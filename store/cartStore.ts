import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity }] };
    });
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return {
          items: state.items.filter((item) => item.id !== id),
        };
      }
      // Update quantity if greater than 0
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    });
  },
  getTotalItems: () => {
    const store = get();
    return store.items.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalPrice: () => {
    const store = get();
    return store.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));
