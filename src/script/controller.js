import onChange from 'on-change';
import { errorRender } from './view.js';

const state = {
  feeds: ['https://ru.hexlet.io/lessons.rss'],
  error: '',
};

const watchedState = onChange(state, (path, value) => {
  const classes = ['feedback', 'm-0', 'position-absolute', 'small', 'text-success'];
  if (path === 'error') {
    classes.push('text-danger');
  }
  errorRender(classes, value.message);
});

export default watchedState;
