import { DataControl } from './data-modules/data-received/dataControl';
import { DataControlLoadByPage } from './data-modules/load-by-page/dataControlLoadByPage';

/**
 * @param {Object} options
 * @returns {DataRender|DataRenderLoadByPage} instance
 */
export function getDataInstance(options) {
  if (!options.data && !options.url) {
    throw new Error('The `url` or `data` property must be defined!');
  }

  if (options.data) {
    return new DataControl(options);
  } else {
    return new DataControlLoadByPage(options);
  }
}
