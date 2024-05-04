import { deleteCookie } from 'undici-types';
import { addCookie, getCookie } from './cookies.js';

export function check_login() {
  const login_cookie = getCookie('login');
  if (!login_cookie) window.location.href = '/login';
}
export function logout() {
  deleteCookie('login');
  window.location.href = '/login';
}

export function login(username) {
  addCookie('login', username);
}