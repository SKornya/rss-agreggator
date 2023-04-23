const elements = {
  form: document.querySelector('form'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
  submit: document.querySelector('.rss-form .btn'),
  feedback: document.querySelector('.feedback'),
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalDescription: document.querySelector('.modal-body'),
  modalFullArticle: document.querySelector('.full-article'),
};

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const setAttributes = (element, attributes) => {
  attributes.forEach((attr) => {
    const [name, value] = attr;
    element.setAttribute(name, value);
  });
};

export { elements, addProxy, setAttributes };
