import onChange from 'on-change';
import * as i18next from 'i18next';
import resources from './locale/resources.js';

const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  resources,
});

export const initRender = () => {
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

const containerRender = (name) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  card.innerHTML = '';

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardHeader = document.createElement('h2');
  cardHeader.classList.add('card-title', 'h4');
  cardHeader.textContent = i18n.t(`${name}`);
  cardBody.append(cardHeader);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  card.append(cardBody, list);

  const container = document.querySelector(`.${name}`);
  container.innerHTML = '';
  container.append(card);
};

const modalRender = (post) => {
  const modal = document.querySelector('.modal');

  modal.addEventListener('shown.bs.modal', () => {});

  modal.classList.add('show');
  modal.setAttribute('style', 'block');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.removeAttribute('aria-hidden');

  const title = modal.querySelector('.modal-title');
  title.textContent = post.title;

  const description = modal.querySelector('.modal-body');
  description.textContent = post.description;

  const link = modal.querySelector('.full-article');
  link.setAttribute('href', post.link);

  modal.addEventListener('hidden.bs.modal', () => {});
};

const feedsRender = (feeds) => {
  containerRender('feeds');

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
  containerRender('posts');

  const addButton = document.querySelector('button[aria-label="add"]');
  addButton.disabled = true;

  const postsList = document.querySelector('.posts .card ul');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    if (post.read) {
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
    }
    a.setAttribute('href', post.link);
    a.setAttribute('data-id', post.postId);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener norefferer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('watchButton');

    button.addEventListener('click', () => {
      post.read = true;
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
      modalRender(post);
    });

    li.append(a, button);
    postsList.append(li);
  });

  addButton.disabled = false;
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'proceedState':
        if (value === 'filling') {
          initRender();
        }
        if (value === 'loaded') {
          feedbackRender('success');
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
