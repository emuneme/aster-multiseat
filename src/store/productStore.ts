import { create } from 'zustand';
import { insforge } from '../lib/insforge';

export interface Product {
    id: string; // Changed to string for UUID
    type: string;
    name: string;
    price: number;
    category: string; // 'monthly' | 'annual' | 'perpetual'
    users: number;
    image: string;
    features: string[];
    is_popular: boolean;
    active: boolean;
    created_at?: string;
    [key: string]: any;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id' | 'active' | 'created_at'>) => Promise<void>;
    updateProduct: (id: string, updatedData: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    toggleFeatured: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()((set, get) => ({
    products: [],
    loading: false,

    fetchProducts: async () => {
        set({ loading: true });
        const { data, error } = await insforge.database
            .from('products')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching products:", error);
        } else if (data) {
            set({ products: data as Product[] });
        }
        set({ loading: false });
    },

    addProduct: async (productData) => {
        // Strip out any properties that do not belong to the database schema
        const { desc, ...cleanProductData } = productData as any;

        const newProduct = {
            ...cleanProductData,
            active: true,
            is_popular: cleanProductData.is_popular || false
        };

        const { data, error } = await insforge.database
            .from('products')
            .insert([newProduct])
            .select();

        if (error) {
            console.error("Error adding product:", error);
        } else if (data && data.length > 0) {
            set((state) => ({
                products: [...state.products, data[0] as Product]
            }));
        }
    },

    updateProduct: async (id, updatedData) => {
        // Strip out non-schema properties
        const { desc, ...cleanUpdatedData } = updatedData as any;

        const { data, error } = await insforge.database
            .from('products')
            .update(cleanUpdatedData)
            .eq('id', id)
            .select();

        if (error) {
            console.error("Error updating product:", error);
        } else if (data && data.length > 0) {
            set((state) => ({
                products: state.products.map(p => p.id === id ? { ...p, ...data[0] } : p)
            }));
        }
    },

    deleteProduct: async (id) => {
        const { error } = await insforge.database
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting product:", error);
        } else {
            set((state) => ({
                products: state.products.filter(p => p.id !== id)
            }));
        }
    },

    toggleFeatured: async (id) => {
        const product = get().products.find(p => p.id === id);
        if (!product) return;

        const { data, error } = await insforge.database
            .from('products')
            .update({ is_popular: !product.is_popular })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Error toggling featured product:", error);
        } else if (data && data.length > 0) {
            set((state) => ({
                products: state.products.map(p => p.id === id ? { ...p, ...data[0] } : p)
            }));
        }
    }
}));
