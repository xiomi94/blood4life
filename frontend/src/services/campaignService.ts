import axiosInstance from '../utils/axiosInstance';
import type { Campaign, CampaignFormData } from '../types/common.types';

// Re-export types for convenience
export type { Campaign, CampaignFormData };

/**
 * Endpoints del servicio de campañas
 */
const CAMPAIGN_ENDPOINTS = {
    CREATE: '/hospital/campaign/create',
    GET_ALL: '/hospital/campaign/all',
    GET_BY_HOSPITAL: (hospitalId: number) => `/hospital/campaign/hospital/${hospitalId}`,
    GET_BY_ID: (id: number) => `/hospital/campaign/${id}`,
    UPDATE: (id: number) => `/hospital/campaign/${id}`,
    DELETE: (id: number) => `/hospital/campaign/${id}`,
} as const;

/**
 * Convierte datos de campaña a FormData para enviar al servidor
 * Elimina duplicación entre create y update
 */
const buildCampaignFormData = (data: CampaignFormData): FormData => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('location', data.location);
    formData.append('requiredDonorQuantity', data.requiredDonorQuantity.toString());

    // Añadir cada tipo de sangre requerido
    data.requiredBloodTypes.forEach(bloodType => {
        formData.append('requiredBloodTypes', bloodType);
    });

    return formData;
};

/**
 * Servicio de campañas
 * Maneja todas las operaciones CRUD de campañas de donación
 */
export const campaignService = {
    /**
     * Crea una nueva campaña
     */
    createCampaign: async (data: CampaignFormData): Promise<Campaign> => {
        const formData = buildCampaignFormData(data);
        const response = await axiosInstance.post<Campaign>(CAMPAIGN_ENDPOINTS.CREATE, formData);
        return response.data;
    },

    /**
     * Obtiene todas las campañas de un hospital específico
     */
    getCampaignsByHospital: async (hospitalId: number): Promise<Campaign[]> => {
        const response = await axiosInstance.get<Campaign[]>(
            CAMPAIGN_ENDPOINTS.GET_BY_HOSPITAL(hospitalId)
        );
        return response.data;
    },

    /**
     * Obtiene todas las campañas del sistema
     */
    getAllCampaigns: async (): Promise<Campaign[]> => {
        const response = await axiosInstance.get<Campaign[]>(CAMPAIGN_ENDPOINTS.GET_ALL);
        return response.data;
    },

    /**
     * Obtiene una campaña por su ID
     */
    getCampaignById: async (id: number): Promise<Campaign> => {
        const response = await axiosInstance.get<Campaign>(CAMPAIGN_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    },

    /**
     * Actualiza una campaña existente
     */
    updateCampaign: async (id: number, data: CampaignFormData): Promise<Campaign> => {
        const formData = buildCampaignFormData(data);
        const response = await axiosInstance.put<Campaign>(CAMPAIGN_ENDPOINTS.UPDATE(id), formData);
        return response.data;
    },

    /**
     * Elimina una campaña
     */
    deleteCampaign: async (id: number): Promise<void> => {
        await axiosInstance.delete(CAMPAIGN_ENDPOINTS.DELETE(id));
    }
};
