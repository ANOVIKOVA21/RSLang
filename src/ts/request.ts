import { showWarning } from './general-functions';
const url = 'https://anna-learnenglish.herokuapp.com';
const urlWords = url + '/words';
const urlUsers = url + '/users';
const urlSignIn = url + '/signin';

export interface GetWordsData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}
export interface GetUser {
  name?: string;
  email: string;
  password: string;
}
export async function getWords(group: number, page: number): Promise<GetWordsData[]> {
  const result = await fetch(`${urlWords}?group=${group}&page=${page}`);
  return result.json();
}
export async function createUser(user: GetUser) {
  const result = await fetch(`${urlUsers}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (result.status === 200) return result.json();
  else if (result.status === 417) showWarning('Пользователь с таким email уже существует!');
  else showWarning('Ошибка! Проверьте email или пароль');
}
export async function signIn(user: GetUser) {
  const result = await fetch(`${urlSignIn}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  console.log('sign in promise', result);
  if (result.status === 200) return result.json();
  else if (result.status === 403) showWarning('Неправильный email или пароль!');
  else showWarning('Ошибка! Проверьте email или пароль');
}
export async function deleteUser(id: string) {
  const user = JSON.parse(localStorage.getItem('user') || '');
  const token = user.token;
  const result = await fetch(`${urlUsers}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  // console.log('delete in promise', result);
  if (result.status === 204) console.log('user deleted');
  else console.log('Ошибка!');
}
