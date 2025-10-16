import { useEffect, useState } from 'react';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useAuthStore } from '../store/authStore';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../services/utils/toastConfig';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add custom fonts here if needed
  });
  const [isReady, setIsReady] = useState(false);
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        if (typeof window !== 'undefined') {
          window.frameworkReady?.();
        }
        await initializeAuth();
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsReady(true); // Still set ready to prevent blocking
      }
    };

    initialize();
  }, [initializeAuth]);

  if (!loaded || !isReady) return null;

  return (
    <SafeAreaProvider>
      <Slot />
      <StatusBar style="dark" />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
