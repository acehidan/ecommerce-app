import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCheckoutStore } from '../store/checkoutStore';

export default function OrderSuccess() {
  const router = useRouter();
  const { checkoutData } = useCheckoutStore();
  const { orderResponse } = checkoutData;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Confirm Screen</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>အော်ဒါ လက်ခံရရှိပါတယ်</Text>

        {/* Confirmation Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            မှာယူထားတဲ့ ပစ္စည်းတွေကို Royal Express Delivery ဖြင့်
          </Text>
          <Text style={styles.messageText}>
            တစ်ပတ်အတွင်းရောက်ရှိအောင်ပို့ဆောင်ပေးပါမယ် ။
          </Text>
          <Text style={styles.messageText}>အခုလို ဝယ်ယူအားပေးတဲ့အတွက်</Text>
          <Text style={styles.messageText}>ကျေးဇူးအများကြီးတင်ရှိပါတယ် ။</Text>
        </View>

        {/* Order Details (if available) */}
        {orderResponse && (
          <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderDetailsTitle}>
              Order ID: {orderResponse.orderId}
            </Text>
            <Text style={styles.orderDetailsSubtitle}>
              Status: {orderResponse.status}
            </Text>
            <Text style={styles.orderDetailsSubtitle}>
              Total: MMK {orderResponse.totalAmount.toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.orderDetailsButton}
          onPress={() => {
            // Navigate to order details page
            console.log('Navigate to order details');
          }}
        >
          <Text style={styles.orderDetailsButtonText}>အော်ဒါအသေးစိတ်</Text>
        </Pressable>

        <Pressable
          style={styles.continueShoppingButton}
          onPress={() => {
            // Navigate to home/products page
            router.push('/(tabs)');
          }}
        >
          <Text style={styles.continueShoppingButtonText}>
            အခြား ပစ္စည်းတွေကြည့်မယ်
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  messageText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  orderDetailsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  orderDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  orderDetailsSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  orderDetailsButton: {
    // flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  orderDetailsButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  continueShoppingButton: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 24,
    paddingVertical: 16,

    alignItems: 'center',
  },
  continueShoppingButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
