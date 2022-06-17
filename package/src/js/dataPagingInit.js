import { PagingControl } from './pagingControl';
import { getDataInstance } from './dataInstance';

/**
 * @class DataPagingInit
 * pagination initialization
 * parent class for DataCPaging
 */
export class DataPagingInit {
  /**
   * @constructor
   * @param {Object} options
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
   * @param {Object} [options.urlExtraParams] - optional, extra url params
   * @param {String} [options.childSelector] - optional, child selector of collection for autoloading
   * @param {String} [options.dimmerSelector] - optional, dimmer selector
   * @param {HTMLElement} options.pagingContainer - DOM element for paging
   * @param {Number} [options.countRecords] - optional, total data count
   * @param {Number} [options.perPage=10] - optional
   * @param {Boolean} [options.isShowPerPage=true] - optional, show or not perPage dropbox
   * @param {String} [options.loading='none'] - optional, loading can be 'auto'|'more'|'none'
   * @param {String} [options.textShowMore='show more'] - optional, text for Show More button, if loading='more'
   */
  constructor(options) {
    const { dataOptions, pagingOptions } = this.setOptions(options);

    this.dataControl = getDataInstance(dataOptions);

    this.pagingControl = new PagingControl(pagingOptions);

    // if options.data
    if (
      this.pagingControl.initCountRecords &&
      this.pagingControl.initCountRecords < this.dataControl.realCountRecords
    ) {
      this.dataControl.reduceNumberEntries(this.pagingControl.initCountRecords);
    }

    this.init();
  }

  /**
   * @param {Object} options
   * @returns {Object} { dataOptions, pagingOptions }
   */
  setOptions(options) {
    const defaults = {
      perPage: 10,
      countRecords: null,
      isShowPerPage: true,
      loading: 'none',
      textShowMore: null,
    };

    let actualOptions = { ...defaults, ...(options || {}) };

    const organize = ({
      pagingContainer,
      perPage,
      countRecords,
      isShowPerPage,
      loading,
      textShowMore,
      dataContainer,
      ...object
    }) => ({
      pagingOptions: {
        container: pagingContainer,
        perPage,
        countRecords,
        isShowPerPage,
        loading,
        textShowMore,
      },
      dataOptions: {
        container: dataContainer,
        ...object,
      },
    });

    const { dataOptions, pagingOptions } = organize(actualOptions);

    /* 
      can't change perPage value
      if dataOptions.urlParams is set but dataOptions.urlParams.limit is not defined 
    */
    if (dataOptions.urlParams && !dataOptions.urlParams.limit) {
      pagingOptions.isShowPerPage = false;
    }

    return { dataOptions, pagingOptions };
  }

  /**
   * subscribe to events and init paging
   */
  init() {
    this.checkMethods();

    this.pagingControl.subscribe('renderPages', this.renderPages.bind(this));
    this.pagingControl.subscribe('renderData', this.renderData.bind(this));
    this.pagingControl.subscribe('goToTop', this.goToTop.bind(this));

    this.initialized = this.pagingControl.init();
  }

  /**
   * checking the existence of required methods in DataClass
   */
  checkMethods() {
    const methodNames = ['renderPages', 'renderData'];

    for (const methodName of methodNames) {
      if (typeof this.dataControl[methodName] !== 'function') {
        throw new Error(
          `${methodName} method should be implemented! in Data class`
        );
      }
    }
  }

  /**
   * executed when event 'renderPages' occurs
   * @param {Number} perPage
   * @param {Number} numPage
   * @returns {Promise} from dataControl.renderPages
   */
  renderPages(perPage = 10, numPage = 1) {
    return this.dataControl.renderPages(perPage, numPage).then((lastChild) => ({
      lastChild,
      countRecords: this.dataControl.realCountRecords ?? null,
    }));
  }

  /**
   * executed when event 'renderData' occurs
   * @param {Number} numPage
   * @param {Boolean} isPageAdd
   * @returns {Promise} from dataControl.renderData
   */
  renderData(numPage = 1, isPageAdd = false) {
    return this.dataControl
      .renderData(numPage, isPageAdd)
      .then((lastChild) => ({
        lastChild,
      }));
  }

  /**
   * executed when event 'goToTop' occurs
   */
  goToTop() {
    if (typeof this.dataControl.goToTop === 'function') {
      this.dataControl.goToTop();
    }
  }
}
