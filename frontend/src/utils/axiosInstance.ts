import axios from 'axios';
import { API_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: This allows cookies to be sent with requests
  maxRedirects: 0, // Don't follow redirects - treat them as errors
});

// No request interceptor needed for token injection anymore!

export default axiosInstance;
