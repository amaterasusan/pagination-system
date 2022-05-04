import { DataManager } from '../dataManager';

/**
 * @class DataRender
 * display data
 * @extends DataManager
 */
export class DataRender extends DataManager {
  /**
   * @constructor
   * @param {Object} options
   * @param {HTMLElement} options.container - DOM element for data
   * @param {Array} options.data
   * @param {Function} options.dataRenderFn - function for render data
   * @param {String} [options.childSelector] - optional, child selector of collection for autoloading
   */
  constructor({ data, ...options }) {
    super(options);

    if (!Array.isArray(data)) {
      throw new Error('data is not an array!');
    }

    this.data = data;
    this.pages = [];
    this.lastChild = null;
  }

  /**
   * @param {Number} perPage
   * @param {Number} numPage
   * @returns {Promise}
   */
  renderPages(perPage, numPage) {
    this.pages = this.dataPagination(perPage);
    return this.renderData(numPage);
  }

  /**
   * @param {Number} numPage
   * @param {Boolean} isPageAdd
   * @returns {Promise}
   */
  renderData(numPage, isPageAdd = false) {
    const dataPage = this.pages[numPage - 1];
    this.container.innerHTML = !isPageAdd
      ? this.dataRenderFn(dataPage)
      : this.container.innerHTML + this.dataRenderFn(dataPage);

    if (this.childSelector) {
      this.lastChild = this.getLastChild();
    }

    return Promise.resolve(this.lastChild);
  }

  /**
   * @param {Number} perPage
   * @returns {Array}
   */
  dataPagination(perPage) {
    let dataByPage = [];
    for (
      let i = 0, len = this.data.length, chunk = +perPage;
      i < len;
      i += chunk
    ) {
      let sliceData = this.data.slice(i, i + chunk);
      dataByPage = [...dataByPage, sliceData];
    }
    return dataByPage;
  }
}
