import axiosInstance from "../utils/axiosInstance.ts";
import { AUTH_ENDPOINTS, HEADERS } from '../constants/app.constants';
import { getLoginEndpoint } from '../utils/userTypeDetector';
import type { LoginResponse, UserType } from '../types/common.types';

export const authService = {
  login: async (email: string, password: string, type: UserType) => {
    const credentials = btoa(`${email}:${password}`);

    const response = await axiosInstance.post<LoginResponse>(
      getLoginEndpoint(type),
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        }
      }
    );
    return response.data;
  },

  registerHospital: async (hospitalData: FormData) => {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.HOSPITAL_REGISTER,
      hospitalData,
      { headers: HEADERS.MULTIPART_FORM_DATA }
    );
    return response.data;
  },

  registerBloodDonor: async (submitData: FormData) => {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.BLOOD_DONOR_REGISTER,
      submitData,
      { headers: HEADERS.MULTIPART_FORM_DATA }
    );
    return response.data;
  }
};
