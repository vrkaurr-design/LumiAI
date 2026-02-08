import { create } from 'zustand';

interface AppState {
  isCameraActive: boolean;
  selectedProduct: string | null;
  toggleCamera: () => void;
  setProduct: (productId: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isCameraActive: false,
  selectedProduct: null,
  toggleCamera: () => set((state) => ({ isCameraActive: !state.isCameraActive })),
  setProduct: (productId) => set({ selectedProduct: productId }),
}));
