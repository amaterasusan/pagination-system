
// sample data for list
const loremIpsum = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'a', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugait', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'justo', 'fermentum', 'bibendum', 'massa', 'nunc', 'pulvinar', 'sapien', 'ligula', 'condimentum', 'vel', 'ero', 'ornare', 'egestas', 'dui', 'mi', 'nul', 'posuere', 'quam', 'vitae', 'proin', 'neque', 'nibh', 'morbi', 'tempus', 'urna', 'arcu', 'at', 'e', 'dapibus', 'qos', 'nam', 'convallis', 'aenean', 'cras', 'facilisis', 'laoreet', 'donec'];

window.addEventListener('DOMContentLoaded', () => {
  if (typeof PaginationSystem === 'undefined') {
    console.error('PaginationSystem class is not found');
    return;
  }
  const data = makeDataList();
  const dataRenderFn = (dataPage) => {
    return `<ul>${dataPage
      .map(
        (item) =>
          `<li><span class="item-counter">${item.number}</span> <span class="textline">${item.text}</span></li>`
      )
      .join('')}</ul>`;
  };

  const options = {
    dataContainer: document.querySelector('.container'),
    dataRenderFn: dataRenderFn,
    data: data || [],
    pagingContainer: document.querySelector('.paging-container'),
    perPage: 10,
    countRecords: data.length || 0,
  };

  new PaginationSystem(options);
});

function makeDataList() {
  let data = [];
  let words = '';
  for (let i = 0; i < 110; i++) {
    words = getRandomText().join(' ');
    data = [...data, { number: i + 1, text: words }];
  }

  return data;
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

function randomNumber(count) {
  return Math.floor(count * Math.random());
}
