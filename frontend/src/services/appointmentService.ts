import axiosInstance from '../utils/axiosInstance';

export interface AppointmentStatus {
  id: number;
  name: string;
}

export interface Appointment {
  id: number;
  appointmentStatus: AppointmentStatus;
  campaignId: number;
  bloodDonorId: number;
  hospitalComment?: string;
  dateAppointment: string;
  hourAppointment?: string;
}

export interface AppointmentWithDonor extends Appointment {
  bloodDonor?: {
    id: number;
    firstName: string;
    lastName: string;
    bloodType: string;
    dni: string;
  };
}

export const appointmentService = {
  getAppointmentsByDonor: async (donorId: number): Promise<Appointment[]> => {
    const response = await axiosInstance.get(`/appointment/donor/${donorId}`);
    return response.data;
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await axiosInstance.get('/appointment/all');
    return response.data;
  },

  getTodayAppointmentsByHospital: async (hospitalId: number): Promise<AppointmentWithDonor[]> => {
    const response = await axiosInstance.get(`/appointment/hospital/${hospitalId}/today`);
    return response.data;
  },

  createAppointment: async (appointment: Partial<Appointment>): Promise<Appointment> => {
    const response = await axiosInstance.post('/appointment/create', appointment);
    return response.data;
  }
};
