import onChange from 'on-change';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

export default () => {
  const state = {
    value: '',
    feeds: [],
    errors: [],
  };

  const watchedState = onChange(state, (path, value, prevValue) => {
    console.log(path);
    console.log(value, prevValue);
  });
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    console.log(e, e.target);
    e.preventDefault();
    const input = document.querySelector('input');
    const t = new FormData(form).get('url');
    console.log(t);
    watchedState.value = input.value;
  });
};
