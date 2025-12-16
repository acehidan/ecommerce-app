import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUserProfile } from './user/userProfile';

const API_BASE_URL = 'https://api.komindiystore.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await clearUserProfile();
      } catch (clearError) {
        console.error('Error clearing user profile on 401:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
