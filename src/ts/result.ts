import { levelOptions, GetGameWord } from './options';
import { getAudio } from './game';
function addListItemAndListers(gameWords: GetGameWord[], parent: HTMLDivElement) {
  const words = levelOptions.words;
  gameWords.forEach((obj, index) => {
    const listItem = `<li class="result__list-item">
        <button type="button" class="result__audio button"></button>
        <p class="result__word">${words[obj.questionNum].word} - ${words[obj.questionNum].wordTranslate}</p>
      </li>`;
    parent.insertAdjacentHTML('beforeend', listItem);
    const audioBtns = parent.querySelectorAll('.result__audio');
    audioBtns[index].addEventListener('click', () => {
      const audio = getAudio(words[obj.questionNum].audio);
      audio.play();
    });
  });
}
function showList(el: HTMLElement) {
  el.classList.toggle('result__show-list');
}
export function showResult() {
  const resultTemp = document.getElementById('result-page') as HTMLTemplateElement;
  const resultEl = resultTemp.content.cloneNode(true) as HTMLDivElement;
  const score = resultEl.querySelector('.result__score') as HTMLSpanElement;
  const amountOfRightAnswers = resultEl.querySelector('.result__right') as HTMLSpanElement;
  const amountOfWrongAnswers = resultEl.querySelector('.result__wrong') as HTMLSpanElement;
  const rightAnswersList = resultEl.querySelector('.result__right-list') as HTMLDivElement;
  const wrongAnswersList = resultEl.querySelector('.result__wrong-list') as HTMLDivElement;

  score.innerHTML = document.querySelector('.sprint-game__score')?.innerHTML || '0';
  amountOfRightAnswers.innerHTML = `${levelOptions.userRightAnswers.length}`;
  amountOfWrongAnswers.innerHTML = `${levelOptions.userWrongAnswers.length}`;
  amountOfRightAnswers.addEventListener('click', () => showList(rightAnswersList));
  amountOfWrongAnswers.addEventListener('click', () => showList(wrongAnswersList));
  document.body.appendChild(resultEl);
  document.body.style.overflow = 'hidden';
  addListItemAndListers(levelOptions.userRightAnswers, rightAnswersList);
  addListItemAndListers(levelOptions.userWrongAnswers, wrongAnswersList);
}
