import axios from 'axios';
import { API_URL } from '../config';

export interface BloodDonor {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  bloodType?: {
    id: number;
    bloodType: string;
  };
}

export interface Hospital {
  id: number;
  cif: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export const adminService = {
  // Blood Donors
  async getBloodDonors(): Promise<BloodDonor[]> {
    const response = await axios.get(`${API_URL}/admin/blood-donors`, { withCredentials: true });
    return response.data;
  },

  async updateBloodDonor(id: number, data: Partial<BloodDonor>): Promise<BloodDonor> {
    const response = await axios.put(`${API_URL}/admin/blood-donors/${id}`, data, { withCredentials: true });
    return response.data;
  },

  async deleteBloodDonor(id: number): Promise<void> {
    await axios.delete(`${API_URL}/admin/blood-donors/${id}`, { withCredentials: true });
  },

  // Hospitals
  async getHospitals(): Promise<Hospital[]> {
    const response = await axios.get(`${API_URL}/admin/hospitals`, { withCredentials: true });
    return response.data;
  },

  async updateHospital(id: number, data: Partial<Hospital>): Promise<Hospital> {
    const response = await axios.put(`${API_URL}/admin/hospitals/${id}`, data, { withCredentials: true });
    return response.data;
  },

  async deleteHospital(id: number): Promise<void> {
    await axios.delete(`${API_URL}/admin/hospitals/${id}`, { withCredentials: true });
  }
};
