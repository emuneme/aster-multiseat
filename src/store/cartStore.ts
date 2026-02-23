import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './productStore';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number | string) => void;
    updateQuantity: (productId: number | string, quantity: number) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => {
                const existing = state.items.find((item) => item.id === product.id);
                if (existing) {
                    return {
                        items: state.items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }
                return { items: [...state.items, { ...product, quantity: 1 }] };
            }),
            removeItem: (productId) => set((state) => ({
                items: state.items.filter((item) => item.id !== productId),
            })),
            updateQuantity: (productId, quantity) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
                ),
            })),
            clearCart: () => set({ items: [] }),
            getSubtotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: 'aster-cart-storage',
        }
    )
);
