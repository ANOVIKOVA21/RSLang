import { showWarning } from './general-functions';
import { getUserInfo, redirectToAuthorization, saveUserInfo } from './user';
const url = 'https://anna-learnenglish.herokuapp.com';
const urlWords = url + '/words';
const urlUsers = url + '/users';
const urlSignIn = url + '/signin';

export interface GetWordsData {
  id?: string;
  _id?: string;
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
  userWord?: GetWordInfo;
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
  newWord: string;
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
  debugger;
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
    console.log(newUserInfo);
    saveUserInfo(newUserInfo);
    // localStorage.setItem('user', JSON.stringify(newUserInfo));
  } else if (result.status === 401) redirectToAuthorization();
}
export async function createUserWord(wordId: string, wordInfo: GetWordInfo) {
  debugger;
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wordInfo),
  });
  if (result.status === 200) {
    const content = await result.json();
    delete content.id;
    delete content.wordId;
    return content;
  } else if (result.status === 401) GetNewUserTokens();
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
  if (result.status === 200) return result.json();
  else if (result.status === 401) GetNewUserTokens();
}
export async function getUserWord(wordId: string, wordInfo?: GetWordInfo) {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
    },
  });
  if (result.status === 200) {
    const content = await result.json();
    delete content.id;
    delete content.wordId;
    return content;
  } else if (result.status === 404) {
    if (wordInfo) return createUserWord(wordId, wordInfo);
  } else if (result.status === 401) GetNewUserTokens();
}
export async function updateUserWord(wordId: string, wordInfo: GetWordInfo) {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  const result = await fetch(`${urlUsers}/${userInfo.userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wordInfo),
  });
  const content = await result.json();
  console.log(content);
  if (result.status === 401) GetNewUserTokens();
  else if (result.status === 404) createUserWord(wordId, wordInfo);
}
export async function getAggregatedWords(group: number, page: number) {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  let filter;
  if (group === 6) filter = { $or: [{ 'userWord.difficulty': 'difficult' }] };
  else filter = { $and: [{ page: page }, { group: group }] };
  const result = await fetch(
    `${urlUsers}/${userInfo.userId}/aggregatedWords?filter=${JSON.stringify(filter)}&wordsPerPage=20`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        Accept: 'application/json',
      },
    }
  );
  if (result.status === 200) return result.json();
  else if (result.status === 401) GetNewUserTokens();
}
