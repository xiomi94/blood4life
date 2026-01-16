import axiosInstance from '../utils/axiosInstance';
import { logError } from '../utils/errorHandler';
import type { Hospital, HospitalFormData } from '../models/Hospital';

/**
 * Endpoints del servicio de hospitales
 */
const HOSPITAL_ENDPOINTS = {
  GET_ALL: '/hospital',
  CREATE: '/hospital',
  UPDATE: '/hospital',
  DELETE: (id: number) => `/hospital/${id}`,
} as const;

/**
 * Servicio de hospitales
 * Maneja operaciones CRUD para hospitales
 */
export const hospitalService = {
  /**
   * Obtiene todos los hospitales
   * Maneja diferentes formatos de respuesta del servidor
   */
  async getHospitales(): Promise<Hospital[]> {
    try {
      const response = await axiosInstance.get<Hospital[]>(HOSPITAL_ENDPOINTS.GET_ALL);
      const data = response.data;

      // Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        return data;
      } else if (Array.isArray((data as any).data)) {
        return (data as any).data;
      } else {
        logError(
          new Error('Unexpected response format'),
          'hospitalService.getHospitales',
          { responseData: data }
        );
        return [];
      }
    } catch (error) {
      logError(error, 'hospitalService.getHospitales');
      return [];
    }
  },

  /**
   * Crea un nuevo hospital
   */
  async createHospital(hospital: HospitalFormData): Promise<Hospital> {
    const response = await axiosInstance.post<Hospital>(
      HOSPITAL_ENDPOINTS.CREATE,
      hospital
    );
    return response.data;
  },

  /**
   * Actualiza un hospital existente
   */
  async updateHospital(hospital: Hospital): Promise<Hospital | { message: string }> {
    const response = await axiosInstance.put<Hospital | { message: string }>(
      HOSPITAL_ENDPOINTS.UPDATE,
      hospital
    );
    return response.data;
  },

  /**
   * Elimina un hospital
   */
  async deleteHospital(id: number): Promise<{ status: string }> {
    const response = await axiosInstance.delete<{ status: string }>(
      HOSPITAL_ENDPOINTS.DELETE(id)
    );
    return response.data;
  },
};
