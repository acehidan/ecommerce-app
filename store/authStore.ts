import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Auth state rehydrated');
        }
      },
    }
  )
);
