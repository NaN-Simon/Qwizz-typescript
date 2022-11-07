// class Testing {
//   $el: HTMLElement;
//   $card: HTMLElement;
//   $btn: HTMLButtonElement;
//   $form: HTMLFormElement;
  
//   constructor(){
//     this.$el = document.querySelector('.container') as HTMLElement
//     this.$card = this.$el.querySelector('.card') as HTMLElement;
//     this.$btn = this.$el.querySelector('.button') as HTMLButtonElement;
//     this.$form = document.forms[0] as HTMLFormElement;
//     let questIndex: number = 0;
//     let totalScore: number = 0;
//     let mistalesArrow: string[] = [];

//     this.init()
//   }
//   init(){
//     btn?.addEventListener('submit',btnClickHandler)
//   }

//   btnClickHandler(event: Event){
//     event.preventDefault();
//     console.log('test')
//   }
//   toCleanCard(): void {
//     this.$card.innerHTML = '';
//   }
//   // toCleanCard();
  
//   displayNewQuestion(): void {
//     let liHTML = questions[questIndex].answer.map((singleAnswer) => {
//       return `
//       <li class="card__answer-item">
//         <label class="card__answer-item-label">
//         <input type="radio" name="answer">
//         <span>${singleAnswer}</span></label>
//       </li>
//       `
//     })
    
//     this.$card.innerHTML = `
//       <div class="question">Какой перевод слова(фразы) 
//         <strong>${questions[questIndex].quest}</strong>?
//       </div>
//       <ul class="card__answer">
//         ${liHTML.join("")}
//       </ul>`;
//   }
//   this.displayNewQuestion()

// }