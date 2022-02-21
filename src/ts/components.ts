import { renderBookPage } from './book';
// import { options } from './options';

export function getHomeComponent(): string {
  const startPageTemp = document.getElementById('start-page') as HTMLTemplateElement;
  return startPageTemp.innerHTML;
}

export async function getBookComponent(path: string) {
  const bookGroup = Number(path.slice(-3, -2));
  const bookPage = Number(path.slice(-1));
  const bookPageTemp = await renderBookPage(bookGroup, bookPage);
  return bookPageTemp.innerHTML;
}

export function getSprintComponent(path: string): string {
  const sprintPageTemp = document.getElementById('sprint-page') as HTMLTemplateElement;
  if (path.includes('levels=false')) {
    sprintPageTemp.content.querySelector('select')?.remove();
  }
  return sprintPageTemp.innerHTML;
}
export function getAudioCallComponent(path: string): string {
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
