import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add custom fonts here if needed
  });
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.frameworkReady?.();
    }
    initializeAuth();
  }, [initializeAuth]);

  if (!loaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
