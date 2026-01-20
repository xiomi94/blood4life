import axios from 'axios';
import { API_URL } from '../config';
import { tokenStorage } from './tokenStorage';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: This allows cookies to be sent with requests
  maxRedirects: 0, // Don't follow redirects - treat them as errors
});

// Request interceptor para agregar el JWT token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();

    // Si existe token y la petición no es de login, agregar header Authorization
    if (token && !config.url?.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos 401, limpiar el token (sesión expirada)
    if (error.response?.status === 401) {
      tokenStorage.remove();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
