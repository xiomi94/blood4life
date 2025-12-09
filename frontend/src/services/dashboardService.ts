import axios from 'axios';
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
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await axios.get(`${API_URL}/dashboard/stats`);
        return response.data;
    }
};
