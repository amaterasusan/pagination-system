import { DataRender } from './dataRender';
import { sorting, findData } from '../../utils';

/**
 * @class DataControl
 * @extends DataRender
 */
export class DataControl extends DataRender {
  constructor(options) {
    super(options);
  }

  /**
   * @param {Object} queryObj like {field: 'name',  direction: 1, type: 'alpha'}
   * @param {String} queryObj.name - field name
   * @param {Number} queryObj.direction - direction: 1(ASC)|-1(DESC)
   * @param {String} queryObj.type - field type: 'numeric'|'date'|'alpha'
   */
  sortData(queryObj = {}) {
    if (!queryObj.field) {
      return;
    }

    if (!queryObj.direction) {
      queryObj.direction = 1;
    }

    if (!queryObj.type) {
      queryObj.type = 'alpha';
    }

    this.lastSortQuery = queryObj;

    this.data.sort((a, b) => sorting(a, b, queryObj));
  }

  /**
   * filter Data
   * @param {Object} search
   * like
   * {
   *   q: {value: 'b'} // global search
   *   id: { action: 'lte', value: 40 },
   * }
   */
  filterData(search = {}) {
    if (!search) {
      console.warn('%csearch data is empty!', 'font-size:16px;');
      return;
    }

    const { q: globalSearch, ...filters } = search;
    const globalSearchValue = globalSearch?.value?.toLowerCase();
    const filterKeys = Object.keys(filters);

    if (!globalSearchValue && !filterKeys.length) {
      console.warn('%cSearch values are not set!', 'font-size:16px;');
      return;
    }

    this.data = this.storageDgData.filter((row) => {
      const data = globalSearchValue
        ? Object.values(row).find((value) =>
            String(value).toLowerCase().includes(globalSearchValue)
          )
        : row;

      // apply filters
      if (data) {
        if (!filterKeys.length) {
          return true;
        }

        return filterKeys.every((fieldName) => {
          const filter = filters[fieldName];
          if (row[fieldName]) {
            return findData(row[fieldName], filter);
          }

          return false;
        });
      }

      return false;
    });

    if (this.lastSortQuery) {
      this.data.sort((a, b) => sorting(a, b, this.lastSortQuery));
    }

    this.realCountRecords = this.data.length;
  }

  /**
   * resore data
   */
  restoreData() {
    this.data = [...this.storageDgData];

    if (this.lastSortQuery) {
      this.data.sort((a, b) => sorting(a, b, this.lastSortQuery));
    }

    this.realCountRecords = this.data.length;
  }
}
