import { getWords, GetWordsData, getAggregatedWords } from './request';
import { getArrRandomNumbers, getRandomNum } from './general-functions';
import { levelOptions, options } from './options';
import { showResult } from './result';
// audio: "files/20_1598.mp3"
// audioExample: "files/20_1598_example.mp3"
// audioMeaning: "files/20_1598_meaning.mp3"
// group: 2
// id: "5e9f5ee35eb9e72bc21afadd"
// image: "files/20_1598.jpg"
// page: 19
// textExample: "My youngest daughter is a <b>terrific</b> painter."
// textExampleTranslate: "Моя младшая дочь - потрясающий художник"
// textMeaning: "Something <i>terrific</i> is very good."
// textMeaningTranslate: "Что-то потрясающее очень хорошо"
// transcription: "[tərífik]"
// word: "terrific"
// wordTranslate: "потрясающий"

// 1 этап - 10
// 2 этап - 20
// 3 этап - 40
// 4 этап - 80
export function getAudio(link: string) {
  const url = `https://anna-learnenglish.herokuapp.com/${link}`;
  const audio = new Audio(url);
  audio.load();
  return audio;
}
export async function getLevelData(amountOfArrs: number, group: number, page?: number) {
  const promiseArr = [];
  if (page || page === 0) {
    for (let i = 0; i < amountOfArrs; i++) {
      if (i === 0) promiseArr.push(getWords(group, page));
      if (page === 0) break;
      page -= 1;
      promiseArr.push(getWords(group, page));
    }
  } else {
    const randomPages = getArrRandomNumbers(amountOfArrs, options.totalPages);
    randomPages.forEach((randomPage) => promiseArr.push(getWords(group - 1, randomPage)));
  }
  const data = Promise.all(promiseArr);
  const words = (await data).flat();
  return words;
}
export async function getUserLevelData(amountOfArrs: number, group: number, page?: number) {
  debugger;
  const promiseArr = [];
  if (page || page === 0) {
    for (let i = 0; i < amountOfArrs; i++) {
      if (i === 0) promiseArr.push(getAggregatedWords(group, page));
      if (page === 0) break;
      page -= 1;
      promiseArr.push(getAggregatedWords(group, page));
    }
  } else {
    const randomPages = getArrRandomNumbers(amountOfArrs, options.totalPages);
    for (let i = 0; i < randomPages.length; i++) {
      const chunkOfWords: GetWordsData[] = await getAggregatedWords(group - 1, randomPages[i]);
      const filteredWords = chunkOfWords.filter((word) => !word.userWord || word.userWord.difficulty !== 'studied');
      promiseArr.push(filteredWords);
    }
  }
  const data = Promise.all(promiseArr);
  const words = (await data).flat();
  console.log(words);
  return words;
}
let interval: NodeJS.Timer;

function setTime(timer: HTMLSpanElement) {
  timer.innerHTML = `${levelOptions.time}`;
  if (levelOptions.time < 10) timer.innerHTML = `0${levelOptions.time}`;
}
function updateTime(timer: HTMLSpanElement) {
  levelOptions.time = 60;
  setTime(timer);
}
function decreaseTime(timer: HTMLSpanElement) {
  if (levelOptions.time === 0) {
    clearInterval(interval);
    levelOptions.rightAnswersInRow = 0;
    levelOptions.questionNum = 0;
    showResult();
  } else {
    --levelOptions.time;
    setTime(timer);
  }
}
export function startTimer() {
  const timer = document.querySelector('.timer') as HTMLSpanElement;

  updateTime(timer);
  interval = setInterval(() => decreaseTime(timer), 1000);
}
export async function startSprint(words: GetWordsData[]) {
  if (levelOptions.questionNum === words.length) levelOptions.time = 0;
  const engWordEl = document.querySelector('.sprint-game__eng-word') as HTMLParagraphElement;
  const wordTranslationEl = document.querySelector('.sprint-game__translation') as HTMLParagraphElement;
  engWordEl.innerHTML = `${words[levelOptions.questionNum].word}`;

  const rightAnswer = words[levelOptions.questionNum].wordTranslate;
  if (getRandomNum(0, 1)) wordTranslationEl.innerHTML = `${rightAnswer}`;
  else wordTranslationEl.innerHTML = `${words[getRandomNum(0, words.length - 1)].wordTranslate}`;
  if (words[levelOptions.questionNum].id !== undefined)
    levelOptions.currentWordId = words[levelOptions.questionNum].id as string;
  else if (words[levelOptions.questionNum]._id !== undefined)
    levelOptions.currentWordId = words[levelOptions.questionNum]._id as string;
  levelOptions.questionNum++;

  console.log(rightAnswer);

  levelOptions.rightAnswer = rightAnswer;
  levelOptions.programAnswer = wordTranslationEl.innerHTML;
}
export async function startAudioCall(words: GetWordsData[]) {
  if (levelOptions.questionNum === 20) {
    showResult();
    const scoreMessage = document.querySelector('.result__message') as HTMLParagraphElement;
    scoreMessage.style.display = 'none';
    return;
  }
  const listenBtn = document.querySelector('.audiocall-game__listen');
  const optionsTranslation = document.querySelectorAll<HTMLLIElement>('.audiocall-game__option');
  const rightAnswer = words[levelOptions.questionNum].wordTranslate;
  const randomNum = getRandomNum(0, optionsTranslation.length - 1);

  listenBtn?.setAttribute('data-audio', `${words[levelOptions.questionNum].audio}`);
  getAudio(words[levelOptions.questionNum].audio).play();
  const randomWordsNums = getArrRandomNumbers(5, words.length - 1, levelOptions.questionNum);
  optionsTranslation.forEach((option, index) => (option.innerHTML = words[randomWordsNums[index]].wordTranslate));
  optionsTranslation[randomNum].innerHTML = `${rightAnswer}`;
  if (words[levelOptions.questionNum].id !== undefined)
    levelOptions.currentWordId = words[levelOptions.questionNum].id as string;
  else if (words[levelOptions.questionNum]._id !== undefined)
    levelOptions.currentWordId = words[levelOptions.questionNum]._id as string;
  levelOptions.questionNum++;

  console.log(rightAnswer);

  levelOptions.rightAnswer = rightAnswer;
}
export function checkRightAnswers() {
  const sprintPointsEl = document.querySelectorAll('.sprint-game__point');
  const sprintImg = document.querySelector('.sprint-game__img') as HTMLDivElement;

  if (levelOptions.rightAnswersInRow === 0) {
    sprintImg.style.backgroundImage = 'url(../animals/rabbit.png)';
    sprintPointsEl.forEach((el) => el.classList.remove('sprint-game__point-active'));
  }
  if (
    levelOptions.rightAnswersInRow === 1 ||
    levelOptions.rightAnswersInRow === 5 ||
    levelOptions.rightAnswersInRow === 9
  )
    sprintPointsEl[0].classList.add('sprint-game__point-active');
  if (
    levelOptions.rightAnswersInRow === 2 ||
    levelOptions.rightAnswersInRow === 6 ||
    levelOptions.rightAnswersInRow === 10
  )
    sprintPointsEl[1].classList.add('sprint-game__point-active');
  if (
    levelOptions.rightAnswersInRow === 3 ||
    levelOptions.rightAnswersInRow === 7 ||
    levelOptions.rightAnswersInRow === 11
  )
    sprintPointsEl[2].classList.add('sprint-game__point-active');
  if (levelOptions.rightAnswersInRow === 4) {
    sprintImg.style.backgroundImage = 'url(../animals/fox.png)';
    sprintPointsEl.forEach((el) => el.classList.remove('sprint-game__point-active'));
  }
  if (levelOptions.rightAnswersInRow === 8) {
    sprintImg.style.backgroundImage = 'url(../animals/bear.png)';
    sprintPointsEl.forEach((el) => el.classList.remove('sprint-game__point-active'));
  }
  if (levelOptions.rightAnswersInRow === 12) sprintImg.style.backgroundImage = 'url(../animals/dragon.png)';
}
export function setScore() {
  const sprintScore = document.querySelector('.sprint-game__score') as HTMLElement;
  const sprintExtraPoint = document.querySelector('.sprint-game__extra-points') as HTMLSpanElement;
  let score = Number(sprintScore.innerHTML);
  if (levelOptions.rightAnswersInRow < 4) {
    score += 10;
    sprintScore.innerHTML = `${score}`;
    sprintExtraPoint.innerHTML = '10';
  }
  if (levelOptions.rightAnswersInRow >= 4 && levelOptions.rightAnswersInRow < 8) {
    score += 20;
    sprintScore.innerHTML = `${score}`;
    sprintExtraPoint.innerHTML = '20';
  }
  if (levelOptions.rightAnswersInRow >= 8 && levelOptions.rightAnswersInRow < 12) {
    score += 40;
    sprintScore.innerHTML = `${score}`;
    sprintExtraPoint.innerHTML = '40';
  }
  if (levelOptions.rightAnswersInRow >= 12) {
    score += 80;
    sprintScore.innerHTML = `${score}`;
    sprintExtraPoint.innerHTML = '80';
  }
}
