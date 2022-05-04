const perPage = 10;
// sample data for list
const loremIpsum = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'a', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugait', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'justo', 'fermentum', 'bibendum', 'massa', 'nunc', 'pulvinar', 'sapien', 'ligula', 'condimentum', 'vel', 'ero', 'ornare', 'egestas', 'dui', 'mi', 'nul', 'posuere', 'quam', 'vitae', 'proin', 'neque', 'nibh', 'morbi', 'tempus', 'urna', 'arcu', 'at', 'e', 'dapibus', 'qos', 'nam', 'convallis', 'aenean', 'cras', 'facilisis', 'laoreet', 'donec'];

// sample data for table
const names = ['Paul', 'Anne', 'Benji', 'Carl', 'Sarah', 'Julie', 'Ryan', 'Steve', 'Peter', 'Samantha', 'Andrew', 'Ivan', 'Melissa', 'Margaret', 'Mark'];
const lastNames = ['Smith', 'Anderson', 'Morrison', 'Kane', 'Ferguson', 'Warner', 'Hammer', 'Phillips', 'Thompson', 'Chang', 'Gallacher', 'Foreman', 'Dunn', 'Burnard', 'Aspell'];
const countries = ['South Africa', 'England', 'Australia', 'Mexico', 'China', 'Japan', 'Honduras', 'Canada', 'France', 'Spain'];
const cities = {
  'South Africa': ['Cape Town', 'Kimberley', 'Queenstown', 'Virginia'],
  'England': ['Belfast', 'Birmingham', 'Cambridge', 'Bristol', 'Lancaster', 'Liverpool', 'London', 'Manchester'],
  'Australia': ['Melbourne', 'Sydney', 'Canberra', 'Hobart'],
  'China': ['Beijing', 'Hong Kong', 'Shanghai', 'Chongqing'],
  'Mexico': ['Mexico City', 'Puebla', 'Monterrey', 'Morelia'],
  'Japan': ['Tokyo', 'Nagoya', 'Osaka', 'Seto', 'Toyohashi', 'Okazaki', 'Tahara'],
  'Honduras': ['Tegucigalpa', 'San Pedro Sula', 'Choloma'],
  'Canada': ['Ottawa', 'Edmonton', 'Toronto', 'Calgary', 'Montreal'],
  'France': ['Paris', 'Marseilles', 'Bordeaux', 'Lyon', 'Toulouse', 'Nice', 'Lil'],
  'Spain': ['Madrid', 'Barcelona', 'Seville', 'Valencia'],
};

function randomNumber(count) {
  return Math.floor(count * Math.random());
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomText() {
  const lenLorem = loremIpsum.length;
  let words = [];

  for (let i = 0; i < 10; i++) {
    let rand = randomNumber(lenLorem);
    words.push(loremIpsum[rand]);
  }

  if (words.length) {
    const firstWord = words[0];
    const firstLetter = firstWord[0].toUpperCase();
    const remainLetters = firstWord.slice(1);
    words[0] = firstLetter + remainLetters;
  }

  return words;
}

function makeDataList() {
  let data = [];
  let words = '';
  for (let i = 0; i < 110; i++) {
    words = getRandomText().join(' ');
    data = [...data, { number: i + 1, text: words }];
  }

  function dataRender(dataPage) {
    return `<ul>${dataPage
      .map(
        (item) =>
          `<li><span class="item-counter">${item.number}</span> <span class="textline">${item.text}</span></li>`
      )
      .join('')}</ul>`;
  }

  return {
    data,
    dataRender,
  };
}

function makeDataTable() {
  const data = [];

  for (let i = 1; i <= 100; i++) {
    let randName = randomNumber(names.length);
    let randLastName = randomNumber(lastNames.length);
    let randCountry = randomNumber(countries.length);
    let randCity = randomNumber(cities[countries[randCountry]].length);

    data.push({
      ID: i,
      Name: names[randName],
      Surname: lastNames[randLastName],
      Country: countries[randCountry],
      City: cities[countries[randCountry]][randCity],
    });
  }

  function dataRender(dataPage) {
    return `${dataPage
      .map(
        (row) =>
          `<tr>${Object.entries(row)
            .map(([key, value]) => `<td data-th="${key}">${value}</td>`)
            .join('')}</tr>`
      )
      .join('')}`;
  }

  return {
    data,
    dataRender,
  };
}

function makeDataProducts() {
  let data = [];

  for (let i = 0; i < 70; i++) {
    const watchNumber = randomNumber(2000000);
    const price = randomNumber(1000);
    const imgNumber = randomIntFromInterval(1, 10);
    const starCount = randomIntFromInterval(1, 5);
    data = [
      ...data,
      {
        watch_number: watchNumber,
        price: price,
        img: `img/${imgNumber}.jpg`,
        starCount: starCount,
      },
    ];
  }

  function getStars(starCount) {
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(`<i class="fa fa-star" aria-hidden="true"></i>`);
    }

    for (let i = starCount; i < 5; i++) {
      stars.push(`<i class="fa fa-star-o" aria-hidden="true"></i>`);
    }
    return stars.join('');
  }

  function dataRender(dataPage) {
    return `${dataPage
      .map(
        (item) =>
          `<div class="card">
            <div class="card-content">
            <div class="content-img"><div class="img" style="background-image:url(${
              item.img
            })"></div></div>
              <div class="content-details">
                <h4>Watch ${item.watch_number}</h2>
                <span class="hint-star star">
                  ${getStars(item.starCount)}
                </span>
                <div class="control">
	                <button class="btn-card ripple">
                  <span class="shopping-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>
                  <span class="price">$${item.price}</span>
                  </button>
	              </div>
              </div>
            </div>
          </div>`
      )
      .join('')}`;
  }

  return {
    data,
    dataRender,
  };
}

function dataRenderAjaxLoading(dataPage) {
  return `${dataPage
    .map(
      (item) =>
        `<div class="card">
          <div class="card-post">
            <div class="card-item-title">
              <span class="item-counter">${item.id}</span>
              <span class="item-title">${item.title
                .split(' ')
                .slice(0, 3)
                .join(' ')}</span>
            </div>
            <p class="item-body">${item.body}</p>
          </div>
        </div>`
    )
    .join('')}`;
}

/**
 * list data (List menu item)
 */
export function getListOptions() {
  const data = makeDataList();
  return {
    dataContainer: document.querySelector(
      '.list-content .container .data-container'
    ),
    dataRenderFn: data.dataRender,
    data: data.data || [],
    childSelector: 'li',
    pagingContainer: document.querySelector('.list-content .container'),
    perPage: perPage,
    countRecords: data.data.length || 0,
    isShowPerPage: false,
  };
}

/**
 * table data (Table menu item)
 */
export function getTableOptions() {
  let dataContainerTable = document.querySelector(
    '.table-content .container .data-container'
  );

  const dataTable = makeDataTable();
  const fields = dataTable.data.length ? Object.keys(dataTable.data[0]) : [];

  // create table and append to data container
  if (!document.querySelector('.dg-grid')) {
    const table = document.createElement('table');
    table.classList.add('dg-grid');

    const setBasisTable = (fields) => {
      return `<thead><tr>${fields
        .map((item) => `<th>${item}</th>`)
        .join('')}</tr></thead><tbody></tbody>`;
    };

    table.insertAdjacentHTML('afterbegin', setBasisTable(fields));
    dataContainerTable.appendChild(table);
  }
  // real container for data will be tbody
  dataContainerTable = document.querySelector('.dg-grid tbody');

  return {
    dataContainer: dataContainerTable,
    dataRenderFn: dataTable.dataRender,
    data: dataTable.data || [],
    pagingContainer: document.querySelector('.table-content .container'),
    perPage: perPage,
    countRecords: dataTable.data.length || 0,
  };
}

/**
 * Products Data (Products menu item)
 */
export function getProductsOptions() {
  const data = makeDataProducts();

  return {
    dataContainer: document.querySelector(
      '.products-content .container-products .data-products .list-cards'
    ),
    dataRenderFn: data.dataRender,
    data: data.data || [],
    childSelector: '.card',
    pagingContainer: document.querySelector(
      '.products-content .container-products'
    ),
    perPage: perPage,
    countRecords: data.data.length || 0,
    loading: 'more',
  };
}

export function getAjaxOptions() {
  return {
    dataContainer: document.querySelector(
      '.posts-content .container .data-container .list-cards'
    ),
    dataRenderFn: dataRenderAjaxLoading,
    childSelector: '.card',
    url: 'https://jsonplaceholder.typicode.com/posts', // test server url
    urlParams: {
      limit: '_limit', // url query param (number of items to display per page) optional
      pageNumber: '_page', // url query param (number of page)
    }, // url query params
    dimmerSelector: '#dimmer',
    pagingContainer: document.querySelector('.posts-content .container'),
    perPage: perPage,
    countRecords: 100,
    loading: 'more',
  };
}
