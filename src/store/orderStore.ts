import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface OrderItem {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
    licenseKey: string | null;
    [key: string]: any;
}

export interface Order {
    id: string; // UUID from DB
    friendly_id: string; // E.g., ORD-123456
    customer_id?: string;
    customer: any; // For UI display, hydrated from customer join
    date: string; // Maps to created_at
    status: 'pending' | 'paid' | 'completed' | 'cancelled';
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    source: string;
    [key: string]: any;
}

interface OrderState {
    orders: Order[];
    loading: boolean;
    fetchOrders: () => Promise<void>;
    fetchOrderById: (orderId: string) => Promise<Order | null>;
    addOrder: (orderData: Partial<Order>) => Promise<Order | null>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    updateOrderItems: (orderId: string, newItems: OrderItem[]) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
    getRecentOrders: (limit?: number) => Order[];
    getTotalRevenue: () => number;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
    orders: [],
    loading: false,

    fetchOrders: async () => {
        set({ loading: true });

        // Use a join to get customer details along with orders
        const { data, error } = await insforge.database
            .from('orders')
            .select(`
                *,
                customer:customers(*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
        } else if (data) {
            const formattedOrders = data.map((d: any) => ({
                id: d.id,
                friendly_id: d.friendly_id,
                customer_id: d.customer_id,
                customer: d.customer || { name: 'Desconhecido', email: '' }, // Fallback gracefully
                date: d.created_at,
                status: d.status,
                items: d.items,
                total: d.total,
                paymentMethod: d.payment_method,
                source: d.source
            }));
            set({ orders: formattedOrders as Order[] });
        }
        set({ loading: false });
    },

    fetchOrderById: async (orderId) => {
        set({ loading: true });

        const { data, error } = await insforge.database
            .from('orders')
            .select(`
                *,
                customer:customers(*)
            `)
            .eq('id', orderId)
            .single();

        set({ loading: false });

        if (error) {
            console.error("Error fetching order by ID:", error);
            return null;
        }

        if (data) {
            const formattedOrder = {
                id: data.id,
                friendly_id: data.friendly_id,
                customer_id: data.customer_id,
                customer: data.customer || { name: 'Desconhecido', email: '' },
                date: data.created_at,
                status: data.status,
                items: data.items,
                total: data.total,
                paymentMethod: data.payment_method,
                source: data.source
            } as Order;

            set((state) => {
                const exists = state.orders.some(o => o.id === formattedOrder.id);
                if (exists) {
                    return { orders: state.orders.map(o => o.id === formattedOrder.id ? formattedOrder : o) };
                }
                return { orders: [...state.orders, formattedOrder] };
            });

            return formattedOrder;
        }
        return null;
    },

    addOrder: async (orderData) => {
        const friendlyId = `ORD-${Date.now().toString().slice(-6)}`;

        // We assume orderData has a customer object inside from the UI flow
        // The UI handles searching/creating customer and passing it here.
        // We will insert the order with the customer ID if available, or just map it 
        // Note: For a robust system, the backend schema should allow creating customer if missing
        // For simplicity, we assume customer exists or we just store UI-provided customer format

        const newOrderRecord = {
            friendly_id: friendlyId,
            customer_id: orderData.customer?.id || null, // Best effort link
            total: orderData.total || 0,
            status: 'pending',
            payment_method: orderData.paymentMethod || 'pos',
            source: orderData.source || 'manual',
            items: orderData.items?.map((item: any) => ({ ...item, licenseKey: null })) || []
        };

        const { data, error } = await insforge.database
            .from('orders')
            .insert([newOrderRecord])
            .select(`*, customer:customers(*)`);

        if (error) {
            console.error("Error adding order:", error);
            return null;
        } else if (data && data.length > 0) {
            const d = data[0];
            const formattedOrder = {
                id: d.id,
                friendly_id: d.friendly_id,
                customer_id: d.customer_id,
                customer: d.customer || orderData.customer, // Use provided UI customer as fallback if relation fails
                date: d.created_at,
                status: d.status,
                items: d.items,
                total: d.total,
                paymentMethod: d.payment_method,
                source: d.source
            } as Order;

            set((state) => ({ orders: [formattedOrder, ...state.orders] }));
            return formattedOrder;
        }
        return null;
    },

    updateOrderStatus: async (orderId, status) => {
        const { data, error } = await insforge.database
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select();

        if (error) {
            console.error("Error updating order status:", error);
        } else if (data && data.length > 0) {
            set((state) => ({
                orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
            }));
        }
    },

    updateOrderItems: async (orderId, newItems) => {
        const { data, error } = await insforge.database
            .from('orders')
            .update({ items: newItems })
            .eq('id', orderId)
            .select();

        if (error) {
            console.error("Error updating order items:", error);
        } else if (data && data.length > 0) {
            set((state) => ({
                orders: state.orders.map(o => o.id === orderId ? { ...o, items: newItems } : o)
            }));
        }
    },

    deleteOrder: async (orderId) => {
        const { error } = await insforge.database
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) {
            console.error("Error deleting order:", error);
        } else {
            set((state) => ({
                orders: state.orders.filter(o => o.id !== orderId)
            }));
        }
    },

    getRecentOrders: (limit = 5) => {
        return get().orders.slice(0, limit);
    },

    getTotalRevenue: () => {
        return get().orders
            .filter(o => o.status !== 'cancelled')
            .reduce((total, order) => total + (order.total || 0), 0);
    }
}));
