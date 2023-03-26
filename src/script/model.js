/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import axios from 'axios';
import getWatchedState, { mainPageRender } from './view.js';
import parseData from './parser.js';

const getOriginURL = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const app = () => {
  const state = {
    form: {
      status: '',
      message: '',
    },
    status: '',
    urls: [],
    posts: [],
  };

  const watchedState = getWatchedState(state);

  const getRequest = (url) => {
    axios.get(getOriginURL(url))
      .then((response) => {
        const parsingData = parseData(response.data.contents);
        if (!(parsingData.tagName === 'rss')) {
          state.form.message = 'notRSS';
          watchedState.form.status = 'error';
          state.form.status = '';
          return;
        }
        state.form.message = 'successLoad';
        watchedState.form.status = 'success';
        state.form.status = '';

        watchedState.status = 'loaded';

        const title = parsingData.querySelector('channel title').textContent;
        const description = parsingData.querySelector('channel description').textContent;

        state.urls.push({
          id: state.urls.length + 1,
          url,
          title,
          description,
        });

        const feedPosts = [];
        const currentId = state.urls.at(-1).id;
        const items = parsingData.querySelectorAll('item')
          .forEach((item, index) => feedPosts.push({
            id: currentId,
            postId: index + 1,
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent,
          }));
        state.posts.unshift(feedPosts);
        watchedState.status = 'readyToRender';
      })
      .catch(() => {
        state.form.message = 'networkError';
        watchedState.form.status = 'error';
      });
    setTimeout(() => getRequest(url), 5000);
  };

  mainPageRender();

  yup.setLocale({
    string: {
      url: ({ url }) => ({ key: 'notValidURL', values: { url } }),
    },
    mixed: {
      notOneOf: ({ notOneOf }) => ({ key: 'oneOfFeeds', values: { notOneOf } }),
    },
  });

  const validate = (url) => {
    const validateSchema = yup.string()
      .trim()
      .url()
      .notOneOf(watchedState.urls.map((item) => item.url))
      .required();

    validateSchema.validate(url)
      .then(() => {
        getRequest(url);
      })
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        state.form.message = key;
        watchedState.form.status = 'error';
        state.form.status = '';
      });
  };

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.focus();
    const t = new FormData(form).get('url');
    validate(t);
    form.reset();
  });
};

export default () => {
  app();
};
