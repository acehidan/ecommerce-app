import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure the navigation is ready
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    // Use replace instead of push to avoid navigation stack issues
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/onboarding');
    }
  }, [isAuthenticated, isNavigationReady]);

  // Return a minimal view instead of null to ensure component is mounted
  return <View style={{ flex: 1 }} />;
}
