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

  questIndex = 0;

  totalScore = 0;

  mistalesArrow: string[] = [];

  answer = '';

  rightAnswer = questions[this.questIndex].right;

  renderOrder: number[] = [];

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
    // this.renderOrder = this.getPseudoRandomQuestionArray(questions)
    // this.questIndex = this.renderOrder[0]
    // this.renderOrder.shift()
    console.log(this.getPseudoRandomQuestionArray(questions));

    this.$heading.innerHTML = this.renderNewHeading(this.questIndex);
    this.$options.innerHTML = this.renderNewOptions(this.questIndex);

    this.btnNextClickHandler = this.btnNextClickHandler.bind(this);
    this.$btnNext.addEventListener('click', this.btnNextClickHandler);
    this.btnStopClickHandler = this.btnStopClickHandler.bind(this);
    this.$btnStop.addEventListener('click', this.btnStopClickHandler);
  }

  btnNextClickHandler() {
    this.answer = this.getUserAnswer() || '';
    const result = this.answer === this.rightAnswer;

    if (this.answer === '') return;

    this.addScorePointOrPushMistake();
    this.displayAnswerStatus(result);

    this.questIndex++;

    // if (this.renderOrder.length !== 0) {
    if (questions.length !== this.questIndex) {
      this.rightAnswer = questions[this.questIndex].right;
      this.$heading.innerHTML = this.renderNewHeading(this.questIndex);
      this.$options.innerHTML = this.renderNewOptions(this.questIndex);
    } else {
      this.renderGameOver();
    }
  }

  btnStopClickHandler() {
    this.renderGameOver();
  }

  getPseudoRandomQuestionArray(array: Quest[]) {
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

  renderGameOver() {
    this.$btnNext.removeEventListener('click', this.btnNextClickHandler);
    this.$btnNext.addEventListener('click', () => window.location.reload());
    this.$btnNext.innerHTML = 'Start new game';
    this.$btnStop.style.display = 'none';
    this.questIndex = 0;
    this.$heading.innerHTML = `<h1>Game over!</h1><h2>Балл: ${this.totalScore}</h2>`;
    this.$options.innerHTML = '';
    if (this.mistalesArrow.length !== 0) {
      this.$answerList.innerHTML = this.renderResult();
    } else {
      this.$options.innerHTML = 'Все верно!';
    }
  }

  renderResult() {
    const resultArray = this.mistalesArrow.map((item) => `<li class="answer-list__item">${item}</li>`).join('');
    return `<ul class="answer-list__items">${resultArray}<ul>`;
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
      this.mistalesArrow
        .push(`${questions[this.questIndex].quest} - ${this.rightAnswer}`);
    }
  }

  renderNewHeading(index: number): string {
    return `Какой перевод слова(фразы): 
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

const qwizz = document.querySelectorAll('.js-qwizz');
qwizz.forEach((selector) => { new Qwizz(selector as HTMLElement); });
