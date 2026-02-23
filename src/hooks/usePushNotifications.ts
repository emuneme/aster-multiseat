import { useState, useEffect } from 'react';

/**
 * Hook to manage Push Notification subscriptions for the PWA.
 * It handles requesting permissions and generating the subscription object
 * that should be sent to the backend to subscribe the user.
 */
export const usePushNotifications = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // Replace with your VAPID public key from backend
    const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribe = async () => {
        try {
            if (!isSupported) {
                throw new Error('Push notifications are not supported in this browser.');
            }

            const permissionResult = await Notification.requestPermission();
            setPermission(permissionResult);

            if (permissionResult !== 'granted') {
                throw new Error('Permission not granted for Notification');
            }

            const registration = await navigator.serviceWorker.ready;

            if (!publicVapidKey) {
                console.warn('VAPID Public Key is missing. Subscription cannot be completed.');
                return null;
            }

            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                setSubscription(existingSubscription);
                return existingSubscription;
            }

            const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            setSubscription(newSubscription);
            return newSubscription;

        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            return null;
        }
    };

    return {
        isSupported,
        permission,
        subscription,
        subscribe,
        error
    };
};
