import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface Customer {
    id: string; // UUID from DB
    name: string;
    email: string;
    phone?: string;
    company?: string;
    nuit?: string;
    address?: string;
    photoUrl?: string; // URL da foto ou logótipo
    password?: string; // Palavra-passe temporária ou credencial
    created_at?: string;
    [key: string]: any;
}

interface CustomerState {
    customers: Customer[];
    loading: boolean;
    fetchCustomers: () => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>, photoFile?: File) => Promise<void>;
    updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
    customers: [
        {
            id: 'c1',
            name: 'Eusébio Munene',
            email: 'emunene@aster.co.mz',
            phone: '+2588491000',
            nuit: '400123456',
            company: 'Aster'
        }
    ],
    loading: false,

    fetchCustomers: async () => {
        set({ loading: true });
        const { data, error } = await insforge.database
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching customers:", error);
        } else if (data) {
            set({ customers: data as Customer[] });
        }
        set({ loading: false });
    },

    addCustomer: async (customerData, photoFile) => {
        let finalPhotoUrl = '';

        if (photoFile) {
            const { data: storageData, error: storageError } = await insforge.storage
                .from('customer-logos')
                .uploadAuto(photoFile);

            if (storageError) {
                console.error("Error uploading logo:", storageError);
            } else if (storageData) {
                finalPhotoUrl = storageData.url;
            }
        }

        const fullCustomerData = { ...customerData, photoUrl: finalPhotoUrl };
        const { data, error } = await insforge.database
            .from('customers')
            .insert([fullCustomerData])
            .select();

        if (error) {
            console.error("Error adding customer:", error);
            throw new Error(error.message || "Falha ao cadastrar o cliente na base de dados");
        } else if (data && data.length > 0) {
            set((state) => ({
                customers: [data[0] as Customer, ...state.customers]
            }));
        }
    },

    updateCustomer: async (id, updatedData) => {
        const { data, error } = await insforge.database
            .from('customers')
            .update(updatedData)
            .eq('id', id)
            .select();

        if (error) {
            console.error("Error updating customer:", error);
        } else if (data && data.length > 0) {
            set((state) => ({
                customers: state.customers.map(c => c.id === id ? { ...c, ...data[0] } : c)
            }));
        }
    },

    deleteCustomer: async (id) => {
        const { error } = await insforge.database
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting customer:", error);
        } else {
            set((state) => ({
                customers: state.customers.filter(c => c.id !== id)
            }));
        }
    }
}));
