import {
  getListOptions,
  getTableOptions,
  getProductsOptions,
  getAjaxOptions,
} from './makeData';
import PaginationSystem from 'pagination-system';
import './demo.css';
import 'pagination-system/dist/pagination-system.min.css';

const CacheInstances = {};
let errorMessageEl;

window.addEventListener('DOMContentLoaded', function () {
  errorMessageEl = document.querySelector('.message');

  // add event for radio buttons (click menu event)
  const radiosMenu = document.querySelectorAll('input[name="tab"]');
  radiosMenu.forEach((el) => {
    el.addEventListener('click', handleToggleMenu);
  });

  // add change event on select (Server Data by page)
  document
    .querySelector('.select-box select')
    .addEventListener('change', handleSelectBox);

  // check sessionStorage
  let dataMenu = sessionStorage.getItem('pg-current-menu');
  let needMenu;

  if (!dataMenu) {
    needMenu = document.querySelector(`input[name="tab"]:checked`);
    dataMenu = needMenu.dataset.menu;
  } else {
    // if current menu in sessionStorage
    needMenu = document.querySelector(`input[data-menu="${dataMenu}"]`);
  }

  if (needMenu && dataMenu) {
    needMenu.checked = true;
    initData(dataMenu);
  }
});

/**
 * Init data for menu items: List, Table, Products, Server Data
 * @param {String} dataMenu
 */
function initData(dataMenu) {
  // options are return from function depends on dataMenu
  toggleErrorMessage(false);
  let options;
  switch (dataMenu) {
    case 'list':
      options = getListOptions();
      break;
    case 'table':
      options = getTableOptions();
      break;
    case 'products':
      options = getProductsOptions();
      break;
    case 'posts_server':
      options = getAjaxOptions();
      // set value for select
      const selectBox = document.querySelector('.select-box select');
      const selectBoxValue =
        selectBox.getAttribute('select-value') || options.loading || 'none';
      selectBox.value = selectBoxValue;
      break;
    default:
      break;
  }

  memoizationData(setData, dataMenu, options);
}

/**
 * Memoization instances
 * @param {Function} fn
 * @param {String} key
 * @param {Object} options
 * @returns {*} 
 */
function memoizationData(fn, key, options = {}) {
  if (key in CacheInstances) {
    //console.log('Fetching from cache');
    return CacheInstances[key];
  } else {
    //console.log('Calculating result');
    let result = fn(options);
    if (result) {
      CacheInstances[key] = result;
    }
    return result;
  }
}

/**
 * @param {Object} options
 * @returns {PaginationSystem} instance
 */
function setData(options) {
  try {
    return new PaginationSystem(options);
  } catch (e) {
    toggleErrorMessage(true);
    console.error(e);
  }
}

/**
 * handle toggle menu function
 * @param {*} event
 */
function handleToggleMenu(event) {
  const target = event.target;
  const dataMenu = target.dataset.menu || null;

  if (dataMenu) {
    sessionStorage.setItem('pg-current-menu', dataMenu);
    initData(dataMenu);
  }
}

/**
 * handle select (Data loading by page)
 * @param {*} event
 */
function handleSelectBox(event) {
  const target = event.target;
  const loading = target.value;
  const dataPaging = memoizationData(setData, 'posts_server');

  /**
   * dynamic change of the 'loading' parameter (can be 'auto'|'more'|'none')
   * @param {String} loading
   */
  function changeLoading(loading) {
    dataPaging.pagingControl.loading = loading;
    dataPaging.pagingControl.numPage = 1;
    dataPaging.pagingControl.clearActiveBtns();
    dataPaging.pagingControl.setLoadingDependencies();
    if (loading === 'more') {
      dataPaging.pagingControl.setShowMoreEvent();
    }
    dataPaging.pagingControl.renderData(false);
  }

  if (dataPaging instanceof PaginationSystem) {
    target.setAttribute('select-value', loading);
    changeLoading(loading);
  }
}

/**
 * @param {Boolean} isShow
 */
function toggleErrorMessage(isShow) {
  if (!errorMessageEl) {
    return;
  }

  errorMessageEl.classList[isShow ? 'remove' : 'add']('hide');
}
