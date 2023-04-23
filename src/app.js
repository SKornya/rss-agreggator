/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import * as i18next from 'i18next';
import resources from './locales/resources.js';
import getWatchedState from './view.js';
import parseData from './parser.js';
import { elements, addProxy } from './utils.js';

const updateRSS = (watchedState) => {
  if (watchedState.feeds.length) {
    const promises = watchedState.feeds.map((feed) => axios.get(addProxy(feed.link))
      .then((response) => {
        const [, posts] = parseData(response.data.contents);
        const postsFromState = watchedState.posts.filter((post) => post.feedId === feed.id);
        const newPosts = _.differenceBy(posts, postsFromState, 'link');
        newPosts.forEach((post) => {
          post.id = _.uniqueId();
          post.feedId = feed.id;
        });
        watchedState.posts = [...newPosts, ...watchedState.posts];
      })
      .catch(() => []));
    const promise = Promise.all(promises);
  }
  setTimeout(updateRSS, 5000, watchedState);
};

const getRequest = (url, watchedState) => {
  axios.get(addProxy(url))
    .then((response) => {
      const [feed, posts] = parseData(response.data.contents);
      feed.id = _.uniqueId();
      feed.link = url;
      const feedId = feed.id;
      watchedState.feeds.push(feed);
      posts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = feedId;
      });
      watchedState.posts = [...posts, ...watchedState.posts];
      watchedState.status = 'loaded';
    })
    .catch((err) => {
      if (err.isAxiosError) {
        watchedState.form.error = 'networkError';
      } else if (err.isParserError) {
        watchedState.form.error = 'parserError';
      } else {
        watchedState.form.error = 'unknowError';
      }
      watchedState.status = 'failed';
    });
};

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    resources,
  });

  const initialState = {
    status: 'filling',
    form: {
      error: null,
    },
    feeds: [],
    posts: [],
    selectedPostId: null,
    readPostsIds: new Set(),
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

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new FormData(elements.form).get('url');
    const feedsURLs = watchedState.feeds.map(({ link }) => link);
    watchedState.status = 'loading';
    validate(url, feedsURLs)
      .then(() => {
        getRequest(url, watchedState);
      })
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        watchedState.form.error = key;
        watchedState.status = 'failed';
      });
    elements.form.reset();
  });

  elements.posts.addEventListener('click', (e) => {
    const { target } = e;
    const { dataset: { id } } = target;
    if (id) {
      watchedState.readPostsIds.add(id);
      watchedState.selectedPostId = id;
    }
  });

  updateRSS(watchedState);
};
