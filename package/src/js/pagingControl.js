import { Pagination } from './pagination';

/**
 * @class PagingControl
 * the  class that manages the behavior of pagination system
 * @extends Pagination
 */
export class PagingControl extends Pagination {
  /**
   * @constructor
   * @param {Object} options
   * @param {HTMLElement} options.container
   * @param {Number} options.perPage
   * @param {Number} options.countRecords
   * @param {Boolean} options.isShowPerPage - show or not perPage dropbox
   * @param {String} options.loading - loading can be 'auto'|'more'|'none'
   */
  constructor(options) {
    super(options);
  }

  /**
   * init paging
   */
  init() {
    this.renderPages().then((lastChild) => {
      this.initPaging();
      this.setLoadingDependencies();
      this.setEvent();

      if (this.loading === 'auto') {
        this.observe(lastChild);
      }
    });
  }

  /**
   * loading = 'auto' - set infiniteObserver
   * loading = 'more' - set 'Show More' button
   */
  setLoadingDependencies() {
    if (this.showMoreElement) {
      this.visibileShowMoreBtn(false);
    }

    if (this.loading === 'auto') {
      this.setInfiniteObserver();
    } else if (this.loading === 'more') {
      if (!this.showMoreElement) {
        this.setShowMoreBtn();
      }

      this.visibileShowMoreBtn(true);
    }
  }

  /**
   * set IntersectionObserver if loading = 'auto'
   */
  setInfiniteObserver() {
    this.infiniteObserver = new IntersectionObserver(
      ([entry], observer) => {
        // check reached the last element
        if (entry.isIntersecting) {
          // stop observe it
          observer.unobserve(entry.target);

          // load next page
          this.handlerShowMore();
        }
      },
      { threshold: 0.8 }
    );
  }

  /**
   * set events for perPage element, pages buttons, 'Show More' button
   */
  setEvent() {
    this.setPerPageEvent();
    this.setPaginationEvent();
    this.setShowMoreEvent();
  }

  setPerPageEvent() {
    // per page
    if (this.perPageElement) {
      this.perPageElement.addEventListener(
        'change',
        this.handlerPerPage.bind(this),
        false
      );
    }
  }

  setPaginationEvent() {
    // pages buttons click event
    if (this.paginatorElement) {
      this.paginatorElement.addEventListener(
        'click',
        this.handlerGoPage.bind(this),
        false
      );
    }
  }

  setShowMoreEvent() {
    // show more
    if (
      this.showMoreElement &&
      this.showMoreElement.getAttribute('listener') !== 'true'
    ) {
      //this.visibileShowMoreBtn(true);
      this.showMoreElement.setAttribute('listener', 'true');
      this.showMoreElement.addEventListener(
        'click',
        this.handlerShowMore.bind(this),
        false
      );
    }
  }

  /**
   * handler change perPage
   * @param {*} event
   */
  handlerPerPage(event) {
    const perPageEl = event.target;
    perPageEl.blur();
    this.perPage = +perPageEl.value;
    this.eventName = 'perPage';
    this.numPage = 1;
    this.clearActiveBtns();
    this.setNumberPages();
    this.renderPages().then(() => {
      this.afterRenderData();
    });
  }

  /**
   * handler page button click event
   * @param {*} event
   */
  handlerGoPage(event) {
    this.eventName = 'goPage';
    const element = event.target;
    const pageData = element.dataset.index;
    if (!pageData) {
      return false;
    }

    switch (pageData) {
      case 'prev':
        if (this.activeBtns.length && this.activeBtns[0] > 1) {
          this.numPage = this.activeBtns[0] - 1;
        } else {
          this.numPage--;
        }
        break;
      case 'next':
        this.numPage++;
        break;
      case 'first':
        this.numPage = 1;
        break;
      case 'last':
        this.numPage = this.numberPages;
        break;
      default:
        this.numPage = +pageData;
        break;
    }

    this.clearActiveBtns();
    this.renderData(false);
  }

  /**
   * handler 'Show More' button click event
   * @param {*} event
   */
  handlerShowMore(event) {
    this.eventName = event ? 'showMore' : 'moreAuto';
    if (this.numPage === this.numberPages) {
      return;
    }

    this.clearActiveBtns();

    if (this.numPage < this.numberPages) {
      // already pressed buttons must be saved in array
      this.paginatorElement
        .querySelectorAll('button.active')
        .forEach((element) => {
          this.activeBtns.push(+element.dataset.index);
        });

      this.numPage++;
      this.renderData(true);
    }
  }

  /**
   * fire renderPages event
   */
  renderPages() {
    return this.fire('renderPages', this.perPage, this.numPage);
  }

  /**
   * fire renderData event
   * @param {Boolean} isPageAdd - whether data is added to the page or the page is overwritten
   */
  renderData(isPageAdd) {
    this.fire('renderData', this.numPage, isPageAdd).then((lastChild) => {
      if (this.loading === 'auto') {
        this.observe(lastChild);
      }

      this.afterRenderData();
    });
  }

  afterRenderData() {
    this.checkScroll();
    this.render();
  }

  /**
   * if a page button was clicked or perPage was changed
   * (i.e. does not load automatically or "Show more") -
   * fire goToTop event
   */
  checkScroll() {
    const allowedEventsToScrollTop = ['goPage', 'perPage'];

    if (allowedEventsToScrollTop.includes(this.eventName)) {
      this.fire('goToTop', this.perPage, this.numPage);
      this.eventName = 'none';
    }
  }

  observe(lastChild) {
    if (!(lastChild instanceof HTMLElement)) {
      console.error(
        'autoload is not possible, last child of collection is not HTMLElement!'
      );
      return;
    }

    this.lastChild = lastChild;
    this.observeLastChild();
  }

  /**
   * observe last child element if loading = 'auto'
   */
  observeLastChild() {
    if (this.infiniteObserver && this.lastChild) {
      this.infiniteObserver.observe(this.lastChild);
    }
  }

  /**
   * set 'Show More' button
   */
  setShowMoreBtn() {
    if (!this.showMoreElement) {
      this.displayShowMoreBtn();

      // invisible at first
      this.visibileShowMoreBtn(false);
    }
  }

  /**
   * display 'Show More' button
   */
  displayShowMoreBtn() {
    // insert 'Show More' button
    this.pagingBox.insertAdjacentHTML(
      'afterend',
      this.template.showMoreTemplate()
    );

    this.showMoreElement = this.container.querySelector(this.showMoreSelector);
  }

  /**
   * visibility show more button
   */
  visibileShowMoreBtn(isShow) {
    this.showMoreElement.style.display = isShow ? 'flex' : 'none';
  }
}
