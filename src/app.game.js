import cards from './data/cards';
import shuffle from './utils/shuffle';
import createDOMElements from './utils/create.elements';

const gameContent = document.querySelector('.game_content');
const gameAnswers = document.querySelector('.game_answers');
const correctSound = new Audio('./assets/audio/correct.mp3');
const successSound = new Audio('./assets/audio/success.mp3');
const failureSound = new Audio('./assets/audio/failure.mp3');
const errorSound = new Audio('./assets/audio/error.mp3');

const maxStarsNumber = 7;

let questions = [];
let answers = [];
let counter = 0;

function playSound() {
  const wordAudio = new Audio(questions[counter].audio);
  wordAudio.play();
}

function saveCardCorrectWrong(answer, word) {
  const statistic = JSON.parse(localStorage.getItem('stats'));

  statistic.forEach((wordItem) => {
    if (wordItem.word === word) {
      if (answer === true) {
        const local = wordItem;
        local.correct += 1;
      } else {
        const local = wordItem;
        local.wrong += 1;
      }
    }
  });

  localStorage.setItem('stats', JSON.stringify(statistic));
}

function checkAnswer(card) {
  const starWin = createDOMElements({ element: 'img', className: 'star', dataArr: ['src', './assets/icons/star-win.svg'] });
  const starFail = createDOMElements({ element: 'img', className: 'star', dataArr: ['src', './assets/icons/star-fail.svg'] });

  if (questions[counter].word === card.dataset.name) {
    answers.push(true);
    saveCardCorrectWrong(true, questions[counter].word);
    if (gameAnswers.childNodes.length > maxStarsNumber) {
      gameAnswers.removeChild(gameAnswers.firstChild);
    }
    gameAnswers.appendChild(starWin);
    return true;
  }

  answers.push(false);
  saveCardCorrectWrong(false, questions[counter].word);
  if (gameAnswers.childNodes.length > maxStarsNumber) {
    gameAnswers.removeChild(gameAnswers.firstChild);
  }
  gameAnswers.appendChild(starFail);
  return false;
}

function chechWin() {
  const errors = answers.filter((item) => !item).length;

  const overlayWin = createDOMElements({
    element: 'div',
    className: 'overlay_win',
    child: '<p class="overlay_text">GOOD JOB!</p><img class="overlay_win_img" src="./assets/img/win.gif">',
  });

  const overlayFail = createDOMElements({
    element: 'div',
    className: 'overlay_fail',
    child: `<p class="overlay_text">TRY AGAIN! ERORS: ${errors}</p><img class="overlay_fail_img" src="./assets/img/fail.gif">`,
  });

  if (errors) {
    document.body.classList.add('lock');
    document.body.append(overlayFail);

    failureSound.play();

    setTimeout(() => {
      window.location.reload();
      document.body.removeChild(overlayFail);
      document.body.classList.remove('lock');
    }, 3000);
  } else {
    document.body.classList.add('lock');
    document.body.append(overlayWin);
    successSound.play();

    setTimeout(() => {
      window.location.reload();
      document.body.removeChild(overlayWin);
      document.body.classList.remove('lock');
    }, 3000);
  }
}

function game() {
  const gameCards = document.querySelectorAll('.card');

  gameCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (checkAnswer(card)) {
        counter += 1;
        correctSound.play();

        card.classList.add('card_correct');
        if (counter === questions.length) {
          chechWin();
        } else {
          setTimeout(() => {
            playSound();
          }, 500);
        }
      } else {
        errorSound.play();
        // repeat word if error
        setTimeout(() => {
          playSound();
        }, 500);
      }
    });
  });
}

export default function startGame(currentCategory) {
  answers = [];
  counter = 0;

  const repeatButton = createDOMElements({
    element: 'div',
    className: 'repeat_sound',
  });
  gameContent.prepend(repeatButton);

  questions = shuffle(cards[currentCategory]);

  game();
  playSound();
  repeatButton.addEventListener('click', () => playSound());
}
