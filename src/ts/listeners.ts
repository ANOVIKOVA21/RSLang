import { options, levelOptions } from './options';
import { getLevelData, getAudio, startSprint, startAudioCall, startTimer, checkRightAnswers, setScore } from './game';
import { shuffle } from './general-functions';
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
      const audio = getAudio(link);
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
  const audioCallRulesEl = document.querySelector('.audiocall-rules') as HTMLElement;
  const audioCallGameEl = document.querySelector('.audiocall-game') as HTMLElement;
  const audioCallSelect = document.querySelector('.audiocall-rules__select') as HTMLSelectElement;
  const audioCallStartBtn = document.querySelector('.start-audiocall-btn');
  const listenBtn = document.querySelector('.audiocall-game__listen') as HTMLButtonElement;
  const audioCallAnswerBtnsContainer = document.querySelector('.audiocall-game__options');
  const skipBtn = document.querySelector('.skip-btn') as HTMLButtonElement;
  const optionsTranslationBtns = document.querySelectorAll<HTMLLIElement>('.audiocall-game__option');

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
      levelOptions.words = await getLevelData(6, Number(sprintSelect.value));
    } else {
      levelOptions.words = await getLevelData(6, options.currentBookGroup, options.currentBookPage);
    }
    startSprint(levelOptions.words);
    startTimer();
    sprintGameEl?.focus();
  });
  sprintGameEl?.addEventListener('keydown', (ev) => {
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
    startSprint(levelOptions.words);
  });
  audioCallStartBtn?.addEventListener('click', async () => {
    audioCallRulesEl.style.display = 'none';
    audioCallGameEl.style.display = 'flex';
    footer.style.display = 'none';
    if (audioCallSelect) {
      const wordsArr = await getLevelData(6, Number(audioCallSelect.value));
      levelOptions.words = shuffle(wordsArr);
    } else {
      const wordsArr = await getLevelData(3, options.currentBookGroup, options.currentBookPage);
      const firstPart = shuffle(wordsArr.slice(0, 20));
      const secondPart = wordsArr.slice(20);
      levelOptions.words = firstPart.concat(secondPart);
    }
    startAudioCall(levelOptions.words);
    audioCallGameEl?.focus();
  });
  listenBtn?.addEventListener('click', () => {
    const audio = getAudio(listenBtn.dataset.audio || '');
    audio.play();
  });
  audioCallAnswerBtnsContainer?.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement;
    if (target.tagName != 'LI') return;
    optionsTranslationBtns.forEach((btn) => (btn.style.pointerEvents = 'none'));
    skipBtn.innerHTML = '🠖';
    if (target.innerHTML === levelOptions.rightAnswer) {
      target.classList.add('audiocall-game__right-answer');
      levelOptions.userRightAnswers.push({ id: levelOptions.currentWordId, questionNum: levelOptions.questionNum - 1 });
    } else {
      target.classList.add('audiocall-game__wrong-answer');
      optionsTranslationBtns.forEach((btn) => {
        if (btn.innerHTML === levelOptions.rightAnswer) btn.classList.add('audiocall-game__right-answer');
      });
      levelOptions.userWrongAnswers.push({ id: levelOptions.currentWordId, questionNum: levelOptions.questionNum - 1 });
    }
  });
  skipBtn?.addEventListener('click', () => {
    if (skipBtn.innerHTML === 'Не знаю') {
      skipBtn.innerHTML = '🠖';
      optionsTranslationBtns.forEach((btn) => {
        btn.style.pointerEvents = 'none';
        if (btn.innerHTML === levelOptions.rightAnswer) btn.classList.add('audiocall-game__right-answer');
      });
      levelOptions.userWrongAnswers.push({ id: levelOptions.currentWordId, questionNum: levelOptions.questionNum - 1 });
    } else {
      skipBtn.innerHTML = 'Не знаю';
      optionsTranslationBtns.forEach((btn) => {
        btn.classList.remove('audiocall-game__right-answer');
        btn.classList.remove('audiocall-game__wrong-answer');
        btn.style.pointerEvents = 'auto';
      });
      startAudioCall(levelOptions.words);
    }
  });
  audioCallGameEl?.addEventListener('keydown', (ev) => {
    if (ev.key === '1') optionsTranslationBtns[0].click();
    if (ev.key === '2') optionsTranslationBtns[1].click();
    if (ev.key === '3') optionsTranslationBtns[2].click();
    if (ev.key === '4') optionsTranslationBtns[3].click();
    if (ev.key === '5') optionsTranslationBtns[4].click();
    if (ev.key === ' ') {
      if (document.hasFocus() === false) skipBtn.focus();
      skipBtn.click();
      if (document.hasFocus()) {
        skipBtn.blur();
        audioCallGameEl.focus();
      }
    }
    if (ev.key === 'Enter') {
      ev.preventDefault();
      listenBtn.click();
    }
  });
}
export function addAuthorizationListeners() {
  debugger;
  const authorization = document.querySelector('.authorization') as HTMLElement;
  const signInBtn = document.querySelector('.header__sign-in');
  const closeBtn = document.querySelector('.authorization__close');
  const authorizationBtn = document.querySelector('.authorization__sign-in');
  const userName = document.getElementById('user-name') as HTMLInputElement;
  const email = document.getElementById('email') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;
  signInBtn?.addEventListener('click', () => {
    authorization.style.display = 'flex';
  });
  closeBtn?.addEventListener('click', () => {
    authorization.style.display = 'none';
  });
  authorizationBtn?.addEventListener('click', (ev) => {
    if (!userName.validity.valid || !email.validity.valid || !password.validity.valid) return;
    ev.preventDefault();
    console.log('valid');
    // console.log('email', email.validity.valid);
    // console.log('password valid', password.validity.valid);
    // console.log('password', password.value);
  });
}
