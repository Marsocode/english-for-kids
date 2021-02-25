import './css/styles.css';
import menuOnload from './app.header';
import startGame from './app.game';
import CardBoard from './cardBoard';
import showStatistics from './app.stats';

menuOnload();

let statisticsPage = false;
const menyListCategory = document.querySelectorAll('.menu_list_category');
const switchAppModeCheckBox = document.getElementById('switch_btn');
const gameContent = document.querySelector('.game_content');
const gameAnswers = document.querySelector('.game_answers');
const gameButton = document.querySelector('.game_button');

const cardBoard = new CardBoard();

let activeLink = null;
function addActiveLink(category) {
  if (activeLink) {
    activeLink.classList.remove('active_link');
  }
  category.classList.add('active_link');
  activeLink = category;
}

// draw board of categories
function drawMainCategoriesCards() {
  cardBoard.categoriesCards.forEach((category) => {
    category.addEventListener('click', () => {
      cardBoard.renderSpecificCategory(category.dataset.category);

      // highlight menu item
      addActiveLink(document.querySelector(`.menu_list_category[data-category="${category.dataset.category}"]`));
    });
  });
}

drawMainCategoriesCards();

function addGameElements() {
  if (cardBoard.gameMode) {
    if (cardBoard.currentCategory === 'main_page') {
      gameAnswers.innerHTML = '';
      // delete repeat button
      gameContent.removeChild(gameContent.firstElementChild);
      // add start game_button default
      gameButton.classList.remove('game_mode');
      gameContent.insertBefore(gameButton, gameAnswers);
    } else {
      gameAnswers.innerHTML = '';
      // delete repeat button
      gameContent.removeChild(gameContent.firstElementChild);
      // add start game_button in game mode
      gameButton.classList.add('game_mode');
      gameContent.insertBefore(gameButton, gameAnswers);
    }
    // if another currentCategory - also delete game content
  } else {
    gameAnswers.innerHTML = '';
    // delete repeat button
    gameContent.removeChild(gameContent.firstElementChild);
    // add start game_button default
    gameButton.classList.remove('game_mode');
    gameContent.insertBefore(gameButton, gameAnswers);
  }
}

menyListCategory.forEach((category) => {
  category.addEventListener('click', () => {
    // add game elements if game mode
    addGameElements();

    // highlight menu item
    addActiveLink(category);

    if (category.dataset.category === 'main_page') {
      cardBoard.initCategoriesCards();
      drawMainCategoriesCards();
    } else {
      cardBoard.renderSpecificCategory(category.dataset.category);
    }
  });
});

switchAppModeCheckBox.addEventListener('click', (e) => {
  const { target } = e;

  cardBoard.gameMode = target.checked;
  addGameElements();

  // if we are in the category page
  if (cardBoard.currentCategory !== 'main_page') {
    // draw game board
    cardBoard.renderSpecificCategory(cardBoard.currentCategory);
  }
});

gameButton.addEventListener('click', () => {
  startGame(cardBoard.currentCategory);
  gameContent.removeChild(gameButton);
});

const statisticButton = document.querySelector('.statistic_button');

statisticButton.addEventListener('click', () => {
  if (statisticsPage === false) {
    statisticsPage = true;
    statisticButton.classList.add('close_stats');
    showStatistics();
    document.body.classList.add('lock');
  } else {
    statisticsPage = false;
    statisticButton.classList.remove('close_stats');
    const overlay = document.querySelector('.statistic_overlay_container');
    document.body.removeChild(overlay);
    document.body.classList.remove('lock');
  }
});
