export const render = () => {
  console.log('plug');
};

export const errorRender = (classes, value) => {
  const errorsP = document.querySelectorAll('.text-danger');
  const container = document.querySelector('.col-md-10');
  errorsP.forEach((p) => {
    p.remove();
  });
  const input = document.querySelector('input');
  input.classList.add('is-invalid');
  const p = document.createElement('p');
  p.classList.add(...classes);
  p.textContent = value;
  container.append(p);
};
