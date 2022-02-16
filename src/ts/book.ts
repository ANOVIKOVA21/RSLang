import { getWords } from './request';
import { addWordsListeners } from './listeners';

export async function setWords(group = 0, page = 0) {
  const wordsDatas = await getWords(group, page);
  const parent = document.querySelector('.words-list');
  const wordCardTemp = document.getElementById('word-card-temp') as HTMLTemplateElement;
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
    parent?.appendChild(wordCard);
    const audio: string[] = [data.audio, data.audioMeaning, data.audioExample];
    wordBtnsContainer?.addEventListener('click', (ev) => addWordsListeners(ev, audio));
  });
}
