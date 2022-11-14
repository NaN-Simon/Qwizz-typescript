import './styles/_index.scss';

import questions from './assets/questions.json';

  interface Quest {
    quest: string;
  answer: string;
}

interface Data {
  questIndex: number,
  totalScore: number,
  mistalesArrow: string[],
  selectedAnswer: string,
  rightAnswer: string,
  question: string,
  wordForGuessing: number,
  queueArray: number[],
  arrayOfIndexes: number[],
}

class Qwizz {
  $el: HTMLElement;

  $heading: HTMLElement;

  $options: HTMLElement;

  $btnNext: HTMLElement;

  $btnStop: HTMLElement;

  $alert: HTMLElement;

  $answerList: HTMLElement;

  data: Data = {
    questIndex: 0,
    totalScore: 0,
    mistalesArrow: [],
    selectedAnswer: '',
    rightAnswer: '',
    question: '',
    wordForGuessing: 0,
    queueArray: [],
    arrayOfIndexes: [],
  };

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

  init() {
    this.data.queueArray = Qwizz.getPseudoRandomQuestionArray(questions);

    if (this.data.queueArray.length !== 0) {
      this.data.arrayOfIndexes = this.data.queueArray.splice(0, 4);
    }

    this.$heading.innerHTML = Qwizz.renderNewHeading(this.data.arrayOfIndexes[0]);
    this.$options.innerHTML = Qwizz.renderNewOptions(this.data.arrayOfIndexes, questions);

    this.btnNextClickHandler = this.btnNextClickHandler.bind(this);
    this.$btnNext.addEventListener('click', this.btnNextClickHandler);
    this.btnStopClickHandler = this.btnStopClickHandler.bind(this);
    this.$btnStop.addEventListener('click', this.btnStopClickHandler);
  }

  btnNextClickHandler() {
    this.data.selectedAnswer = this.getUserAnswer() || '';
    if (this.data.selectedAnswer === '') return;

    this.data.question = questions[this.data.arrayOfIndexes[0]].quest;
    this.data.rightAnswer = questions[this.data.arrayOfIndexes[0]].answer;
    const compare = this.data.selectedAnswer === this.data.rightAnswer;

    this.addScorePointOrPushMistake(compare);
    this.displayAnswerStatus(compare);

    [this.data.wordForGuessing] = this.data.queueArray;

    this.data.questIndex++;

    if (this.data.queueArray.length > 3) {
      this.data.arrayOfIndexes = this.data.queueArray.splice(0, 4);

      this.$heading.innerHTML = Qwizz.renderNewHeading(this.data.wordForGuessing);
      this.$options.innerHTML = Qwizz.renderNewOptions(this.data.arrayOfIndexes, questions);

      this.data.rightAnswer = questions[this.data.wordForGuessing].answer;
    } else {
      this.renderGameOver();
    }
  }

  static renderNewHeading(index: number): string {
    return `Какой перевод слова(фразы): 
              <strong class="word">${questions[index].quest}</strong>?
            `;
  }

  static renderNewOptions(indexArray: number[], questArray: Quest[]): string {
    const answersList = indexArray.map((answerNumb) => questArray[answerNumb].answer);
    answersList.sort(() => Math.random() - 0.5);
    return answersList.map((item) => `
      <label class="block__qwizz-options-item">
        <input type="radio" name="answer">
        <span>${item}</span>
      </label>
      `).join('');
  }

  btnStopClickHandler() {
    this.renderGameOver();
  }

  renderGameOver() {
    this.$btnNext.removeEventListener('click', this.btnNextClickHandler);
    this.$btnNext.addEventListener('click', () => window.location.reload());
    this.$btnNext.innerHTML = 'Start new game';
    this.$btnStop.style.display = 'none';
    this.data.questIndex = 0;
    this.$heading.innerHTML = `<h1>Game over!</h1><h2>Балл: ${this.data.totalScore}</h2>`;
    this.$options.innerHTML = '';
    if (this.data.mistalesArrow.length !== 0) {
      this.$answerList.innerHTML = this.renderResult();
    } else {
      this.$options.innerHTML = 'Все верно!';
    }
  }

  renderResult() {
    const resultArray = this.data.mistalesArrow.map((item) => `<li class="answer-list__item">${item}</li>`).join('');
    return `<ul class="answer-list__items">${resultArray}<ul>`;
  }

  addScorePointOrPushMistake(compare: boolean): void {
    if (compare) {
      this.data.totalScore++;
    } else {
      this.data.mistalesArrow
        .push(`${this.data.question} - ${this.data.rightAnswer}`);
    }
  }

  getUserAnswer() {
    const checkedInput = this.$options.querySelector('input[type="radio"]:checked');
    const checkedTextAnswer = checkedInput?.parentElement?.querySelector('span')?.innerHTML;
    return checkedTextAnswer;
  }

  displayAnswerStatus(compare: boolean):void {
    if (compare) {
      this.$alert.innerHTML = 'Верно!';
    } else {
      this.$alert.innerHTML = 'Неверно!';
    }
    setTimeout(() => {
      this.$alert.innerHTML = '';
    }, 3000);
  }

  static getPseudoRandomQuestionArray(array: Quest[] | number[]) {
    const max = array.length - 1;
    const min = 0;

    let totalNumbers = max - min + 1;
    const arrayTotalNumbers = [];
    const arrayRandomNumbers = [];
    let tempRandomNumber;

    while (totalNumbers--) {
      arrayTotalNumbers.push(totalNumbers + min);
    }
    while (arrayTotalNumbers.length) {
      tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
      arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
      arrayTotalNumbers.splice(tempRandomNumber, 1);
    }
    return arrayRandomNumbers;
  }
}

const qwizz = document.querySelectorAll('.js-qwizz');
qwizz.forEach((selector) => {
  new Qwizz(selector as HTMLElement);
});
