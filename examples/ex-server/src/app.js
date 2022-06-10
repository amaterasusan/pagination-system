import PaginationSystem from 'pagination-system';
import 'pagination-system/dist/pagination-system.min.css';
import './demo.css';

// instance PaginationSystem class
let dataPaging;
let errorMessageEl;

const url = 'http://localhost:3000/users'; // test server url (json-server)
const urlParams = {
  limit: '_limit', // url query param name (number of items to display per page) optional
  pageNumber: '_page', // url query param name (number of page),
}; // url query params

const sortParam = '_sort';
const orderParam = '_order';
const seachParam = 'q';

//-- any other your server --
// const url = 'http://test.com';
// const urlParams = {
//   limit: 'perpage',
//   pageNumber: 'pageno',
// }; // url query params

// const sortParam = 'sort';
// const orderParam = 'order';
// const seachParam = 'glob';

// sorted css classes
const sortAscClass = 'sorted-asc';
const sortDescClass = 'sorted-desc';

window.addEventListener('DOMContentLoaded', () => {
  errorMessageEl = document.querySelector('.message');
  createTable();
  createDataPagingInst();
});

/**
 * create table inside container
 */
function createTable() {
  if (!document.querySelector('.dg-grid')) {
    const table = document.createElement('table');
    table.classList.add('dg-grid', 'sortable');

    table.insertAdjacentHTML('afterbegin', '<tbody></tbody>');
    document.querySelector('.container-table').appendChild(table);
  }
}

/**
 * create instance of PaginationSystem class
 */
async function createDataPagingInst() {
  const dataRenderFn = (data) => {
    return `${data
      .map(
        (row) =>
          `<tr>${Object.entries(row)
            .map(
              ([key, value]) =>
                `<td data-th="${key}">
                <label class="cell-label"><input type="checkbox" class="cell-checkbox">
                <div class="cell-content">${value}</div></label>
              </td>`
            )
            .join('')}</tr>`
      )
      .join('')}`;
  };

  /*
    Table retrieving data page by page through HTTP.
    About countRecords option:
    It is recommended to return the total number of records in the 'X-Total-Count' header.
    If you want to limit the amount of data, set urlExtraParams option
  */
  const options = {
    dataContainer: document.querySelector('.dg-grid tbody'), // real container for data will be tbody
    dataRenderFn: dataRenderFn,
    url: url, // test server url (json-server)
    urlParams: urlParams, // url query params
    // urlExtraParams: { id_lte: 33, id_gte: 3 }, // use this one if you need to set some other url query parameters
    dimmerSelector: '#dimmer',
    pagingContainer: document.querySelector('.paging-container'),
  };

  // PaginationSystem
  try {
    dataPaging = new PaginationSystem(options);
    const dataKeys = await dataPaging
      .getDataKeys()
      .catch((err) => showError(err));

    if (dataKeys && dataKeys.length) {
      setHeaderTable(dataKeys);
    }

    setEvents();
  } catch (err) {
    showError(err);
  }
}

/**
 * Set Table Header
 * @param {Array} fields
 */
function setHeaderTable(fields) {
  // css class by type
  const classByType = {
    numeric: 'sort-numeric',
    date: 'sort-date',
    alpha: 'sort-alpha',
  };

  const setHeader = (fields) => {
    return `<thead><tr>${fields
      .map(
        (item) =>
          `<th class="${classByType[item.type]}" data-header="${
            item.name
          }" title="${item.name}">${item.title}</th>`
      )
      .join('')}</tr></thead>`;
  };

  if (fields.length) {
    document
      .querySelector('.dg-grid')
      .insertAdjacentHTML('afterbegin', setHeader(fields));
  }
}

/**
 * set Events
 */
function setEvents() {
  // Enter key event in a text box
  document
    .querySelector('#search-input')
    .addEventListener('keypress', beforeFilterData, false);

  // add a click event to the search button
  document
    .querySelector('#dg-search')
    .addEventListener('click', filterData, false);

  // add a click event on the restore button
  document
    .querySelector('#dg-cancel-search')
    .addEventListener('click', restoreData, false);

  document
    .querySelector('.notification-close')
    .addEventListener('click', () => toggleErrorMessage(false), false);
  
  const dgTH = document.querySelector('.dg-grid').querySelectorAll('thead th');
  // add event listener for sorting
  dgTH.forEach((th) => {
    th.addEventListener('pointerdown', sortColumn, false);
  });
}

/**
 * sorting event handling
 * @param {*} event
 */
function sortColumn(event) {
  // is left mouse down
  let isLeftButton =
    (event.which ? event.which == 1 : false) ||
    (event.button ? event.button == 1 : false);

  if (!isLeftButton) {
    return false;
  }

  const target = event.target;
  const sortHeader = target.closest('th');
  const newDirection = sortHeader.classList.contains(sortAscClass) ? -1 : 1;
  const headerName = sortHeader.dataset.header;

  // remove sort class
  const sortedHeader = document
    .querySelector('.dg-grid')
    .querySelector(`th.${sortAscClass}, th.${sortDescClass}`);

  if (sortedHeader) {
    sortedHeader.classList.remove(sortAscClass, sortDescClass);
  }

  // add required sort class
  sortHeader.classList.add(newDirection === 1 ? sortAscClass : sortDescClass);

  // calling sortData method of PaginationSystem class
  const queryObj = {
    [sortParam]: headerName,
    [orderParam]: newDirection === 1 ? 'ASC' : 'DESC',
  };
  dataPaging.sortData(queryObj, 1);
}

/**
 * keypress event handling in a text box (Enter keypress)
 * @param {*} event
 */
function beforeFilterData(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    filterData(event);
  }
}

/**
 * search event handling (filter data)
 * @param {*} event
 */
function filterData(event) {
  let searchEl = document.querySelector('#search-input');

  if (!searchEl.value) {
    return false;
  }

  searchEl = searchEl.value.toLowerCase();

  // json server api search
  // q - Full-text search
  // {q: 'female', id_gte: 10, first_name_like: '^an', id_lte: 100}
  const seachObj = { [seachParam]: searchEl };

  // calling filterData method of PaginationSystem class
  dataPaging
    .filterData(seachObj)
    .then((countRecords) => {
      console.log('Found:', countRecords);
    })
    .catch((err) => {
      showError(err);
    });
}

/**
 *  restore data event handling
 * @param {*} event
 */
function restoreData(event) {
  const searchEl = document.querySelector('#search-input');
  searchEl.value = '';

  // calling restoreData method of PaginationSystem class
  dataPaging.restoreData().catch((err) => {
    showError(err);
  });
}

/**
 * @param {*} err
 */
function showError(err) {
  toggleErrorMessage(true, err.message);
  console.error(`%c${err}`, 'font-size:16px;');
}

/**
 * @param {Boolean} isShow
 * @param {String} errMessage
 * @returns
 */
function toggleErrorMessage(isShow, errMessage = '') {
  if (!errorMessageEl) {
    return;
  }
  errMessage = errMessage.replace(/\n/g, '<br>');
  errorMessageEl.classList[isShow ? 'remove' : 'add']('hide');
  const messSelector = errorMessageEl.querySelector('p');
  if (messSelector && errMessage) {
    messSelector.innerHTML = errMessage;
  }
}
