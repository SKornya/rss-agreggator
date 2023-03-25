import * as yup from 'yup';
import axios from 'axios';
import getWatchedState, { mainPageRender } from './view.js';
import parseData from './parser.js';

const getOriginURL = (url) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`;

const app = () => {
  const state = {
    form: {
      state: '',
      message: '',
    },
    urls: [],
    // feedback: '',
  };

  mainPageRender();

  const watchedState = getWatchedState(state);

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
      .notOneOf(watchedState.urls)
      .required();

    validateSchema.validate(url)
      .then(() => {
        // setInterval(() => {
        axios.get(getOriginURL(url))
          .then((response) => {
            const htmlData = parseData(response.data.contents);
            if (!(htmlData.tagName === 'rss')) {
              state.form.message = 'notRSS';
              watchedState.form.state = 'error';
              state.form.state = '';
              return;
            }
            state.form.message = 'successLoad';
            state.urls.push(url);
            watchedState.form.state = 'success';
            state.form.state = '';
            console.log(htmlData);
          })
          .catch((e) => console.log(e));
        // }, 5000);
      })
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        state.form.message = key;
        watchedState.form.state = 'error';
        state.form.state = '';
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
