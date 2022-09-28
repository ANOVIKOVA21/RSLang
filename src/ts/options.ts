import { GetWordsData } from './request';
interface GetOptions {
  currentBookGroup: number;
  currentBookPage: number;
  totalPages: number;
}
export interface GetGameWord {
  id: string;
  questionNum: number;
}
interface GetLevelOptions {
  time: number;
  questionNum: number;
  currentWordId: string;
  rightAnswer: string;
  programAnswer: string;
  words: GetWordsData[];
  userRightAnswers: GetGameWord[];
  userWrongAnswers: GetGameWord[];
  rightAnswersInRow: number;
}

export const options: GetOptions = {
  currentBookGroup: 0,
  currentBookPage: 0,
  totalPages: 29,
};
export const levelOptions: GetLevelOptions = {
  time: 60,
  questionNum: 0,
  currentWordId: '',
  rightAnswer: '',
  programAnswer: '',
  words: [],
  userRightAnswers: [],
  userWrongAnswers: [],
  rightAnswersInRow: 0,
};
