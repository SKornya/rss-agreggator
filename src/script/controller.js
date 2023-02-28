import onChange from 'on-change';
import render from './view.js';

const state = {
  status: 'invalid',
  feeds: [],
  errors: [],
};

const watchedState = onChange(state, (path, value, prevValue) => {
  // console.log(path, value, prevValue);
  if (path === 'errors') {
    console.log(value);
  }
  render(state);
});

export default watchedState;
