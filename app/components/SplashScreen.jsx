import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text, Platform } from 'react-native';
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

/**
 * Splash Screen Component with Animations
 * @param {string} logoSource - Source for the logo image (require() or URI)
 * @param {string} appName - App name to display (optional)
 * @param {number} duration - Duration in milliseconds before hiding (default: 2000)
 * @param {function} onFinish - Callback function when splash finishes
 * @param {string} backgroundColor - Background color (default: white)
 */
export default function SplashScreen({
  logoSource,
  appName = 'Komin DIY',
  duration = 2000,
  onFinish,
  backgroundColor = colors.background.primary,
}) {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    console.log('SplashScreen: Component mounted, starting animations');
    // Start animations
    logoScale.value = withSequence(
      withTiming(1.2, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      }),
      withTiming(1, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      })
    );

    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    textOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      })
    );

    textTranslateY.value = withDelay(
      400,
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

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[styles.container, { backgroundColor }]}
    >
      <LinearGradient
        colors={[backgroundColor, colors.primaryLight + '10', backgroundColor]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          {logoSource ? (
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
              onError={(error) => {
                console.log('Splash image error:', error);
              }}
            />
          ) : (
            <View style={[styles.logo, styles.logoPlaceholder]} />
          )}
        </Animated.View>

        {appName && (
          <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
            <Text style={styles.appName}>{appName}</Text>
          </Animated.View>
        )}

        {/* Animated loading dots */}
        <Animated.View
          entering={FadeIn.delay(800).duration(400)}
          style={styles.dotsContainer}
        >
          <LoadingDots />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

/**
 * Loading Dots Animation Component
 */
function LoadingDots() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animateDots = () => {
      dot1.value = withSequence(
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
      );
      dot2.value = withDelay(
        200,
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        )
      );
      dot3.value = withDelay(
        400,
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        )
      );
    };

    // Start animation loop
    const interval = setInterval(animateDots, 1200);
    animateDots(); // Initial animation

    return () => clearInterval(interval);
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: 0.8 + dot1.value * 0.4 }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: 0.8 + dot2.value * 0.4 }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: 0.8 + dot3.value * 0.4 }],
  }));

  return (
    <View style={styles.dotsWrapper}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoPlaceholder: {
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
    letterSpacing: 1,
  },
  dotsContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});

