import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View } from 'react-native';

export default function Index() {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth and wait for it to complete
    const init = async () => {
      try {
        await initializeAuth();
        setAuthInitialized(true);
      } catch (error) {
        console.error('Error initializing auth in index:', error);
        setAuthInitialized(true); // Still proceed even on error
      }
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    // Add a small delay to ensure the navigation is ready
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only navigate after both navigation is ready AND auth is initialized
    if (!isNavigationReady || !authInitialized) return;
    console.log('isAuthenticated', isAuthenticated);

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/onboarding');
    }
  }, [isAuthenticated, isNavigationReady, authInitialized]);

  // Return a minimal view instead of null to ensure component is mounted
  return <View style={{ flex: 1 }} />;
}
