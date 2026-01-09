import axiosInstance from '../utils/axiosInstance';
import { API_URL } from '../config';

export interface DashboardStats {
    bloodType: {
        labels: string[];
        counts: number[];
    };
    gender: {
        labels: string[];
        counts: number[];
    };
    totalUsers: {
        labels: string[];
        counts: number[];
    };
    campaigns: {
        labels: string[];
        counts: number[];
    };
    breakdown?: {
        gender: string;
        bloodType: string;
        count: number;
    }[];
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get(`${API_URL}/dashboard/stats`);
        return response.data;
    }
};
