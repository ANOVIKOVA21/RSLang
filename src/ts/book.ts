import { getWords } from './request';
import { options } from './options';
export async function renderBookPage(group = 0, page = 0) {
  const wordsDatas = await getWords(group, page);
  const bookPageTemp = document.getElementById('book-page') as HTMLTemplateElement;
  const bookGroups = bookPageTemp.content.querySelectorAll('.book__section');
  const currentPageEl = bookPageTemp.content.querySelector('.book__curr-page') as HTMLSpanElement;
  const parent = bookPageTemp.content.querySelector('.words-list') as HTMLDivElement;
  const wordCardTemp = document.querySelector('#word-card-temp') as HTMLTemplateElement;
  bookGroups.forEach((bookGroup) => bookGroup.classList.remove('book__section_active'));
  bookGroups[group].classList.add('book__section_active');
  currentPageEl.innerHTML = `${page + 1}`;
  parent.innerHTML = '';
  wordsDatas.forEach((data) => {
    const wordCard = wordCardTemp.content.cloneNode(true) as HTMLDivElement;
    const wordImg = wordCard.querySelector('.word-card__img') as HTMLDivElement;
    const wordTitle = wordCard.querySelector('.word-card__title') as HTMLElement;
    const wordValues = wordCard.querySelectorAll('.word-card__value p');
    const wordExamples = wordCard.querySelectorAll('.word-card__example p');
    const wordBtnsContainer = wordCard.querySelector('.word-card__btns');
    wordImg.style.backgroundImage = `url("https://anna-learnenglish.herokuapp.com/${data.image}")`;
    wordTitle.innerHTML = `${data.word} ${data.transcription} ${data.wordTranslate}`;
    wordValues[0].innerHTML = `${data.textMeaning}`;
    wordValues[1].innerHTML = `${data.textMeaningTranslate}`;
    wordExamples[0].innerHTML = `${data.textExample}`;
    wordExamples[1].innerHTML = `${data.textExampleTranslate}`;
    parent.appendChild(wordCard);
    const audio: string[] = [data.audio, data.audioMeaning, data.audioExample];
    wordBtnsContainer?.setAttribute('data-audio', `${audio}`);
  });
  options.currentBookGroup = group;
  options.currentBookPage = page;
  console.log(options.currentBookGroup, options.currentBookPage);
  return bookPageTemp;
}
