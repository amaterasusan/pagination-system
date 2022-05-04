import PaginationSystem from 'pagination-system';
import './demo.css';
import 'pagination-system/dist/pagination-system.min.css';

window.addEventListener('DOMContentLoaded', () => {
  const dataRenderFn = (dataPage) => {
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
  };

  const options = {
    dataContainer: document.querySelector(
      '.container .data-container .list-cards'
    ),
    dataRenderFn: dataRenderFn,
    childSelector: '.card',
    url: 'https://jsonplaceholder.typicode.com/posts', // test server url
    urlParams: {
      limit: '_limit', // url query param (number of items to display per page) optional
      pageNumber: '_page', // url query param (number of page)
    }, // url query params
    dimmerSelector: '#dimmer',
    pagingContainer: document.querySelector('.paging-container'),
    perPage: 10,
    countRecords: 100,
    loading: 'auto',
  };

  new PaginationSystem(options);
});
