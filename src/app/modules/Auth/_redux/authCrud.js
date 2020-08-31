import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const LOGIN_URL = `${API_URL}/api/v1/auth/login`;
export const REGISTER_URL = `${API_URL}/api/v1/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/v1/auth/forgot-password`;
export const ME_URL = `${API_URL}/api/v1/business`;

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, name, phone_number, password) {
  return axios.post(REGISTER_URL, { email, name, phone_number, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  const { business_id } = JSON.parse(localStorage.getItem('user_info'));
  return axios.get(`${ME_URL}/${business_id}`);
}
