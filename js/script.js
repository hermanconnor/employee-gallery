'use strict';

const initApp = () => {
  const gallery = document.getElementById('gallery');
  const searchContainer = document.querySelector('.search-container');

  fetchData('https://randomuser.me/api/?results=12&nat=us').then((data) => {
    if (data) {
      displayEmployees(data.results);
    }
  });

  function createSearchForm() {
    const form = document.createElement('form');
    form.action = '#';
    form.method = 'get';
    searchContainer.appendChild(form);

    const label = document.createElement('label');
    label.htmlFor = 'search-input';
    label.className = 'visually-hidden';
    label.innerText = 'Search employees';
    form.appendChild(label);

    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'search-input';
    input.className = 'search-input';
    input.placeholder = 'Search...';
    form.appendChild(input);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.innerHTML = '&#x1F50D;';
    submit.id = 'search-submit';
    submit.className = 'search-submit';
    form.appendChild(submit);
  }

  // Create search form (only once)
  if (!document.getElementById('search-input')) {
    createSearchForm();
  }

  function displayEmployees(employees) {
    const employeeCards = employees.map((employee, index) => {
      const fullName = `${employee.name.first} ${employee.name.last}`;

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-img-container">
          <img class="card-img" src="${employee.picture.large}" alt="Profile picture for ${fullName}">
        </div>
        <div class="card-info-container">
          <h3 class="card-name cap">${fullName}</h3>
          <p class="card-text">${employee.email}</p>
          <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        </div>
      `;

      card.addEventListener('click', () => createModal(employees, index));

      return card;
    });

    gallery.append(...employeeCards);
  }

  function createModalContainer() {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    document.body.appendChild(modalContainer);
    return modalContainer;
  }

  function setModalContent(modalContainer, employee) {
    const birthday = formatDate(employee.dob.date);
    const fullName = `${employee.name.first} ${employee.name.last}`;
    const address = `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}`;

    modalContainer.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
        <img class="modal-img" src="${employee.picture.large}" alt="Profile picture for ${fullName}">
        <h3 class="modal-name cap">${fullName}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${employee.cell}</p>
        <p class="modal-text">${address}</p>
        <p class="modal-text">Birthday: ${birthday}</p>
      </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  `;
  }

  function createModal(employees, index) {
    let modalContainer = document.querySelector('.modal-container');

    if (!modalContainer) {
      modalContainer = createModalContainer();
    }

    setModalContent(modalContainer, employees[index]);

    addModalEventListeners(modalContainer, employees, index);
  }

  function addModalEventListeners(modalContainer, employees, index) {
    // Close modal button
    modalContainer
      .querySelector('#modal-close-btn')
      .addEventListener('click', () => closeModal(modalContainer));

    // Close modal on Escape key
    document.addEventListener('keydown', (e) =>
      closeOnEscape(e, modalContainer),
    );

    // Next and Previous buttons
    modalContainer
      .querySelector('#modal-next')
      .addEventListener('click', () => navigateModal(employees, index, 'next'));

    modalContainer
      .querySelector('#modal-prev')
      .addEventListener('click', () => navigateModal(employees, index, 'prev'));
  }

  function navigateModal(employees, currentIndex, direction) {
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % employees.length
        : (currentIndex - 1 + employees.length) % employees.length;

    createModal(employees, nextIndex);
  }

  function closeModal(modalContainer) {
    modalContainer.remove();
  }

  function closeOnEscape(e, modalContainer) {
    if (e.key === 'Escape') {
      closeModal(modalContainer);

      document.removeEventListener('keydown', (e) =>
        closeOnEscape(e, modalContainer),
      );
    }
  }

  const searchInput = document.getElementById('search-input');
  const submit = document.getElementById('search-submit');

  function filterEmployees(query) {
    const cards = document.querySelectorAll('.card');
    query = query.toLowerCase();

    cards.forEach((card) => {
      const name = card.querySelector('.card-name').textContent.toLowerCase();
      card.style.display = name.includes(query) ? '' : 'none';
    });
  }

  searchInput.addEventListener('keyup', () =>
    filterEmployees(searchInput.value),
  );

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    filterEmployees(input.value);
  });
};

document.addEventListener('DOMContentLoaded', initApp);
