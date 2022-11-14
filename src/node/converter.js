console.log('Loading..');
let fs = require("fs");
let path = require("path")
const newQuestions = []

let str = fs.readFileSync(path.join(__dirname,'draft-list.txt'), "utf8")
str.split("\n").map((item) => {
  let card = new Object();
  let a = item.split(" - ")
  card.quest = a[0];
  card.answer = a[1];
  newQuestions.push(card)
})
fs.writeFileSync(path.join(__dirname, '../assets/questions.json'), JSON.stringify(newQuestions));
console.log('..loading is complete');