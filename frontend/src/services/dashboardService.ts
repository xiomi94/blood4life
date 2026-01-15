import axiosInstance from '../utils/axiosInstance';

/**
 * Estadísticas del dashboard
 */
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

/**
 * Servicio de dashboard
 * Obtiene estadísticas generales del sistema
 */
export const dashboardService = {
    /**
     * Obtiene las estadísticas del dashboard
     */
    async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get<DashboardStats>(`/dashboard/stats?t=${Date.now()}`);
        return response.data;
    }
};
