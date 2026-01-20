import notificationService from '../services/notificationService';

const VAPID_PUBLIC_KEY = 'BKmNEpf1iaYSAhvoMsvkNyJrXXDm0nb4AdmmLA20w1iLmB6659JnDDCHkadcBgUr2mjNYJAJl9F6_HyLyMKnVKs';

export const registerPushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported in this browser.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered with scope:', registration.scope);

        // Wait for the service worker to be ready (active)
        await navigator.serviceWorker.ready;

        // Check availability of Push API
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        // Always send to backend to ensure sync (or check if changed logic could be here)
        await notificationService.subscribePush(subscription.toJSON());
        console.log('User is subscribed to push notifications');

    } catch (error) {
        console.error('Failed to register/subscribe to push notifications:', error);
    }
};

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
