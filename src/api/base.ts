import axios from 'axios';
export const API_URL = 'https://dev.api.ieum.devkor.club/';

/* axios 공통 config */
export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // timeout: 10000, // 10초 대기
});

// Response 인터셉터 추가
API.interceptors.response.use(
  response => {
    // 응답 데이터를 변환합니다.
    return response;
  },
  error => {
    // 에러를 그대로 전달합니다.
    return Promise.reject(error);
  },
);
