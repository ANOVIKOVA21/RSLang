import { renderBookPage } from './book';

const signInBtn = document.querySelector('.header__sign-in') as HTMLButtonElement;
export function getHomeComponent(): string {
  signInBtn.style.display = 'block';
  const startPageTemp = document.getElementById('start-page') as HTMLTemplateElement;
  return startPageTemp.innerHTML;
}

export async function getBookComponent(path: string) {
  signInBtn.style.display = 'none';
  const bookGroup = Number(path.slice(-3, -2));
  const bookPage = Number(path.slice(-1));
  const bookPageTemp = await renderBookPage(bookGroup, bookPage);
  return bookPageTemp.innerHTML;
}

export function getSprintComponent(path: string): string {
  signInBtn.style.display = 'none';
  const sprintPageTemp = document.getElementById('sprint-page') as HTMLTemplateElement;
  if (path.includes('levels=false')) {
    sprintPageTemp.content.querySelector('select')?.remove();
  }
  return sprintPageTemp.innerHTML;
}
export function getAudioCallComponent(path: string): string {
  signInBtn.style.display = 'none';
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
