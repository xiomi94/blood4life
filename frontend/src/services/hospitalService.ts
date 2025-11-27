import axiosInstance from '../utils/axiosInstance';
import type { Hospital, HospitalFormData } from '../models/Hospital';

export const hospitalService = {
  async getHospitales(): Promise<Hospital[]> {
    try {
      const response = await axiosInstance.get('/hospital');

      const data = response.data;

      // Asegurarse de devolver siempre un array
      if (Array.isArray(data)) {
        return data;
      } else if (Array.isArray((data as any).data)) {
        return (data as any).data;
      } else {
        console.error('Formato inesperado de respuesta:', data);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener hospitales:', error);
      return [];
    }
  },

  async createHospital(hospital: HospitalFormData): Promise<Hospital> {
    const response = await axiosInstance.post('/hospital', hospital);
    return response.data;
  },

  async updateHospital(hospital: Hospital): Promise<Hospital | { message: string }> {
    const response = await axiosInstance.put('/hospital', hospital);
    return response.data;
  },

  async deleteHospital(id: number): Promise<{ status: string }> {
    const response = await axiosInstance.delete(`/hospital/${id}`);
    return response.data;
  },
};
