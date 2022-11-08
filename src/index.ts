/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
import './styles/_index.scss';
// import * as questions3 from './questions.json';

const questions: Quest[] = require('./questions.json');

// const test: HTMLElementTagNameMap
// this === HTMLElement

interface Quest {
  quest: string;
  answer: string[];
  right: string;
}

const supCard = document.querySelector('.sup-card') as HTMLElement;
const card = document.querySelector('.card') as HTMLElement;
const btn = document.querySelector('.button') as HTMLButtonElement;

let questIndex = 0;
let totalScore = 0;
let mistalesArrow: string[] = [];

btn?.addEventListener('click', btnClickHandler);

card.innerHTML = displayNewQuestion();

function btnClickHandler() {
  const answer = getUserAnswer();
  const rightAnswer = questions[questIndex].right;
  const result = answer === rightAnswer;
  if (answer === undefined) return;
  displayAnswerStatus(result);
  addScorePointOrPushMistake(answer, rightAnswer);
  questIndex++;
  if (questions.length !== questIndex) {
    card.innerHTML = displayNewQuestion();
  } else {
    questIndex = 0;
    card.innerHTML = endgame();
  }
}

function addScorePointOrPushMistake(answer?: string, rightAnswer?: string): void {
  if (answer === rightAnswer) {
    totalScore++;
  } else {
    mistalesArrow.push(`${answer} - ${rightAnswer}`);
  }
}

function getUserAnswer() {
  const checkedInput = card.querySelector('input[type="radio"]:checked');
  const checkedTextAnswer = checkedInput?.parentElement?.querySelector('span')?.innerHTML;
  return checkedTextAnswer;
}

function displayNewQuestion() {
  let liHTML = questions[questIndex].answer.map((singleAnswer) => `
    <li class="card__answer-item">
      <label class="card__answer-item-label">
      <input type="radio" name="answer">
      <span>${singleAnswer}</span></label>
    </li>
    `);

  return `
    <div class="question">Какой перевод слова(фразы) 
      <strong class="word">${questions[questIndex].quest}</strong>?
    </div>
    <ul class="card__answer">
      ${liHTML.join('')}
    </ul>`;
}

function displayAnswerStatus(result: boolean):void {
  if (result) {
    supCard.innerHTML = 'Верно!';
  } else {
    supCard.innerHTML = 'Неверно!';
  }
  setTimeout(() => {
    supCard.innerHTML = '';
  }, 3000);
}

function endgame() {
  const resultArray = mistalesArrow.map((item) => `<li class="card__answer-item">${item}</li>`).join('');
  let scoreList = '';
  if (mistalesArrow.length !== 0) {
    scoreList = `
    <h5>Правильный ответ - неправильный ответ</h5>
    <ul>${resultArray}<ul>
    `;
  } else {
    scoreList = 'Все верно!';
  }

  return `
  <h1>Game over!</h1>
  <h2>Балл: ${totalScore}</h2>
  ${scoreList}
  `;
}
