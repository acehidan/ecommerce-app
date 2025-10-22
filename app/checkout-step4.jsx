import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore } from '../store/checkoutStore';
import { useAuthStore } from '../store/authStore';

export default function CheckoutStep4() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { checkoutData, completeCheckout, createOrder, clearCheckoutData } =
    useCheckoutStore();
  const { user } = useAuthStore();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Get data from checkout store
  const { contactInfo, addressInfo, orderItems, orderSummary, paymentInfo } =
    checkoutData;

  // Get selected payment method from checkout store or default to prepayment
  const selectedPaymentMethod = paymentInfo?.selectedMethod || 'prepayment';
  // console.log('Payment method from store:', selectedPaymentMethod);
  // console.log('Full payment info:', paymentInfo);

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

  const handleCreateOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!contactInfo || !addressInfo || !orderItems.length) {
      Alert.alert('Error', 'Missing required order information');
      return;
    }

    setIsCreatingOrder(true);

    // Navigate to loading page
    router.push('/order-processing');

    try {
      // Validate required data
      if (!user._id) {
        throw new Error('User ID is required');
      }
      if (!orderItems || orderItems.length === 0) {
        throw new Error('No items in cart');
      }
      if (!addressInfo?.fullAddress) {
        throw new Error('Address is required');
      }

      // Map order items to the required format
      const products = orderItems.map((item) => ({
        stockId: item.id.toString(), // Convert number to string
        quantity: item.quantity,
      }));

      console.log('Products:', products);

      // Map payment method
      const paymentMethodMap = {
        prepayment: 'cash-down',
        cod: 'cash-on-delivery',
      };

      const orderData = {
        userId: user._id,
        products,
        address: addressInfo.fullAddress,
        deliveryZone: '68bad3e54077df8ffba8e978',
        platform: 'ecommerce',
        paymentMethod: 'cash-down',
      };

      // const orderData = {
      //   userId: user._id,
      //   products,
      //   address: addressInfo.fullAddress,
      //   deliveryZone: '68bad3e54077df8ffba8e978', // This should come from addressInfo or be configurable
      //   platform: 'ecommerce',
      //   paymentMethod: 'cash-down',
      // };

      // Additional validation for API requirements
      if (!orderData.userId || orderData.userId.trim() === '') {
        throw new Error('User ID cannot be empty');
      }
      if (!orderData.products || orderData.products.length === 0) {
        throw new Error('Products cannot be empty');
      }
      if (!orderData.address || orderData.address.trim() === '') {
        throw new Error('Address cannot be empty');
      }
      if (!orderData.deliveryZone || orderData.deliveryZone.trim() === '') {
        throw new Error('Delivery zone is required');
      }

      // console.log('Creating order with data:', orderData);
      // console.log('User ID:', user._id);
      // console.log('Order items:', orderItems);
      // console.log('Address info:', addressInfo);
      // console.log('Selected payment method:', selectedPaymentMethod);

      const response = await createOrder(orderData);

      console.log('Order created successfully:', response);

      // Clear cart items and checkout data first
      clearCart();
      clearCheckoutData();
      completeCheckout();

      // Navigate to success page (replace the loading page)
      router.replace('/order-success');
    } catch (error) {
      console.error('Error creating order:', error);

      let errorMessage = 'Failed to create order. Please try again.';

      // Handle validation errors
      if (error.message) {
        errorMessage = error.message;
      }
      // Handle specific API error responses
      else if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);

        if (error.response.status === 400) {
          errorMessage = 'Invalid order data. Please check your information.';
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        errorMessage = 'Network error. Please check your connection.';
      }

      Alert.alert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to step 4 on error
            router.replace('/checkout-step4');
          },
        },
      ]);
    } finally {
      setIsCreatingOrder(false);
    }
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
            <Ionicons name="arrow-back" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>စစ်ဆေးပါ</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.totalSteps}>စုစုပေါင်း အဆင့် ၄ ဆင့်</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact & Address Summary */}
        {(contactInfo || addressInfo) && (
          <View style={styles.contactAddressSection}>
            <View style={styles.contactAddressSectionTitle}>
              <View>
                <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>
              </View>
              <Text style={styles.currentStep}>အဆင့် နံပါတ် ၄</Text>
            </View>
            {contactInfo && (
              <View style={styles.contactSection}>
                <Text style={styles.subsectionTitle}>
                  ဝယ်ယူသူ အချက်အလက်များ
                </Text>
                <View style={styles.contactCards}>
                  <View style={styles.contactCard}>
                    <View style={styles.contactCardHeader}>
                      <Ionicons
                        name="person-outline"
                        size={24}
                        color="#666666"
                      />
                      <Text style={styles.contactLabel}>နာမည်</Text>
                    </View>
                    <Text style={styles.contactValue}>
                      {contactInfo.name || 'Guest User'}
                    </Text>
                  </View>
                  <View style={styles.contactCard}>
                    <View style={styles.contactCardHeader}>
                      <Ionicons name="call-outline" size={24} color="#666666" />
                      <Text style={styles.contactLabel}>ဖုန်းနံပါတ်</Text>
                    </View>
                    <Text style={styles.contactValue}>
                      {contactInfo.phoneNumber || 'Not provided'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {addressInfo && (
              <View style={styles.deliverySection}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.subsectionTitle}>
                    ပို့ဆောင်ရမဲ့ နေရပ်လိပ်စာ
                  </Text>
                  <View style={styles.deliveryTypeBadge}>
                    <Text style={styles.deliveryTypeText}>
                      {addressInfo.deliveryType}
                    </Text>
                  </View>
                </View>

                <View style={styles.locationCards}>
                  <View style={styles.locationCard}>
                    <View style={styles.contactCardHeader}>
                      <Ionicons
                        name="business-outline"
                        size={24}
                        color="#666666"
                      />
                      <Text style={styles.locationLabel}>မြို့</Text>
                    </View>
                    <Text style={styles.locationValue}>
                      {addressInfo.city || 'Not provided'}
                    </Text>
                  </View>
                  <View style={styles.locationCard}>
                    <View style={styles.contactCardHeader}>
                      <Ionicons name="home-outline" size={24} color="#666666" />
                      <Text style={styles.locationLabel}>မြို့နယ်</Text>
                    </View>
                    <Text style={styles.locationValue}>
                      {addressInfo.township || 'Not provided'}
                    </Text>
                  </View>
                </View>

                <View style={styles.exactAddressCard}>
                  <View style={styles.contactCardHeader}>
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color="#666666"
                    />
                    <Text style={styles.exactAddressLabel}>
                      ပို့ဆောင်ရန် လိပ်စာ အတိအကျ
                    </Text>
                  </View>
                  <Text style={styles.exactAddressValue}>
                    {addressInfo.fullAddress || 'No address provided'}
                  </Text>
                </View>
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

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>ငွေပေးချေမှု</Text>

          <View style={styles.paymentMethodDisplay}>
            <View style={styles.paymentMethodCard}>
              {selectedPaymentMethod === 'prepayment' ? (
                <>
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name="card-outline" size={24} color="#666666" />
                  </View>
                  <Text style={styles.paymentMethodLabel}>ငွေကြိုရှင်း</Text>
                </>
              ) : (
                <>
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name="home-outline" size={24} color="#666666" />
                  </View>
                  <Text style={styles.paymentMethodLabel}>
                    အိမ်အရောက်ငွေချေ
                  </Text>
                </>
              )}
            </View>
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
          <Text style={styles.backActionText}>ပြန်စစ်မယ်</Text>
        </Pressable>
        <Pressable
          style={[
            styles.continueActionButton,
            isCreatingOrder && styles.continueActionButtonDisabled,
          ]}
          onPress={handleCreateOrder}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <Text style={styles.continueActionText}>အော်ဒါ တင်နေသည်...</Text>
          ) : (
            <Text style={styles.continueActionText}>အော်ဒါ တင်မယ်</Text>
          )}
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
    backgroundColor: '#F5F5F5',
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
    padding: 4,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginLeft: 8,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  totalSteps: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 2,
  },
  currentStep: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
  },
  contactAddressSectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactAddressSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  contactSection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  contactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  contactCards: {
    flexDirection: 'row',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  deliverySection: {
    marginBottom: 24,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTypeBadge: {
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deliveryTypeText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  addressTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  addressTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },
  addressTabActive: {
    backgroundColor: '#333333',
  },
  addressTabText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  addressTabTextActive: {
    color: '#FFFFFF',
  },
  locationCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  exactAddressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  exactAddressLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  exactAddressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentMethodDisplay: {
    marginTop: 12,
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  purchasedItemsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  itemsList: {
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
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  summaryDetails: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  continueActionButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  continueActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
