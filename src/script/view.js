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

// const errorRender = (errorText) => {
//   const feedback = document.querySelector('.feedback');
//   feedback.classList.replace('text-success', 'text-danger');
//   feedback.textContent = i18n.t(`error.${errorText}`);
// };

const feedbackRender = (value, type = 'loaded') => {
  const feedback = document.querySelector('.feedback');
  switch (type) {
    case 'error':
      feedback.classList.replace('text-success', 'text-danger');
      break;
    case 'loaded':
      feedback.classList.replace('text-danger', 'text-success');
      break;
    default:
      break;
  }
  feedback.textContent = i18n.t(`${type}.${value}`);
};

const containersRender = () => {
  const cardRender = (blockName) => {
    const card = document.createElement('div');
    card.classList.add('card', 'border-0');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardHeader = document.createElement('h2');
    cardHeader.classList.add('card-title', 'h4');
    cardHeader.textContent = i18n.t(`${blockName}`);
    cardBody.append(cardHeader);

    const list = document.createElement('ul');
    list.classList.add('list-group', 'border-0', 'rounded-0');

    card.append(cardBody, list);
    return card;
  };

  const postsPart = document.querySelector('.posts');
  const feedsPart = document.querySelector('.feeds');
  postsPart.append(cardRender('posts'));
  feedsPart.append(cardRender('feeds'));
};

const feedsRender = (feeds) => {
  const feedsContainer = document.querySelector('.feeds ul');
  feedsContainer.innerHTML = '';

  const addButton = document.querySelector('button[aria-label="add"]');
  addButton.disabled = true;
  const feedsList = document.querySelector('.feeds .card ul');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    feedHeader.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;

    li.append(feedHeader, feedDescription);
    feedsList.prepend(li);
  });

  addButton.disabled = false;
};

const postsRender = (posts) => {
  const postsContainer = document.querySelector('.posts ul');
  postsContainer.innerHTML = '';

  const addButton = document.querySelector('button[aria-label="add"]');
  addButton.disabled = true;

  const postsList = document.querySelector('.posts .card ul');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', post.link);
    a.setAttribute('data-id', post.postId);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener norefferer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.postId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('watchButton');
    li.append(a, button);
    postsList.append(li);
  });

  addButton.disabled = false;
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'proceedState':
        if (value === 'loaded') {
          feedbackRender('success');
          containersRender();
        }
        if (value === 'failed') {
          feedbackRender(state.form.error, 'error');
        }
        break;
      case 'feeds':
        feedsRender(state.feeds);
        break;
      case 'posts':
        postsRender(state.posts);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
