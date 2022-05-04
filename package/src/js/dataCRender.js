import { DataRender } from './data-modules/data-received/dataRender';
import { DataRenderLoadByPage } from './data-modules/load-by-page/dataRenderLoadByPage';

/**
 * @param {Object} options
 * @returns {DataRender|DataRenderLoadByPage} instance
 */
export function getDataInstance(options) {
  if (options.data) {
    return new DataRender(options);
  } else if (options.url) {
    return new DataRenderLoadByPage(options);
  }
}
    