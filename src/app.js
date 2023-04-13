/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import * as i18next from 'i18next';
import resources from './locales/resources.js';
import getWatchedState from './view.js';
import parseData from './parser.js';

const getOriginURL = (url) => {
  const base = new URL('https://allorigins.hexlet.app/get?disableCache=true');
  const params = new URLSearchParams(base.search);
  params.append('url', url);
  base.search = params;
  return base;
};

const updateRSS = (watchedState) => {
  if (watchedState.urls.length) {
    watchedState.urls.forEach((url) => {
      axios.get(getOriginURL(url))
        .then((response) => {
          const [feed, posts] = parseData(response.data.contents);
          const feedId = watchedState.feeds.find((item) => item.link === feed.link).id;
          const postsFromState = watchedState.posts.filter((post) => post.feedId === feedId);
          const newPosts = _.differenceBy(posts, postsFromState, 'link');
          newPosts.forEach((post) => {
            post.id = _.uniqueId();
            post.feedId = feedId;
          });
          watchedState.posts = [...newPosts, ...watchedState.posts];
        })
        .catch(() => []);
    });
  }
  setTimeout(updateRSS, 5000, watchedState);
};

const getRequest = (url, watchedState) => {
  axios.get(getOriginURL(url))
    .then((response) => {
      const [feed, posts] = parseData(response.data.contents);
      watchedState.proceedState = 'loaded';
      watchedState.urls.push(url);
      feed.id = _.uniqueId();
      feed.link = url;
      const feedId = feed.id;
      watchedState.feeds.push(feed);
      posts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = feedId;
      });
      watchedState.posts = [...posts, ...watchedState.posts];
    })
    .catch((err) => {
      if (err.isAxiosError) {
        watchedState.form.error = 'networkError';
      } else if (err.isParserError) {
        watchedState.form.error = 'parserError';
      } else {
        watchedState.form.error = 'unknowError';
      }
      watchedState.proceedState = 'failed';
    });
};

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    resources,
  });

  const initialState = {
    proceedState: 'filling',
    form: {
      error: '',
    },
    urls: [],
    feeds: [],
    posts: [],
    readingPost: null,
  };

  const watchedState = getWatchedState(initialState, i18n);

  yup.setLocale({
    string: {
      url: ({ url }) => ({ key: 'notValidURL', values: { url } }),
    },
    mixed: {
      notOneOf: ({ notOneOf }) => ({ key: 'oneOfFeeds', values: { notOneOf } }),
    },
  });

  const validate = (url, urls) => {
    const validateSchema = yup.string()
      .trim()
      .url()
      .notOneOf(urls)
      .required();

    return validateSchema.validate(url);
  };

  const form = document.querySelector('form');
  const posts = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.focus();
    const url = new FormData(form).get('url');
    validate(url, initialState.urls)
      .then(() => {
        watchedState.proceedState = 'loading';
        getRequest(url, watchedState);
      })
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        watchedState.form.error = key;
        watchedState.proceedState = 'failed';
      });
    form.reset();
  });

  posts.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName === 'BUTTON') {
      watchedState.readingPost = watchedState.posts.find((post) => post.id === target.dataset.id);
    }
  });

  updateRSS(watchedState);
};
