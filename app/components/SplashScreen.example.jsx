/**
 * Example usage of SplashScreen component
 * 
 * This file demonstrates how to use the SplashScreen component
 * in your app. You can integrate it in your index.jsx or _layout.jsx
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import SplashScreen from './SplashScreen';

export default function ExampleUsage() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
    // Navigate to your main screen here
    // router.replace('/(tabs)');
  };

  if (showSplash) {
    return (
      <SplashScreen
        logoSource={require('../../assets/images/komin.jpg')} // or { uri: 'https://...' }
        appName="Komin DIY"
        duration={2500} // 2.5 seconds
        onFinish={handleSplashFinish}
        backgroundColor="#ffffff" // Optional, defaults to white
      />
    );
  }

  return <View style={{ flex: 1 }} />; // Your main app content
}

/**
 * Alternative: Using in _layout.jsx or index.jsx
 * 
 * import { useState, useEffect } from 'react';
 * import SplashScreen from './components/SplashScreen';
 * 
 * export default function Index() {
 *   const [showSplash, setShowSplash] = useState(true);
 *   const { isAuthenticated } = useAuthStore();
 * 
 *   useEffect(() => {
 *     if (!showSplash) {
 *       if (isAuthenticated) {
 *         router.replace('/(tabs)');
 *       } else {
 *         router.replace('/auth/onboarding');
 *       }
 *     }
 *   }, [showSplash, isAuthenticated]);
 * 
 *   if (showSplash) {
 *     return (
 *       <SplashScreen
 *         logoSource={require('../assets/images/komin.jpg')}
 *         appName="Komin DIY"
 *         duration={2000}
 *         onFinish={() => setShowSplash(false)}
 *       />
 *     );
 *   }
 * 
 *   return null;
 * }
 */

