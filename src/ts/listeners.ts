import { options, levelOptions } from './options';
import { getLevelData, start, startTimer, checkRightAnswers, setScore } from './game';
export function updateNavigation(prevBtn: HTMLLinkElement, nextBtn: HTMLLinkElement) {
  const currentBookPage = Number(location.hash.slice(-1));
  const minCurrentPage = 0;
  if (currentBookPage === minCurrentPage) {
    prevBtn.disabled = true;
  }
  if (currentBookPage === options.totalPages) {
    nextBtn.disabled = true;
  }
  if (currentBookPage > minCurrentPage) {
    prevBtn.disabled = false;
  }
  if (currentBookPage < options.totalPages) {
    nextBtn.disabled = false;
  }
}
export function addWordsListeners(ev: Event, container: HTMLDivElement) {
  const target = ev.target as HTMLElement;
  if (target.tagName != 'BUTTON') return;
  const audioLinks = container.dataset.audio?.split(',');
  if (target.closest('.word-card__listen')) {
    const audioList: HTMLAudioElement[] = [];
    audioLinks?.forEach((link) => {
      const url = `https://anna-learnenglish.herokuapp.com/${link}`;
      const audio = new Audio(url);
      audio.load();
      audioList.push(audio);
    });

    audioList[0].play();
    audioList[0].onended = () => audioList[1].play();
    audioList[1].onended = () => audioList[2].play();
  }
  // if (target.closest('.word-card__difficult')) {
  // }
  // if (target.closest('.word-card__studied')) {
  // }
}
export function addListeners() {
  const bookBtnsContainer = document.querySelector('.book__nav-btns');
  const wordBtnsContainer = document.querySelectorAll<HTMLDivElement>('.word-card__btns');
  const sprintRulesEl = document.querySelector('.sprint-rules') as HTMLElement;
  const sprintGameEl = document.querySelector('.sprint-game') as HTMLElement;
  const sprintSelect = document.querySelector('.sprint-rules__select') as HTMLSelectElement;
  const sprintStartBtn = document.querySelector('.start-sprint-btn');
  const footer = document.querySelector('.footer') as HTMLElement;
  const sprintGameContainer = document.querySelector('.sprint-game__container') as HTMLDivElement;
  const sprintGameBtns = document.querySelector('.sprint-game__btns');
  //   const bookPrevPage = document.querySelector('.book__prev-page');
  //   const bookNextPage = document.querySelector('.book__next-page');

  bookBtnsContainer?.addEventListener('click', (ev) => {
    const target = ev.target as HTMLLinkElement;
    if (target.tagName != 'A') return;
    ev.preventDefault();
    const prevBtn = document.querySelector('.book__prev-page') as HTMLLinkElement;
    const nextBtn = document.querySelector('.book__next-page') as HTMLLinkElement;
    const group = Number(location.hash.slice(-3, -2));
    let page = Number(location.hash.slice(-1));
    if (target === prevBtn && page > 0) {
      page--;
    }
    if (target === nextBtn && page < options.totalPages - 1) {
      page++;
    }
    updateNavigation(prevBtn, nextBtn);
    target.href = `#/book/${group}/${page}`;
    location.hash = target.getAttribute('href') || '';
  });
  wordBtnsContainer.forEach((container) =>
    container.addEventListener('click', (ev) => addWordsListeners(ev, container))
  );
  sprintStartBtn?.addEventListener('click', async () => {
    sprintRulesEl.style.display = 'none';
    sprintGameEl.style.display = 'flex';
    footer.style.display = 'none';
    if (sprintSelect) {
      levelOptions.words = await getLevelData(Number(sprintSelect.value));
    } else {
      levelOptions.words = await getLevelData(options.currentBookGroup, options.currentBookPage);
    }
    start(levelOptions.words);
    startTimer();
    sprintGameEl?.focus();
  });
  sprintGameEl?.addEventListener('keydown', (ev) => {
    console.log(ev.key);
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    if (levelOptions.time === 0) return;
    const trueBtn = sprintGameEl.querySelector<HTMLElement>('.sprint-game__true-btn');
    const falseBtn = sprintGameEl.querySelector<HTMLElement>('.sprint-game__false-btn');
    if (ev.key === 'ArrowLeft') trueBtn?.click();
    if (ev.key === 'ArrowRight') falseBtn?.click();
  });
  sprintGameBtns?.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement;
    if (target.tagName != 'BUTTON') return;
    const trueBtn = target.closest('.sprint-game__true-btn');
    const falseBtn = target.closest('.sprint-game__false-btn');
    let rightBtn;
    if (levelOptions.programAnswer === levelOptions.rightAnswer) rightBtn = trueBtn;
    else rightBtn = falseBtn;
    if (target === rightBtn) {
      sprintGameContainer.style.border = '2px solid green';
      levelOptions.userRightAnswers.push({ id: levelOptions.currentWordId, questionNum: levelOptions.questionNum - 1 });
      levelOptions.rightAnswersInRow++;
      checkRightAnswers();
      setScore();
      setTimeout(() => (sprintGameContainer.style.border = '2px solid white'), 1000);
    } else {
      sprintGameContainer.style.border = '2px solid red';
      levelOptions.userWrongAnswers.push({ id: levelOptions.currentWordId, questionNum: levelOptions.questionNum - 1 });
      levelOptions.rightAnswersInRow = 0;
      checkRightAnswers();
      setTimeout(() => (sprintGameContainer.style.border = '2px solid white'), 1000);
    }
    start(levelOptions.words);
  });
}
