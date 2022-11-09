import './styles/_index.scss';
import questions from './questions.json';

interface Quest {
  quest: string;
  answer: string[];
  right: string;
}

class Qwizz {
  $el: HTMLElement;

  $heading: HTMLElement;

  $options: HTMLElement;

  $btnNext: HTMLElement;

  $btnStop: HTMLElement;

  $alert: HTMLElement;

  $answerList: HTMLElement;

  constructor(selector: HTMLElement) {
    this.$el = selector;
    this.$heading = this.$el.querySelector('.block__qwizz-heading') as HTMLElement;
    this.$options = this.$el.querySelector('.block__qwizz-options') as HTMLElement;
    this.$btnNext = this.$el.querySelector('.button-next') as HTMLElement;
    this.$btnStop = this.$el.querySelector('.button-stop') as HTMLElement;
    this.$alert = this.$el.querySelector('.block__qwizz-alert') as HTMLElement;
    this.$answerList = this.$el.querySelector('.answer-list') as HTMLElement;

    this.init();
  }

  questIndex = 0;

  totalScore = 0;

  mistalesArrow: string[] = [];

  answer = '';

  rightAnswer = questions[this.questIndex].right;

  init() {
    console.log(this.answer);

    this.$heading.innerHTML = this.renderNewHeading(this.questIndex);
    this.$options.innerHTML = this.renderNewOptions(this.questIndex);

    this.btnNextClickHandler = this.btnNextClickHandler.bind(this);
    this.$btnNext.addEventListener('click', this.btnNextClickHandler);
    this.$btnStop.addEventListener('click', this.btnStopClickHandler);
  }

  btnNextClickHandler() {
    this.answer = this.getUserAnswer() || '';
    const result = this.answer === this.rightAnswer;

    if (this.answer === '') return;

    this.addScorePointOrPushMistake();
    this.displayAnswerStatus(result);

    this.rightAnswer = questions[this.questIndex].right;
    this.questIndex++;

    if (questions.length !== this.questIndex) {
      this.$heading.innerHTML = this.renderNewHeading(this.questIndex);
      this.$options.innerHTML = this.renderNewOptions(this.questIndex);
    } else {
      this.questIndex = 0;
      this.$heading.innerHTML = `<h1>Game over!</h1><h2>Балл: ${this.totalScore}</h2>`;
      this.$options.innerHTML = '';
      if (this.mistalesArrow.length !== 0) {
        this.$answerList.innerHTML = this.renderResult();
      } else {
        this.$options.innerHTML = 'Все верно!';
      }
    }
    console.log(this.questIndex, this.rightAnswer);
  }

  btnStopClickHandler() {}

  renderResult() {
    const resultArray = this.mistalesArrow.map((item) => `<li class="card__answer-item">${item}</li>`).join('');

    return `
    <h5>Правильный ответ - неправильный ответ</h5>
    <ul>${resultArray}<ul>
    `;
  }

  displayAnswerStatus(result: boolean):void {
    if (result) {
      this.$alert.innerHTML = 'Верно!';
    } else {
      this.$alert.innerHTML = 'Неверно!';
    }
    setTimeout(() => {
      this.$alert.innerHTML = '';
    }, 3000);
  }

  addScorePointOrPushMistake(): void {
    if (this.answer === this.rightAnswer) {
      this.totalScore++;
    } else {
      this.mistalesArrow.push(`${this.answer} - ${this.rightAnswer}`);
    }
  }

  renderNewHeading(index: number): string {
    return `Какой перевод слова(фразы) 
              <strong class="word">${questions[index].quest}</strong>?
            `;
  }

  renderNewOptions(index: number) {
    return questions[index].answer.map((item) => `
      <label class="block__qwizz-options-item">
        <input type="radio" name="answer">
        <span>${item}</span>
      </label>
      `).join('');
  }

  getUserAnswer() {
    const checkedInput = this.$options.querySelector('input[type="radio"]:checked');
    const checkedTextAnswer = checkedInput?.parentElement?.querySelector('span')?.innerHTML;
    return checkedTextAnswer;
  }
}
/// / const card = document.querySelector('.card') as HTMLElement;
/// / const buttonNext = document.querySelector('.button-next') as HTMLButtonElement;
/// / const buttonStop = document.querySelector('.button-stop') as HTMLButtonElement;

/// / let questIndex = 0;
/// / let totalScore = 0;
/// / let mistalesArrow: string[] = [];

/// / buttonNext?.addEventListener('click', buttonNextClickHandler);
/// / buttonStop?.addEventListener('click', buttonStopClickHandler);

/// / card.innerHTML = displayNewQuestion();

// function buttonStopClickHandler() {
//   buttonNext?.removeEventListener('click', buttonNextClickHandler);
//   if (buttonNext !== undefined) {
//     buttonNext.innerHTML = 'Начать сначала';
//     buttonStop.style.display = 'none';
//   }
//   buttonNext?.addEventListener('click', () => window.location.reload());
//   card.innerHTML = endgame();
// }

/// / function buttonNextClickHandler() {
/// /   const answer = getUserAnswer();
/// /   const rightAnswer = questions[questIndex].right;
/// /   const result = answer === rightAnswer;
/// /   if (answer === undefined) return;
/// /   displayAnswerStatus(result);
/// /   addScorePointOrPushMistake(answer, rightAnswer);
/// /   questIndex++;
/// /   if (questions.length !== questIndex) {
/// /     card.innerHTML = displayNewQuestion();
/// /   } else {
/// /     questIndex = 0;
/// /     card.innerHTML = endgame();
/// /   }
/// / }

/// / function addScorePointOrPushMistake(answer?: string, rightAnswer?: string): void {
/// /   if (answer === rightAnswer) {
/// /     totalScore++;
/// /   } else {
/// /     mistalesArrow.push(`${answer} - ${rightAnswer}`);
/// /   }
/// / }

/// / function getUserAnswer() {
/// /   const checkedInput = card.querySelector('input[type="radio"]:checked');
/// /   const checkedTextAnswer = checkedInput?.parentElement?.querySelector('span')?.innerHTML;
/// /   return checkedTextAnswer;
/// / }

/// / function displayNewQuestion() {
/// /   let liHTML = questions[questIndex].answer.map((singleAnswer) => `
/// /     <li class="card__answer-item">
/// /       <label class="card__answer-item-label">
/// /       <input type="radio" name="answer">
/// /       <span>${singleAnswer}</span></label>
/// /     </li>
/// /     `);

/// /   return `
/// /     <div class="question">Какой перевод слова(фразы)
/// /       <strong class="word">${questions[questIndex].quest}</strong>?
/// /     </div>
/// /     <ul class="card__answer">
/// /       ${liHTML.join('')}
/// /     </ul>`;
/// / }

/// / function displayAnswerStatus(result: boolean):void {
/// /   if (result) {
/// /     supCard.innerHTML = 'Верно!';
/// /   } else {
/// /     supCard.innerHTML = 'Неверно!';
/// /   }
/// /   setTimeout(() => {
/// /     supCard.innerHTML = '';
/// /   }, 3000);
/// / }

// function endgame() {
//   const resultArray = mistalesArrow.map((item) => `<li class="card__answer-item">${item}</li>`).join('');
//   let scoreList = '';
//   if (mistalesArrow.length !== 0) {
//     scoreList = `
//     <h5>Правильный ответ - неправильный ответ</h5>
//     <ul>${resultArray}<ul>
//     `;
//   } else {
//     scoreList = 'Все верно!';
//   }

//   return `
/// /   <h1>Game over!</h1>
/// /   <h2>Балл: ${totalScore}</h2>
//   ${scoreList}
//   `;
// }

const qwizz = document.querySelectorAll('.js-qwizz');
// eslint-disable-next-line no-new
qwizz.forEach((selector) => { new Qwizz(selector as HTMLElement); });
