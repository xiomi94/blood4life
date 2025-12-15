import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    private client: Client | null = null;
    private connected: boolean = false;

    connect(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Create SockJS instance
                const socket = new SockJS(url);

                // Create STOMP client
                this.client = new Client({
                    webSocketFactory: () => socket as any,
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                });

                // Set up connection handlers
                this.client.onConnect = () => {
                    console.log('✅ WebSocket connected');
                    this.connected = true;
                    resolve();
                };

                this.client.onStompError = (frame: any) => {
                    console.error('❌ WebSocket error:', frame.headers['message']);
                    console.error('Additional details:', frame.body);
                    reject(new Error(frame.headers['message']));
                };

                this.client.onWebSocketError = (error: any) => {
                    console.error('❌ WebSocket connection error:', error);
                    reject(error);
                };

                this.client.onDisconnect = () => {
                    console.log('🔌 WebSocket disconnected');
                    this.connected = false;
                };

                // Activate connection
                this.client.activate();
            } catch (error) {
                console.error('❌ Failed to create WebSocket connection:', error);
                reject(error);
            }
        });
    }

    subscribe(
        destination: string,
        callback: (message: any) => void
    ): () => void {
        if (!this.client || !this.connected) {
            console.warn('⚠️ Cannot subscribe: WebSocket not connected');
            return () => { };
        }

        const subscription = this.client.subscribe(destination, (message: any) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                callback(parsedMessage);
            } catch (error) {
                console.error('❌ Error parsing WebSocket message:', error);
            }
        });

        // Return unsubscribe function
        return () => {
            subscription.unsubscribe();
        };
    }

    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.connected = false;
            console.log('🔌 WebSocket disconnected');
        }
    }

    isConnected(): boolean {
        return this.connected;
    }
}

export const websocketService = new WebSocketService();
