/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import getWatchedState from './view.js';
import parseData from './parser.js';

const getOriginURL = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const updateRSS = (url, state, watchedState) => {
  axios.get(getOriginURL(url.trim()))
    .then((response) => {
      const [feed, posts] = parseData(response.data.contents);
      const feedId = state.feeds.find((item) => item.link === feed.link).id;
      const postsFromState = state.posts.filter((post) => post.feedId === feedId);
      const newPosts = _.differenceBy(posts, postsFromState, 'link');
      newPosts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = feedId;
      });
      watchedState.posts = [...newPosts, ...state.posts];
    })
    .catch(() => []);
  setTimeout(updateRSS, 5000, url);
};

const getRequest = (url, state, watchedState) => {
  axios.get(getOriginURL(url.trim()))
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
      watchedState.posts = [...posts, ...state.posts];
      updateRSS(url, state, watchedState);
    })
    .catch((err) => {
      if (!(_.has(err, 'errors'))) {
        watchedState.form.error = 'networkError';
      } else {
        watchedState.form.error = 'parsererror';
      }
      watchedState.proceedState = 'failed';
    });
};

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
        getRequest(url, state, watchedState);
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
