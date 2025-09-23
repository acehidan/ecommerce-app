import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveUserProfile,
  clearUserProfile,
  getUserProfile,
} from '../services/user/userProfile';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    phoneNumber: string;
  } | null;
  token: string | null;
  login: (user: { name: string; phoneNumber: string }, token: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: async (user, token) => {
        try {
          await saveUserProfile({ user, token });
          set({ isAuthenticated: true, user, token });
        } catch (error) {
          console.error('Error saving user profile:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await clearUserProfile();
          set({ isAuthenticated: false, user: null, token: null });
        } catch (error) {
          console.error('Error clearing user profile:', error);
        }
      },
      continueAsGuest: () =>
        set({ isAuthenticated: true, user: null, token: null }),
      initializeAuth: async () => {
        try {
          const profile = await getUserProfile();
          if (profile && profile.token) {
            set({
              isAuthenticated: true,
              user: profile.user,
              token: profile.token,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
        }
      },
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
