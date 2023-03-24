import onChange from 'on-change';
import * as i18next from 'i18next';
import resources from './locale/resources.js';

const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  resources,
});

export const init = () => {
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

// const feedbackRender = (value, type) => {
//   const exampleP = document.querySelector('.text-muted');
//   const feedbackP = exampleP.nextElementSibling;
//   if (feedbackP) {
//     const isError = feedbackP.classList.contains('text-danger');

//     if (isError) {
//       feedbackP.classList.replace('text-danger', 'text-success');
//       feedbackP.textContent = i18n.t('successLoad');
//     } else {
//       feedbackP.classList.add('text-danger');
//       feedbackP.textContent = i18n.t(`errors.${value}`);
//     }
//     return;
//   }
//   const newFeedbackP = document.createElement('p');
//   newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');

//   newFeedbackP.textContent = i18n.t(`errors.${value}`);
//   exampleP.after(newFeedbackP);
// };

const createNewFeedbackElement = (prevSimbling, content, type) => {
  const newFeedbackP = document.createElement('p');
  newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  if (type === 'error') {
    newFeedbackP.classList.add('text-danger');
  }
  newFeedbackP.textContent = i18n.t(`errors.${content}`);
  prevSimbling.after(newFeedbackP);
};

// const rerenderFeedbackElement = (element) => {
//   const isError = feedbackP.classList.contains('text-danger');
//   if (!isError) {
//     feedbackP.classList.add('text-danger');
//     feedbackP.textContent = i18n.t(`${value}`);
//   } else {
//     feedbackP.classList.toggle('text-danger');
//     feedbackP.textContent = i18n.t('successLoad');
//   }
//   return;
// };

const errorRender = (value) => {
  const exampleP = document.querySelector('.text-muted');
  const feedbackP = exampleP.nextElementSibling;
  if (feedbackP) {
    const isError = feedbackP.classList.contains('text-danger');
    if (!isError) {
      feedbackP.classList.add('text-danger');
    }
    feedbackP.textContent = i18n.t(`errors.${value}`);
    return;
  }
  createNewFeedbackElement(exampleP, value, 'error');
  // const newFeedbackP = document.createElement('p');
  // newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');
  // newFeedbackP.textContent = i18n.t(`${value}`);
  // exampleP.after(newFeedbackP);
};

const renderSuccess = (value) => {
  const exampleP = document.querySelector('.text-muted');
  const feedbackP = exampleP.nextElementSibling;
  if (feedbackP) {
    const isError = feedbackP.classList.contains('text-danger');
    if (isError) {
      feedbackP.classList.replace('text-danger', 'text-success');
    }
    feedbackP.textContent = i18n.t(`${value}`);
    return;
  }
  createNewFeedbackElement(exampleP, value, 'success');
  // const newFeedbackP = document.createElement('p');
  // newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  // newFeedbackP.textContent = i18n.t('successLoad');
  // exampleP.after(newFeedbackP);
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      switch (value) {
        case 'success':
          renderSuccess(state.form.message);
          break;
        case 'error':
          errorRender(state.form.message);
          break;
        default:
          throw new Error('unknow state');
      }
    }

    if (path === 'feedback') {
      // feedbackRender(value, 'error');
      errorRender(value);
    }
    if (path === 'urls') {
      // feedbackRender(null, 'success');
      renderSucsess(state.feedback);
    }
  });

  return watchedState;
};
