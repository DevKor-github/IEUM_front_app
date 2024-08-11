import axios from 'axios';
export const API_URL = 'https://api.ieum.devkor.club/';

/* axios 공통 config */
export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

// /* baseAPI 정의 */
// const baseAPI = {
//   get: (url: string, data?: any) => API.get(url, data),
//   post: (url: string, data?: any) => API.post(url, data),
//   put: (url: string, data?: any) => API.put(url, data),
//   delete: (url: string, data?: any) => API.delete(url, data),
// };

// export default baseAPI;
