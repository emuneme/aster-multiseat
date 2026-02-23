import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photoUrl?: string;
}

interface CustomerAuthState {
    isCustomerAuthenticated: boolean;
    customerUser: CustomerUser | null;
    customerLogin: (email: string, phoneOrNuit: string, customers: any[]) => { success: boolean; error?: string };
    customerLogout: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
    persist(
        (set) => ({
            isCustomerAuthenticated: false,
            customerUser: null,
            customerLogin: (email, phoneOrNuit, customers) => {
                // Procurar cliente por email e verificar se a senha temporária, telefone ou NUIT coincide
                const customer = customers.find(c =>
                    c.email.toLowerCase() === email.toLowerCase() &&
                    (c.password === phoneOrNuit || c.phone === phoneOrNuit || c.nuit === phoneOrNuit)
                );

                if (customer) {
                    const user = {
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        photoUrl: customer.photoUrl
                    };
                    set({ isCustomerAuthenticated: true, customerUser: user });
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Credenciais inválidas. Verifique o seu e-mail e Telefone/NUIT registados.'
                };
            },
            customerLogout: () => set({ isCustomerAuthenticated: false, customerUser: null }),
        }),
        {
            name: 'aster-customer-auth-storage',
        }
    )
);
