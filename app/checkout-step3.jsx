import React, { useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';

export default function CheckoutStep3() {
  const router = useRouter();
  const { getTotalPrice } = useCartStore();
  const { setPaymentMethod, setReceiptImage, setPaymentDetails } =
    useCheckoutStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('prepayment');
  const [selectedReceiptImage, setSelectedReceiptImage] = useState(null);

  // Calculate total (same as step 2)
  const totalWeight = 3.8; // Example weight
  const shippingFee = 3000;
  const overweightCharge = totalWeight > 3 ? 2000 : 0;
  const grandTotal = getTotalPrice() + shippingFee + overweightCharge;

  const paymentMethods = [
    { key: 'cod', label: 'အိမ်အရောက်ငွေချေ', type: 'radio' },
    { key: 'prepayment', label: 'ငွေကြိုရှင်း', type: 'radio' },
  ];

  const pickImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedReceiptImage(result.assets[0]);
        setReceiptImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = () => {
    setSelectedReceiptImage(null);
    setReceiptImage(null);
  };

  const saveStep3Data = () => {
    setPaymentMethod(selectedPaymentMethod);

    // Set sample payment details
    setPaymentDetails({
      bankName: 'A BANK',
      transactionAmount: '-50,000.00',
      transactionDate: '01/01/2023 04:04:04',
      transactionNo: 'E1234567890+123456',
      transferTo: 'Daw Hla Hla (123456789)',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>စစ်ဆေးပါ</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.totalSteps}>စုစုပေါင်း အဆင့် ၄ ဆင့်</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Information Section */}
        <View style={styles.paymentInfoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              ငွေပေးချေမှုဆိုင်ရာ အချက်အလက်များ
            </Text>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>အဆင့် နံပါတ် ၃</Text>
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
                  onPress={() => setSelectedPaymentMethod(method.key)}
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

          {/* Payment Receipt Section */}
          <View style={styles.paymentReceiptSection}>
            <Text style={styles.subsectionTitle}>ငွေပေးချေမှု ဖြတ်ပိုင်း</Text>

            <View style={styles.receiptDetails}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>ငွေလွှဲရန်</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>စုစုပေါင်း</Text>
                <Text style={styles.receiptValue}>
                  MMK {grandTotal.toLocaleString()}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Kpay</Text>
                <View style={styles.receiptRight}>
                  <Text style={styles.receiptValue}>09782711003</Text>
                  <Text style={styles.receiptName}>ဦ်းမင်း</Text>
                </View>
              </View>
            </View>
          </View>

          {/* KBZPay QR Code Section - Only show if no receipt uploaded */}
          {!selectedReceiptImage && (
            <View style={styles.qrCodeSection}>
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrCodeWrapper}>
                  {/* Real QR Code Image */}
                  <View style={styles.qrCodeImageContainer}>
                    <Image
                      source={require('../assets/images/QR.jpg')}
                      style={styles.qrCodeImage}
                      resizeMode="contain"
                    />

                    {/* Embedded Profile Picture */}
                    {/* <View style={styles.embeddedProfile}>
                      <View style={styles.profileImage}>
                        <Ionicons name="person" size={20} color="#666666" />
                      </View>
                    </View> */}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Upload Receipt Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.subsectionTitle}>
              ငွေဖြတ်ပိုင်း ပုံတင်ခြင်း
            </Text>

            {selectedReceiptImage ? (
              <View style={styles.receiptPreviewContainer}>
                <View style={styles.receiptPreview}>
                  <Image
                    source={{ uri: selectedReceiptImage.uri }}
                    style={styles.receiptPreviewImage}
                    resizeMode="cover"
                  />
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </Pressable>
                </View>
                <Text style={styles.receiptPreviewText}>
                  Receipt uploaded successfully
                </Text>
              </View>
            ) : (
              <Pressable style={styles.uploadButton} onPress={pickImage}>
                <View style={styles.uploadButtonContent}>
                  <Ionicons name="camera-outline" size={24} color="#666666" />
                  <Text style={styles.uploadButtonText}>
                    ငွေဖြတ်ပိုင်းပုံ တင်မယ်
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </Pressable>
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
          <Text style={styles.backActionText}>ပြန်သွားမယ်</Text>
        </Pressable>
        <Pressable
          style={styles.payActionButton}
          onPress={() => {
            saveStep3Data();
            console.log('Navigating to checkout-step4');
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
  topBar: {
    backgroundColor: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  topBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    color: '#000000',
    flex: 1,
    marginLeft: 16,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  totalSteps: {
    fontSize: 12,
    color: '#666666',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  stepBadge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepBadgeText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  paymentOptionsCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
  },
  paymentOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000000',
    opacity: 0.2,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#000000',
    opacity: 1,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#000000',
  },
  paymentReceiptSection: {
    marginBottom: 24,
  },
  receiptDetails: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#666666',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  receiptRight: {
    alignItems: 'flex-end',
  },
  receiptName: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  qrCodeSection: {
    marginBottom: 24,
  },
  qrCodeContainer: {
    // backgroundColor: '#007AFF',
    // borderRadius: 12,
    // padding: 20,
    alignItems: 'center',
  },
  qrCodeInstruction: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  qrCodeImageContainer: {
    width: 500,
    height: 500,
    position: 'relative',
  },
  qrCodeImage: {
    width: 500,
    height: 500,
  },
  embeddedProfile: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  kbzpayLogo: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
  },
  kbzpayLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kbzpayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  kbzpayIcon: {
    marginHorizontal: 4,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 12,
  },
  receiptPreviewContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  receiptPreview: {
    position: 'relative',
    marginBottom: 12,
  },
  receiptPreviewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  receiptPreviewText: {
    fontSize: 12,
    color: '#4CAF50',
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
  payActionButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
