import { create } from 'zustand';

export interface WholesaleTier {
  wholeSaleQuantity: number;
  wholeSaleUnitPrice: number;
  _id?: string;
}

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  // Store product data for price recalculation
  retailUnitPrice: number;
  wholeSale?: WholesaleTier[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  // Helper function to calculate unit price based on quantity
  getUnitPrice: (item: CartItem, quantity: number) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  // Helper function to calculate unit price based on quantity and wholesale tiers
  getUnitPrice: (item, quantity) => {
    if (quantity === 0) return 0;
    
    // If quantity is 1, use retail price
    if (quantity === 1) {
      return item.retailUnitPrice;
    }
    
    // Check if wholesale tiers exist
    if (item.wholeSale && item.wholeSale.length > 0) {
      // Sort wholesale tiers by quantity (descending) to find the best match
      const sortedWholesale = [...item.wholeSale].sort(
        (a, b) => b.wholeSaleQuantity - a.wholeSaleQuantity
      );
      
      // Find the highest wholesale tier that the quantity qualifies for
      const matchingTier = sortedWholesale.find(
        (tier) => quantity >= tier.wholeSaleQuantity
      );
      
      // If quantity qualifies for wholesale, use wholesale price
      if (matchingTier) {
        return matchingTier.wholeSaleUnitPrice;
      }
    }
    
    // Default to retail price if no wholesale tier matches
    return item.retailUnitPrice;
  },
  
  addItem: (item, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      const unitPrice = get().getUnitPrice(item as CartItem, quantity);
      
      if (existingItem) {
        // If item exists, update quantity and recalculate price
        const newQuantity = existingItem.quantity + quantity;
        const newPrice = get().getUnitPrice(existingItem, newQuantity);
        return {
          items: state.items.map((i) =>
            i.id === item.id 
              ? { ...i, quantity: newQuantity, price: newPrice } 
              : i
          ),
        };
      }
      // Add new item with calculated price
      return { 
        items: [...state.items, { ...item, quantity, price: unitPrice } as CartItem] 
      };
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
      // Update quantity and recalculate price based on new quantity
      return {
        items: state.items.map((item) => {
          if (item.id === id) {
            const newPrice = get().getUnitPrice(item, quantity);
            return { ...item, quantity, price: newPrice };
          }
          return item;
        }),
      };
    });
  },
  
  clearCart: () => {
    set({ items: [] });
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
