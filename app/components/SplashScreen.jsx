import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Splash Screen Component with Animations
 * @param {string} logoSource - Source for the logo image (require() or URI)
 * @param {number} duration - Duration in milliseconds before hiding (default: 3000)
 * @param {function} onFinish - Callback function when splash finishes
 */
export default function SplashScreen({
  logoSource,
  duration = 3000,
  onFinish,
}) {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(20);

  useEffect(() => {
    // Start animations
    logoScale.value = withSequence(
      withTiming(1.1, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      }),
      withTiming(1, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      })
    );

    logoOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });

    textOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );

    textTranslateY.value = withDelay(
      600,
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );

    welcomeOpacity.value = withDelay(
      1200,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      })
    );

    welcomeTranslateY.value = withDelay(
      1200,
      withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      })
    );

    // Hide splash after duration
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  const welcomeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: welcomeOpacity.value,
      transform: [{ translateY: welcomeTranslateY.value }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#ffffff']}
        style={styles.gradient}
      >
        {/* Top right "Please wait" text */}
        <Animated.View
          entering={FadeIn.delay(500).duration(400)}
          style={styles.waitTextContainer}
        >
          <Text style={styles.waitText}>ခနစောင့်ပေးပါ</Text>
        </Animated.View>

        {/* Main Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          {logoSource && (
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
        </Animated.View>

        {/* Store Address */}
        {/* <Animated.View style={[styles.addressContainer, textAnimatedStyle]}>
          <Text style={styles.addressText}>
            ဆိုင်လိပ်စာ - မဟာဗန္ဓုလလမ်း, အလယ် ဘလောက်, ရန်ကုန်
          </Text>
        </Animated.View> */}

        {/* Welcome Text */}
        {/* <Animated.View style={[styles.welcomeContainer, welcomeAnimatedStyle]}>
          <Text style={styles.storeName}>Ko Min D.I.Y Store</Text>
          <Text style={styles.welcomeText}>မှကြိုဆိုပါတယ်ခင်ဗျ</Text>
        </Animated.View> */}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  waitTextContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  waitText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
  addressContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  addressText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'NotoSansMyanmar-Regular',
    lineHeight: 22,
  },
  welcomeContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
});
