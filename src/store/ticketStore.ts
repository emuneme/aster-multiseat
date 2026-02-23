import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface Ticket {
    id: string;
    friendly_id: string;
    customer_id: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
    };
    assigned_to?: string | null;
    technician?: {
        name: string;
    } | null;
    subject: string;
    description: string;
    category: 'Hardware' | 'Software' | 'Rede' | 'Impressora' | 'Outro';
    priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    status: 'Novo' | 'Em Análise' | 'Aguardando Cliente' | 'Resolvido' | 'Cancelado' | 'Encerrado';
    created_at: string;
    updated_at: string;
    notes?: {
        text: string;
        author: string;
        date: string;
        is_internal: boolean;
    }[];
}

interface TicketState {
    tickets: Ticket[];
    loading: boolean;
    fetchTickets: () => Promise<void>;
    addTicket: (ticketData: Partial<Ticket>) => Promise<Ticket | null>;
    updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
    addTicketNote: (ticketId: string, note: { text: string; author: string; is_internal: boolean }) => Promise<void>;
    assignTicket: (ticketId: string, technicianId: string | null) => Promise<void>;
    deleteTicket: (ticketId: string) => Promise<void>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
    tickets: [],
    loading: false,

    fetchTickets: async () => {
        set({ loading: true });
        const { data, error } = await insforge.database
            .from('tickets')
            .select(`
                *,
                customer:customers(name, email, phone),
                technician:technicians(name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tickets:', error);
        } else if (data) {
            set({ tickets: data as any[] });
        }
        set({ loading: false });
    },

    addTicket: async (ticketData) => {
        const friendly_id = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
        const newTicketData = {
            friendly_id,
            customer_id: ticketData.customer_id,
            subject: ticketData.subject,
            description: ticketData.description,
            category: ticketData.category || 'Outro',
            priority: ticketData.priority || 'Média',
            status: 'Novo',
            notes: []
        };

        const { data, error } = await insforge.database
            .from('tickets')
            .insert([newTicketData])
            .select(`
                *,
                customer:customers(name, email, phone)
            `);

        if (error) {
            console.error('Error adding ticket:', error);
            return null;
        }

        if (data && data.length > 0) {
            set(state => ({ tickets: [data[0] as any, ...state.tickets] }));
            return data[0] as any;
        }
        return null;
    },

    updateTicketStatus: async (ticketId, status) => {
        const updatedAt = new Date().toISOString();
        const { error } = await insforge.database
            .from('tickets')
            .update({ status, updated_at: updatedAt })
            .eq('id', ticketId);

        if (error) {
            console.error('Error updating ticket status:', error);
        } else {
            set(state => ({
                tickets: state.tickets.map(t =>
                    t.id === ticketId ? { ...t, status, updated_at: updatedAt } : t
                )
            }));
        }
    },

    addTicketNote: async (ticketId, note) => {
        const ticket = get().tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const newNote = {
            ...note,
            date: new Date().toISOString()
        };

        const updatedNotes = [...(ticket.notes || []), newNote];
        const updatedAt = new Date().toISOString();

        const { error } = await insforge.database
            .from('tickets')
            .update({ notes: updatedNotes, updated_at: updatedAt })
            .eq('id', ticketId);

        if (error) {
            console.error('Error adding ticket note:', error);
        } else {
            set(state => ({
                tickets: state.tickets.map(t =>
                    t.id === ticketId ? { ...t, notes: updatedNotes, updated_at: updatedAt } : t
                )
            }));
        }
    },

    assignTicket: async (ticketId, technicianId) => {
        const updatedAt = new Date().toISOString();
        const { error } = await insforge.database
            .from('tickets')
            .update({ assigned_to: technicianId, updated_at: updatedAt })
            .eq('id', ticketId);

        if (error) {
            console.error('Error assigning ticket:', error);
        } else {
            // Refetch to get the technician name correctly, or update optimistically
            get().fetchTickets();
        }
    },

    deleteTicket: async (ticketId) => {
        const { error } = await insforge.database
            .from('tickets')
            .delete()
            .eq('id', ticketId);

        if (error) {
            console.error('Error deleting ticket:', error);
        } else {
            set(state => ({
                tickets: state.tickets.filter(t => t.id !== ticketId)
            }));
        }
    }
}));
