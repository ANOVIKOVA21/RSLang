import { showWarning } from './general-functions';
import { getUserInfo, redirectToAuthorization } from './user';
const url = 'https://anna-learnenglish.herokuapp.com';
const urlWords = url + '/words';
const urlUsers = url + '/users';
const urlSignIn = url + '/signin';
// const value = localStorage.getItem('user');
// let user;
// if (typeof value === 'string') {
//   user = JSON.parse(value);
// }

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
export interface GetWordInfo {
  difficulty: string;
  optional: GetWordOptional;
}
interface GetWordOptional {
  newWord: boolean;
  rightAnswers: number;
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
  const userInfo = JSON.parse(localStorage.getItem('user') || '');
  const token = userInfo.token;
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
export async function GetNewUserTokens() {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/tokens`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userInfo.refreshToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  console.log('sign in promise', result);
  if (result.status === 200) {
    const newUserInfo = await result.json();
    localStorage.setItem('user', JSON.stringify(newUserInfo));
  } else if (result.status === 401) redirectToAuthorization();
}
export async function createUserWord(wordId: string, word: GetWordInfo) {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
  const content = await result.json();
  if (result.status === 404) GetNewUserTokens();
  console.log(content);
}
export async function getUserWords() {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
    },
  });
  const content = await result.json();

  console.log(content);
}
export async function getUserWord(wordId: string) {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
    },
  });
  const content = await result.json();

  console.log(content);
  if (result.status === 200) return result.json();
  else if (result.status === 404) return;
}
export async function UpdateUserWord(wordId: string, word: GetWordInfo) {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
  const content = await result.json();

  console.log(content);
}
