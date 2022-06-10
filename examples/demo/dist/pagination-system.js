(()=>{var e={783:function(e){e.exports=function(){"use strict";class e extends class extends class{constructor(){this.events={}}subscribe(e,t){this.events[e]=t}unsubscribe(e){if(this.events[e]){const{[e]:t,...n}=this.events;this.events=n}}fire(e,...t){const n=this.events[e];if(n)return n(...t)}}{constructor(e){if(super(),!(e.container instanceof HTMLElement))throw new Error("Paging Container is not HTMLElement");if(!e.countRecords)throw new Error("countRecords is not set!");this.container=e.container,this.perPage=e.perPage||10,this.countRecords=e.countRecords||0,this.isShowPerPage=e.isShowPerPage??!0,this.numPage=1,this.activeBtns=[],this.loading=["auto","more","none"].includes(e.loading)?e.loading:"none",this.statusBoxSelector=".dg-status-box",this.pagingBoxSelector=".dg-paging",this.perPageSelector="#per-page",this.paginatorSelector=".pagination",this.showMoreSelector=".show-more",this.template=function(){function e(e=1,n,a=!1){let i=`<div id="number-pages" class="dg-number-pages">${t(e,n).join("")}</div>`;return n>1&&(i=`<button type="button" ${a?"":"disabled"} data-index="first">&laquo;</button><button type="button" ${a?"":"disabled"} data-index="prev">&lsaquo;</button>${i}<button type="button" ${e===n?"disabled":""} data-index="next">&rsaquo;</button><button type="button" ${e===n?"disabled":""} data-index="last">&raquo;</button>`),i}function t(e,t){let r=[];return r=t<10?[...r,...n(1,t+1)]:e<5?[...r,...n(1,8),...i(t)]:e>t-4?[...r,...a(1),...n(t-4-2,t+1)]:[...r,...a(1),...n(e-2,e+2+1),...i(t)],r}function n(e,t){let n=[];for(let a=e;a<t;a++)n.push(`<button type="button" tabindex="${a}" data-index="${a}">${a}</button>`);return n}function a(e){let t=[];return t.push(`<button type="button" tabindex="${e}" data-index="${e}">${e}</button>`),t.push('<button type="button" data-index="disabled" disabled>...</button>'),t}function i(e){let t=[];return t.push('<button type="button" data-index="disabled" disabled>...</button>'),t.push(`<button type = "button" tabindex = "${e}" data-index="${e}" >${e}</button >`),t}return{htmlTemplate:function(t,n=10,a=!0){const i=e(1,t);let r=[`<select id="per-page" class="dg-per-page${a?"":" per-page-hide"}">`];return[5,10,15,20,30,40,50].forEach((e=>{const t=e===n?" selected":"";r=[...r,`<option value="${e}"${t}>${e}</option>`]})),r=[...r,"</select>"].join(""),`<div class="dg-status-box"><div class="dg-paging">${r}<div class="pagination">${i}</div></div>`},htmlBtns:e,showMoreTemplate:function(){return'<div class="show-more"><i class="fa fa-repeat fa-4x fa-fw" aria-hidden="true"></i> <span>more</span></div>'}}}()}initPaging(){this.setNumberPages(),this.displayTemplatePages(),this.visiblePagingBox()}setNumberPages(){this.numberPages=Math.ceil(this.countRecords/this.perPage)}displayTemplatePages(){this.container.querySelector(this.statusBoxSelector)&&this.container.querySelector(this.statusBoxSelector).remove(),this.container.insertAdjacentHTML("beforeend",this.template.htmlTemplate(this.numberPages,this.perPage,this.isShowPerPage)),this.pagingBox=this.container.querySelector(this.pagingBoxSelector),this.perPageElement=this.container.querySelector(this.perPageSelector),this.paginatorElement=this.container.querySelector(this.paginatorSelector)}render(){this.numberPages>1?(this.displayBtns(),this.visiblePaging(!0)):(this.paginatorElement.innerHTML="",this.visiblePaging(!1)),this.setActivePageBtn()}displayBtns(){this.paginatorElement.innerHTML=this.template.htmlBtns(this.numPage,this.numberPages,!(1===this.numPage||this.activeBtns.length&&1===this.activeBtns[0]))}visiblePagingBox(){this.numberPages>1&&(this.visiblePaging(!0),this.setActivePageBtn())}visiblePaging(e){this.pagingBox.style.visibility=e||this.numberPages>1?"visible":"hidden"}setActivePageBtn(){if(this.numberPages>1){const e=this.container.querySelector(`[data-index="${this.numPage}"]`);e&&e.classList.add("active","current"),this.activeBtns.length&&this.activeBtns.forEach((e=>{const t=this.paginatorElement.querySelector(`[data-index="${e}"]`);t&&t.classList.add("active")}))}}clearActiveBtns(){this.activeBtns=[]}}{constructor(e){super(e)}init(){this.renderPages().then((e=>{this.initPaging(),this.setLoadingDependencies(),this.setEvent(),"auto"===this.loading&&this.observe(e)}))}setLoadingDependencies(){this.showMoreElement&&this.visibileShowMoreBtn(!1),"auto"===this.loading?this.setInfiniteObserver():"more"===this.loading&&(this.showMoreElement||this.setShowMoreBtn(),this.visibileShowMoreBtn(!0))}setInfiniteObserver(){this.infiniteObserver=new IntersectionObserver((([e],t)=>{e.isIntersecting&&(t.unobserve(e.target),this.handlerShowMore())}),{threshold:.8})}setEvent(){this.setPerPageEvent(),this.setPaginationEvent(),this.setShowMoreEvent()}setPerPageEvent(){this.perPageElement&&this.perPageElement.addEventListener("change",this.handlerPerPage.bind(this),!1)}setPaginationEvent(){this.paginatorElement&&this.paginatorElement.addEventListener("click",this.handlerGoPage.bind(this),!1)}setShowMoreEvent(){this.showMoreElement&&"true"!==this.showMoreElement.getAttribute("listener")&&(this.showMoreElement.setAttribute("listener","true"),this.showMoreElement.addEventListener("click",this.handlerShowMore.bind(this),!1))}handlerPerPage(e){const t=e.target;t.blur(),this.perPage=+t.value,this.eventName="perPage",this.numPage=1,this.clearActiveBtns(),this.setNumberPages(),this.renderPages().then((()=>{this.afterRenderData()}))}handlerGoPage(e){this.eventName="goPage";const t=e.target.dataset.index;if(!t)return!1;switch(t){case"prev":this.activeBtns.length&&this.activeBtns[0]>1?this.numPage=this.activeBtns[0]-1:this.numPage--;break;case"next":this.numPage++;break;case"first":this.numPage=1;break;case"last":this.numPage=this.numberPages;break;default:this.numPage=+t}this.clearActiveBtns(),this.renderData(!1)}handlerShowMore(e){this.eventName=e?"showMore":"moreAuto",this.numPage!==this.numberPages&&(this.clearActiveBtns(),this.numPage<this.numberPages&&(this.paginatorElement.querySelectorAll("button.active").forEach((e=>{this.activeBtns.push(+e.dataset.index)})),this.numPage++,this.renderData(!0)))}renderPages(){return this.fire("renderPages",this.perPage,this.numPage)}renderData(e){this.fire("renderData",this.numPage,e).then((e=>{"auto"===this.loading&&this.observe(e),this.afterRenderData()}))}afterRenderData(){this.checkScroll(),this.render()}checkScroll(){["goPage","perPage"].includes(this.eventName)&&(this.fire("goToTop",this.perPage,this.numPage),this.eventName="none")}observe(e){e instanceof HTMLElement?(this.lastChild=e,this.observeLastChild()):console.error("autoload is not possible, last child of collection is not HTMLElement!")}observeLastChild(){this.infiniteObserver&&this.lastChild&&this.infiniteObserver.observe(this.lastChild)}setShowMoreBtn(){this.showMoreElement||(this.displayShowMoreBtn(),this.visibileShowMoreBtn(!1))}displayShowMoreBtn(){this.pagingBox.insertAdjacentHTML("afterend",this.template.showMoreTemplate()),this.showMoreElement=this.container.querySelector(this.showMoreSelector)}visibileShowMoreBtn(e){this.showMoreElement.style.display=e?"flex":"none"}}class t{constructor(e){if(!(e.container instanceof HTMLElement))throw new Error("Data container is not HTMLElement!");if("function"!=typeof e.dataRenderFn)throw new Error("dataRenderFn is not a Function!");this.container=e.container,this.dataRenderFn=e.dataRenderFn,this.childSelector=e.childSelector||null}renderPages(){throw new Error("renderPages method should be implemented in the child class")}renderData(){throw new Error("renderData method should be implemented in the child class")}getLastChild(){return this.container.querySelector(`${this.childSelector}:last-child`)}goToTop(){this.container.scrollIntoView({block:"start",inline:"nearest",behavior:"smooth"})}}class n extends t{constructor({data:e,...t}){if(super(t),!Array.isArray(e))throw new Error("data is not an array!");this.data=e,this.pages=[],this.lastChild=null}renderPages(e,t){return this.pages=this.dataPagination(e),this.renderData(t)}renderData(e,t=!1){const n=this.pages[e-1];return this.container.innerHTML=t?this.container.innerHTML+this.dataRenderFn(n):this.dataRenderFn(n),this.childSelector&&(this.lastChild=this.getLastChild()),Promise.resolve(this.lastChild)}dataPagination(e){let t=[];for(let n=0,a=this.data.length,i=+e;n<a;n+=i){let e=this.data.slice(n,n+i);t=[...t,e]}return t}}class a extends t{constructor({url:e,urlParams:t,...n}){if(super(n),!e)throw new Error("url must be defined");if(!t)throw new Error("urlParams must be defined");if(!t.pageNumber)throw new Error("urlParams.pageNumber must be defined");this.url=e,this.urlParams=t,this.dimmerElement=n.dimmerSelector&&document.querySelector(n.dimmerSelector),this.lastChild=null}renderPages(e,t){return this.limitData=e,this.renderData(t)}renderData(e,t=!1){return this.toggleDimmer(!0),this.loadServerData(e).then((e=>(this.displayData(e,t),this.toggleDimmer(!1),this.childSelector&&(this.lastChild=this.getLastChild()),this.lastChild))).catch((e=>{throw this.toggleDimmer(!1),new Error(e)}))}loadServerData(e=1){const t=this.urlParams.limit?`${this.url}?${this.urlParams.limit}=${this.limitData}&${this.urlParams.pageNumber}=${e}`:`${this.url}?${this.urlParams.pageNumber}=${e}`;return fetch(t).then((e=>e.json()))}displayData(e,t=!1){this.container.innerHTML=t?this.container.innerHTML+this.dataRenderFn(e):this.dataRenderFn(e)}toggleDimmer(e){this.dimmerElement&&(e?(this.dimmerElement.classList.add("active"),this.container.style.opacity=.7):(this.dimmerElement.classList.remove("active"),this.container.style.opacity=1))}}return class extends class{constructor(e){let t={perPage:10,countRecords:0,isShowPerPage:!0,loading:"none",...e||{}};const{dataOptions:n,pagingOptions:a}=(({pagingContainer:e,perPage:t,countRecords:n,isShowPerPage:a,loading:i,dataContainer:r,...s})=>({pagingOptions:{container:e,perPage:t,countRecords:n,isShowPerPage:a,loading:i},dataOptions:{container:r,...s}}))(t);n.urlParams&&!n.urlParams.limit&&(a.isShowPerPage=!1),this.dataOptions=n,this.pagingOptions=a}init(){this.checkMethods(),this.pagingControl.subscribe("renderPages",this.renderPages.bind(this)),this.pagingControl.subscribe("renderData",this.renderData.bind(this)),this.pagingControl.subscribe("goToTop",this.goToTop.bind(this)),this.pagingControl.init()}checkMethods(){const e=["renderPages","renderData"];for(const t of e)if("function"!=typeof this.dataControl[t])throw new Error(`${t} method should be implemented! in Data class`)}renderPages(e,t){return this.dataControl.renderPages(e,t)}renderData(e,t){return this.dataControl.renderData(e,t)}goToTop(){"function"==typeof this.dataControl.goToTop&&this.dataControl.goToTop()}}{constructor(t){super(t),this.dataControl=function(e){return e.data?new n(e):e.url?new a(e):void 0}(this.dataOptions),this.pagingControl=new e(this.pagingOptions),this.init()}}}()}},t={};function n(a){var i=t[a];if(void 0!==i)return i.exports;var r=t[a]={exports:{}};return e[a].call(r.exports,r,r.exports,n),r.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e=["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","labore","et","dolore","magna","aliqua","ut","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","a","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugait","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum","justo","fermentum","bibendum","massa","nunc","pulvinar","sapien","ligula","condimentum","vel","ero","ornare","egestas","dui","mi","nul","posuere","quam","vitae","proin","neque","nibh","morbi","tempus","urna","arcu","at","e","dapibus","qos","nam","convallis","aenean","cras","facilisis","laoreet","donec"],t=["Paul","Anne","Benji","Carl","Sarah","Julie","Ryan","Steve","Peter","Samantha","Andrew","Ivan","Melissa","Margaret","Mark"],a=["Smith","Anderson","Morrison","Kane","Ferguson","Warner","Hammer","Phillips","Thompson","Chang","Gallacher","Foreman","Dunn","Burnard","Aspell"],i=["South Africa","England","Australia","Mexico","China","Japan","Honduras","Canada","France","Spain"],r={"South Africa":["Cape Town","Kimberley","Queenstown","Virginia"],England:["Belfast","Birmingham","Cambridge","Bristol","Lancaster","Liverpool","London","Manchester"],Australia:["Melbourne","Sydney","Canberra","Hobart"],China:["Beijing","Hong Kong","Shanghai","Chongqing"],Mexico:["Mexico City","Puebla","Monterrey","Morelia"],Japan:["Tokyo","Nagoya","Osaka","Seto","Toyohashi","Okazaki","Tahara"],Honduras:["Tegucigalpa","San Pedro Sula","Choloma"],Canada:["Ottawa","Edmonton","Toronto","Calgary","Montreal"],France:["Paris","Marseilles","Bordeaux","Lyon","Toulouse","Nice","Lil"],Spain:["Madrid","Barcelona","Seville","Valencia"]};function s(e){return Math.floor(e*Math.random())}function o(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function l(){const t=e.length;let n=[];for(let a=0;a<10;a++){let a=s(t);n.push(e[a])}if(n.length){const e=n[0],t=e[0].toUpperCase(),a=e.slice(1);n[0]=t+a}return n}function c(e){return`${e.map((e=>`<div class="card">\n          <div class="card-post">\n            <div class="card-item-title">\n              <span class="item-counter">${e.id}</span>\n              <span class="item-title">${e.title.split(" ").slice(0,3).join(" ")}</span>\n            </div>\n            <p class="item-body">${e.body}</p>\n          </div>\n        </div>`)).join("")}`}var d=n(783),h=n.n(d);const u={};let g;function m(e){let n;switch(f(!1),e){case"list":n=function(){const e=function(){let e=[],t="";for(let n=0;n<110;n++)t=l().join(" "),e=[...e,{number:n+1,text:t}];return{data:e,dataRender:function(e){return`<ul>${e.map((e=>`<li><span class="item-counter">${e.number}</span> <span class="textline">${e.text}</span></li>`)).join("")}</ul>`}}}();return{dataContainer:document.querySelector(".list-content .container .data-container"),dataRenderFn:e.dataRender,data:e.data||[],childSelector:"li",pagingContainer:document.querySelector(".list-content .container"),perPage:10,countRecords:e.data.length||0,isShowPerPage:!1}}();break;case"table":n=function(){let e=document.querySelector(".table-content .container .data-container");const n=function(){const e=[];for(let n=1;n<=100;n++){let o=s(t.length),l=s(a.length),c=s(i.length),d=s(r[i[c]].length);e.push({ID:n,Name:t[o],Surname:a[l],Country:i[c],City:r[i[c]][d]})}return{data:e,dataRender:function(e){return`${e.map((e=>`<tr>${Object.entries(e).map((([e,t])=>`<td data-th="${e}">${t}</td>`)).join("")}</tr>`)).join("")}`}}}(),o=n.data.length?Object.keys(n.data[0]):[];if(!document.querySelector(".dg-grid")){const t=document.createElement("table");t.classList.add("dg-grid");const n=e=>`<thead><tr>${e.map((e=>`<th>${e}</th>`)).join("")}</tr></thead><tbody></tbody>`;t.insertAdjacentHTML("afterbegin",n(o)),e.appendChild(t)}return e=document.querySelector(".dg-grid tbody"),{dataContainer:e,dataRenderFn:n.dataRender,data:n.data||[],pagingContainer:document.querySelector(".table-content .container"),perPage:10,countRecords:n.data.length||0}}();break;case"products":n=function(){const e=function(){let e=[];for(let t=0;t<70;t++){const t=s(2e6),n=s(1e3),a=o(1,10),i=o(1,5);e=[...e,{watch_number:t,price:n,img:`img/${a}.jpg`,starCount:i}]}return{data:e,dataRender:function(e){return`${e.map((e=>`<div class="card">\n            <div class="card-content">\n            <div class="content-img"><div class="img" style="background-image:url(${e.img})"></div></div>\n              <div class="content-details">\n                <h4>Watch ${e.watch_number}</h2>\n                <span class="hint-star star">\n                  ${function(e){const t=[];for(let n=0;n<e;n++)t.push('<i class="fa fa-star" aria-hidden="true"></i>');for(let n=e;n<5;n++)t.push('<i class="fa fa-star-o" aria-hidden="true"></i>');return t.join("")}(e.starCount)}\n                </span>\n                <div class="control">\n\t                <button class="btn-card ripple">\n                  <span class="shopping-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>\n                  <span class="price">$${e.price}</span>\n                  </button>\n\t              </div>\n              </div>\n            </div>\n          </div>`)).join("")}`}}}();return{dataContainer:document.querySelector(".products-content .container-products .data-products .list-cards"),dataRenderFn:e.dataRender,data:e.data||[],childSelector:".card",pagingContainer:document.querySelector(".products-content .container-products"),perPage:10,countRecords:e.data.length||0,loading:"more"}}();break;case"posts_server":n={dataContainer:document.querySelector(".posts-content .container .data-container .list-cards"),dataRenderFn:c,childSelector:".card",url:"https://jsonplaceholder.typicode.com/posts",urlParams:{limit:"_limit",pageNumber:"_page"},dimmerSelector:"#dimmer",pagingContainer:document.querySelector(".posts-content .container"),perPage:10,countRecords:100,loading:"more"};const e=document.querySelector(".select-box select"),d=e.getAttribute("select-value")||n.loading||"none";e.value=d}p(b,e,n)}function p(e,t,n={}){if(t in u)return u[t];{let a=e(n);return a&&(u[t]=a),a}}function b(e){try{return new(h())(e)}catch(e){f(!0),console.error(e)}}function v(e){const t=e.target.dataset.menu||null;t&&(sessionStorage.setItem("pg-current-menu",t),m(t))}function P(e){const t=e.target,n=t.value,a=p(b,"posts_server");a instanceof h()&&(t.setAttribute("select-value",n),function(e){a.pagingControl.loading=e,a.pagingControl.numPage=1,a.pagingControl.clearActiveBtns(),a.pagingControl.setLoadingDependencies(),"more"===e&&a.pagingControl.setShowMoreEvent(),a.pagingControl.renderData(!1)}(n))}function f(e){g&&g.classList[e?"remove":"add"]("hide")}window.addEventListener("DOMContentLoaded",(function(){g=document.querySelector(".message"),document.querySelectorAll('input[name="tab"]').forEach((e=>{e.addEventListener("click",v)})),document.querySelector(".select-box select").addEventListener("change",P);let e,t=sessionStorage.getItem("pg-current-menu");t?e=document.querySelector(`input[data-menu="${t}"]`):(e=document.querySelector('input[name="tab"]:checked'),t=e.dataset.menu),e&&t&&(e.checked=!0,m(t))}))})()})();