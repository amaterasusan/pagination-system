import { DataPagingInit } from './dataPagingInit';

/**
 * @class DataCPaging
 * API data pagination
 * @extends DataPagingInit
 */
export class DataCPaging extends DataPagingInit {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);
  }

  /**
   * returns Promise with an array of keys (field name)
   * like [{name: 'id', type: 'numeric', title: 'id'}, {name: 'first_name', type: 'alpha', title: 'first name'}, ...]
   * @returns {Promise} dataKeys
   */
  getDataKeys() {
    return this.initialized.then(() => this.dataControl.dataKeys || []);
  }

  /**
   * @returns {Number} numPage
   */
  getNumPage() {
    return this.pagingControl.numPage;
  }

  /**
   * @returns {Number} perPage
   */
  getPerPage() {
    return this.pagingControl.perPage;
  }

  /**
   * render pages
   * @param {Number} numPage
   * @returns {Promise}
   */
  render(numPage = 1) {
    this.pagingControl.numPage = numPage;
    return this.pagingControl.renderDataPagination();
  }

  /**
   * sort data
   * @param {Object} queryObj
   * @param {Number} numPage
   * queryObj:
   * if options.url - like {'_sort': 'name', '_order': 'asc'}
   * if options.data - {field: 'name', direction: 1, type: 'alpha'}
   * direction: 1(ASC)|-1(DESC)
   * type: 'numeric'|'date'|'alpha'
   */
  sortData(queryObj = {}, numPage = 1) {
    this.dataControl.sortData(queryObj);
    this.render(numPage);
  }

  /**
   * filter data
   * @param {Object} queryObj
   * if options.url - like { q: 'andrew', country: 'spain' } for url query
   * if options.data - like
   * {
   *   q: {value: 'andr'} // global search
   *   id: { action: 'lte', value: 40 },
   *   age: { action: 'in_range', value: [20, 30] },
   * }
   * @returns {Promise}
   */
  filterData(queryObj = {}) {
    this.dataControl.filterData(queryObj);
    return this.render(1).then(() => this.pagingControl.countRecords);
  }

  /**
   * restore data after filtering
   * @returns {Promise}
   */
  restoreData() {
    this.dataControl.restoreData();
    return this.render(1);
  }
}
