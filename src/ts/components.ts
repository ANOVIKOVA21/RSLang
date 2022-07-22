import { renderBookPage } from './book';
import { showUser } from './listeners';

const signInBtn = document.querySelector('.header__sign-in') as HTMLButtonElement;
const userEl = document.querySelector('.header__user') as HTMLDivElement;
const value = localStorage.getItem('user');
export function getHomeComponent(): string {
  if (typeof value === 'string') {
    const userData = JSON.parse(value);
    showUser(userData.name);
    signInBtn.classList.add('hide');
  } else signInBtn.style.display = 'block';
  const startPageTemp = document.getElementById('start-page') as HTMLTemplateElement;
  return startPageTemp.innerHTML;
}

export async function getBookComponent(path: string) {
  signInBtn.style.display = 'none';
  userEl.style.display = 'none';
  const bookGroup = Number(path.slice(-3, -2));
  const bookPage = Number(path.slice(-1));
  let wordCardTemp;
  if (typeof value === 'string') wordCardTemp = document.querySelector('#word-card-user-temp') as HTMLTemplateElement;
  else wordCardTemp = document.querySelector('#word-card-temp') as HTMLTemplateElement;
  const bookPageTemp = await renderBookPage(wordCardTemp, bookGroup, bookPage);
  return bookPageTemp.innerHTML;
}

export function getSprintComponent(path: string): string {
  signInBtn.style.display = 'none';
  userEl.style.display = 'none';
  const sprintPageTemp = document.getElementById('sprint-page') as HTMLTemplateElement;
  if (path.includes('levels=false')) {
    sprintPageTemp.content.querySelector('select')?.remove();
  }
  return sprintPageTemp.innerHTML;
}
export function getAudioCallComponent(path: string): string {
  signInBtn.style.display = 'none';
  userEl.style.display = 'none';
  const audioCallTemp = document.getElementById('audiocall-page') as HTMLTemplateElement;
  if (path.includes('levels=false')) {
    audioCallTemp.content.querySelector('select')?.remove();
  }
  return audioCallTemp.innerHTML;
}
export function getErrorComponent(): string {
  return `
              <section class="error404">
                <h1>Error</h1>
                <p>Неправильный запрос</p>
              </section>
            `;
}
