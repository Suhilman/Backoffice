import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const LOGIN_URL = `${API_URL}/api/v1/auth/login`;
export const LOGIN_STAFF_URL = `${API_URL}/api/v1/auth/staff/login`;
export const REGISTER_URL = `${API_URL}/api/v1/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/v1/forget-password`;
export const ME_URL = `${API_URL}/api/v1/business`;
export const LOGOUT_OWNER = `${API_URL}/api/v1/auth/logout`;
export const LOGOUT_STAFF = `${API_URL}/api/v1/auth/staff/logout`;

export function login(email, password, captcha) {
  return axios.post(LOGIN_URL, {
    email,
    password,
    "g-recaptcha-response": captcha
  });
}

export function loginStaff(staff_id, email, password, device) {
  return axios.post(LOGIN_STAFF_URL, {
    staff_id,
    email,
    password,
    device_id: device
  });
}

export function register(email, name, phone_number, password, captcha) {
  return axios.post(REGISTER_URL, {
    email,
    name,
    phone_number,
    password,
    "g-recaptcha-response": captcha
  });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  const { business_id } = JSON.parse(localStorage.getItem("user_info"));
  return axios.get(`${ME_URL}/${business_id}`);
}

export function logout() {
  const { privileges } = JSON.parse(localStorage.getItem("user_info"));
  const user = privileges ? "staff" : "owner";

  if (user === "staff") {
    return axios.post(`${LOGOUT_STAFF}`);
  } else {
    return axios.post(`${LOGOUT_OWNER}`);
  }
}
