import { useEffect, useRef, useState } from 'react';
import { router, usePathname } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View } from 'react-native';
import SplashScreen from './components/SplashScreen';

export default function Index() {
  console.log('welcome to komin-diy - Entry Point');
  const { isAuthenticated, initializeAuth, token } = useAuthStore();
  const pathname = usePathname();
  const hasNavigated = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFinished, setSplashFinished] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window !== 'undefined') {
          window.frameworkReady?.();
        }
        await initializeAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth in index:', error);
        setIsInitialized(true); // Still proceed even if there's an error
      }
    };
    init();
  }, [initializeAuth]);

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    setSplashFinished(true);
  };

  // Navigate after splash finishes and auth is initialized
  useEffect(() => {
    // Wait for both initialization and splash to complete
    if (!isInitialized || !splashFinished) return;

    // Prevent multiple navigations
    if (hasNavigated.current) return;

    // Check if already on a different route (prevent infinite redirects)
    if (pathname !== '/') {
      hasNavigated.current = true;
      return;
    }

    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      if (hasNavigated.current) return;

      hasNavigated.current = true;

      // Navigate based on authentication status
      // Check token directly to be more reliable
      if (token || isAuthenticated) {
        console.log('User is authenticated, navigating to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('User is not authenticated, navigating to onboarding');
        router.replace('/auth/onboarding');
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isInitialized, splashFinished, isAuthenticated, token, pathname]);

  // Show splash screen while initializing or before navigation
  if (showSplash) {
    return (
      <SplashScreen
        logoSource={require('../assets/images/splashicon.png')}
        duration={3000}
        onFinish={handleSplashFinish}
      />
    );
  }

  // Show empty view while navigating (splash is hidden but navigation hasn't completed yet)
  return <View style={{ flex: 1 }} />;
}
