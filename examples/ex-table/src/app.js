import PaginationSystem from 'pagination-system';
import './demo.css';
import 'pagination-system/dist/pagination-system.min.css';
import data from './static/data_100.json';

// instance of PaginationSystem class
let dataPaging;
let errorMessageEl;

// sorted css classes
const sortAscClass = 'sorted-asc';
const sortDescClass = 'sorted-desc';

// css class by type
const classByType = {
  numeric: 'sort-numeric',
  date: 'sort-date',
  alpha: 'sort-alpha',
};

window.addEventListener('DOMContentLoaded', () => {
  // error pop-up
  errorMessageEl = document.querySelector('.message');
  // close pop-up
  document
    .querySelector('.notification-close')
    .addEventListener('click', () => toggleErrorMessage(false), false);

  // make table
  if (!data.length) {
    toggleErrorMessage(true, 'Data array is empty!');
    return;
  }

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
  const dataRenderFn = (dataPage) => {
    return `${dataPage
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

  const options = {
    dataContainer: document.querySelector('.dg-grid tbody'), // real container for data will be tbody
    dataRenderFn: dataRenderFn,
    data: data || [],
    pagingContainer: document.querySelector('.paging-container'),
    // countRecords: 12, // there is no need to set this parameter, the number of records will be counted
  };

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

// set table header
function setHeaderTable(fields = []) {
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

// set Events
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

  const dgTH = document.querySelector('.dg-grid').querySelectorAll('thead th');
  // add event listener for sorting
  dgTH.forEach((th) => {
    th.addEventListener('pointerdown', sortColumn, false);
  });
}

// sorting event
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
  const type = ['numeric', 'date', 'alpha'].find((key) =>
    sortHeader.classList.contains(classByType[key])
  );

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
    field: headerName,
    direction: newDirection,
    type: type,
  };
  dataPaging.sortData(queryObj, 1);
}

// Enter key event in a text box
function beforeFilterData(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    filterData(event);
  }
}

// filter data event
function filterData(event) {
  let searchEl = document.querySelector('#search-input');

  if (!searchEl.value) {
    return false;
  }

  searchEl = searchEl.value.toLowerCase();
  const queryObj = {
    q: { value: searchEl },
    // country: { action: 'eq', value: 'china' },
    // age: { action: 'lte', value: 30 },
    // name: { action: 'starts_with', value: 'm' },
    // id: { action: 'in_range', value: [20, 50] }
  };

  // calling filterData method of PaginationSystem class
  dataPaging
    .filterData(queryObj)
    .then((countRecords) => {
      console.log('Found:', countRecords);
    })
    .catch((err) => {
      showError(err);
    });
}

// restore data event
function restoreData(event) {
  document.querySelector('#search-input').value = '';
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
