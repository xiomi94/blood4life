import axiosInstance from '../utils/axiosInstance';

export interface Notification {
    id: number;
    message: string;
    dateNotification: string;
    read: boolean;
}

export interface UnreadCountResponse {
    count: number;
}

/**
 * Notification Service
 * Handles all notification-related API calls
 */
const notificationService = {
    /**
     * Get all notifications for the authenticated user
     */
    getMyNotifications: async (): Promise<Notification[]> => {
        const response = await axiosInstance.get<Notification[]>('/notifications');
        return response.data;
    },

    /**
     * Get the count of unread notifications
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await axiosInstance.get<UnreadCountResponse>('/notifications/unread/count');
        return response.data.count;
    },

    /**
     * Get all unread notifications
     */
    getUnreadNotifications: async (): Promise<Notification[]> => {
        const response = await axiosInstance.get<Notification[]>('/notifications/unread');
        return response.data;
    },

    /**
     * Mark a specific notification as read
     */
    markAsRead: async (id: number): Promise<void> => {
        await axiosInstance.put(`/notifications/${id}/read`);
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<void> => {
        await axiosInstance.put('/notifications/read-all');
    }
};

export default notificationService;
