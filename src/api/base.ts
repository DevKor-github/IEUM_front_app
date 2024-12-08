import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Alert} from 'react-native';
export const API_URL = 'https://dev.api.ieum.devkor.club/';

/* axios 공통 config */
export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // timeout: 10000, // 10초 대기
});

// Request interceptor to add the access token to every request
API.interceptors.request.use(
  async config => {
    // Retrieve the token from secure storage
    // const token = await AsyncStorage.getItem('accessToken'); // todo 추후 변경
    if (config.headers.Authorization) return config;
    const accessToken = await EncryptedStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    // Handle the error
    return Promise.reject(error);
  },
);

// Response 인터셉터 추가
API.interceptors.response.use(
  response => {
    // 응답 데이터를 변환합니다.
    return response;
  },
  error => {
    // 에러를 그대로 전달합니다.
    const {status, data} = error.response;
    // Alert.alert('오류', data.message);
    return Promise.reject(error);
  },
);
