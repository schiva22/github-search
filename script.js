const form = document.querySelector('.search__form');
const resultsContainer = document.querySelector('.search__findings-list');
const countContainer = document.querySelector('.search__findings');
const errorContainer = document.querySelector('.search__error');
const btn = document.querySelector('.search__button');

const renderError = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            Произошла ошибка...
        </p>
  `;
  countContainer.innerHTML = '';
};

const renderEmptyResults = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            По вашему запросу ничего не найдено, попробуйте уточнить запрос
        </p>
  `;
  countContainer.innerHTML = '';
};

const renderCount = count => {
  countContainer.innerHTML = `
      Найдено <span class="search__findings-amount">${count.toLocaleString(
        'ru-RU'
      )}</span> результатов
  `;
};

const onSubmitStart = () => {
  countContainer.innerHTML = `Загрузка...`;
  resultsContainer.innerHTML = '';
  errorContainer.innerHTML = '';
};

function template(item) {
  const newElement = document.createElement('li');
  newElement.classList.add('search__finding-item');
  newElement.innerHTML = `
      <a class="search__finding-link" target="_blank" href="${item.html_url}">
          ${item.full_name}
      </a>
      <span class="search__finding-description">${item.description}</span>
	`;
  return newElement;
};

const search = (title) => {
    return fetch('https://api.nomoreparties.co/github-search?q=' + title)
        .then((response) => response.json())
        .then((json) => {
            if (json.Response === 'False') {
                throw new Error(json.Error);
            }
            if (json.total_count) {
              renderCount(json.total_count);
              json.items.forEach(element => {
                const item = template(element);
                resultsContainer.appendChild(item);
              });
            } else {
              renderEmptyResults();
            }
        })
        .catch((err) => {
          renderError();
        });
};

async function onSubmit(event) {
  // ваш код
    event.preventDefault();
    onSubmitStart();
    await search(document.querySelector('.search__textfield').value);
};

form.addEventListener('submit', onSubmit);