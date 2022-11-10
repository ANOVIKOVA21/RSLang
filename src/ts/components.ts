import { renderBookPage, renderUserBookPage } from './book';
import { showUser } from './listeners';
import { getUserInfo } from './user';

const signInBtn = document.querySelector('.header__sign-in') as HTMLButtonElement;
const userEl = document.querySelector('.header__user') as HTMLDivElement;
export function getHomeComponent(): string {
  const userData = getUserInfo();
  if (userData) {
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
  let bookPageTemp: HTMLTemplateElement;
  const userData = getUserInfo();
  if (userData) {
    if (bookGroup === 6) {
      bookPageTemp = await renderUserBookPage(bookGroup, bookPage);
    } else {
      bookPageTemp = await renderUserBookPage(bookGroup, bookPage);
    }
  } else {
    bookPageTemp = await renderBookPage(bookGroup, bookPage);
  }
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
