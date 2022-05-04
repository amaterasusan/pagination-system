/**
 * @class DataPagingManager
 */
export class DataPagingManager {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    const defaults = {
      perPage: 10,
      countRecords: 0,
      isShowPerPage: true,
      loading: 'none',
    };

    let actualOptions = { ...defaults, ...(options || {}) };

    const organize = ({
      pagingContainer,
      perPage,
      countRecords,
      isShowPerPage,
      loading,
      dataContainer,
      ...object
    }) => ({
      pagingOptions: {
        container: pagingContainer,
        perPage,
        countRecords,
        isShowPerPage,
        loading,
      },
      dataOptions: {
        container: dataContainer,
        ...object,
      },
    });

    const { dataOptions, pagingOptions } = organize(actualOptions);

    // can't change perPage value
    // if dataOptions.urlParams.limit is not defined
    if (dataOptions.urlParams && !dataOptions.urlParams.limit) {
      pagingOptions.isShowPerPage = false;
    }

    this.dataOptions = dataOptions;
    this.pagingOptions = pagingOptions;
  }

  /**
   * subscribe to events and init paging
   */
  init() {
    this.checkMethods();

    this.pagingControl.subscribe('renderPages', this.renderPages.bind(this));
    this.pagingControl.subscribe('renderData', this.renderData.bind(this));
    this.pagingControl.subscribe('goToTop', this.goToTop.bind(this));

    this.pagingControl.init();
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
  renderPages(perPage, numPage) {
    return this.dataControl.renderPages(perPage, numPage);
  }

  /**
   * executed when event 'renderData' occurs
   * @param {Number} numPage
   * @param {Boolean} isPageAdd
   * @returns {Promise} from dataControl.renderData
   */
  renderData(numPage, isPageAdd) {
    return this.dataControl.renderData(numPage, isPageAdd);
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
