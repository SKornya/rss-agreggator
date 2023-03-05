import onChange from 'on-change';
// import axios from 'axios';
import { i18n } from './model.js';

const render = () => {
  console.log('plug');
};

const feedbackRender = (value, type) => {
  const exampleP = document.querySelector('.text-muted');
  const feedbackP = exampleP.nextElementSibling;
  if (feedbackP) {
    const isError = feedbackP.classList.contains('text-danger');
    if (isError) {
      feedbackP.classList.replace('text-danger', 'text-success');
      feedbackP.textContent = i18n.t('successLoad');
    } else {
      feedbackP.classList.add('text-danger');
      feedbackP.textContent = i18n.t(`${value}`);
    }
    return;
  }
  const newFeedbackP = document.createElement('p');
  newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');
  
  newFeedbackP.textContent = i18n.t(`${value}`);
  exampleP.after(newFeedbackP);
};

const createNewFeedbackElement = (prevSimbling, content, type) => {
  const newFeedbackP = document.createElement('p');
  newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  if (type === 'error') {
    newFeedbackP.classList.add('text-danger');
  }
  newFeedbackP.textContent = i18n.t(`${content}`);
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
    feedbackP.textContent = i18n.t(`${value}`);
    return;
  }
  createNewFeedbackElement(exampleP, value, 'error');
  // const newFeedbackP = document.createElement('p');
  // newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');
  // newFeedbackP.textContent = i18n.t(`${value}`);
  // exampleP.after(newFeedbackP);
};

const renderSucsess = (value) => {
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
