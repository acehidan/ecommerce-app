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
    _id: string;
    userName: string;
    phoneNumber: string;
    isVerified: boolean;
    role: string;
  } | null;
  token: string | null;
  passwordChangeToken: string | null;
  login: (
    user: {
      _id: string;
      userName: string;
      phoneNumber: string;
      isVerified: boolean;
      role: string;
    },
    token: string
  ) => void;
  logout: () => void;
  continueAsGuest: () => void;
  initializeAuth: () => Promise<void>;
  updateUsername: (userName: string) => void;
  setPasswordChangeToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      passwordChangeToken: null,
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
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            passwordChangeToken: null,
          });
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
          } else {
            // Explicitly set to false if no profile found
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              passwordChangeToken: null,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // On error, also set to false
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            passwordChangeToken: null,
          });
        }
      },
      updateUsername: (userName: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              userName,
            },
          });
        }
      },
      setPasswordChangeToken: (token: string | null) => {
        set({ passwordChangeToken: token });
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
