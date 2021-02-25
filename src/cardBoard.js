import categories from './data/categories';
import cards from './data/cards';
import stats from './data/stats';
import createDOMElements from './utils/create.elements';

const categoriesCards = document.querySelector('.categories_cards');
const gameButton = document.querySelector('.game_button');
// stats
let statistic = '';

function createStatistic() {
  if (!localStorage.getItem('stats')) {
    statistic = localStorage.setItem('stats', JSON.stringify(stats));
  } else {
    statistic = JSON.parse(localStorage.getItem('stats'));
  }
}

createStatistic();

function saveCardTrained(cardWord) {
  statistic.forEach((wordItem) => {
    if (wordItem.word === cardWord) {
      const local = wordItem;
      local.train += 1;
    }
  });

  localStorage.setItem('stats', JSON.stringify(statistic));
}

export default class CardBoard {
  constructor() {
    this.categoriesCards = [];
    this.cardsByCategory = [];
    this.gameMode = false;
    this.initCategoriesCards();
    this.currentCategory = 'main_page';
  }

  initCategoriesCards() {
    categoriesCards.innerHTML = null;

    categories.forEach((category) => {
      this.currentCategory = 'main_page';

      const categoryCard = createDOMElements({
        element: 'div',
        className: 'category_card',
        child: `<div class="card_image_container"><img class="card_image" src="${category.image}" alt="image"></div><h3 class="card_title">${category.categoryName.toUpperCase()}</h3>`,
        parent: categoriesCards,
        dataArr: ['category', category.categoryName.toLowerCase()],
      });

      this.categoriesCards.push(categoryCard);
    });

    gameButton.classList.remove('game_mode');
  }

  renderSpecificCategory(category) {
    categoriesCards.innerHTML = '';

    cards[category].forEach((cardItem) => {
      this.currentCategory = category;

      const cardFront = createDOMElements({
        element: 'div',
        className: 'front',
        child: this.gameMode ? `<div class="card_image_container game_mode"><img class="card_image" src="${cardItem.image}" alt=""></div>` : `<div class="card_image_container"><img class="card_image" src="${cardItem.image}" alt=""></div>
          <div class="card_content"><h3 class="card_title">${cardItem.word.toUpperCase()}</h3><div class="flip_card"></div>`,
      });

      const cardBack = createDOMElements({
        element: 'div',
        className: 'back',
        child: `<div class="card_image_container"><img class="card_image" src="${cardItem.image}" alt=""></div><div class="card_content">
              <h3 class="card_title">${cardItem.translation.toUpperCase()}</h3>`,
      });

      const card = createDOMElements({
        element: 'div',
        className: 'card',
        child: this.gameMode ? cardFront : [cardFront, cardBack],
        parent: categoriesCards,
        dataArr: ['name', `${cardItem.word}`],
      });

      if (this.gameMode) {
        gameButton.classList.add('game_mode');
        gameButton.innerHTML = 'START GAME';
      } else {
        gameButton.classList.remove('game_mode');
        gameButton.innerHTML = '';
      }

      if (!this.gameMode) {
        card.addEventListener('click', (e) => {
          const { target } = e;
          if (cardItem.audio.includes(card.dataset.name)) {
            const clickSound = new Audio(cardItem.audio);
            clickSound.play();
          }

          // save clicks within train mode
          saveCardTrained(card.dataset.name);

          if (target.className === 'flip_card') {
            card.classList.toggle('flipped');
          }
        });

        card.addEventListener('mouseleave', () => {
          setTimeout(
            () => {
              card.classList.remove('flipped');
            }, 300,
          );
        });
      }

      this.cardsByCategory.push(card);
    });
  }
}
