/* eslint-disable prefer-const */
import './styles/_index.scss';
// const test: HTMLElementTagNameMap

interface Quest {
  quest: string,
  answer: string[],
  right: number
}
const questions: Quest[] = [
  {
    quest: 'chair',
    answer: ['стол', 'стул', 'кресло', 'диван'],
    right: 2,
  },
  {
    quest: 'couch',
    answer: ['стол', 'стул', 'кресло', 'диван'],
    right: 4,
  },
  {
    quest: 'table',
    answer: ['стол', 'стул', 'кресло', 'диван'],
    right: 1,
  },
];

let totalScore: number = 0;
let questIndex: number = 0;
let mistalesArrow: string[] = [];
