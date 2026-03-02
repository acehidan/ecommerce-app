import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { useCheckoutStore } from '../store/checkoutStore';

/**
 * Payment Result Screen
 * Handles deep links from payment gateways (e.g., komin-diy://payment_result)
 */
export default function PaymentResult() {
  const router = useRouter();
  const { status, message } = useLocalSearchParams();
  const { checkoutData } = useCheckoutStore();
  console.log("checkoutData", checkoutData)
  const { orderResponse } = checkoutData;
  console.log("order-response", orderResponse)

  // Use values from store as requested (since the deep link is only the base URL)
  const displayOrderId = orderResponse?.orderId;
  const displayAmount = orderResponse?.totalAmount;
  const displayStatus = status || 'success';

  useEffect(() => {
    // Prevent hardware back button on Android to ensure user uses our navigation
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleNavigateHome();
      return true;
    });

    // Log for debugging
    console.log('--- Deep Link Received ---');
    console.log('Status:', displayStatus);
    console.log('Order ID:', displayOrderId);
    console.log('Amount:', displayAmount);
    console.log('Message:', message);

    return () => backHandler.remove();
  }, []);

  const handleNavigateHome = () => {
    // Replace to prevent going back to this screen
    router.replace('/(tabs)');
  };

  const getStatusConfig = () => {
    switch (displayStatus) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          color: colors.success.main,
          title: 'ငွေပေးချေမှု အောင်မြင်ပါသည်',
          subtitle: 'သင်၏ အော်ဒါကို အတည်ပြုပြီးပါပြီ။',
          bgLight: colors.success.light,
        };
      case 'failed':
        return {
          icon: 'close-circle',
          color: colors.error.main,
          title: 'ငွေပေးချေမှု မအောင်မြင်ပါ',
          subtitle: message || 'တစ်ခုခု မှားယွင်းနေပါသည်။ ထပ်မံကြိုးစားကြည့်ပါ။',
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
          <Ionicons name={config.icon} size={80} color={config.color} />
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

        {displayStatus === 'failed' && (
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
