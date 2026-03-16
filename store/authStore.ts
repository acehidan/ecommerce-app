import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveUserProfile,
  clearUserProfile,
  getUserProfile,
} from '../services/user/userProfile';
import { validateToken } from '../services/auth/validateToken';

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
  initializeAuth: () => Promise<boolean>;
  updateUsername: (userName: string) => void;
  updatePhoneNumber: (phoneNumber: string, isVerified: boolean) => void;
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
            const validation = await validateToken();
            if (validation.valid) {
              set({
                isAuthenticated: true,
                user: profile.user,
                token: profile.token,
              });
              return true;
            } else {
              // Token invalid
              await get().logout();
              return false;
            }
          } else {
            // No token found, continue as guest
            get().continueAsGuest();
            return true;
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          get().continueAsGuest();
          return true;
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
      updatePhoneNumber: (phoneNumber: string, isVerified: boolean) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              phoneNumber,
              isVerified,
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
