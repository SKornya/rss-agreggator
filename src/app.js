/* eslint-disable no-unused-vars */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import * as i18next from 'i18next';
import resources from './locales/resources.js';
import getWatchedState from './view.js';
import parseData from './parser.js';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const updateRSS = (watchedState) => {
  if (watchedState.feeds.length) {
    const promises = watchedState.feeds.map(({ link }) => axios.get(addProxy(link))
      .then((response) => {
        const [feed, posts] = parseData(response.data.contents);
        feed.link = link;
        const feedId = watchedState.feeds.find((item) => item.link === feed.link).id;
        feed.id = feedId;
        const postsFromState = watchedState.posts.filter((post) => post.feedId === feedId);
        const newPosts = _.differenceBy(posts, postsFromState, 'link');
        newPosts.forEach((post) => {
          post.id = _.uniqueId();
          post.feedId = feedId;
        });
        return newPosts;
      })
      .catch(() => []));
    const promise = Promise.all(promises);
    promise
      .then((data) => {
        data.forEach((posts) => {
          watchedState.posts = [...posts, ...watchedState.posts];
        });
      });
  }
  setTimeout(updateRSS, 5000, watchedState);
};

const getRequest = (url, watchedState) => {
  axios.get(addProxy(url))
    .then((response) => {
      const [feed, posts] = parseData(response.data.contents);
      watchedState.status = 'loaded';
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
      error: '',
    },
    feeds: [],
    posts: [],
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

  const form = document.querySelector('form');
  const posts = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new FormData(form).get('url');
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
    form.reset();
  });

  posts.addEventListener('click', (e) => {
    const { target } = e;
    const { dataset: { id } } = target;
    if (id) {
      watchedState.readPostsIds.add(id);
    }
  });

  updateRSS(watchedState);
};
