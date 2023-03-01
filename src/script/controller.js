import onChange from 'on-change';
import axios from 'axios';
import { errorRender } from './view.js';
import { conformsTo, valuesIn } from 'lodash';
import { resolveConfig } from 'prettier';

const state = {
  feeds: [],
  error: '',
};

const watchedState = onChange(state, (path, value) => {
  if (path === 'error') {
    const classes = ['feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger'];
    errorRender(classes, value);
  }
  if (path === 'feeds') {

  }
});

export default watchedState;
