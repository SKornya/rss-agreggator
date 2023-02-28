import * as yup from 'yup';
import axios from 'axios';
// import { keyBy } from 'lodash';
import watchedState from './controller.js';

const validateSchema = yup.string()
  .trim()
  .url()
  .required()
  .notOneOf(watchedState.feeds);

const validate = (url) => {
  validateSchema.validate(url)
    .then((result) => {
      axios.get(url)
        .then((response) => {
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err);
        });
      watchedState.feeds.push(result);
    })
    .catch((err) => {
      watchedState.errors.push(err);
    });
};

export default () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = new FormData(form).get('url');
    console.log(t);
    validate(t);
  });
};
