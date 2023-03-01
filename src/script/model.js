import * as yup from 'yup';
import * as i18next from 'i18next';
// import axios from 'axios';
import watchedState from './controller.js';
import resources from '.src'

yup.setLocale({
  string: {
    url: 'Ссылка должна быть валидным URL',
  },
  mixed: {
    notOneOf: 'RSS уже существует',
  },
});

const validateSchema = yup.string()
  .trim()
  .url()
  .notOneOf(watchedState.feeds)
  .required();

const validate = (url) => {
  validateSchema.validate(url)
    .then(() => {
      watchedState.feeds.push(url);
    })
    .catch((err) => {
      watchedState.error = err.message;
    });
};

const app = () => {
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
