import { GetWordsData } from './request';
export function getRandomNum(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getArrRandomNumbers(arrLength: number, maxNum: number, exception?: number) {
  const numbers: number[] = [];
  for (let i = 0; i < 100; i++) {
    if (numbers.length === arrLength) break;
    const randomNum = getRandomNum(0, maxNum);

    if (randomNum != exception && !numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return numbers;
}

export function shuffle(arr: GetWordsData[]) {
  return arr.sort(() => Math.random() - 0.5);
}

export function showWarning(warning: string) {
  const formContainer = document.querySelector('.authorization__form') as HTMLFieldSetElement;
  const warningEl = document.createElement('div');
  warningEl.classList.add('warning');
  warningEl.textContent = warning;
  formContainer.appendChild(warningEl);
  setTimeout(() => {
    warningEl.remove();
  }, 5000);
}
export function showLoading(parent: HTMLElement, target: string) {
  const loadingContainer = document.createElement('div');
  loadingContainer.style.width = parent.clientWidth + 'px';
  loadingContainer.classList.add(`${target}-loading`);
  parent.appendChild(loadingContainer);
}
export function removeLoading(target: string) {
  const loadingContainer = document.querySelector(`.${target}-loading`) as HTMLDivElement;
  loadingContainer.remove();
}
export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}
export function showUserError(errorEl: HTMLParagraphElement, input: HTMLInputElement) {
  const validationMessage = input.validationMessage;
  errorEl.innerHTML = validationMessage;
  if (!validationMessage) input.style.border = '2px solid #1cd91c';
  else input.style.border = '2px solid red';
}
