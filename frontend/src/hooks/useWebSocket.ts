import { useEffect, useState, useCallback } from 'react';
import { websocketService } from '../services/websocketService';
import { useAuth } from '../context/AuthContext';

// Build WebSocket URL
// In development, always use the local Vite dev server which will proxy to backend
// In production, use the production API URL with correct WebSocket protocol
const getWebSocketURL = () => {
    // If we're in development (localhost), always use the Vite dev server proxy
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `${window.location.protocol}//${window.location.host}/api/ws`;
    }

    // In production, use VITE_API_URL if configured
    if (import.meta.env.VITE_API_URL) {
        // Convert https:// to wss:// or http:// to ws://
        const wsProtocol = import.meta.env.VITE_API_URL.startsWith('https') ? 'wss' : 'ws';
        const urlWithoutProtocol = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '');
        return `${wsProtocol}://${urlWithoutProtocol}/ws`;
    }

    // Fallback: use current location with proper WebSocket protocol
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${window.location.host}/ws`;
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

    const publish = useCallback((destination: string, body: any) => {
        websocketService.publish(destination, body);
    }, []);

    return {
        isConnected,
        subscribe,
        publish,
    };
};
