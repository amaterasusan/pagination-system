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
      throw new Error('Data container is not HTMLElement!');
    }

    if (typeof options.dataRenderFn !== 'function') {
      throw new Error('dataRenderFn is not a Function!');
    }

    this.container = options.container;
    this.dataRenderFn = options.dataRenderFn;
    this.childSelector = options.childSelector || null;
  }

  /**
   * renderPages method should be implemented in the child class
   */
  renderPages() {
    throw new Error(
      'renderPages method should be implemented in the child class'
    );
  }

  /**
   * renderData method should be implemented in the child class
   */
  renderData() {
    throw new Error(
      'renderData method should be implemented in the child class'
    );
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
