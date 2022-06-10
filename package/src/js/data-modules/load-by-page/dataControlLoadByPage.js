import { DataRenderLoadByPage } from './dataRenderLoadByPage';

/**
 * @class DataControlLoadByPage
 * @extends DataRenderLoadByPage
 */
export class DataControlLoadByPage extends DataRenderLoadByPage {
  constructor(options) {
    super(options);

    this.lastSearch = {};
  }

  /**
   * @param {Object} queryObj
   * like {'_sort': 'name', '_order': 'ASC'}
   */
  sortData(queryObj = {}) {
    this.setUrlQuery(queryObj);
  }

  /**
   * filter Data
   * @param {Object} search
   * like { name: 'andrew', country: 'spain' }
   */
  filterData(search = {}) {
    if (Object.keys(this.lastSearch).length) {
      this.removeQueryParams(this.lastSearch);
    }

    this.lastSearch = search;
    this.setUrlQuery(search);
  }

  /**
   * resore data
   */
  restoreData() {
    if (!this.lastSearch) {
      return;
    }

    this.removeQueryParams(this.lastSearch);
  }
}
