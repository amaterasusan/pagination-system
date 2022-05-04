import { DataManager } from '../dataManager';
/**
 * @class DataRenderLoadByPage
 * loading data from server page by page and display
 * @extends DataManager
 */
export class DataRenderLoadByPage extends DataManager {
  /**
   * @constructor
   * @param {Object} options
   * @param {HTMLElement} options.container - DOM element for data
   * @param {Function} options.dataRenderFn - function for render data
   * @param {String} options.url - url for loading data
   * @param {Object} options.urlParams - url query params {limit, pageNumber}
   * @param {String} [options.urlParams.limit] - optional, url query param name (number of items to display per page)
   * @param {String} options.urlParams.pageNumber - url query param name (number of page)
   * @param {String} [options.childSelector] - optional, child selector of collection for autoloading
   * @param {String} [options.dimmerSelector] - optional, dimmer selector
   */
  constructor({ url, urlParams, ...options }) {
    super(options);

    if (!url) {
      throw new Error('url must be defined');
    }

    if (!urlParams) {
      throw new Error('urlParams must be defined');
    }

    if (!urlParams.pageNumber) {
      throw new Error('urlParams.pageNumber must be defined');
    }

    // server url
    this.url = url;
    this.urlParams = urlParams;
    this.dimmerElement = options.dimmerSelector && document.querySelector(options.dimmerSelector);
    this.lastChild = null;
  }

  /**
   * @param {Number} perPage
   * @param {Number} numPage
   * @returns {Promise}
   */
  renderPages(perPage, numPage) {
    this.limitData = perPage;
    return this.renderData(numPage);
  }

  /**
   * @param {Number} numPage
   * @param {Boolean} isPageAdd
   * @returns {Promise}
   */
  renderData(numPage, isPageAdd = false) {
    this.toggleDimmer(true);

    return this.loadServerData(numPage)
      .then((data) => {
        this.displayData(data, isPageAdd);
        this.toggleDimmer(false);

        if (this.childSelector) {
          this.lastChild = this.getLastChild();
        }

        return this.lastChild;
        //
      })
      .catch((err) => {
        this.toggleDimmer(false);
        throw new Error(err);
      });
  }

  /**
   * Loading a page from the server
   * @param {Number} numPage
   * @returns {Promise}
   */
  loadServerData(numPage = 1) {
    const url = this.urlParams.limit
      ? `${this.url}?${this.urlParams.limit}=${this.limitData}&${this.urlParams.pageNumber}=${numPage}`
      : `${this.url}?${this.urlParams.pageNumber}=${numPage}`;

    return fetch(url).then((res) => res.json());
  }

  /**
   * display data with dataRenderFn
   * @param {Array} dataPage
   * @param {Boolean} isPageAdd
   */
  displayData(dataPage, isPageAdd = false) {
    this.container.innerHTML = !isPageAdd
      ? this.dataRenderFn(dataPage)
      : this.container.innerHTML + this.dataRenderFn(dataPage);
  }

  /**
   * Toggle Dimmer
   * @param {Boolean} isVisible
   */
  toggleDimmer(isVisible) {
    if (!this.dimmerElement) {
      return;
    }

    if (isVisible) {
      this.dimmerElement.classList.add('active');
      this.container.style.opacity = 0.7;
    } else {
      this.dimmerElement.classList.remove('active');
      this.container.style.opacity = 1;
    }
  }
}
