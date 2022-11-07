/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-const */
import './styles/_index.scss';
// const test: HTMLElementTagNameMap
// this === HTMLElement

interface Quest {
  quest: string;
  answer: string[];
  right: string;
}
const questions: Quest[] = [
  {
    quest: 'chair',
    answer: ['стол', 'стул', 'кресло', 'диван'],
    right: 'стул',
  },
  {
    quest: 'couch',
    answer: ['стол', 'стул', 'кресло', 'диван'],
    right: 'диван',
  },
  {
    quest: 'table',
    answer: ['стол', 'стул', 'кресло', 'диван'],
    right: 'стол',
  },
];

const card = document.querySelector('.card') as HTMLElement;
const btn = document.querySelector('.button') as HTMLButtonElement;
const form = document.forms[0] as HTMLFormElement;

let questIndex = 0;
let totalScore = 0;
let mistalesArrow: string[] = [];

btn?.addEventListener('click', btnClickHandler);

displayNewQuestion();

function btnClickHandler() {
  const answer = getUserAnswer();
  const rightAnswer = questions[questIndex].right;
  const result = answer === rightAnswer;
  if (answer === undefined) {
    alert('Choose answer');
  } else {
    displayAnswer(result);
    addScorePointOrPushMistake(answer, rightAnswer);
    questIndex++;
    displayNewQuestion();
  }
}

function addScorePointOrPushMistake(answer: string, rightAnswer: string): void {
  if (answer === rightAnswer) {
    totalScore++;
  } else {
    mistalesArrow.push(`Правильный ответ: ${answer} - Твой ответ: ${rightAnswer}`);
  }
}

function displayAnswer(result: boolean) {
  if (result) {
    alert('Верно!');
    // totalScore++;
  } else {
    alert('Неверно!');
    // mistalesArrow.push(`${value} - ${rightAnswer}`);
  }
}

function getUserAnswer() {
  const checkedInput = card.querySelector('input[type="radio"]:checked');
  const checkedTextAnswer = checkedInput?.parentElement?.querySelector('span')?.innerHTML;
  return checkedTextAnswer;
}

function displayNewQuestion(): void {
  if (questions.length !== questIndex) {
    let liHTML = questions[questIndex].answer.map((singleAnswer) => `
      <li class="card__answer-item">
        <label class="card__answer-item-label">
        <input type="radio" name="answer">
        <span>${singleAnswer}</span></label>
      </li>
      `);

    card.innerHTML = `
      <div class="question">Какой перевод слова(фразы) 
        <strong>${questions[questIndex].quest}</strong>?
      </div>
      <ul class="card__answer">
        ${liHTML.join('')}
      </ul>`;
  } else {
    questIndex = 0;
    card.innerHTML = 'Game over!';
  }
}
