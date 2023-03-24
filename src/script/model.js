import * as yup from 'yup';
// import axios from 'axios';
import getWatchedState, { init } from './view.js';
// import parseData from './parser.js';

const app = () => {
  const state = {
    form: {
      state: '',
      message: '',
    },
    urls: [],
    // feedback: '',
  };

  init();

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
        state.form.message = 'successLoad';
        state.urls.push(url);
        watchedState.form.state = 'success';
        // axios.get(url)
        //   .then(({ data }) => {
        //     const htmlData = parseData(data);
        //     console.log(htmlData);
        //   })
        //   .catch((e) => console.log(e));
      })
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        state.form.message = key;
        watchedState.form.state = 'error';
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
