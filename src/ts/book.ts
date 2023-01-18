import { getWords, getAggregatedWords } from './request';
// , updateUserWord
import { options } from './options';
import { GetWordsData } from './request';

async function renderWordCards(wordCardTemp: HTMLTemplateElement, wordsData: GetWordsData[], parent: HTMLDivElement) {
  for (const data of wordsData) {
    const wordCardFragment = wordCardTemp.content.cloneNode(true) as DocumentFragment;
    const wordCard = wordCardFragment.querySelector('.word-card') as HTMLDivElement;
    const wordImg = wordCardFragment.querySelector('.word-card__img') as HTMLDivElement;
    const wordTitle = wordCardFragment.querySelector('.word-card__title') as HTMLElement;
    const wordValues = wordCardFragment.querySelectorAll('.word-card__value p');
    const wordExamples = wordCardFragment.querySelectorAll('.word-card__example p');
    const wordBtnsContainer = wordCardFragment.querySelector('.word-card__btns');
    wordImg.style.backgroundImage = `url("https://anna-learnenglish.herokuapp.com/${data.image}")`;
    wordTitle.innerHTML = `${data.word} ${data.transcription} ${data.wordTranslate}`;
    wordValues[0].innerHTML = `${data.textMeaning}`;
    wordValues[1].innerHTML = `${data.textMeaningTranslate}`;
    wordExamples[0].innerHTML = `${data.textExample}`;
    wordExamples[1].innerHTML = `${data.textExampleTranslate}`;
    const audio: string[] = [data.audio, data.audioMeaning, data.audioExample];
    wordBtnsContainer?.setAttribute('data-audio', `${audio}`);
    parent.appendChild(wordCardFragment);
    if (data._id) wordCard.setAttribute('data-word-id', `${data._id}`);
    if (data.userWord !== undefined) {
      const answersInLineEl = wordCardFragment.querySelector('.word-card__answers-in-line');
      const amountOfAnswers = wordCard.querySelector('.word-card__amount-answers') as HTMLSpanElement;
      if (data.userWord.difficulty === 'difficult') {
        wordCard.classList.add('difficult');
        amountOfAnswers.innerHTML = '6';
      }
      if (data.userWord.difficulty === 'studied') wordCard.classList.add('studied');
      // if(data.userWord.optional.rightAnswers===Number(amountOfAnswers.innerHTML) ){
      //   updateUserWord
      //   wordCard.classList.add('studied')}
      if (answersInLineEl !== null) {
        answersInLineEl.textContent = `${data.userWord.optional.rightAnswers}`;
      }
    }
  }
}
export async function renderBookPage(group = 0, page = 0) {
  const wordsData = await getWords(group, page);
  const bookPageTemp = document.getElementById('book-page') as HTMLTemplateElement;
  const bookGroups = bookPageTemp.content.querySelectorAll('.book__section');
  const currentPageEl = bookPageTemp.content.querySelector('.book__curr-page') as HTMLSpanElement;
  const parent = bookPageTemp.content.querySelector('.words-list') as HTMLDivElement;
  const wordCardTemp = document.querySelector('#word-card-temp') as HTMLTemplateElement;
  bookGroups.forEach((bookGroup) => bookGroup.classList.remove('book__section_active'));
  bookGroups[group].classList.add('book__section_active');
  currentPageEl.innerHTML = `${page + 1}`;
  parent.innerHTML = '';
  await renderWordCards(wordCardTemp, wordsData, parent);
  options.currentBookGroup = group;
  options.currentBookPage = page;
  return bookPageTemp;
}
export async function renderUserBookPage(group = 0, page = 0) {
  const wordsData: GetWordsData[] = await getAggregatedWords(group, page);
  const bookPageTemp = document.getElementById('book-page') as HTMLTemplateElement;
  const groupList = bookPageTemp.content.querySelector('.book__sections') as HTMLUListElement;
  const currentPageEl = bookPageTemp.content.querySelector('.book__curr-page') as HTMLSpanElement;
  const navBtns = bookPageTemp.content.querySelector('.book__nav-btns') as HTMLDivElement;
  const parent = bookPageTemp.content.querySelector('.words-list') as HTMLDivElement;
  if (!bookPageTemp.content.querySelector('.book__section[data-group="' + 7 + '"]')) {
    const difficultGroup = '<li class="book__section" data-group="7"><a href="#/book/6/0">Сложные слова</a></li>';
    groupList.insertAdjacentHTML('beforeend', `${difficultGroup}`);
  }
  const bookGroups = bookPageTemp.content.querySelectorAll('.book__section');
  bookGroups.forEach((bookGroup) => bookGroup.classList.remove('book__section_active'));
  bookGroups[group].classList.add('book__section_active');
  currentPageEl.innerHTML = `${page + 1}`;
  parent.innerHTML = '';
  if (group === 6) {
    const wordCardDifficultTemp = document.querySelector('#word-card-difficult-temp') as HTMLTemplateElement;
    await renderWordCards(wordCardDifficultTemp, wordsData, parent);
    navBtns.style.display = 'none';
  } else {
    const wordCardUserTemp = document.querySelector('#word-card-user-temp') as HTMLTemplateElement;
    await renderWordCards(wordCardUserTemp, wordsData, parent);
    navBtns.style.display = 'flex';
  }
  options.currentBookGroup = group;
  options.currentBookPage = page;
  return bookPageTemp;
}
