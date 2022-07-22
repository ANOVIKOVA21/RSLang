import { GetNewUserTokens } from './request';
import { parseJwt } from './general-functions';
interface GetUserInfo {
  exp?: number;
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
export function getUserInfo() {
  const value = localStorage.getItem('user');
  let user: GetUserInfo;
  if (typeof value === 'string') {
    user = JSON.parse(value);
    return user;
  }
}
export async function checkTokens() {
  const userInfo = getUserInfo();
  if (!userInfo) return;
  if (!userInfo.exp) return;
  const expDate = new Date(userInfo.exp * 1000);
  const now = new Date(Date.now());
  if (now >= expDate) await GetNewUserTokens();
}
export function redirectToAuthorization() {
  // debugger;
  localStorage.removeItem('user');
  (document.querySelector('.header__logo') as HTMLElement).click();
  (document.querySelector('.header__sign-in') as HTMLElement).click();
}
export function saveUserInfo(user: GetUserInfo) {
  const decoded = parseJwt(user.token);
  user.exp = decoded.exp;
  localStorage.setItem('user', JSON.stringify(user));
  location.reload();
}
