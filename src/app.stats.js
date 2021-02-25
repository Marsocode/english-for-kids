/* eslint-disable no-param-reassign */
import stats from './data/stats';
import createDOMElements from './utils/create.elements';

let compareKey;
let inverse = true;
let currentKey;
let preveiousKey = 'category';

function drawStatistic(statistic, statisticContainer) {
  statistic.forEach((wordItem) => {
    const localWordItem = wordItem;
    let persentRight;
    if (localWordItem.wrong === 0 && localWordItem.correct === 0) {
      persentRight = 0;
    } else if (localWordItem.wrong === 0 && localWordItem.correct !== 0) {
      persentRight = 100;
    } else if (localWordItem.wrong !== 0 && localWordItem.correct === 0) {
      persentRight = 0;
    } else {
      persentRight = (localWordItem.correct / (localWordItem.correct + localWordItem.wrong)) * 100;
    }

    const correctPercetage = persentRight.toFixed(1);
    // convert in Number
    localWordItem.percent = +(persentRight);

    createDOMElements({
      element: 'div',
      className: 'statistic_row_word',
      child: `<div class="word_category">${localWordItem.category}</div><div class="word_name">${localWordItem.word}</div><div class="word_translation">${localWordItem.translation}</div>
        <div class="word_train">${localWordItem.train}</div><div class="word_correct">${localWordItem.correct}</div><div class="word_wrong">${localWordItem.wrong}</div> <div class="word_percent">${correctPercetage}</div>`,
      parent: statisticContainer,
    });
  });

  localStorage.setItem('stats', JSON.stringify(statistic));
}

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const obj1 = a[compareKey];
  const obj2 = b[compareKey];

  let comparison = 0;
  // inverse = true - ascending
  if (inverse) {
    if (obj1 > obj2) {
      comparison = 1;
    } else if (obj1 < obj2) {
      comparison = -1;
    }
  } else if (!inverse) {
    if (obj1 < obj2) {
      comparison = 1;
    } else if (obj1 > obj2) {
      comparison = -1;
    }
  }

  return comparison;
}

export default function showStatistics() {
  inverse = true;
  currentKey = 'category';
  compareKey = 'category';
  preveiousKey = 'category';
  let statisticContent = JSON.parse(localStorage.getItem('stats')).sort(compare);

  const overlayContainer = createDOMElements({
    element: 'div',
    className: 'statistic_overlay_container',
  });

  const overlayStatistic = createDOMElements({
    element: 'div',
    className: 'statistic_overlay',
    parent: overlayContainer,
  });

  const overlayHeaderContent = createDOMElements({
    element: 'div',
    className: 'statistic_overlay_header_content',
    child: '<h3 class="statistic_overlay_header">YOUR STATISTIC<//h3>',
    parent: overlayStatistic,
  });

  const resetStatistic = createDOMElements({
    element: 'div',
    className: 'statistic_reset',
    child: 'RESET',
    parent: overlayHeaderContent,
  });

  const statisticDataWrapper = createDOMElements({
    element: 'div',
    className: 'statistic_data_wrapper',
    parent: overlayStatistic,
  });

  const statisticRowHeader = createDOMElements({
    element: 'div',
    className: 'statistic_row_header',
    parent: statisticDataWrapper,
  });

  statisticRowHeader.innerHTML = '<div class="table-head" data-method="asc" data-active="true" data-head="category">Category</div>'
    + '<div class="table-head" data-method="asc" data-active="false" data-head="word">Word</div>'
    + '<div  class="table-head" data-method="asc" data-active="false" data-head="translation">Translation</div>'
    + '<div class="table-head" data-method="asc" data-active="false" data-head="train">Train</div>'
    + '<div  class="table-head" data-method="asc" data-active="false" data-head="correct">Correct</div>'
    + '<div  class="table-head" data-method="asc" data-active="false" data-head="wrong">Error</div>'
    + '<div  class="table-head" data-method="asc" data-active="false" data-head="percent">%</div>';

  const statisticData = createDOMElements({
    element: 'div',
    className: 'statistic_data',
    parent: statisticDataWrapper,
  });

  // sort
  statisticRowHeader.childNodes.forEach((item) => {
    item.addEventListener('click', () => {
      currentKey = item.dataset.head;

      if (currentKey === preveiousKey) {
        inverse = !inverse;
        item.dataset.active = true;
        if (inverse) {
          item.dataset.method = 'asc';
        } else {
          item.dataset.method = 'desc';
        }
      } else {
        inverse = true;
        item.dataset.method = 'asc';
        item.dataset.active = true;
        document.querySelector(`[data-head="${preveiousKey}"]`).dataset.active = false;
        preveiousKey = currentKey;
      }

      compareKey = item.dataset.head;
      statisticContent = statisticContent.sort(compare);

      statisticData.innerHTML = '';
      drawStatistic(statisticContent, statisticData);
    });
  });

  resetStatistic.addEventListener('click', () => {
    localStorage.setItem('stats', JSON.stringify(stats));
    statisticContent = JSON.parse(localStorage.getItem('stats'));
    statisticData.innerHTML = '';
    drawStatistic(statisticContent, statisticData);
  });

  drawStatistic(statisticContent, statisticData);

  document.body.append(overlayContainer);
}
