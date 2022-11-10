/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-new */
/* eslint-disable lines-between-class-members */
import './styles/_index.scss';
import questions from './questions.json';

interface Quest {
  quest: string;
  answer: string[];
  right: string;
}

interface Data {
  questIndex: number,
  totalScore: number,
  mistalesArrow: string[],
  selectedAnswer: string,
  rightAnswer: string,
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
  };

  // renderOrderArray: number[] = [];
  renderOrderArray: number[] = this.getPseudoRandomQuestionArray(questions);
  currentOrderNumber = 0;
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
    /* присваивание псевдорандомного числа для порядка следования, если он массив не пуст */
    if (this.renderOrderArray.length !== 0) {
      this.currentOrderNumber = this.renderOrderArray[0];
    }
    console.log(this.renderOrderArray);

    /* Рендер первого отображения */
    this.$heading.innerHTML = this.renderNewHeading(this.data.questIndex);
    this.$options.innerHTML = this.renderNewOptions(this.data.questIndex);

    /* Обработчики событий */
    this.btnNextClickHandler = this.btnNextClickHandler.bind(this);
    this.$btnNext.addEventListener('click', this.btnNextClickHandler);
    this.btnStopClickHandler = this.btnStopClickHandler.bind(this);
    this.$btnStop.addEventListener('click', this.btnStopClickHandler);
  }

  btnNextClickHandler() {
    /* ВОЗМОЖНО УДАЛИТЬ IF присваивание псевдорандомного
    числа для порядка следования, если он массив не пуст */
    if (this.renderOrderArray.length !== 0) {
      this.currentOrderNumber = this.renderOrderArray[0];
    }

    /* получение правльного ответа */
    this.data.rightAnswer = questions[this.data.questIndex].right;

    /* выбранный элемент в форме */
    this.data.selectedAnswer = this.getUserAnswer() || '';
    /* сравнение выбранного элемента с правильным */
    const result = this.data.selectedAnswer === this.data.rightAnswer;

    /* нереагирование если ничего не выбрано */
    if (this.data.selectedAnswer === '') return;

    /* обновление рейтинга или добавление ошибки в массив */
    this.addScorePointOrPushMistake(result);
    /* отображение результата */
    this.displayAnswerStatus(result);

    /* увеличения индекса вопроса по порядку */
    this.data.questIndex++;

    /* проверка: последний ли вопрос */
    if (questions.length !== this.data.questIndex) {
      /* отображение нового вопроса */
      this.$heading.innerHTML = this.renderNewHeading(this.data.questIndex);
      this.$options.innerHTML = this.renderNewOptions(this.data.questIndex);

      /* присваивание нового правильного ответа */
      this.data.rightAnswer = questions[this.data.questIndex].right;
      this.renderOrderArray.shift();
    } else {
      /* конец игры, если последний вопрос */
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

  addScorePointOrPushMistake(result: boolean): void {
    if (result) {
      this.data.totalScore++;
    } else {
      this.data.mistalesArrow
        .push(`${questions[this.data.questIndex].quest} - ${this.data.rightAnswer}`);
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
