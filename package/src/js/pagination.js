import { EventManager } from './eventManager';

/**
 * @class Pagination
 * Pagination class
 * display pagination
 * @extends EventManager
 */
export class Pagination extends EventManager {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    super();

    if (!(options.container instanceof HTMLElement)) {
      throw new Error('`pagingContainer` property is not HTMLElement!');
    }

    this.container = options.container;
    this.perPage = options.perPage || 10;
    this.countRecords = options.countRecords ?? null;
    this.initCountRecords = this.countRecords;
    this.isShowPerPage = options.isShowPerPage ?? true;
    this.textShowMore = options.textShowMore ?? 'show more';
    this.numPage = 1;
    this.activeBtns = [];

    // loading
    const allowedValues = ['auto', 'more', 'none'];
    this.loading = allowedValues.includes(options.loading)
      ? options.loading
      : 'none';

    this.statusBoxSelector = '.dg-status-box';
    this.pagingBoxSelector = '.dg-paging';
    this.perPageSelector = '#per-page';
    this.paginatorSelector = '.pagination';
    this.showMoreSelector = '.show-more';
    this.template = PagingTemplate();
  }

  initPaging() {
    this.setNumberPages();
    this.displayTemplatePages();
    this.visiblePagingBox();
  }

  /**
   * calculate count of pages
   */
  setNumberPages() {
    this.numberPages = Math.ceil(this.countRecords / this.perPage);
  }

  /**
   * recalculate number of pages
   * @param {Number} countRecords
   */
  recalculateNumberPages(countRecords = 1) {
    this.countRecords = countRecords;
    this.setNumberPages();
  }

  /**
   * display paging
   */
  displayTemplatePages() {
    // insert html in container,
    // initially the paging box is invisible, will become visible after the data is loaded
    if (this.container.querySelector(this.statusBoxSelector)) {
      this.container.querySelector(this.statusBoxSelector).remove();
    }

    this.container.insertAdjacentHTML(
      'beforeend',
      this.template.htmlTemplate(
        this.numberPages,
        this.perPage,
        this.isShowPerPage
      )
    );

    this.pagingBox = this.container.querySelector(this.pagingBoxSelector);
    this.perPageElement = this.container.querySelector(this.perPageSelector);
    this.paginatorElement = this.container.querySelector(
      this.paginatorSelector
    );
  }

  /**
   * render paging
   */
  render() {
    if (this.numberPages > 1) {
      this.displayBtns();
      this.visiblePaging(true);
    } else {
      this.paginatorElement.innerHTML = '';
    }

    this.setActivePageBtn();
  }

  /**
   * display paging buttons
   */
  displayBtns() {
    this.paginatorElement.innerHTML = this.template.htmlBtns(
      this.numPage,
      this.numberPages,
      !(
        this.numPage === 1 ||
        (this.activeBtns.length && this.activeBtns[0] === 1)
      ) // isVisibleFirst
    );
  }

  /**
   * initial visibility all paging box
   */
  visiblePagingBox() {
    if (this.numberPages > 1) {
      // set visible Paging
      this.visiblePaging(true);

      // set activa page button
      this.setActivePageBtn();
    }
  }

  /**
   * visibility paging elements
   * @param {Boolean} isVisible
   */
  visiblePaging(isVisible) {
    this.pagingBox.style.visibility =
      isVisible || this.numberPages > 1 ? 'visible' : 'hidden';
  }

  /**
   * set Active page button(s)
   */
  setActivePageBtn() {
    if (this.numberPages > 1) {
      // current button
      const currentPageBtn = this.container.querySelector(
        `[data-index="${this.numPage}"]`
      );

      if (currentPageBtn) {
        currentPageBtn.classList.add('active', 'current');
      }

      // buttons pressed before show more click
      if (this.activeBtns.length) {
        this.activeBtns.forEach((element) => {
          const domElement = this.paginatorElement.querySelector(
            `[data-index="${element}"]`
          );
          if (domElement) {
            domElement.classList.add('active');
          }
        });
      }
    }
  }

  clearActiveBtns() {
    this.activeBtns = [];
  }
}

/**
 * Paging Template
 * @returns {Object of functions {htmlTemplate, htmlBtns, showMoreTemplate}}
 */
function PagingTemplate() {
  /**
   * @param {Number} pageCount
   * @param {Number} perPage
   * @param {Boolean} isShowPerPage
   * @returns {String} String with html
   */
  function htmlTemplate(pageCount, perPage = 10, isShowPerPage = true) {
    const btns = htmlBtns(1, pageCount);
    const perPageValues = [5, 10, 15, 20, 30, 40, 50];
    let perPageHTML = [
      `<select id="per-page" class="dg-per-page${
        !isShowPerPage ? ' per-page-hide' : ''
      }">`,
    ];

    perPageValues.forEach((el) => {
      const selected = el === perPage ? ' selected' : '';
      perPageHTML = [
        ...perPageHTML,
        `<option value="${el}"${selected}>${el}</option>`,
      ];
    });

    perPageHTML = [...perPageHTML, `</select>`].join('');

    return `<div class="dg-status-box"><div class="dg-paging">${perPageHTML}<div class="pagination">${btns}</div></div>`;
  }

  /**
   * @param {Number} numPage
   * @param {Number} pageCount
   * @param {Boolean} isVisibleFirst
   * @returns {String} String with html
   */
  function htmlBtns(numPage = 1, pageCount, isVisibleFirst = false) {
    const btns = paginator(numPage, pageCount);
    let html = `<div id="number-pages" class="dg-number-pages">${btns.join(
      ''
    )}</div>`;

    if (pageCount > 1) {
      const prevButton = `<button type="button" ${
        !isVisibleFirst ? 'disabled' : ''
      } data-index="prev">&lsaquo;</button>`;

      const nextButton = `<button type="button" ${
        numPage === pageCount ? 'disabled' : ''
      } data-index="next">&rsaquo;</button>`;

      const firstButton = `<button type="button" ${
        !isVisibleFirst ? 'disabled' : ''
      } data-index="first">&laquo;</button>`;

      const lastButton = `<button type="button" ${
        numPage === pageCount ? 'disabled' : ''
      } data-index="last">&raquo;</button>`;

      html = `${firstButton}${prevButton}${html}${nextButton}${lastButton}`;
    }

    return html;
  }

  /**
   * @param {Number} numPage
   * @param {Number} pageCount
   * @returns {Array}
   */
  function paginator(numPage, pageCount) {
    const delta = 2;
    const doubleDelta = delta * 2;

    let btns = [];

    if (pageCount < 10) {
      btns = [...btns, ...addBtnPaging(1, pageCount + 1)];
    } else if (numPage < doubleDelta + 1) {
      btns = [
        ...btns,
        ...addBtnPaging(1, doubleDelta + 4),
        ...lastBtnPaging(pageCount),
      ];
    } else if (numPage > pageCount - doubleDelta) {
      btns = [
        ...btns,
        ...startBtnPaging(1),
        ...addBtnPaging(pageCount - doubleDelta - 2, pageCount + 1),
      ];
    } else {
      btns = [
        ...btns,
        ...startBtnPaging(1),
        ...addBtnPaging(numPage - delta, numPage + delta + 1),
        ...lastBtnPaging(pageCount),
      ];
    }

    return btns;
  }

  /**
   *
   * @param {Number} start
   * @param {Number} len
   * @returns {Array}
   */
  function addBtnPaging(start, len) {
    let btns = [];
    for (let i = start; i < len; i++) {
      btns.push(
        `<button type="button" tabindex="${i}" data-index="${i}">${i}</button>`
      );
    }
    return btns;
  }

  /**
   * @param {Number} first
   * @returns {Array}
   */
  function startBtnPaging(first) {
    let btns = [];
    btns.push(
      `<button type="button" tabindex="${first}" data-index="${first}">${first}</button>`
    );
    btns.push(
      `<button type="button" data-index="disabled" disabled>...</button>`
    );
    return btns;
  }

  /**
   *
   * @param {Number} last
   * @returns {Array}
   */
  function lastBtnPaging(last) {
    let btns = [];
    btns.push(
      `<button type="button" data-index="disabled" disabled>...</button>`
    );
    btns.push(
      `<button type = "button" tabindex = "${last}" data-index="${last}" >${last}</button >`
    );
    return btns;
  }

  /**
   * html template for 'Show More' button
   * @returns {String}
   */
  function showMoreTemplate(textShowMore = '') {
    return `<div class="show-more"><i class="show-more-icon" aria-hidden="true"></i> <span>${textShowMore}</span></div>`;
  }

  return {
    htmlTemplate,
    htmlBtns,
    showMoreTemplate,
  };
}
