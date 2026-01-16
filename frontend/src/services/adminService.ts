import axiosInstance from '../utils/axiosInstance';
import type { Campaign, Appointment } from '../types/common.types';
import type { BloodDonor } from '../models/BloodDonor';
import type { Hospital } from '../models/Hospital';

// Re-export types for convenience
export type { BloodDonor, Hospital, Appointment, Campaign };

/**
 * Nota: Reutilizamos tipos de common.types y models donde sea posible
 * para evitar duplicación
 */

/**
 * Estado de una cita (específico para admin)
 */
export interface AppointmentStatus {
  id: number;
  status: string;
}

/**
 * Cita completa con información del donante (para admin)
 */
export interface AdminAppointment {
  id: number;
  appointmentStatus: AppointmentStatus;
  campaignId: number;
  campaignName: string;
  bloodDonorId: number;
  bloodDonor: any; // Tipo complejo del donante
  hospitalComment?: string;
  dateAppointment: string;
  hourAppointment: string;
}

/**
 * Endpoints del servicio de administración
 */
const ADMIN_ENDPOINTS = {
  // Blood Donors
  GET_BLOOD_DONORS: '/admin/blood-donors',
  UPDATE_BLOOD_DONOR: (id: number) => `/admin/blood-donors/${id}`,
  DELETE_BLOOD_DONOR: (id: number) => `/admin/blood-donors/${id}`,

  // Hospitals
  GET_HOSPITALS: '/admin/hospitals',
  UPDATE_HOSPITAL: (id: number) => `/admin/hospitals/${id}`,
  DELETE_HOSPITAL: (id: number) => `/admin/hospitals/${id}`,

  // Appointments
  GET_APPOINTMENTS: '/admin/appointments',
  UPDATE_APPOINTMENT: (id: number) => `/admin/appointments/${id}`,
  DELETE_APPOINTMENT: (id: number) => `/admin/appointments/${id}`,
  GET_APPOINTMENT_STATUSES: '/admin/appointment-statuses',

  // Campaigns
  GET_CAMPAIGNS: '/admin/campaigns',
  UPDATE_CAMPAIGN: (id: number) => `/admin/campaigns/${id}`,
  DELETE_CAMPAIGN: (id: number) => `/admin/campaigns/${id}`,
} as const;

/**
 * Servicio de administración
 * Maneja todas las operaciones CRUD del panel de administración
 */
export const adminService = {
  // ====================================
  // Blood Donors
  // ====================================

  /**
   * Obtiene todos los donantes de sangre
   */
  async getBloodDonors(): Promise<any[]> {
    const response = await axiosInstance.get<any[]>(ADMIN_ENDPOINTS.GET_BLOOD_DONORS);
    return response.data;
  },

  /**
   * Actualiza un donante de sangre
   */
  async updateBloodDonor(id: number, data: Partial<any>): Promise<any> {
    const response = await axiosInstance.put<any>(
      ADMIN_ENDPOINTS.UPDATE_BLOOD_DONOR(id),
      data
    );
    return response.data;
  },

  /**
   * Elimina un donante de sangre
   */
  async deleteBloodDonor(id: number): Promise<void> {
    await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_BLOOD_DONOR(id));
  },

  // ====================================
  // Hospitals
  // ====================================

  /**
   * Obtiene todos los hospitales
   */
  async getHospitals(): Promise<any[]> {
    const response = await axiosInstance.get<any[]>(ADMIN_ENDPOINTS.GET_HOSPITALS);
    return response.data;
  },

  /**
   * Actualiza un hospital
   */
  async updateHospital(id: number, data: Partial<any>): Promise<any> {
    const response = await axiosInstance.put<any>(
      ADMIN_ENDPOINTS.UPDATE_HOSPITAL(id),
      data
    );
    return response.data;
  },

  /**
   * Elimina un hospital
   */
  async deleteHospital(id: number): Promise<void> {
    await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_HOSPITAL(id));
  },

  // ====================================
  // Appointments
  // ====================================

  /**
   * Obtiene todas las citas
   */
  async getAppointments(): Promise<AdminAppointment[]> {
    const response = await axiosInstance.get<AdminAppointment[]>(ADMIN_ENDPOINTS.GET_APPOINTMENTS);
    return response.data;
  },

  /**
   * Actualiza una cita
   */
  async updateAppointment(id: number, data: Partial<AdminAppointment>): Promise<AdminAppointment> {
    const response = await axiosInstance.put<AdminAppointment>(
      ADMIN_ENDPOINTS.UPDATE_APPOINTMENT(id),
      data
    );
    return response.data;
  },

  /**
   * Elimina una cita
   */
  async deleteAppointment(id: number): Promise<void> {
    await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_APPOINTMENT(id));
  },

  /**
   * Obtiene todos los estados posibles de citas
   */
  async getAppointmentStatuses(): Promise<AppointmentStatus[]> {
    const response = await axiosInstance.get<AppointmentStatus[]>(
      ADMIN_ENDPOINTS.GET_APPOINTMENT_STATUSES
    );
    return response.data;
  },

  // ====================================
  // Campaigns
  // ====================================

  /**
   * Obtiene todas las campañas
   */
  async getCampaigns(): Promise<any[]> {
    const response = await axiosInstance.get<any[]>(ADMIN_ENDPOINTS.GET_CAMPAIGNS);
    return response.data;
  },

  /**
   * Actualiza una campaña
   */
  async updateCampaign(id: number, data: Partial<any>): Promise<any> {
    const response = await axiosInstance.put<any>(
      ADMIN_ENDPOINTS.UPDATE_CAMPAIGN(id),
      data
    );
    return response.data;
  },

  /**
   * Elimina una campaña
   */
  async deleteCampaign(id: number): Promise<void> {
    await axiosInstance.delete(ADMIN_ENDPOINTS.DELETE_CAMPAIGN(id));
  }
};
