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
import { getDeliveryZone } from '../services/delivery/getDeliveryZone';
import { createOrder } from '../services/order/createOrder';
import colors from '../constants/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PageHeader from './components/PageHeader';

export default function CheckoutStep4() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { checkoutData, completeCheckout, clearCheckoutData, setAddressInfo } =
    useCheckoutStore();
  const { user } = useAuthStore();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const { contactInfo, addressInfo, orderItems, orderSummary, paymentInfo } =
    checkoutData;


  // Get selected payment method from checkout store or default to prepayment
  const selectedPaymentMethod = paymentInfo?.selectedMethod;

  // console.log("orderSummary", orderSummary);

  const handleCreateOrder = async () => {
    let deliveryZone = addressInfo.deliveryZone;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!contactInfo || !addressInfo || !orderItems.length || !deliveryZone) {
      Alert.alert('Error', 'Missing required order information');
      return;
    }

    // setIsCreatingOrder(true);

    // Navigate to loading page
    // router.push('/order-processing');

    try {
      if (!orderItems || orderItems.length === 0) {
        throw new Error('No items in cart');
      }
      if (!addressInfo?.fullAddress) {
        throw new Error('Address is required');
      }

      const products = orderItems.map((item) => ({
        stockId: item.id.toString(), // Convert number to string
        quantity: item.quantity,
      }));

      const orderData = {
        products,
        address: addressInfo.fullAddress,
        deliveryZone: deliveryZone,
        platform: 'ecommerce',
        paymentMethod: paymentInfo.selectedMethod,
      };

      // Additional validation for API requirements

      if (!orderData.products || orderData.products.length === 0) {
        throw new Error('Products cannot be empty');
      }
      if (!orderData.address || orderData.address.trim() === '') {
        throw new Error('Address cannot be empty');
      }
      if (!orderData.deliveryZone || orderData.deliveryZone.trim() === '') {
        throw new Error('Delivery zone is required');
      }

      console.log(orderData);

      const response = await createOrder(orderData);
      console.log("response", response);

      if (response.success) {
        console.log("Order created successfully");

      }

      // Clear cart items and checkout data first
      // clearCart();
      // clearCheckoutData();
      // completeCheckout();

      // Navigate to success page (replace the loading page)
      // router.replace('/order-success');
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <PageHeader
        title="စစ်ဆေးပါ"
        showBackButton={true}
        rightContent="စုစုပေါင်း အဆင့် ၄ ဆင့်"
      />



      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.purchasedItemsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>အဆင့် နံပါတ် ၄</Text>
            </View>
          </View>
        </View>


        {/* Contact & Address Summary */}
        {(contactInfo || addressInfo) && (
          <View style={styles.contactAddressSection}>

            {contactInfo && (
              <View>
                <Text style={styles.subsectionTitle}>
                  ဝယ်ယူသူ အချက်အလက်များ
                </Text>
                <View style={styles.contactCards}>
                  <View style={styles.contactCard}>
                    <View style={styles.contactCardHeader}>
                      <MaterialCommunityIcons name="account-circle-outline" size={17} color="black" />
                      <Text style={styles.contactLabel}>နာမည်</Text>
                    </View>
                    <Text style={styles.contactValue}>
                      {user?.userName || 'Guest User'}
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
              <View style={styles.exactAddressCard}>
                <View style={styles.contactCardHeader}>
                  <Ionicons name="location-outline" size={17} color="black" />
                  <Text style={styles.contactLabel}>
                    ပို့ဆောင်ရန် လိပ်စာ အတိအကျ
                  </Text>
                </View>

                <Text style={styles.contactValue}>
                  {addressInfo.fullAddress || 'No address provided'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Purchased Items Section */}
        <View style={styles.purchasedItemsSection}>
          <Text style={styles.sectionTitle}>ဝယ်ယူထားသော ပစ္စည်းများ</Text>

          <View style={styles.itemsList}>
            {orderItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity} ခု</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemWeight}>
                    {item?.weight} KG
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  MMK {(item.price * item.quantity)?.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>စုစုပေါင်း</Text>
              <Text style={styles.summaryValue}>
                MMK {orderSummary?.subtotal?.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ပို့ဆောင်ခ</Text>
              <Text style={styles.summaryValue}>
                MMK {orderSummary?.shippingFee?.toLocaleString()}
              </Text>
            </View>

            {orderSummary.totalWeight > 2 && (
              <View style={styles.summaryRow}>
                <View style={styles.overweightRow}>
                  <Text style={styles.summaryLabel}>ဝန်ပိုကြေး</Text>
                  <Text style={styles.weightText}>
                    {orderSummary?.totalWeight?.toFixed(2)} KG
                  </Text>
                </View>
                <Text style={styles.summaryValue}>
                  MMK {orderSummary?.overweightCharge?.toLocaleString()}
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>စုစုပေါင်း</Text>
              <Text style={styles.grandTotalValue}>
                MMK {orderSummary?.grandTotal?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeader}>
            <Text style={styles.sectionTitle}>ငွေပေးချေမှု</Text>
            <Pressable
              style={styles.changeButton}
              onPress={() => router.push('/checkout-step3')}
            >
              <Text style={styles.changeButtonText}>ပြောင်းလဲရန်</Text>
            </Pressable>
          </View>

          <View style={styles.paymentMethodDisplay}>
            {/* Payment Method Card */}
            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentCardLeft}>
                <View>
                  <MaterialCommunityIcons name="currency-usd" size={20} color={colors.text.primary} />
                </View>
                <Text style={styles.paymentMethodLabel}>ငွေပေးချေမှု</Text>
              </View>
              <Text style={styles.paymentMethodValue}>
                {selectedPaymentMethod === 'cash-on-delivery'
                  ? 'အိမ်အရောက်ငွေချေ'
                  : 'ငွေကြိုရှင်း'}
              </Text>
            </View>

            {/* Payment Type Card */}
            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentCardLeft}>
                <Ionicons name="wallet-outline" size={20} color={colors.text.primary} />
                <Text style={styles.paymentMethodLabel}>ငွေပေးချေမှု နည်းလမ်း</Text>
              </View>
              <View style={styles.paymentCardRight}>
                {paymentInfo?.paymentType === 'cash' && (
                  <MaterialCommunityIcons name="currency-usd" size={16} color={colors.text.primary} />
                )}
                <Text style={styles.paymentMethodValue}>
                  {selectedPaymentMethod === 'cash-on-delivery' ? 'ငွေသား' : (
                    <View style={styles.kpayIconContainer}>
                      <Image
                        source={require('../assets/images/kpay.png')}
                        style={styles.kpayIcon}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </Text>
              </View>
            </View>
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
    backgroundColor: colors.background.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 16,
  },
  currentStep: {
    fontSize: 12,
    color: colors.button.primary,
    fontWeight: '900',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  contactCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  contactCard: {
    backgroundColor: colors.background.secondary,
    width: 163,
    height: 106,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 26,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  contactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.text.primary,
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.2,

  },
  contactValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deliveryTypeText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
  addressTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  addressTab: {
    width: 49,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },
  addressTabActive: {
    backgroundColor: colors.background.secondary,
  },
  addressTabText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  addressTabTextActive: {
    color: colors.text.primary,
  },
  locationCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    marginTop: 20,
    height: 127,
    flexDirection: 'column',
    paddingLeft: 20,
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 20,

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
    marginVertical: 24,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeButton: {
    paddingHorizontal: 16,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.text.primary,
  },
  paymentMethodDisplay: {
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: 20,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentOptionIconSquare: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodLabel: {
    fontSize: 14,
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.text.primary,
  },
  kpayIconContainer: {
    marginRight: 12,
  },
  kpayIcon: {
    width: 32,
    height: 32,
  },
  paymentMethodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  paymentCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  purchasedItemsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansMyanmar-Regular',
    lineHeight: 38,
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  itemsList: {
    borderRadius: 12,
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.text.primary,
    width: "10%"
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    color: colors.text.primary,

    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  itemWeight: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,

  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  orderSummarySection: {
    marginBottom: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  summaryContainer: {
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  overweightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: 8,
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
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
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
    backgroundColor: colors.background.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  backActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  continueActionButton: {
    flex: 1,
    backgroundColor: colors.button.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueActionButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  continueActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});