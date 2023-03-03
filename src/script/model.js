import * as yup from 'yup';
import * as i18next from 'i18next';
import axios from 'axios';
import getWatchedState from './view.js';
// import watchedState from './view.js';
import resources from './locale/resources.js';
import parseData from './parser.js';
import { get } from 'lodash';

const app = (i18n) => {
  const state = {
    urls: ['https://ru.hexlet.io/lessons.rss'],
    error: '',
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
  
  const validateSchema = yup.string()
    .trim()
    .url()
    .notOneOf(state.urls)
    .required();

  const validate = (url) => {
    validateSchema.validate(url)  
      .then((res) => {
        watchedState.urls.push(url);
        // axios.get(url)
        //   .then(({ data }) => {
        //     const htmlData = parseData(data);
        //     console.log(htmlData);
        //   })
        //   .catch((e) => console.log(e));
      })
      .catch((err) => {
        console.log(err);
        const [error] = err.errors;
        const { key } = error;
        watchedState.error = i18n.t(key);
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
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    resources,
  });

  app(i18nInstance);
};
