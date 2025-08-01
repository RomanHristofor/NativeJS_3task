import { paginate, renderPagination } from './lib/pagination.js';
import { saveElementPositions, animateElementChanges } from './lib/animation.js';
import { highlightRows } from './lib/highlight.js';

const API_URL = 'https://3c0b9776f1e513a2.mokky.dev/users';

let userData = [];
let viewData = [];
const pageSize = 10;
let currentPage = 1;
let isReordering = false;
const sortedBy = { key: 'id', direction: 'asc' };

const searchElem = document.getElementById('search');

function getFilteredAndSortedData(query) {
  const filtered = query
    ? userData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
    )
    : userData;

  return [...filtered].sort((a, b) => {
    if (a[sortedBy.key] < b[sortedBy.key]) return sortedBy.direction === 'asc' ? -1 : 1;
    if (a[sortedBy.key] > b[sortedBy.key]) return sortedBy.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderTable(data) {
  const container = document.getElementById('container');
  const paginated = paginate(data, currentPage, pageSize);
  const isDesktop = window.innerWidth > 768;

  if (isDesktop && isReordering) {
    saveElementPositions();
  }

  container.innerHTML =
    (isDesktop ? createTable(paginated.items) : createCards(paginated.items)) +
    renderPagination(paginated);

  if (isDesktop && isReordering) {
    animateElementChanges();
    isReordering = false;
  }

  highlightRows(data, currentPage, pageSize);
}

function handleSearch(e) {
  currentPage = 1;
  const query = e.target.value.toLowerCase().trim();
  viewData = getFilteredAndSortedData(query);
  isReordering = true;
  renderTable(viewData);
}

window.changePage = function (page) {
  currentPage = page;
  renderTable(viewData.length ? viewData : userData);
};

window.sortBy = function (key) {
  if (sortedBy.key === key) {
    sortedBy.direction = sortedBy.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortedBy.key = key;
    sortedBy.direction = 'asc';
  }

  const query = searchElem.value.toLowerCase().trim();
  viewData = getFilteredAndSortedData(query);
  currentPage = 1;
  isReordering = true;
  renderTable(viewData);
};

function getAriaSort(key) {
  if (sortedBy.key !== key) return 'none';
  return sortedBy.direction === 'asc' ? 'ascending' : 'descending';
}

function createTable(data) {
  const headers = `
    <thead>
      <tr>
        <th scope="col" onclick="sortBy('id')" aria-sort="${getAriaSort('id')}">
          ${renderHeader('ID', 'id')}
        </th>
        <th scope="col" onclick="sortBy('name')" aria-sort="${getAriaSort('name')}">
          ${renderHeader('Title', 'name')}
        </th>
      </tr>
    </thead>
  `;

  const rows = data.map(
    (item) => `
      <tr data-id="${item.id}">
        <td>${item.id}</td>
        <td>${item.name}</td>
      </tr>
    `
  ).join('');

  return `<table>${headers}<tbody>${rows}</tbody></table>`;
}

function createCards(data) {
  return data.map(
    (item) => `
      <article class="card" data-id="${item.id}">
        <strong>ID:</strong> ${item.id}<br />
        <strong>Title:</strong> ${item.name}
      </article>
    `
  ).join('');
}

function renderHeader(label, key) {
  const direction = sortedBy.key === key ? sortedBy.direction : null;
  const arrow = direction === 'asc' ? ' ▲' : direction === 'desc' ? ' ▼' : '';
  return `${label}${arrow}`;
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch(API_URL);
  userData = await res.json();
  viewData = getFilteredAndSortedData('');
  renderTable(viewData);
  searchElem.addEventListener('input', debounce(handleSearch, 300));
});

window.addEventListener('resize', debounce(() => {
  const query = searchElem?.value?.toLowerCase().trim() || '';
  viewData = getFilteredAndSortedData(query);
  renderTable(viewData);
}, 200));
