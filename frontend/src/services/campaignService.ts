import axiosInstance from '../utils/axiosInstance';

export interface CampaignFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    requiredDonorQuantity: number;
    requiredBloodTypes: string[];
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
}

export const campaignService = {
    createCampaign: async (data: CampaignFormData): Promise<Campaign> => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('startDate', data.startDate);
        formData.append('endDate', data.endDate);
        formData.append('location', data.location);
        formData.append('requiredDonorQuantity', data.requiredDonorQuantity.toString());

        // Append each blood type
        data.requiredBloodTypes.forEach(bloodType => {
            formData.append('requiredBloodTypes', bloodType);
        });

        const response = await axiosInstance.post('/campaign', formData);
        return response.data;
    },

    getCampaignsByHospital: async (hospitalId: number): Promise<Campaign[]> => {
        const response = await axiosInstance.get(`/campaign/hospital/${hospitalId}`);
        return response.data;
    },

    getAllCampaigns: async (): Promise<Campaign[]> => {
        const response = await axiosInstance.get('/campaign');
        return response.data;
    },

    getCampaignById: async (id: number): Promise<Campaign> => {
        const response = await axiosInstance.get(`/campaign/${id}`);
        return response.data;
    }
};
