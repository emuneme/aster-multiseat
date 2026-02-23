import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { insforge } from '../lib/insforge';

export interface User {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar_url?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    failedAttempts: number;
    lockedUntil: number | null;
    login: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            failedAttempts: 0,
            lockedUntil: null,
            login: async (email, password) => {
                const now = Date.now();
                const state = get();

                // Check if locked
                if (state.lockedUntil && now < state.lockedUntil) {
                    const remaining = Math.ceil((state.lockedUntil - now) / 60000);
                    return { success: false, error: `Sistema bloqueado. Tente novamente em ${remaining} minutos.` };
                }

                // If lock expired, reset
                if (state.lockedUntil && now >= state.lockedUntil) {
                    set({ failedAttempts: 0, lockedUntil: null });
                }

                // The hardcoded fallback below is removed to ensure we always fetch actual user data (like avatar) from the DB.
                // If special bootstrap is needed, it should still fetch from DB after validation.

                // Query DB for technician login
                try {
                    if (email && password) {
                        const { data, error } = await insforge.database
                            .from('technicians')
                            .select('*')
                            .eq('email', email)
                            .eq('password_hash', password)
                            .single();

                        if (!error && data) {
                            set({
                                isAuthenticated: true,
                                user: {
                                    id: data.id,
                                    name: data.name,
                                    email: data.email,
                                    phone: data.phone,
                                    role: data.role || 'technician',
                                    avatar_url: data.avatar_url
                                },
                                failedAttempts: 0,
                                lockedUntil: null
                            });
                            return { success: true };
                        }
                    }
                } catch (err) {
                    console.error('Login Auth Error:', err);
                }

                // Failed Attempt Logic
                const newAttempts = state.failedAttempts + 1;
                if (newAttempts >= 3) {
                    set({
                        failedAttempts: newAttempts,
                        lockedUntil: now + 5 * 60 * 1000 // 5 minutes lock
                    });
                    return { success: false, error: 'Sistema bloqueado por 5 minutos (3 tentativas falhas).' };
                }

                set({ failedAttempts: newAttempts });
                return { success: false, error: `Credenciais inválidas. Tentativa ${newAttempts} de 3.` };
            },
            logout: () => set({ isAuthenticated: false, user: null }),
            updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
        }),
        {
            name: 'aster-auth-storage',
        }
    )
);
