import { useEffect } from 'react';
import { insforge } from '../lib/insforge';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';

export const PushNotificationListener = () => {
    const { isAuthenticated } = useAuthStore();
    // Use clear definition since fetchNotifications is now typed

    useEffect(() => {
        if (!isAuthenticated) return;

        // Request browser notification permission
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        let isSubscribed = false;

        const setupRealtime = async () => {
            try {
                await insforge.realtime.connect();
                const { ok } = await insforge.realtime.subscribe('admin_notifications');
                if (ok) {
                    isSubscribed = true;
                    console.log('Push Notifications Active (WebSockets)');
                }

                // Listen for new notifications from DB trigger
                (insforge.realtime as any).on('INSERT_notification', (payload: any) => {
                    // Update global UI state securely
                    // The backend trigger returns JSON, payload is the row
                    useNotificationStore.getState().fetchNotifications();

                    // Trigger OS Level Notification
                    if ('Notification' in window && Notification.permission === 'granted') {
                        const notif = new Notification('Aster Helpdesk: Nova Notificação', {
                            body: payload.title || 'Existem novas atualizações no portal.',
                            icon: '/aster-icon-192.png',
                            badge: '/aster-icon-192.png',
                            vibrate: [200, 100, 200]
                        } as any);

                        notif.onclick = function () {
                            window.focus();
                            this.close();
                        };
                    }

                    // Fallback to web audio alert (optional) if supported without strict interaction policy
                    try {
                        const audio = new Audio('/notification-ping.mp3');
                        audio.play().catch(() => { });
                    } catch (e) { }
                });

            } catch (err) {
                console.error("Failed to setup realtime push notifications", err);
            }
        };

        setupRealtime();

        return () => {
            if (isSubscribed) {
                insforge.realtime.unsubscribe('admin_notifications');
            }
        };
    }, [isAuthenticated]);

    // Component is purely logical and renders nothing
    return null;
};
