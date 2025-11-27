import axiosInstance from '../utils/axiosInstance';
import type { BloodDonor } from "../models/BloodDonor.ts";

export const bloodDonorService = {

  getAll: () => {
    return axiosInstance.get<BloodDonor[]>('/bloodDonor')
  },
  delete: (id: number) => {
    return axiosInstance.delete<{ status: string }>(`/bloodDonor/${id}`)
  },
  create: (bloodDonor: BloodDonor) => {
    return axiosInstance.post<BloodDonor>('/bloodDonor', bloodDonor)
  },
  update: (id: number, data: BloodDonor) => {
    return axiosInstance.put(`/bloodDonor/${id}`, data);
  }

}