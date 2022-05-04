import { DataPagingManager } from './dataPagingManager';
import { PagingControl } from './pagingControl';
import { getDataInstance } from './dataCRender';

/**
 * @class DataCPaging
 * pagination initialization
 * @extends DataPagingManager
 */
export class DataCPaging extends DataPagingManager {
  /**
   * @constructor
   * @param {*} options
   * @param {HTMLElement} options.dataContainer - DOM element for data
   * @param {Function} options.dataRenderFn - function for render data
   *
   * either options.data or options.url and options.urlParams
   * depending on whether all data is received,
   * or data is loaded from the server page by page
   * @param {Array} options.data - if all data is received
   * @param {String} options.url - url for loading data by page from server
   * @param {Object} options.urlParams - url query params {limit, pageNumber}
   * @param {String} [options.urlParams.limit] - optional, url query param name (number of items to display per page)
   * @param {String} options.urlParams.pageNumber - url query param name (number of page)
   * @param {String} [options.childSelector] - optional, child selector of collection for autoloading
   * @param {String} [options.dimmerSelector] - optional, dimmer selector
   * @param {HTMLElement} options.pagingContainer - DOM element for paging
   * @param {Number} options.countRecords - total data count
   * @param {Number} [options.perPage=10] - optional
   * @param {Boolean} [options.isShowPerPage=true] - optional, show or not perPage dropbox
   * @param {String} [options.loading='none'] - optional, loading can be 'auto'|'more'|'none'
   */
  constructor(options) {
    super(options);

    this.dataControl = getDataInstance(this.dataOptions);

    this.pagingControl = new PagingControl(this.pagingOptions);

    this.init();
  }
}
