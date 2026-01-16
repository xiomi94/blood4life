import axiosInstance from '../utils/axiosInstance';

/**
 * Estado de una cita
 */
export interface AppointmentStatus {
  id: number;
  name: string;
}

/**
 * Cita básica
 */
export interface Appointment {
  id: number;
  appointmentStatus: AppointmentStatus;
  campaignId: number;
  bloodDonorId: number;
  hospitalComment?: string;
  dateAppointment: string;
  hourAppointment?: string;
}

/**
 * Cita con información del donante
 */
export interface AppointmentWithDonor extends Appointment {
  bloodDonor?: {
    id: number;
    firstName: string;
    lastName: string;
    bloodType: any;
    dni: string;
    email?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    imageName?: string;
  };
  donorCompletedAppointments?: number;
}

/**
 * Endpoints del servicio de citas
 */
const APPOINTMENT_ENDPOINTS = {
  GET_ALL: '/appointment/all',
  CREATE: '/appointment/create',
  DELETE: (appointmentId: number) => `/appointment/delete/${appointmentId}`,
  GET_BY_DONOR: (donorId: number) => `/appointment/donor/${donorId}`,
  GET_TODAY_BY_HOSPITAL: (hospitalId: number) => `/appointment/hospital/${hospitalId}/today`,
  GET_NEXT_BY_HOSPITAL: (hospitalId: number) => `/appointment/hospital/${hospitalId}/next`,
  GET_MONTHLY_DONATIONS: (hospitalId: number) => `/appointment/hospital/${hospitalId}/monthly-donations`,
} as const;

/**
 * Servicio de citas
 * Maneja operaciones relacionadas con citas médicas para donaciones
 */
export const appointmentService = {
  /**
   * Obtiene todas las citas de un donante
   */
  getAppointmentsByDonor: async (donorId: number): Promise<Appointment[]> => {
    const response = await axiosInstance.get<Appointment[]>(
      APPOINTMENT_ENDPOINTS.GET_BY_DONOR(donorId)
    );
    return response.data;
  },

  /**
   * Obtiene todas las citas del sistema
   */
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await axiosInstance.get<Appointment[]>(APPOINTMENT_ENDPOINTS.GET_ALL);
    return response.data;
  },

  /**
   * Obtiene las citas de hoy para un hospital específico
   */
  getTodayAppointmentsByHospital: async (hospitalId: number): Promise<AppointmentWithDonor[]> => {
    const response = await axiosInstance.get<AppointmentWithDonor[]>(
      APPOINTMENT_ENDPOINTS.GET_TODAY_BY_HOSPITAL(hospitalId)
    );
    return response.data;
  },

  /**
   * Obtiene la próxima cita de un hospital
   */
  getNextAppointment: async (hospitalId: number): Promise<AppointmentWithDonor> => {
    const response = await axiosInstance.get<AppointmentWithDonor>(
      APPOINTMENT_ENDPOINTS.GET_NEXT_BY_HOSPITAL(hospitalId)
    );
    return response.data;
  },

  /**
   * Crea una nueva cita
   */
  createAppointment: async (appointment: Partial<Appointment>): Promise<Appointment> => {
    const response = await axiosInstance.post<Appointment>(
      APPOINTMENT_ENDPOINTS.CREATE,
      appointment
    );
    return response.data;
  },

  /**
   * Obtiene el número de donaciones mensuales de un hospital
   */
  getMonthlyDonationsByHospital: async (hospitalId: number): Promise<number> => {
    const response = await axiosInstance.get<number>(
      APPOINTMENT_ENDPOINTS.GET_MONTHLY_DONATIONS(hospitalId)
    );
    return response.data;
  },

  /**
   * Elimina una cita
   */
  deleteAppointment: async (appointmentId: number): Promise<void> => {
    await axiosInstance.delete(
      APPOINTMENT_ENDPOINTS.DELETE(appointmentId)
    );
  }
};
