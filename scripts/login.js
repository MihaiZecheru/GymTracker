import { addCookie, getCookie, deleteCookie } from './cookies.js';

export function check_login() {
  const login_cookie = getCookie('login');
  if (!login_cookie) window.location.href = '/login';
}
export function logout() {
  deleteCookie('login');
  if (window.location.href != '/login')
    window.location.href = '/login';
}

export function login(username) {
  addCookie('login', username);
}