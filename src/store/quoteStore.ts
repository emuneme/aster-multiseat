import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuoteItem {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
    [key: string]: any;
}

export interface Quote {
    id: string; // E.g., COT-2026-001
    customer: any;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    items: QuoteItem[];
    subtotal: number;
    tax: number;
    total: number;
    validityDays: number;
}

interface QuoteState {
    quotes: Quote[];
    addQuote: (quoteData: Partial<Quote>) => Quote;
    updateQuoteStatus: (quoteId: string, status: Quote['status']) => void;
    deleteQuote: (quoteId: string) => void;
    getPendingQuotesCount: () => number;
}

const mockQuotes: Quote[] = [
    {
        id: 'COT-2026-001',
        customer: { name: 'Escola Secundária da Matola', email: 'direcao@esmatola.edu.mz', phone: '+258 84 123 4567' },
        date: new Date().toISOString(),
        status: 'pending',
        items: [
            { id: 1, name: 'Instalação Multiseat (5 Terminais)', price: 45000, quantity: 1 }
        ],
        subtotal: 45000,
        tax: 7200, // 16% IVA
        total: 52200,
        validityDays: 15
    },
    {
        id: 'COT-2026-002',
        customer: { name: 'Tech Solutions Lda', email: 'compras@techsol.mz', phone: '+258 82 987 6543' },
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        status: 'approved',
        items: [
            { id: 2, name: 'Manutenção Preventiva de Rede', price: 12000, quantity: 1 },
            { id: 3, name: 'Licenças Antivírus Básicas', price: 1500, quantity: 10 }
        ],
        subtotal: 27000,
        tax: 4320,
        total: 31320,
        validityDays: 30
    }
];

export const useQuoteStore = create<QuoteState>()(
    persist(
        (set, get) => ({
            quotes: mockQuotes,

            addQuote: (quoteData) => {
                const friendlyId = `COT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

                const subtotal = quoteData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
                const tax = subtotal * 0.16; // 16% IVA default
                const total = subtotal + tax;

                const newQuote: Quote = {
                    id: friendlyId,
                    customer: quoteData.customer || { name: 'Cliente Novo' },
                    date: new Date().toISOString(),
                    status: 'pending',
                    items: quoteData.items || [],
                    subtotal,
                    tax,
                    total,
                    validityDays: quoteData.validityDays || 15,
                    ...quoteData // Override defaults if provided
                } as Quote;

                set((state) => ({ quotes: [newQuote, ...state.quotes] }));
                return newQuote;
            },

            updateQuoteStatus: (quoteId, status) => {
                set((state) => ({
                    quotes: state.quotes.map(q => q.id === quoteId ? { ...q, status } : q)
                }));
            },

            deleteQuote: (quoteId) => {
                set((state) => ({
                    quotes: state.quotes.filter(q => q.id !== quoteId)
                }));
            },

            getPendingQuotesCount: () => {
                return get().quotes.filter(q => q.status === 'pending').length;
            }
        }),
        {
            name: 'aster-quotes-storage',
        }
    )
);
