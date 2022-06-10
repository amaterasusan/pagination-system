# Data Pagination system 
**pagination-system** is a modern **Vanilla JS** and ES6 library for **data pagination**.  
It includes not only **pagination** but data **filtering** and **sorting** as well.  
It’s also possible to use the `Show more` button or infinite scrolling of data.

* No dependencies
* Highly customizable
* Easy and simple to use

## How to use it

- Install
via npm
```markup
npm i pagination-system
```
import as an ES module
```javascript
// As an ES module
import PaginationSystem from 'pagination-system';
// Necessary stylesheet
import 'pagination-system/dist/pagination-system.min.css';
```
Or just include into HTML
```markup
// UMD Version
<link rel="stylesheet" href="https://unpkg.com/pagination-system/dist/pagination-system.min.css">
<script src="https://unpkg.com/pagination-system/dist/pagination-system.umd.min.js"></script>
```

- Create a container for storing your data and a container for pagination.  
A container for pagination can be the same as a container for data. In any case, pagination div will be added after the data.
```html
<div class="container"></div>
<div class="paging-container"></div>
```
- Initialize the Pagination System in js file.
  ```javascript
    const dataPaging = new PaginationSystem(options);
  ```
  
  The options parameters are slightly different  
  depending on whether the data is received at once,  
  or the data is loaded from the server page by page.  
  
  + **Common Options**
    - dataContainer - DOM element
    - pagingContainer - DOM element
    - dataRenderFn - function to render data
    - perPage - optional, default is 10, number of items per page  
    - countRecords - optional, no need to set this parameter, the number of records will be counted. 
    - isShowPerPage - optional, show or not `perPage` dropbox, default is true
    - childSelector - optional, child selector of collection, used if `loading` is set to `'auto'`
    - loading - optional, can be `'auto'`|`'more'`|`'none'`, default is `'none'`  
    - textShowMore - optional, the default text is `'show more'`, used if `loading` is set to `'more'` (`Show more` button)  
    
  + **Special options, if all data is received**
    - data - data array
    - countRecords - set only if you want to reduce the data array, the data will be truncated
    
  + **Special options, if the data is loaded from the server page by page**  
    - url - String, like 'https://jsonplaceholder.typicode.com/posts'
    - urlParams - Object like 
      ```javascript
      {
        limit: '_limit', // url query param name (number of items to display per page) optional
        pageNumber: '_page', // url query param name (number of page),
      }
      ```
    - urlExtraParams - optional, additional URL params, if you want to restrict the data by some conditions
      Object like 
      ```javascript
      { id_lte: 33, id_gte: 3 }
      ```
    - dimmerSelector - optional, String like `'#dimmer'`, 
      
      in html:
      ```html
      <div id="dimmer">
        <div class="loader"></div>
      </div>
      ```   
    - countRecords - you don't need to set this option.   
      The total number of records should be in the `'X-Total-Count'` response header      


## Available methods of the PaginationSystem class
  * **getDataKeys()**  
  returns Promise
  ```javascript
    const dataPaging = new PaginationSystem(options);
    
    dataPaging
      .getDataKeys()
      .then((dataKeys) => {
        /* 
          dataKeys (field names) array like [
            { name: 'id', type: 'numeric', title: 'id' },
            { name: 'first_name', type: 'alpha', title: 'first name' },
          ]
        */
        if (dataKeys && dataKeys.length) {
          // create table header depending on dataKeys (field names) 
        }
      });
  ```
  * **getNumPage()**  
  @returns {Number} page number
  
  * **getPerPage()**  
  @returns {Number} number of entries per page
  
  * **render(numPage)**  
  render pages  
  @param {Number} numPage  
  @returns {Promise}  
  
  * **restoreData()**  
  restore data after filtering
  
  * **sortData(queryObj, numPage)**  
  data sorting   
  @param {Object} queryObj  
  @param {Number} numPage  
  queryObj:  
  if **options.url** - like `{'_sort': 'name', '_order': 'asc'}`    
  depending on what query parameters your server supports to sort the data  
  if **options.data** - `{field: 'name', direction: 1, type: 'alpha'}`  
  direction: 1(ASC) | -1(DESC)  
  type: `'numeric'`|`'date'`|`'alpha'` 
  
  * **filterData(queryObj)**    
  data filtering   
  @param {Object} queryObj   
  if **options.url** - queryObj like -`{ q: 'andrew', country: 'spain' }`
  depending on what query parameters your server supports to search for records  
  if **options.data**  
  All available actions:     
    * **eq**    (equals)  
    * **ne**    (not equal)  
    * **lt**    (less than)  
    * **lte**   (less than or equal)  
    * **gt**    (greater than)  
    * **gte**   (greater than or equal)  
    * **in_range**  
    * **contains**  
    * **not_contains**  
    * **starts_with**  
    * **ends_with**   
  
  ```javascript
    const dataPaging = new PaginationSystem(options);
    // queryObj like 
    const queryObj = {  
      q: {value: 'andr'} // global search
      id: { action: 'lte', value: 40 },
      age: { action: 'in_range', value: [20, 30] },
    };
    
    dataPaging
      .filterData(queryObj)
      .then((countRecords) => {
        console.log('Found:', countRecords);
      });
  ```      
  
## Examples
  * options.data
    ```javascript
    const options = {
      dataContainer: document.querySelector('.container'),
      dataRenderFn: (dataPage) => {
        .map(
          (item) =>
            `<li>
               <span class="item-counter">${item.number}</span>
               <span class="textline">${item.text}</span>
             </li>`
        ).join('')}</ul>`;
      },
      data: data || [],
      pagingContainer: document.querySelector('.paging-container'),
    };
    
    new PaginationSystem(options);
    ```
  * options.url  
   An example of infinite data loading:
    ```javascript
    const url = 'https://jsonplaceholder.typicode.com/posts'; // test server url 
    const urlParams = {
      limit: '_limit', // url query param name (number of items to display per page) optional
      pageNumber: '_page', // url query param name (number of page),
    }; // url query params
    
    const dataRenderFn = (dataPage) => {
      return `${dataPage
        .map(
          (item) =>
            `<div class="card">
               <div class="card-post">
                 <div class="card-item-title">
                   <span class="item-counter">${item.id}</span>
                   <span class="item-title">${item.title.split(' ').slice(0, 3).join(' ')}</span>
                 </div>
                 <p class="item-body">${item.body}</p>
               </div>
             </div>`
        ).join('')}`;
    };

    const options = {
      dataContainer: document.querySelector('.container'),
      dataRenderFn: dataRenderFn,
      url: url, 
      urlParams: urlParams,
      pagingContainer: document.querySelector('.paging-container'),
      perPage: 20,
      dimmerSelector: '#dimmer', 
      childSelector: '.card', 
      loading: 'auto', 
    };

    new PaginationSystem(options);
    ```
    
**More available in the [examples](https://github.com/amaterasusan/pagination-system/tree/master/examples) folder**