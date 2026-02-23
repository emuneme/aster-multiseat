import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface Technician {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar_url?: string;
    created_at: string;
}

interface TechnicianState {
    technicians: Technician[];
    loading: boolean;
    fetchTechnicians: () => Promise<void>;
    addTechnician: (techData: Partial<Technician>) => Promise<Technician | null>;
    updateTechnician: (id: string, updates: Partial<Technician>) => Promise<boolean>;
    deleteTechnician: (id: string) => Promise<boolean>;
}

export const useTechnicianStore = create<TechnicianState>((set) => ({
    technicians: [],
    loading: false,

    fetchTechnicians: async () => {
        set({ loading: true });
        const { data, error } = await insforge.database
            .from('technicians')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching technicians:', error);
        } else if (data) {
            set({ technicians: data as Technician[] });
        }
        set({ loading: false });
    },

    addTechnician: async (techData) => {
        const { data, error } = await insforge.database
            .from('technicians')
            .insert([techData])
            .select();

        if (error) {
            console.error('Error adding technician:', error);
            return null;
        }

        if (data && data.length > 0) {
            set(state => ({ technicians: [...state.technicians, data[0] as Technician] }));
            return data[0] as Technician;
        }
        return null;
    },

    updateTechnician: async (id, updates) => {
        const { error } = await insforge.database
            .from('technicians')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating technician:', error);
            return false;
        }

        set(state => ({
            technicians: state.technicians.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
        return true;
    },

    deleteTechnician: async (id) => {
        const { error } = await insforge.database
            .from('technicians')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting technician:', error);
            return false;
        }

        set(state => ({
            technicians: state.technicians.filter(t => t.id !== id)
        }));
        return true;
    }
}));

