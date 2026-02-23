import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface Contract {
    id: string;
    friendly_id: string;
    quote_id: string;
    customer_id: string;
    customer?: {
        name: string;
        email: string;
        phone: string;
        document: string;
        address: string;
    };
    manager_id?: string;
    status: 'Minuta' | 'Em Revisão' | 'Assinado' | 'Terminado' | 'Cancelado';
    clauses: any[];
    valid_until?: string;
    monthly_value: number;
    created_at: string;
    updated_at: string;
}

interface ContractState {
    contracts: Contract[];
    loading: boolean;
    fetchContracts: () => Promise<void>;
    addContract: (contractData: Partial<Contract>) => Promise<Contract | null>;
    updateContractStatus: (contractId: string, status: Contract['status']) => Promise<void>;
    updateContractClauses: (contractId: string, clauses: any[]) => Promise<void>;
}

export const useContractStore = create<ContractState>((set) => ({
    contracts: [],
    loading: false,

    fetchContracts: async () => {
        set({ loading: true });
        const { data, error } = await insforge.database
            .from('contracts')
            .select(`
                *,
                customer:customers(*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contracts:', error);
        } else if (data) {
            set({ contracts: data as any[] });
        }
        set({ loading: false });
    },

    addContract: async (contractData) => {
        const friendly_id = `CTR-${Math.floor(Math.random() * 90000) + 10000}`;
        const newContractData = {
            ...contractData,
            friendly_id,
        };

        const { data, error } = await insforge.database
            .from('contracts')
            .insert([newContractData])
            .select(`
                *,
                customer:customers(*)
            `);

        if (error) {
            console.error('Error adding contract:', error);
            return null;
        }

        if (data && data.length > 0) {
            set(state => ({ contracts: [data[0] as any, ...state.contracts] }));
            return data[0] as any;
        }
        return null;
    },

    updateContractStatus: async (contractId, status) => {
        const updatedAt = new Date().toISOString();
        const { error } = await insforge.database
            .from('contracts')
            .update({ status, updated_at: updatedAt })
            .eq('id', contractId);

        if (error) {
            console.error('Error updating contract status:', error);
        } else {
            set(state => ({
                contracts: state.contracts.map(c =>
                    c.id === contractId ? { ...c, status, updated_at: updatedAt } : c
                )
            }));
        }
    },

    updateContractClauses: async (contractId, clauses) => {
        const updatedAt = new Date().toISOString();
        const { error } = await insforge.database
            .from('contracts')
            .update({ clauses, updated_at: updatedAt })
            .eq('id', contractId);

        if (error) {
            console.error('Error updating contract clauses:', error);
        } else {
            set(state => ({
                contracts: state.contracts.map(c =>
                    c.id === contractId ? { ...c, clauses, updated_at: updatedAt } : c
                )
            }));
        }
    }
}));
