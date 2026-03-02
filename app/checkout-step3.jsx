import React, { useState } from 'react';
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PageHeader from './components/PageHeader';
import colors from '../constants/colors';

export default function CheckoutStep3() {
  const router = useRouter();
  const { getTotalPrice } = useCartStore();
  const { setPaymentMethod, setReceiptImage, setPaymentDetails } =
    useCheckoutStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('cash-on-delivery');
  const [selectedPaymentType, setSelectedPaymentType] = useState('cash'); // 'cash' for COD, 'kpay' for cash-down

  const paymentMethods = [
    { key: 'cash-on-delivery', label: 'အိမ်အရောက်ငွေချေ', type: 'radio' },
    { key: 'k-pay', label: 'ငွေကြိုရှင်း', type: 'radio' },
  ];

  // Payment type options based on selected payment method
  const getPaymentTypeOptions = () => {
    if (selectedPaymentMethod === 'cash-on-delivery') {
      return [{ key: 'cash', label: 'ငွေသား', icon: 'cash-outline' }];
    } else if (selectedPaymentMethod === 'k-pay') {
      return [{ key: 'kpay', label: 'KPAY', icon: 'card-outline' }];
    }
    return [];
  };

  const handlePaymentMethodChange = (methodKey) => {
    setSelectedPaymentMethod(methodKey);
    // Reset payment type when payment method changes
    if (methodKey === 'cash-on-delivery') {
      setSelectedPaymentType('cash');
    } else if (methodKey === 'k-pay') {
      setSelectedPaymentType('kpay');
    }
  };

  const saveStep3Data = async () => {
    setPaymentMethod(selectedPaymentMethod);

    // Set payment details based on selected payment type
    if (selectedPaymentMethod === 'k-pay') {
      setPaymentDetails({
        paymentType: 'kpay',
      });
    } else if (selectedPaymentMethod === 'cash-on-delivery') {
      setPaymentDetails({
        paymentType: 'cash',
      });
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
        {/* Payment Information Section */}
        <View style={styles.paymentInfoSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                ငွေပေးချေမှုဆိုင်ရာ
              </Text>
              <Text style={styles.sectionTitle}>
                အချက်အလက်များ
              </Text>
            </View>
            <View style={styles.currentStepBadge}>
              <Text style={styles.currentStepText}>အဆင့် နံပါတ် ၃</Text>
            </View>
          </View>

          {/* Payment Method Section */}
          <View style={styles.paymentMethodSection}>
            <Text style={styles.subsectionTitle}>ငွေပေးချေမှု</Text>
            <View style={styles.paymentOptionsCard}>
              {paymentMethods.map((method) => (
                <Pressable
                  key={method.key}
                  style={styles.paymentOption}
                  onPress={() => handlePaymentMethodChange(method.key)}
                >
                  <View style={styles.paymentOptionLeft}>
                    {method.type === 'checkbox' ? (
                      <View
                        style={[
                          styles.checkbox,
                          selectedPaymentMethod === method.key &&
                          styles.checkboxSelected,
                        ]}
                      >
                        {selectedPaymentMethod === method.key && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                          />
                        )}
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.radioButton,
                          selectedPaymentMethod === method.key &&
                          styles.radioButtonSelected,
                        ]}
                      >
                        {selectedPaymentMethod === method.key && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    )}
                    <Text style={styles.paymentOptionText}>{method.label}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Payment Type Section - Only show if payment method is selected */}
          {selectedPaymentMethod && (
            <View style={styles.paymentTypeSection}>
              <Text style={styles.subsectionTitle}>ငွေပေးချေမှု နည်းလမ်း</Text>
              <View style={styles.paymentOptionsCard}>
                {getPaymentTypeOptions().map((option) => (
                  <Pressable
                    key={option.key}
                    style={styles.paymentTypeOption}
                    onPress={() => setSelectedPaymentType(option.key)}
                  >
                    <View style={styles.paymentTypeOptionLeft}>
                      {option.key === 'kpay' ? (
                        <View style={styles.kpayIconContainer}>
                          <Image
                            source={require('../assets/images/kpay.png')}
                            style={styles.kpayIcon}
                            resizeMode="contain"
                          />
                        </View>
                      ) : (
                        <MaterialCommunityIcons name="currency-usd" size={20} color="black" />
                      )}
                      <Text style={styles.paymentOptionText}>
                        {option.label}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        selectedPaymentType === option.key &&
                        styles.radioButtonSelected,
                      ]}
                    >
                      {selectedPaymentType === option.key && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Pressable
          style={styles.backActionButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backActionText}>ပြန်သွားမယ်</Text>
        </Pressable>
        <Pressable
          style={styles.payActionButton}
          onPress={async () => {
            // Show modal if kpay is selected
            await saveStep3Data();
            router.push('/checkout-step4');
          }}
        >
          <Text style={styles.payActionText}>ငွေပေးချေမယ်</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  paymentInfoSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 16,
  },
  sectionTitleContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansMyanmar-Regular',
    lineHeight: 38,
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  currentStepBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 18,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  currentStepText: {
    color: colors.text.primary,
    fontSize: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  paymentTypeSection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  paymentOptionsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentTypeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentTypeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentTypeIcon: {
    marginRight: 12,
  },
  kpayIconContainer: {
    marginRight: 12,
  },
  kpayIcon: {
    width: 32,
    height: 32,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.2,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
    opacity: 1,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentOptionText: {
    fontSize: 14,
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  backActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  payActionButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  payActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% opacity overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentProcessingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    width: '100%',
  },
  paymentProcessingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  paymentProcessingDescription: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  loadingDots: {
    marginVertical: 16,
  },
  waitingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
});
