import axiosInstance from '../utils/axiosInstance';
import type { BloodDonor } from "../models/BloodDonor.ts";

/**
 * Endpoints del servicio de donantes
 */
const BLOOD_DONOR_ENDPOINTS = {
  GET_ALL: '/bloodDonor',
  CREATE: '/bloodDonor',
  UPDATE: (id: number) => `/bloodDonor/${id}`,
  DELETE: (id: number) => `/bloodDonor/${id}`,
} as const;

/**
 * Servicio de donantes de sangre
 * Maneja operaciones CRUD para donantes
 */
export const bloodDonorService = {
  /**
   * Obtiene todos los donantes de sangre
   */
  getAll: async (): Promise<BloodDonor[]> => {
    const response = await axiosInstance.get<BloodDonor[]>(BLOOD_DONOR_ENDPOINTS.GET_ALL);
    return response.data;
  },

  /**
   * Crea un nuevo donante
   */
  create: async (bloodDonor: BloodDonor): Promise<BloodDonor> => {
    const response = await axiosInstance.post<BloodDonor>(
      BLOOD_DONOR_ENDPOINTS.CREATE,
      bloodDonor
    );
    return response.data;
  },

  /**
   * Actualiza un donante existente
   */
  update: async (id: number, data: BloodDonor): Promise<BloodDonor> => {
    const response = await axiosInstance.put<BloodDonor>(
      BLOOD_DONOR_ENDPOINTS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Elimina un donante
   */
  delete: async (id: number): Promise<{ status: string }> => {
    const response = await axiosInstance.delete<{ status: string }>(
      BLOOD_DONOR_ENDPOINTS.DELETE(id)
    );
    return response.data;
  }
};
