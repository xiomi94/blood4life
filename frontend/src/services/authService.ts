import axiosInstance from "../utils/axiosInstance.ts";

export interface LoginResponse {
  status: string;
  message: string;
}

export const authService = {
  login: async (email: string, password: string, type: 'bloodDonor' | 'hospital' | 'admin') => {
    const credentials = btoa(`${email}:${password}`);

    // Use axiosInstance but overwrite Authorization header
    // If axiosInstance injects Bearer, this per-call configuration should take precedence.
    const response = await axiosInstance.post<LoginResponse>(
      `/auth/${type}/login`,
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
    // Use axiosInstance
    const response = await axiosInstance.post(`/auth/hospital/register`, hospitalData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  registerBloodDonor: async (submitData: FormData) => {
    const response = await axiosInstance.post(`/auth/bloodDonor/register`, submitData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
