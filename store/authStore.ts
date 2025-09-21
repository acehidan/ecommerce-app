import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    phoneNumber: string;
  } | null;
  login: (user: { name: string; phoneNumber: string }) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      continueAsGuest: () => set({ isAuthenticated: true, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
