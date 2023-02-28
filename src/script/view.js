export const render = () => {
  console.log('plug');
};

export const errorRender = (classes, value) => {
  const container = document.querySelector('.col-md-10');
  const input = document.querySelector('input');
  input.classList.add('is-invalid');
  const p = document.createElement('p');
  p.classList.add(...classes);
  p.textContent = value;
  container.append(p);
};
