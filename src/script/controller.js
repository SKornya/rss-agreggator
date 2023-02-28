import onChange from 'on-change';
import { errorRender } from './view.js';

const state = {
  feeds: ['https://ru.hexlet.io/lessons.rss'],
  error: '',
};

const watchedState = onChange(state, (path, value) => {
  if (path === 'error') {
    const classes = ['feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger'];
    errorRender(classes, value);
  }
});

export default watchedState;
