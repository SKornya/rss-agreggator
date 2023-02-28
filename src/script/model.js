import * as yup from 'yup';
// import axios from 'axios';
import watchedState from './controller.js';

const validateSchema = yup.string()
  .trim()
  .url()
  .required()
  .notOneOf(watchedState.feeds);

const validate = (url) => {
  validateSchema.validate(url)
    .then(() => {
      watchedState.feeds.push(url);
    })
    .catch((err) => {
      watchedState.error = err;
    });
};

export default () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = new FormData(form).get('url');
    validate(t);
    form.reset();
  });
};
