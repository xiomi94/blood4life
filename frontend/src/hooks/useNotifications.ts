import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { useWebSocket } from './useWebSocket';

export const useNotifications = () => {
    const { isAuthenticated, userType, user } = useAuth();
    const { subscribe, isConnected } = useWebSocket();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const [count, notifs] = await Promise.all([
                notificationService.getUnreadCount(),
                notificationService.getMyNotifications()
            ]);
            setUnreadCount(count);
            setNotifications(notifs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    }, [isAuthenticated]);

    const markAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markMultipleAsRead = async (ids: number[]) => {
        try {
            await Promise.all(ids.map(id => notificationService.markAsRead(id)));
            setNotifications(prev => prev.map(n =>
                ids.includes(n.id) ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - ids.length));
        } catch (error) {
            console.error('Error marking multiple notifications as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Initial fetch and WebSocket subscription
    useEffect(() => {
        if (isAuthenticated) {
            // Initial load via REST
            fetchNotifications();

            // Setup WebSocket subscription ONLY if connected
            let unsubscribe: (() => void) | undefined;
            if (isConnected && user?.id) {
                // Adjust mapping based on UserType from AuthContext
                // Typically: 'hospital' or 'donante'/'bloodDonor'. 
                // Using 'donor' in path for bloodDonors to match backend logic
                const topic = userType === 'hospital'
                    ? `/topic/notifications/hospital/${user.id}`
                    : `/topic/notifications/donor/${user.id}`;

                console.log('🔔 Suscribiéndose a notificaciones:', topic);
                try {
                    unsubscribe = subscribe(topic, (message) => {
                        console.log("🔔 Notificación recibida:", message);
                        if (message && message.body) {
                            try {
                                const newNotification: Notification = JSON.parse(message.body);

                                // Update local state immediately
                                setNotifications(prev => {
                                    if (prev.some(n => n.id === newNotification.id)) return prev;
                                    return [newNotification, ...prev];
                                });
                                setUnreadCount(prev => prev + 1);
                            } catch (e) {
                                console.error("Error parsing notification from WS:", e);
                                fetchNotifications();
                            }
                        } else {
                            fetchNotifications();
                        }
                    });
                } catch (e) {
                    console.warn("Error subscribing to notifications:", e);
                }
            }

            // Poll for unread count every minute as fallback
            const interval = setInterval(fetchUnreadCount, 60000);
            return () => {
                clearInterval(interval);
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isAuthenticated, user?.id, userType, subscribe, fetchNotifications, fetchUnreadCount, isConnected]);

    return {
        unreadCount,
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        markMultipleAsRead,
        markAllAsRead
    };
};
