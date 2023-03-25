import onChange from 'on-change';
import * as i18next from 'i18next';
import resources from './locale/resources.js';

const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  resources,
});

export const mainPageRender = () => {
  const fields = {
    title: document.querySelector('h1'),
    lead: document.querySelector('.lead'),
    addButton: document.querySelector('[aria-label="add"]'),
    inputLabel: document.querySelector('label[for="url-input"]'),
    example: document.querySelector('.text-muted'),
  };

  Object.entries(fields).forEach(([key, value]) => {
    const element = value;
    element.textContent = i18n.t(`init.${key}`);
  });
  const input = document.querySelector('#url-input');
  input.setAttribute('placeholder', i18n.t('init.placeholder'));
};

const feedbackRender = (value, type) => {
  const feedback = document.querySelector('.feedback');
  switch (type) {
    case 'error':
      if (feedback.classList.contains('text-success')) {
        feedback.classList.replace('text-success', 'text-danger');
      }
      break;
    case 'success':
      if (feedback.classList.contains('text-danger')) {
        feedback.classList.replace('text-danger', 'text-success');
      }
      break;
    default:
      throw new Error('unknow state');
  }
  feedback.textContent = i18n.t(`${type}.${value}`);
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      feedbackRender(state.form.message, value);
    }
  });

  return watchedState;
};
