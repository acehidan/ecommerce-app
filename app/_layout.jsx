import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Easing } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toastConfig } from '../services/utils/toastConfig';

// --- Configuration Constants ---

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,    // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Animation specifications for screen transitions
const TRANSITION_SPEC = {
  open: {
    animation: 'timing',
    config: {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    },
  },
  close: {
    animation: 'timing',
    config: {
      duration: 250,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    },
  },
};

// Custom interpolator for slide animations
const CARD_STYLE_INTERPOLATOR = ({ current, layouts }) => ({
  cardStyle: {
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),
      },
    ],
  },
  overlayStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    }),
  },
});

// Default shared options for all screens in the stack
const TAB_BAR_OPTIONS = {
  headerShown: false,
  animation: 'slide_from_right',
  animationDuration: 300,
  transitionSpec: TRANSITION_SPEC,
  cardStyleInterpolator: CARD_STYLE_INTERPOLATOR,
  presentation: 'card',
};

// --- Root Layout Component ---

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'NotoSansMyanmar-Regular': require('../assets/fonts/NotoSansMyanmar-Regular.ttf'),
  });

  useEffect(() => {
    // Prevent the splash screen from auto-hiding while loading fonts
    SplashScreen.preventAutoHideAsync().catch(console.error);
  }, []);

  useEffect(() => {
    // Hide splash screen once fonts are loaded or an error occurs
    if (fontsLoaded || fontError) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync().catch(console.error);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={TAB_BAR_OPTIONS}>
          {/* 
            Most screens are automatically discovered by Expo Router. 
            We only explicitly list critical entry points or folders to maintain 
            a clean structure while keeping the shared options applied.
          */}
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>

        <StatusBar style="dark" />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
