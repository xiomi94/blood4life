import axios from 'axios';
import { API_URL } from '../config';

export interface LoginResponse {
  status: string;
  message: string;
}

export const authService = {
  login: async (email: string, password: string, type: 'bloodDonor' | 'hospital') => {
    const credentials = btoa(`${email}:${password}`);
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/${type}/login`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        withCredentials: true // Important: Receive the cookie
      }
    );
    return response.data;
  },
};
