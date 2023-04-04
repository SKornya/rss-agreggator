/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import _, { update } from 'lodash';
import axios from 'axios';
import getWatchedState, { initRender } from './view.js';
import parseData from './parser.js';

const getOriginURL = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

export default () => {
  const state = {
    proceedState: '',
    form: {
      error: '',
    },
    urls: [],
    feeds: [],
    posts: [],
  };

  const watchedState = getWatchedState(state);
  watchedState.proceedState = 'filling';

  const updateRSS = (url) => {
    axios.get(getOriginURL(url.trim()))
      .then((response) => {
        const [feed, posts] = parseData(response.data.contents);
        const postsFromState = state.posts.filter((post) => post.feedId === feed.id);
        const newPosts = _.differenceBy(posts, postsFromState, 'link');
        newPosts.forEach((post) => {
          post.id = _.uniqueId();
          post.feedId = feed.id;
        });
        watchedState.posts = [...newPosts, ...state.posts];
      })
      .catch((err) => {
        if (!(_.has(err, 'errors'))) {
          watchedState.form.error = 'networkError';
        } else {
          watchedState.form.error = 'parsererror';
        }
        watchedState.proceedState = 'failed';
      });
    setTimeout(updateRSS, 5000, url);
  };

  const getRequest = (url) => {
    axios.get(getOriginURL(url.trim()))
      .then((response) => {
        const [feed, posts] = parseData(response.data.contents);
        watchedState.proceedState = 'loaded';
        watchedState.urls.push(url);
        feed.id = _.uniqueId();
        const feedId = feed.id;
        watchedState.feeds.push(feed);
        posts.forEach((post) => {
          post.id = _.uniqueId();
          post.feedId = feedId;
        });
        watchedState.posts = [...posts, ...state.posts];
        updateRSS(url);
      })
      .catch((err) => {
        console.log(err);
        if (!(_.has(err, 'errors'))) {
          watchedState.form.error = 'networkError';
        } else {
          watchedState.form.error = 'parsererror';
        }
        watchedState.proceedState = 'failed';
      });
  };

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

    validateSchema.validate(url)
      .then(() => {
        watchedState.proceedState = 'loading';
        getRequest(url);
      })
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        watchedState.form.error = key;
        watchedState.proceedState = 'failed';
      });
  };

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.proceedState = 'filling';
    form.focus();
    const url = new FormData(form).get('url');
    validate(url, state.urls);
    form.reset();
  });
};
