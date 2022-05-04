import PaginationSystem from 'pagination-system';
import './demo.css';
import 'pagination-system/dist/pagination-system.min.css';
import tableData from './static/data_100.json';

window.addEventListener('DOMContentLoaded', () => {
  // make table
  makeDataTable(tableData);
});
/**
 *
 * @param {Array} data
 * @returns
 */
function makeDataTable(data) {
  if (!data.length) {
    return;
  }

  const keysDataRow = Object.keys(data[0]);

  createTable(keysDataRow);

  const dataRenderFn = (dataPage) => {
    return `${dataPage
      .map(
        (row) =>
          `<tr>${Object.entries(row)
            .map(([key, value]) => `<td data-th="${key}">${value}</td>`)
            .join('')}</tr>`
      )
      .join('')}`;
  };

  // real container for data will be tbody
  const options = {
    dataContainer: document.querySelector('.dg-grid tbody'),
    dataRenderFn: dataRenderFn,
    data: data || [],
    pagingContainer: document.querySelector('.paging-container'),
    perPage: 10,
    countRecords: data.length || 0,
  };

  new PaginationSystem(options);
}

/**
 * create table inside container
 * @param {Array} fields
 */
function createTable(fields) {
  if (!document.querySelector('.dg-grid')) {
    const table = document.createElement('table');
    table.classList.add('dg-grid');

    const setBasisTable = (fields) => {
      return `<thead><tr>${fields
        .map((item) => `<th>${item}</th>`)
        .join('')}</tr></thead><tbody></tbody>`;
    };

    table.insertAdjacentHTML('afterbegin', setBasisTable(fields));
    document.querySelector('.container-table').appendChild(table);
  }
}
