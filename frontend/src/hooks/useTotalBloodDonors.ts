import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useTotalDonors = () => {
  const [totalDonors, setTotalDonors] = useState(0);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (messageConnect) => {
        console.log('conectadito');
        client.subscribe('/topic/total-bloodDonors', (messageTotalDonors) => {
          console.log(messageTotalDonors);
          setTotalDonors(Number(messageTotalDonors.body));
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return totalDonors;
};

