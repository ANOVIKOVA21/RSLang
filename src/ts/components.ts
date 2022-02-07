export function getHomeComponent(): string {
  const startPageTemp = document.getElementById('start-page') as HTMLTemplateElement;
  return startPageTemp.innerHTML;
}

export function getBookComponent(): string {
  const bookPageTemp = document.getElementById('book-page') as HTMLTemplateElement;
  return bookPageTemp.innerHTML;
}

export function getSprintComponent(): string {
  const sprintPageTemp = document.getElementById('sprint-page') as HTMLTemplateElement;
  return sprintPageTemp.innerHTML;
}
export function getAudioCallComponent(): string {
  const audioCallTemp = document.getElementById('audio-call-page') as HTMLTemplateElement;
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
