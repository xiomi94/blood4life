import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useTotalDonors = () => {
  const [totalDonors, setTotalDonors] = useState(0);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('✅ WebSocket conectado al servidor');

        // Suscribirse al topic para recibir actualizaciones
        client.subscribe('/topic/total-bloodDonors', (message) => {
          console.log('📊 Total de donantes recibido:', message.body);
          setTotalDonors(Number(message.body));
        });

        // Solicitar el total actual de donantes al servidor
        client.publish({
          destination: '/app/getTotalDonors',
          body: '',
        });
      },
      onStompError: (frame) => {
        console.error('❌ Error en WebSocket:', frame);
      },
      onWebSocketClose: () => {
        console.log('🔌 WebSocket desconectado');
      },
    });

    client.activate();

    return () => {
      console.log('🔌 Cerrando conexión WebSocket...');
      client.deactivate();
    };
  }, []);

  return totalDonors;
};
