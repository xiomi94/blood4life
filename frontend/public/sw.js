self.addEventListener('push', function (event) {
    if (event.data) {
        let messageText = 'Tienes una nueva notificación';
        let notificationTitle = 'Blood4Life';

        try {
            // Try to parse as JSON first
            const data = event.data.json();
            messageText = data.message || messageText;

            // Clean up the message - extract only the readable part before any JSON
            const jsonStartIndex = messageText.indexOf('{');
            if (jsonStartIndex !== -1) {
                // There's JSON embedded, extract only the text before it
                messageText = messageText.substring(0, jsonStartIndex).trim();
            }

            // Extract title if it mentions campaign, donation, etc.
            if (messageText.toLowerCase().includes('campaña')) {
                notificationTitle = '📋 Nueva Campaña';
            } else if (messageText.toLowerCase().includes('inscripción')) {
                notificationTitle = '✅ Nueva Inscripción';
            } else if (messageText.toLowerCase().includes('donante')) {
                notificationTitle = '🩸 Blood4Life - Donante';
            } else if (messageText.toLowerCase().includes('hospital')) {
                notificationTitle = '🏥 Blood4Life - Hospital';
            }

        } catch (e) {
            // If JSON parsing fails, use as plain text
            const rawText = event.data.text() || messageText;
            // Also clean plain text
            const jsonStartIndex = rawText.indexOf('{');
            if (jsonStartIndex !== -1) {
                messageText = rawText.substring(0, jsonStartIndex).trim();
            } else {
                messageText = rawText;
            }
        }

        const options = {
            body: messageText,
            icon: '/vite.svg',
            badge: '/vite.svg',
            vibrate: [100, 50, 100],
            requireInteraction: false,
            data: {
                url: '/dashboard'
            }
        };
        event.waitUntil(
            self.registration.showNotification(notificationTitle, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/dashboard');
            }
        })
    );
});
