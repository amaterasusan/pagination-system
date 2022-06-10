/**
 * @param {*} value
 * @returns
 */
export const checkType = (value) => {
  const checkNum = value.toString().replace(/(\$|\.)/gi, '');
  if ((!isNaN(value) || !isNaN(checkNum)) && typeof value !== 'boolean') {
    return 'numeric';
  }

  if (!isNaN(Date.parse(value))) {
    return 'date';
  }

  return 'alpha';
};

/**
 * @param {*} value
 * @param {String} type 'numeric'|'date'|'alpha'
 * @returns
 */
export const convertValueByType = (value, type = 'alpha') => {
  if (!value) {
    return;
  }
  // for default alpha
  value = value.toString();
  const key = value.toLowerCase();

  switch (type) {
    case 'numeric':
      // if column text like $200 - remove sign $
      value = parseFloat(value.replace(/\$/, ''));
      value = isNaN(value) ? key : value;
      break;
    case 'date':
      value = Date.parse(value);
      value = isNaN(value) ? key : value;
      break;
    default:
      value = key;
      break;
  }

  return value;
};

/**
 * the function used to sort the array
 * like data.sort((a, b) => sorting(a, b, queryObj));
 * @param {*} a
 * @param {*} b
 * @param {Object} queryObj like {field: 'name',  direction: 1, type: 'alpha'}
 * @param {String} queryObj.name - field name
 * @param {Number} queryObj.direction - direction: 1(ASC)|-1(DESC)
 * @param {String} queryObj.type - field type: 'numeric'|'date'|'alpha'
 * @returns
 */
export const sorting = (a, b, { field, direction = 1, type = 'alpha' }) => {
  const sortKeyA = convertValueByType(a[field], type);
  const sortKeyB = convertValueByType(b[field], type);

  return sortKeyA < sortKeyB ? -direction : sortKeyA > sortKeyB ? direction : 0;
};

/**
 * check if string is URL
 * @param {String} str
 * @returns
 */
export const isUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param {Array} arr - array of objects
 * @param {Array} fields - array of object keys
 * @param {String} typeValue 'json'|'url'|'boolean'
 * @returns
 */
export const changeCellHtml = (arr = [], fields = [], typeValue) =>
  arr.forEach((row) => {
    fields.forEach((key) => {
      if (typeof row[key] !== 'undefined') {
        switch (typeValue) {
          case 'json':
            row[key] = JSON.stringify(row[key], undefined, 2);
            break;
          case 'url':
            row[
              key
            ] = `<a class="custom-link" title="${row[key]}" href="${row[key]}">${row[key]}</a>`;
            break;
          case 'boolean':
            row[key] = `<label class="custom-checkbox">
            <input type="checkbox" ${row[key] ? 'checked' : ' '}></label>`;
            break;
          default:
            break;
        }
      }
    });
  });

/**
 * @param {*} date
 * @returns
 */
const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
};

/**
 * @param {*} dataValue
 * @param {Object} filter
 * like
 * {
 *   id: { action: 'lte', value: 40 },
 *   age: { action: 'in_range', value: [20, 30] },
 *   q: {value: 'b'} // global search
 * }
 */
export const findData = (dataValue, filter) => {
  if (!filter.value) {
    return false;
  }

  const type = checkType(dataValue);

  if (type === 'date') {
    dataValue = formatDate(dataValue);
  }

  dataValue = convertValueByType(dataValue, type);

  if (!Array.isArray(filter.value)) {
    filter.value = [filter.value];
  }

  const filterValue1 = convertValueByType(filter.value[0], type);
  const filterValue2 = convertValueByType(filter.value[1], type) || null;

  return actionsInFilters[filter.action](dataValue, filterValue1, filterValue2);
};

export const actionsInFilters = {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  in_range: (a, rang1, rang2) => a >= rang1 && a <= rang2,
  contains: (a, s) => a.includes(s),
  not_contains: (a, s) => !a.includes(s),
  starts_with: (a, s) => a.startsWith(s),
  ends_with: (a, s) => a.endsWith(s),
};
