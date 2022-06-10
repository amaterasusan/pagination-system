import { checkType, isUrl, changeCellHtml } from '../utils';

/**
 * @class DataManager
 * parent class for data render class(es)
 */
export class DataManager {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    if (!(options.container instanceof HTMLElement)) {
      throw new Error('`dataContainer` property is not HTMLElement!');
    }

    if (typeof options.dataRenderFn !== 'function') {
      throw new Error('`dataRenderFn` property is not a Function!');
    }

    this.container = options.container;
    this.dataRenderFn = options.dataRenderFn;
    this.childSelector = options.childSelector || null;
  }

  /**
   * renderPages
   */
  renderPages() {
    throw new Error(
      '`renderPages` method should be implemented in the child class'
    );
  }

  /**
   * renderData
   */
  renderData() {
    throw new Error(
      '`renderData` method should be implemented in the child class'
    );
  }

  /**
   * set data keys (field names) by first row of data
   * @param {Object} row like {"id": 1, "name": "John", ...}
   */
  setDataKeys(row = {}) {
    const keysDataRow = Object.keys(row);
    let dgFields = [];
    let jsonFields = [];
    let urlFields = [];
    let boolFields = [];

    for (const key of keysDataRow) {
      const res = {};
      const value = row[key];

      if (typeof value === 'object') {
        jsonFields.push(key);
      }

      if (isUrl(value)) {
        urlFields.push(key);
      }

      if (typeof value === 'boolean') {
        boolFields.push(key);
      }

      const type = checkType(value);
      res.name = key;
      res.type = type;
      res.title = key.split(/(?:_|\-)/gi).join(' ');
      dgFields = [...dgFields, res];
    }

    this.dataKeys = dgFields;

    if (jsonFields.length) {
      this.jsonFields = jsonFields;
    }

    if (urlFields.length) {
      this.urlFields = urlFields;
    }

    if (boolFields.length) {
      this.boolFields = boolFields;
    }
  }

  /**
   * checking cell content and replace html if need
   * @param {Array} dataPage
   */
  checkContent(dataPage) {
    if (this.jsonFields) {
      changeCellHtml(dataPage, this.jsonFields, 'json');
    }

    if (this.urlFields) {
      changeCellHtml(dataPage, this.urlFields, 'url');
    }

    if (this.boolFields) {
      changeCellHtml(dataPage, this.boolFields, 'boolean');
    }
  }

  /**
   * @returns {HTMLElement} last child element of collection
   */
  getLastChild() {
    return this.container.querySelector(`${this.childSelector}:last-child`);
  }

  /**
   * scroll to top of container
   */
  goToTop() {
    this.container.scrollIntoView({
      block: 'start',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }
}
