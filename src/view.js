import onChange from 'on-change';

const submitBtnSwitching = (operation) => {
  const btn = document.querySelector('.rss-form .btn');
  switch (operation) {
    case 'on':
      btn.disabled = false;
      break;
    case 'off':
      btn.disabled = true;
      break;
    default:
      break;
  }
};

const feedbackRender = (value, type, i18n) => {
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

const containerRender = (name, i18n) => {
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

const modalRender = (posts, readPostsIds) => {
  posts.forEach((post) => {
    if (readPostsIds.has(post.id)) {
      post.read = true;
      const a = document.querySelector(`[data-id="${post.id}"]`);
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
    }
  });

  const post = posts.find(({ id }) => id === [...readPostsIds].at(-1));
  const modal = document.querySelector('.modal');

  const title = modal.querySelector('.modal-title');
  title.textContent = post.title;

  const description = modal.querySelector('.modal-body');
  description.textContent = post.description;

  const link = modal.querySelector('.full-article');
  link.setAttribute('href', post.link);
};

const feedsRender = (feeds, i18n) => {
  containerRender('feeds', i18n);

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
};

const postsRender = (posts, i18n) => {
  containerRender('posts', i18n);

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
    a.setAttribute('data-id', post.id);
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

    li.append(a, button);
    postsList.append(li);
  });
  submitBtnSwitching('on');
};

export default (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'status':
        if (value === 'loading') {
          submitBtnSwitching('off');
        }
        if (value === 'loaded') {
          feedbackRender('success', 'loaded', i18n);
        }
        if (value === 'failed') {
          feedbackRender(state.form.error, 'error', i18n);
        }
        break;
      case 'feeds':
        feedsRender(value, i18n);
        break;
      case 'posts':
        postsRender(value, i18n);
        break;
      case 'readPostsIds':
        modalRender(state.posts, value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
