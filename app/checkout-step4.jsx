import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutStep4() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const { checkoutData, completeCheckout } = useCheckoutStore();

  // Get data from checkout store
  const { contactInfo, addressInfo, orderItems, orderSummary, paymentInfo } =
    checkoutData;

  // Use store data or fallback to defaults
  const displayItems =
    orderItems.length > 0
      ? orderItems
      : items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          weight: item.weight || 1.0,
          price: item.price,
        }));

  const summary = orderSummary || {
    subtotal: getTotalPrice(),
    shippingFee: 6000,
    overweightCharge: 2000,
    grandTotal: getTotalPrice() + 6000 + 2000,
    totalWeight: 3.0,
  };

  const receiptData = paymentInfo?.paymentDetails || {
    bankName: 'A BANK',
    transactionAmount: '-50,000.00',
    transactionDate: '01/01/2023 04:04:04',
    transactionNo: 'E1234567890+123456',
    transactionType: 'Transfer',
    transferTo: 'Daw Hla Hla (123456789)',
    amount: '50,000.00 Ks',
    notice: 'Family & Friends',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>စစ်ဆေးပါ</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.totalSteps}>စုစုပေါင်း အဆင့် ၄ ဆင့်</Text>
            <Text style={styles.currentStep}>အဆင့် နံပါတ် ၃</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact & Address Summary */}
        {(contactInfo || addressInfo) && (
          <View style={styles.contactAddressSection}>
            <Text style={styles.sectionTitle}>အချက်အလက်များ အကျဉ်းချုပ်</Text>

            {contactInfo && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>ဆက်သွယ်ရန်</Text>
                <Text style={styles.infoText}>နာမည်: {contactInfo.name}</Text>
                <Text style={styles.infoText}>
                  ဖုန်းနံပါတ်: {contactInfo.phoneNumber}
                </Text>
              </View>
            )}

            {addressInfo && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>
                  ပို့ဆောင်ရမဲ့ နေရပ်လိပ်စာ
                </Text>
                <Text style={styles.infoText}>မြို့: {addressInfo.city}</Text>
                <Text style={styles.infoText}>
                  မြို့နယ်: {addressInfo.township}
                </Text>
                <Text style={styles.infoText}>
                  လိပ်စာ: {addressInfo.fullAddress}
                </Text>
                <Text style={styles.infoText}>
                  ပို့ဆောင်မှု: {addressInfo.deliveryType}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Purchased Items Section */}
        <View style={styles.purchasedItemsSection}>
          <Text style={styles.sectionTitle}>ဝယ်ယူထားသော ပစ္စည်းများ</Text>

          <View style={styles.itemsList}>
            {displayItems.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity} ခု</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemWeight}>
                    {item.weight.toFixed(1)} KG
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  MMK {item.price.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>

          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>စုစုပေါင်း</Text>
              <Text style={styles.summaryValue}>
                MMK {summary.subtotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ပို့ဆောင်ခ</Text>
              <Text style={styles.summaryValue}>
                MMK {summary.shippingFee.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>အပိုဝန်ဆောင်ခ</Text>
              <Text style={styles.summaryValue}>
                MMK {summary.overweightCharge.toLocaleString()}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>စုစုပေါင်း</Text>
              <Text style={styles.grandTotalValue}>
                MMK {summary.grandTotal.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Receipt Section */}
        <View style={styles.receiptSection}>
          <Text style={styles.sectionTitle}>ငွေဖြတ်ပိုင်း</Text>

          <View style={styles.receiptContainer}>
            {paymentInfo?.receiptImage ? (
              // Show uploaded receipt image
              <View style={styles.uploadedReceiptContainer}>
                <Image
                  source={{ uri: paymentInfo.receiptImage.uri }}
                  style={styles.uploadedReceiptImage}
                  resizeMode="contain"
                />
                <Text style={styles.uploadedReceiptText}>Uploaded Receipt</Text>
              </View>
            ) : (
              // Show simulated receipt if no image uploaded
              <View style={styles.receiptImage}>
                <View style={styles.receiptHeader}>
                  <Text style={styles.bankName}>{receiptData.bankName}</Text>
                  <Text style={styles.transactionAmount}>
                    {receiptData.transactionAmount}
                  </Text>
                </View>

                <View style={styles.receiptContent}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction Date:</Text>
                    <Text style={styles.receiptValue}>
                      {receiptData.transactionDate}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction No:</Text>
                    <Text style={styles.receiptValue}>
                      {receiptData.transactionNo}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction Type:</Text>
                    <Text style={styles.receiptValue}>
                      {receiptData.transactionType}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transfer To:</Text>
                    <Text style={styles.receiptValue}>
                      {receiptData.transferTo}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount:</Text>
                    <Text style={styles.receiptValue}>
                      {receiptData.amount}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Notice:</Text>
                    <Text style={styles.receiptValue}>
                      {receiptData.notice}
                    </Text>
                  </View>
                </View>

                <View style={styles.receiptFooter}>
                  <Text style={styles.thankYouText}>
                    Thank you for using KBZPay!
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Pressable
          style={styles.backActionButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backActionText}>နောက်သို့</Text>
        </Pressable>
        <Pressable
          style={styles.continueActionButton}
          onPress={() => {
            completeCheckout();
            console.log('Order completed!');
            // Navigate to success page or home
            router.push('/(tabs)');
          }}
        >
          <Text style={styles.continueActionText}>ဆက်လုပ်မည်</Text>
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
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 16,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  totalSteps: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  currentStep: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactAddressSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  purchasedItemsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  itemsList: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666666',
    width: 50,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 12,
    color: '#666666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  orderSummarySection: {
    marginBottom: 24,
  },
  summaryDetails: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  grandTotalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  receiptSection: {
    marginBottom: 32,
  },
  receiptContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  uploadedReceiptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadedReceiptImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadedReceiptText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  receiptImage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4444',
  },
  receiptContent: {
    marginBottom: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  receiptLabel: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
  receiptFooter: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  thankYouText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  backActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  backActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  continueActionButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
