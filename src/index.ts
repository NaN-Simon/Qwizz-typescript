/* eslint-disable max-len */
/* eslint-disable space-before-blocks */
/* eslint-disable semi */
/* eslint-disable prefer-const */
/* eslint-disable padded-blocks */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-trailing-spaces */
import './styles/_index.scss';
import questions from './questions.json';

interface Quest {
  quest: string;
  right: string;
}

interface Data {
  questIndex: number,
  totalScore: number,
  mistalesArrow: string[],
  selectedAnswer: string,
  rightAnswer: string,
  question: string,
  wordForGuessing: number,
  renderOrderArray: number[],
  tempCardsArray: number[],
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
    renderOrderArray: [],
    tempCardsArray: [],
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
    this.data.renderOrderArray = this.getPseudoRandomQuestionArray(questions);
    console.log(this.data.renderOrderArray.map((item) => questions[item].quest));
    
    
    if (this.data.renderOrderArray.length !== 0) {
      this.data.tempCardsArray = this.data.renderOrderArray.splice(0, 4); 
    }
    

    this.getOneQuestThreeAnswers(this.data.tempCardsArray);
    this.$heading.innerHTML = this.renderNewHeading(this.data.tempCardsArray[0]);
    this.$options.innerHTML = this.renderNewOptions(this.data.tempCardsArray, questions);
    console.log(this.data.tempCardsArray.map((item) => questions[item].quest));
    

    this.btnNextClickHandler = this.btnNextClickHandler.bind(this);
    this.$btnNext.addEventListener('click', this.btnNextClickHandler);
    this.btnStopClickHandler = this.btnStopClickHandler.bind(this);
    this.$btnStop.addEventListener('click', this.btnStopClickHandler);
  }

  btnNextClickHandler() {
    this.data.selectedAnswer = this.getUserAnswer() || '';
    if (this.data.selectedAnswer === '') return;

    this.data.question = questions[this.data.tempCardsArray[0]].quest;
    this.data.rightAnswer = questions[this.data.tempCardsArray[0]].right;
    const result = this.data.selectedAnswer === this.data.rightAnswer;

    this.addScorePointOrPushMistake(result);
    this.displayAnswerStatus(result);

    this.data.wordForGuessing = this.data.renderOrderArray[0];

    this.data.questIndex++;

    if (this.data.renderOrderArray.length !== 0) {
      this.data.tempCardsArray = this.data.renderOrderArray.splice(0, 4); 
      console.log(this.data.tempCardsArray.map((item) => questions[item].quest));
      
      this.$heading.innerHTML = this.renderNewHeading(this.data.wordForGuessing);
      this.$options.innerHTML = this.renderNewOptions(this.data.tempCardsArray, questions);

      this.data.rightAnswer = questions[this.data.wordForGuessing].right;

    } else {
      this.renderGameOver();
    }
  }

  renderNewOptions(indexArray: number[], questionArray: Quest[]): string {
    const answersList = this.data.tempCardsArray.map((answerNumb) => questionArray[answerNumb].right)
    return answersList.map((item) => `
      <label class="block__qwizz-options-item">
        <input type="radio" name="answer">
        <span>${item}</span>
      </label>
      `).join('');
  }

  renderNewHeading(index: number): string {
    return `Какой перевод слова(фразы): 
              <strong class="word">${questions[index].quest}</strong>?
            `;
  }

  getOneQuestThreeAnswers(tempArray: number[]){
    let qr = [questions[tempArray[0]].quest, questions[tempArray[0]].right]
    let another = [
      [questions[tempArray[1]].quest, questions[tempArray[1]].right],
      [questions[tempArray[2]].quest, questions[tempArray[2]].right],
      [questions[tempArray[3]].quest, questions[tempArray[3]].right],
    ]
    return ''
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

  
  addScorePointOrPushMistake(result: boolean): void {
    if (result) {
      this.data.totalScore++;
    } else {
      this.data.mistalesArrow
      .push(`${this.data.question} - ${this.data.rightAnswer}`);
    }
  }
  
  getUserAnswer() {
    const checkedInput = this.$options.querySelector('input[type="radio"]:checked');
    const checkedTextAnswer = checkedInput?.parentElement?.querySelector('span')?.innerHTML;
    console.log('ОТВЕТ ЮЗЕРА: ' + checkedTextAnswer);
    return checkedTextAnswer;
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
}

const qwizz = document.querySelectorAll('.js-qwizz');
qwizz.forEach((selector) => {
  new Qwizz(selector as HTMLElement);
});
