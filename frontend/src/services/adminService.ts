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
    type: string;
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

export interface AppointmentStatus {
  id: number;
  status: string;
}

export interface Appointment {
  id: number;
  appointmentStatus: AppointmentStatus;
  campaignId: number;
  campaignName: string;
  bloodDonorId: number;
  bloodDonor: BloodDonor;
  hospitalComment?: string;
  dateAppointment: string;
  hourAppointment: string;
}

export interface Campaign {
  id: number;
  hospitalId: number;
  hospitalName: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  requiredDonorQuantity: number;
  requiredBloodType: string;
  currentDonorCount?: number;
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
  },

  // Appointments (Enrollments)
  async getAppointments(): Promise<Appointment[]> {
    const response = await axios.get(`${API_URL}/admin/appointments`, { withCredentials: true });
    return response.data;
  },

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await axios.put(`${API_URL}/admin/appointments/${id}`, data, { withCredentials: true });
    return response.data;
  },

  async deleteAppointment(id: number): Promise<void> {
    await axios.delete(`${API_URL}/admin/appointments/${id}`, { withCredentials: true });
  },

  async getAppointmentStatuses(): Promise<AppointmentStatus[]> {
    const response = await axios.get(`${API_URL}/admin/appointment-statuses`, { withCredentials: true });
    return response.data;
  },

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    const response = await axios.get(`${API_URL}/admin/campaigns`, { withCredentials: true });
    return response.data;
  },

  async updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign> {
    const response = await axios.put(`${API_URL}/admin/campaigns/${id}`, data, { withCredentials: true });
    return response.data;
  },

  async deleteCampaign(id: number): Promise<void> {
    await axios.delete(`${API_URL}/admin/campaigns/${id}`, { withCredentials: true });
  }
};
