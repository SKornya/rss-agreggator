import * as yup from 'yup';
import * as i18next from 'i18next';
import axios from 'axios';
import getWatchedState from './view.js';
import resources from './locale/resources.js';
import parseData from './parser.js';
import { get } from 'lodash';

export const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    resources,
  });

const app = (i18n) => {
  const state = {
    urls: [],
    error: '',
    feedback: '',
  };

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
      .then((res) => {
        watchedState.feedback = 'successLoad';
        watchedState.urls.push(url);
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
        watchedState.feedback = key;
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
  app(i18n);
};
