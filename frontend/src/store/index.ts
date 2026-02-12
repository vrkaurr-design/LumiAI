import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Currency = "₹" | "$" | "€";
export type CartItem = {
  id: string;
  name: string;
  price: number;
  currency?: Currency;
  detail?: string;
  type?: string;
  shade?: "warm" | "cool" | "neutral";
  skinType?: "dry" | "oily" | "combination";
  quantity: number;
};

interface AppState {
  isCameraActive: boolean;
  selectedProduct: string | null;
  cart: CartItem[];
  toggleCamera: () => void;
  setProduct: (productId: string | null) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>()(persist((set, get) => ({
  isCameraActive: false,
  selectedProduct: null,
  cart: [],
  toggleCamera: () => set((state) => ({ isCameraActive: !state.isCameraActive })),
  setProduct: (productId) => set({ selectedProduct: productId }),
  addToCart: (item) => {
    const cart = get().cart.slice();
    const idx = cart.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + 1 };
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    set({ cart });
  },
  removeFromCart: (id) => {
    const cart = get().cart.filter((c) => c.id !== id);
    set({ cart });
  },
  setQuantity: (id, quantity) => {
    const cart = get().cart.map((c) => c.id === id ? { ...c, quantity: Math.max(1, quantity) } : c);
    set({ cart });
  },
  clearCart: () => set({ cart: [] }),
}), { name: "perfect-corp-cart" }));
