import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useCheckoutStore } from '../store/checkoutStore';
import {
  getUserAddresses,
  UserAddress,
} from '../services/user/getUserAddresses';

export default function CheckoutStep1() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { setContactInfo, setAddressInfo } = useCheckoutStore();
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addressTypes = userAddresses.map((address, index) => ({
    key: address._id,
    label: address.note,
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user && isAuthenticated) {
          const response = await getUserAddresses(user._id);
          if (response.success) {
            setUserAddresses(response.data.userAddressInfo);
          }
        }
      } catch (err) {
        console.error('Error fetching user addresses:', err);
        setError('Failed to load user addresses');
      } finally {
        setLoading(false);
      }
    };

    console.log('userAddresses', userAddresses);

    fetchUserData();
  }, [user, isAuthenticated]);

  const getCurrentAddress = () => {
    if (userAddresses.length === 0) return null;
    if (selectedAddressType) {
      return userAddresses.find(
        (address) => address._id === selectedAddressType
      );
    }
    return userAddresses[0]; // Use first address as default
  };

  const currentAddress = getCurrentAddress();

  // Set default selected address when addresses are loaded
  useEffect(() => {
    if (userAddresses.length > 0 && !selectedAddressType) {
      setSelectedAddressType(userAddresses[0]._id);
    }
  }, [userAddresses, selectedAddressType]);

  const saveStep1Data = () => {
    if (user && currentAddress) {
      // Save contact info
      setContactInfo({
        name: user.userName,
        phoneNumber: user.phoneNumber,
      });

      // Save address info
      setAddressInfo({
        addressId: currentAddress._id,
        addressType: selectedAddressType || 'home',
        city: currentAddress.city,
        township: currentAddress.township,
        fullAddress: currentAddress.address,
        deliveryType: 'ဂိတ်ချနဲ့ ပို့မယ်',
      });
    }
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
        {/* Important Information Section */}
        <View style={styles.importantInfoSection}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>အရေးကြီးသော </Text>
            <Text style={styles.sectionTitle}>အချက်အလက်များ</Text>
          </View>
          <View style={styles.currentStepBadge}>
            <Text style={styles.currentStepText}>အဆင့် နံပါတ် ၁</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.subsectionTitle}>ဆက်သွယ်ရန်</Text>
          <View style={styles.contactCards}>
            <View style={styles.contactCard}>
              <View style={styles.contactCardHeader}>
                <Ionicons name="person-outline" size={24} color="#666666" />
                <Text style={styles.contactLabel}>နာမည်</Text>
              </View>
              <Text style={styles.contactValue}>
                {loading ? (
                  <ActivityIndicator size="small" color="#666666" />
                ) : (
                  user?.userName || 'Guest User'
                )}
              </Text>
            </View>
            <View style={styles.contactCard}>
              <View style={styles.contactCardHeader}>
                <Ionicons name="call-outline" size={24} color="#666666" />
                <Text style={styles.contactLabel}>ဖုန်းနံပါတ်</Text>
              </View>
              <Text style={styles.contactValue}>
                {loading ? (
                  <ActivityIndicator size="small" color="#666666" />
                ) : (
                  user?.phoneNumber || 'Not provided'
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.deliverySection}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.subsectionTitle}>
              ပို့ဆောင်ရမဲ့ နေရပ်လိပ်စာ
            </Text>
            <View style={styles.deliveryTypeBadge}>
              <Text style={styles.deliveryTypeText}>ဂိတ်ချနဲ့ ပို့မယ်</Text>
            </View>
          </View>

          {/* Address Type Tabs */}
          {addressTypes.length > 0 && (
            <View style={styles.addressTabs}>
              {addressTypes.map((type) => (
                <Pressable
                  key={type.key}
                  style={[
                    styles.addressTab,
                    selectedAddressType === type.key && styles.addressTabActive,
                  ]}
                  onPress={() => setSelectedAddressType(type.key)}
                >
                  <Text
                    style={[
                      styles.addressTabText,
                      selectedAddressType === type.key &&
                        styles.addressTabTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Location Cards */}
          <View style={styles.locationCards}>
            <View style={styles.locationCard}>
              <View style={styles.contactCardHeader}>
                <Ionicons name="business-outline" size={24} color="#666666" />
                <Text style={styles.locationLabel}>မြို့</Text>
              </View>
              <Text style={styles.locationValue}>
                {loading ? (
                  <ActivityIndicator size="small" color="#666666" />
                ) : (
                  currentAddress?.city || 'Not provided'
                )}
              </Text>
            </View>
            <View style={styles.locationCard}>
              <View style={styles.contactCardHeader}>
                <Ionicons name="home-outline" size={24} color="#666666" />
                <Text style={styles.locationLabel}>မြို့နယ်</Text>
              </View>
              <Text style={styles.locationValue}>
                {loading ? (
                  <ActivityIndicator size="small" color="#666666" />
                ) : (
                  currentAddress?.township || 'Not provided'
                )}
              </Text>
            </View>
          </View>

          {/* Exact Address */}
          <View style={styles.exactAddressCard}>
            <View style={styles.contactCardHeader}>
              <Ionicons name="location-outline" size={24} color="#666666" />
              <Text style={styles.exactAddressLabel}>
                ပို့ဆောင်ရန် လိပ်စာ အတိအကျ
              </Text>
            </View>

            <Text style={styles.exactAddressValue}>
              {loading ? (
                <ActivityIndicator size="small" color="#666666" />
              ) : (
                currentAddress?.address || 'No address provided'
              )}
            </Text>
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
          style={styles.confirmActionButton}
          onPress={() => {
            saveStep1Data();
            console.log('Navigating to checkout-step2');
            router.push('/checkout-step2');
          }}
        >
          <Text style={styles.confirmActionText}>မှန်ကန်ပါတယ်</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    marginTop: 20,
  },
  screenTitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 4,
  },
  currentStepBadge: {
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
  },
  currentStepText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitleContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  importantInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  confirmActionButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFB3B3',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
});
