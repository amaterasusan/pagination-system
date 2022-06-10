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
   * @param {String} [options.urlParams.limit] - optional, URL query parameter name (number of items to display per page)
   * @param {String} options.urlParams.pageNumber - URL query parameter name (number of page)
   * @param {Object} [options.urlExtraParams] - optional, extra url params
   * @param {String} [options.childSelector] - optional, child selector of collection for autoloading
   * @param {String} [options.dimmerSelector] - optional, dimmer selector
   */
  constructor({ url, urlParams, ...options }) {
    super(options);

    if (!urlParams) {
      throw new Error('`urlParams` property must be defined!');
    }

    if (!urlParams.pageNumber) {
      throw new Error('`urlParams.pageNumber` property must be defined!');
    }

    // server url
    this.url = url;
    this.urlBasic = this.url;
    this.urlParams = urlParams;
    this.urlExtraParams = options.urlExtraParams;
    this.dimmerElement = document.querySelector(options.dimmerSelector);
    this.lastChild = null;

    // set some extra parameters
    if (this.urlExtraParams) {
      this.setUrlQuery(this.urlExtraParams);
    }
  }

  /**
   * @param {Number} perPage
   * @param {Number} numPage
   * @returns {Promise}
   */
  renderPages(perPage, numPage) {
    // set limit (number of entries per page) in url query
    if (
      (this.urlParams.limit && this.limitData !== perPage) ||
      !this.limitData
    ) {
      this.setUrlQuery({
        [`${this.urlParams.limit}`]: perPage,
      });
    }

    this.limitData = perPage;

    return this.renderData(numPage);
  }

  /**
   * Loading a page from the server
   * @returns {Promise}
   */
  loadServerData() {
    this.realCountRecords = null;

    return fetch(this.url).then((res) => {
      this.realCountRecords = res.headers.get('x-total-count')
        ? +res.headers.get('x-total-count')
        : null;

      if (this.realCountRecords === null) {
        throw new Error(
          `Response header 'X-Total-Count' doesn't exist,\n so the total number of entries is undefined!\n Check also URL parameters.`
        );
      }

      return res.json();
    });
  }

  /**
   * @param {Number} numPage
   * @param {Boolean} isPageAdd
   * @returns {Promise}
   */
  renderData(numPage, isPageAdd = false) {
    this.toggleDimmer(true);

    // set page number in url query
    this.setUrlQuery({
      [`${this.urlParams.pageNumber}`]: numPage,
    });

    return this.loadServerData()
      .then((data) => {
        if (!this.dataKeys && data.length) {
          // set Data Keys
          this.setDataKeys(data[0]);
        }

        this.displayData(data, isPageAdd);
        this.toggleDimmer(false);

        // for autoload
        if (this.childSelector) {
          this.lastChild = this.getLastChild();
        }

        return this.lastChild;
      })
      .catch((err) => {
        this.toggleDimmer(false);
        throw err;
      });
  }

  /**
   * display data with dataRenderFn
   * @param {Array} dataPage
   * @param {Boolean} isPageAdd
   */
  displayData(dataPage = [], isPageAdd = false) {
    // checking cell content and replace html if need
    this.checkContent(dataPage);

    this.container.innerHTML = !isPageAdd
      ? this.dataRenderFn(dataPage)
      : this.container.innerHTML + this.dataRenderFn(dataPage);
  }

  /**
   * get url query params
   * @returns
   */
  getQueryParams() {
    const url = new URL(`${this.url}`);
    return new URLSearchParams(url.search);
  }

  /**
   * @param {*} queryObj like {key1: value1, key2: value2}
   */
  setUrlQuery(queryObj = {}) {
    const params = this.setQueryParams(queryObj);
    this.setUrl(params);
  }

  /**
   * @param {*} params
   * @param {Object} queryObj
   * @returns {*} params
   */
  setQueryParams(queryObj = {}) {
    let params = this.getQueryParams();
    Object.entries(queryObj).forEach(([key, value]) => {
      params.set(key, value);
    });

    return params;
  }

  removeQueryParams(queryObj = {}) {
    let params = this.getQueryParams();

    Object.keys(queryObj).forEach((key) => {
      params.delete(key);
    });

    this.setUrl(params);
  }

  /**
   * @param {*} params
   */
  setUrl(params) {
    this.url = `${this.urlBasic}?${params.toString()}`;
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
