import onChange from 'on-change';
import axios from 'axios';
// import { errorRender } from './view.js';
import { conformsTo, isElement, valuesIn } from 'lodash';
import { resolveConfig } from 'prettier';

const render = () => {
  console.log('plug');
};

const errorRender = (value) => {
  const exampleP = document.querySelector('.text-muted');
  const feedbackP = exampleP.nextElementSibling;
  if (feedbackP) {
    const isError = feedbackP.classList.contains('text-danger');
    if (!isError) {
      feedbackP.classList.add('text-danger');
    }
    feedbackP.textContent = value;
    return;
  }
  const newFeedbackP = document.createElement('p');
  newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');
  newFeedbackP.textContent = value;
  exampleP.after(newFeedbackP);
};

const renderSucsess = () => {
  const exampleP = document.querySelector('.text-muted');
  const feedbackP = exampleP.nextElementSibling;
  if (feedbackP) {
    const isError = feedbackP.classList.contains('text-danger');
    if (isError) {
      feedbackP.classList.replace('text-danger', 'text-success');
    }
    feedbackP.textContent = 'RSS успешно загружен';
    return;
  }
  const newFeedbackP = document.createElement('p');
  newFeedbackP.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
  newFeedbackP.textContent = 'RSS успешно загружен';
  exampleP.after(newFeedbackP);
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    // const classes = ['feedback', 'm-0', 'position-absolute', 'small', 'text-success'];
    if (path === 'error') {
      // classes.push('text-danger');
      errorRender(value);
    }
    if (path === 'urls') {
      console.log(value);
      renderSucsess();
    }
  });

  return watchedState;
};
