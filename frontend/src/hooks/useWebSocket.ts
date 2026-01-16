import { useEffect, useState, useCallback } from 'react';
import { websocketService } from '../services/websocketService';
import { useAuth } from '../context/AuthContext';

// Build WebSocket URL
// In development, always use the local Vite dev server which will proxy to backend
// In production, use the production API URL
const getWebSocketURL = () => {
    // If we're in development (localhost), always use the Vite dev server proxy
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `${window.location.protocol}//${window.location.host}/ws`;
    }

    // In production, use VITE_API_URL if configured
    if (import.meta.env.VITE_API_URL) {
        return `${import.meta.env.VITE_API_URL}/ws`;
    }

    // Fallback
    return `${window.location.protocol}//${window.location.host}/ws`;
};

const WEBSOCKET_URL = getWebSocketURL();

export const useWebSocket = () => {
    const { isAuthenticated } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let mounted = true;

        const connectWebSocket = async () => {
            if (!isAuthenticated) return;

            try {
                console.log('🔗 Connecting to WebSocket:', WEBSOCKET_URL);
                await websocketService.connect(WEBSOCKET_URL);
                if (mounted) {
                    setIsConnected(true);
                }
            } catch (error) {
                console.error('Failed to connect to WebSocket:', error);
                if (mounted) {
                    setIsConnected(false);
                }
            }
        };

        if (isAuthenticated) {
            connectWebSocket();
        }

        return () => {
            mounted = false;
        };
    }, [isAuthenticated]);

    const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
        return websocketService.subscribe(destination, callback);
    }, []);

    return {
        isConnected,
        subscribe,
    };
};
