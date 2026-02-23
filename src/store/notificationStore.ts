import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface AdminNotification {
    id: string;
    type: 'new_customer' | 'new_ticket' | 'payment_received';
    title: string;
    message: string;
    read: boolean;
    timestamp: Date;
    link?: string;
}

interface NotificationState {
    notifications: AdminNotification[];
    addNotification: (notification: Omit<AdminNotification, 'id' | 'read' | 'timestamp'>) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
    fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    notifications: [],

    // Buscar Notificações
    fetchNotifications: async () => {
        const { data, error } = await insforge.database
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            set({ notifications: data as AdminNotification[] });
        }
    },

    addNotification: async (notif) => {
        // Enviar para tabela da Base de Dados
        const { data, error } = await insforge.database
            .from('notifications')
            .insert([{ ...notif, read: false }])
            .select();

        let newNotif: AdminNotification | null = null;
        if (!error && data && data.length > 0) {
            newNotif = data[0] as AdminNotification;
            set((state) => ({
                notifications: [newNotif!, ...state.notifications]
            }));
        }

        // Chamar InsForge Edge Function em background para envio de E-mail
        try {
            await insforge.functions.invoke('notify-admin', {
                body: {
                    type: notif.type,
                    title: notif.title,
                    message: notif.message
                }
            });
        } catch (err) {
            console.error('Failed to send email notification:', err);
        }
    },

    markAsRead: async (id) => {
        set((state) => ({
            notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
        await insforge.database.from('notifications').update({ read: true }).eq('id', id);
    },

    clearAll: async () => {
        set({ notifications: [] });
        await insforge.database.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
}));
