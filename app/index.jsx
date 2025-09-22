import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/onboarding');
    }
  }, [isAuthenticated]);

  return null;
}
