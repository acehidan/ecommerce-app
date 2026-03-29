import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useCheckoutStore } from '../store/checkoutStore';
import { getOrderDetail } from '../services/order/getOrderDetail';
import { useState, useRef } from 'react';

/**
 * Payment Result Screen
 * Handles deep links from payment gateways (e.g., komin-diy://payment_result)
 */
export default function PaymentResult() {
  const router = useRouter();
  // const { status, message } = useLocalSearchParams();
  const { checkoutData } = useCheckoutStore();
  const { orderResponse } = checkoutData;

  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [currentMessage, setCurrentMessage] = useState('');

  const isNavigating = useRef(false);
  const hasFetched = useRef(false);

  const checkStatus = async (retryCount = 0) => {
    if (isNavigating.current) return;
    try {
      if (retryCount === 0) setLoading(true);

      const response = await getOrderDetail(displayOrderId);

      if (response.success) {
        const orderStatus = response.data.status;
        if (orderStatus === 'confirm' || orderStatus === 'confirmed') {
          isNavigating.current = true;
          // If confirmed, navigate to order success page
          router.replace('/order-success');
          return;
        }

        // Otherwise update display status
        setCurrentStatus(orderStatus);

        // If it's still pending and we haven't reached max retries, poll again
        if (orderStatus === 'pending') {
          if (retryCount < 20) {
            setTimeout(() => checkStatus(retryCount + 1), 3000);
            return;
          } else {
            setCurrentStatus('failed');
            setCurrentMessage('ငွေပေးချေမှု အတည်ပြုချက် မရရှိသေးပါ။ ခဏစောင့်ဆိုင်းပြီး အော်ဒါမှတ်တမ်းတွင် ပြန်လည်စစ်ဆေးပေးပါ။');
          }
        }
      }
    } catch (err) {
      console.error('Error checking order status:', err);
      // Only show error on final fail or critical error
      if (retryCount >= 20) {
        console.log("fail")
        setCurrentStatus('failed');
        setCurrentMessage(err.message || 'Error checking payment status');
      } else {
        setTimeout(() => checkStatus(retryCount + 1), 3000);
        return;
      }
    } finally {
      if (!isNavigating.current) {
        // Small delay before setting loading to false if we are not polling
        setLoading(false);
        console.log("loading false");
      }
    }
  };

  // Use values from store as requested (since the deep link is only the base URL)
  const displayOrderId = orderResponse?.orderId;
  const displayAmount = orderResponse?.totalAmount;

  useEffect(() => {
    // Prevent hardware back button on Android to ensure user uses our navigation
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleNavigateHome();
      return true;
    });

    // Log for debugging
    console.log('--- Deep Link Received ---');
    console.log('Order ID:', displayOrderId);

    if (displayOrderId) {
      if (!hasFetched.current) {
        hasFetched.current = true;
        checkStatus();
      }
    } else {
      setLoading(false);
    }

    return () => backHandler.remove();
  }, []);



  const handleNavigateHome = () => {
    // Replace to prevent going back to this screen
    router.replace('/(tabs)');
  };

  const getStatusConfig = () => {
    switch (currentStatus) {
      case 'failed':
      case 'cancelled':
        return {
          icon: 'close-circle',
          color: colors.error.main,
          title: 'ငွေပေးချေမှု မအောင်မြင်ပါ',
          subtitle: currentMessage || 'တစ်ခုခု မှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။',
          bgLight: colors.error.light,
        };
      case 'pending':
        return {
          icon: 'time',
          color: colors.warning.main,
          title: 'ငွေပေးချေမှု စောင့်ဆိုင်းနေဆဲဖြစ်သည်',
          subtitle: 'သင်၏ ငွေပေးချေမှုကို စစ်ဆေးနေပါသည်။',
          bgLight: colors.warning.light,
        };
      default:
        return {
          icon: 'information-circle',
          color: colors.info.main,
          title: 'ငွေပေးချေမှု အခြေအနေ',
          subtitle: 'ငွေပေးချေမှု အချက်အလက်များကို ပြန်လည်စစ်ဆေးနေပါသည်။',
          bgLight: colors.info.light,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <View style={styles.content}>
        {/* Status Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.bgLight }]}>
          {loading ? (
            <ActivityIndicator size="large" color={config.color} />
          ) : (
            <Ionicons name={config.icon} size={80} color={config.color} />
          )}
        </View>

        {/* Status Text */}
        <Text style={[styles.title, { color: config.color }]}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>

        {/* Transaction Details Card */}
        {(displayOrderId || displayAmount) && (
          <View style={styles.detailsCard}>
            {displayOrderId && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order ID</Text>
                <Text style={styles.detailValue}>{displayOrderId}</Text>
              </View>
            )}
            {displayAmount && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ပမာဏ</Text>
                <Text style={styles.detailValue}>
                  {parseFloat(displayAmount.toString()).toLocaleString()} MMK
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleNavigateHome}
        >
          <Text style={styles.primaryButtonText}>ပင်မစာမျက်နှာသို့ သွားမည်</Text>
        </Pressable>

        {(currentStatus === 'failed' || currentStatus === 'cancelled') && (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>ထပ်မံကြိုးစားမည်</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  secondaryButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
});
