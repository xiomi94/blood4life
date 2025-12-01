import axios from 'axios';
import { API_URL } from '../config';
import axiosInstance from "../utils/axiosInstance.ts";

export interface LoginResponse {
  status: string;
  message: string;
}

export const authService = {
  login: async (email: string, password: string, type: 'bloodDonor' | 'hospital' | 'admin') => {
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
  registerHospital: async (hospitalData: FormData) => {
    const response = await axios.post(`${API_URL}/auth/hospital/register`, hospitalData);
    return response.data;
  },

  registerBloodDonor: (submitData: FormData) => {
    return axiosInstance.post(
      `/auth/bloodDonor/register`,
      submitData,
      { withCredentials: false }
    );
  }
};
