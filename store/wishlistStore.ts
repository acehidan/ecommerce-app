import { create } from 'zustand';

export interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) {
        return { items: state.items.filter((i) => i.id !== item.id) };
      }
      return { items: [...state.items, item] };
    });
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  isInWishlist: (id) => {
    return get().items.some((item) => item.id === id);
  },
}));