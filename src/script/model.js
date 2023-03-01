import * as yup from 'yup';
import * as i18next from 'i18next';
// import axios from 'axios';
import watchedState from './controller.js';
import resources from './locale/resources.js';

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
  .notOneOf(watchedState.feeds)
  .required();

const app = (i18n) => {
  const validate = (url) => {
    validateSchema.validate(url)
      .then(() => {
        watchedState.feeds.push(url);
      })  
      .catch((err) => {
        const [error] = err.errors;
        const { key } = error;
        state.error = i18n.t(key);
      });
  };

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
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
