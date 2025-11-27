import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View } from 'react-native';
import SplashScreen from './components/SplashScreen';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure the navigation is ready
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only navigate after splash is finished AND navigation is ready
    if (!isNavigationReady || !splashFinished) return;

    // Use replace instead of push to avoid navigation stack issues
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/onboarding');
    }
  }, [isAuthenticated, isNavigationReady, splashFinished]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setSplashFinished(true);
  };

  // Show splash screen first
  if (showSplash) {
    console.log('Index: Rendering splash screen');
    return (
      <SplashScreen
        logoSource={require('../assets/images/splash.png')}
        appName="Komin DIY"
        duration={5000}
        onFinish={handleSplashFinish}
        backgroundColor="#ffffff"
      />
    );
  }

  // Return a minimal view instead of null to ensure component is mounted
  return <View style={{ flex: 1 }} />;
}
