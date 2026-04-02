import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useCheckoutStore } from '../store/checkoutStore';
import { getUserAddresses } from '../services/user/getUserAddresses';
import { getDeliveryZone } from '../services/delivery/getDeliveryZone';
import PageHeader from './components/PageHeader';
import colors from '../constants/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DeliveryZoneErrorModal from './components/DeliveryZoneErrorModal';

const SkeletonItem = ({ style }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation());
    };

    startAnimation();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#E1E9EE',
          borderRadius: 4,
        },
        style,
        { opacity },
      ]}
    />
  );
};

export default function CheckoutStep1() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { setContactInfo, setAddressInfo } = useCheckoutStore();
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const addressTypes = userAddresses.map((address) => ({
    key: address._id,
    label: address.note,
  }));

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          if (user && isAuthenticated) {
            const response = await getUserAddresses();
            if (response.success) {
              setUserAddresses(response.data);
            }
          }
        } catch (err) {
          console.error('Error fetching user addresses:', err);
          setError('Failed to load user addresses');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [user, isAuthenticated])
  );

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

  const saveStep1Data = async () => {
    if (user && currentAddress) {
      // Save contact info
      setContactInfo({
        name: user.userName,
        phoneNumber: user.phoneNumber,
      });

      // Fetch delivery zone
      let deliveryZone = '';
      try {
        const deliveryZoneResponse = await getDeliveryZone(
          currentAddress.city,
          currentAddress.township
        );
        console.log("deliveryZoneResponse", deliveryZoneResponse);
        if (deliveryZoneResponse.success && deliveryZoneResponse.data.deliveryZone) {
          deliveryZone = deliveryZoneResponse.data.deliveryZone;
        } else {
          setModalMessage(deliveryZoneResponse.message);
          setShowErrorModal(true);
          return false;
        }
      } catch (error) {
        console.error('Error fetching delivery zone:', error);
        setModalMessage('ပို့ဆောင်ရေး အချက်အလက်များကို ရယူရာတွင် အမှားအယွင်းရှိနေပါသည်။');
        setShowErrorModal(true);
        return false;
      }

      // Save address info with delivery zone
      setAddressInfo({
        addressId: currentAddress._id,
        addressType: selectedAddressType || 'home',
        city: currentAddress.city,
        township: currentAddress.township,
        fullAddress: currentAddress.address,
        deliveryType: 'ဂိတ်ချနဲ့ ပို့မယ်',
        deliveryZone,
      });
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="စစ်ဆေးပါ"
        showBackButton={true}
        rightContent="စုစုပေါင်း အဆင့် ၄ ဆင့်"
      />

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
            {loading ? (
              <>
                <SkeletonItem style={styles.contactCard} />
                <SkeletonItem style={styles.contactCard} />
              </>
            ) : (
              <>
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
                    <MaterialCommunityIcons name="phone-outline" size={17} color="black" />
                    <Text style={styles.contactLabel}>ဖုန်းနံပါတ်</Text>
                  </View>
                  <Text style={styles.contactValue}>
                    {user?.phoneNumber || 'Not provided'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.deliverySection}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.subsectionTitle}>
              ပို့ဆောင်ရမဲ့ နေရပ်လိပ်စာ
            </Text>

            <Pressable
              style={styles.addButton}
              onPress={() => router.push('/add-address')}
            >
              <Text style={styles.addButtonText}>လိပ်စာ ထည့်မယ်</Text>
            </Pressable>
          </View>

          {/* Address Type Tabs */}
          {addressTypes.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.addressTabs}
              contentContainerStyle={styles.addressTabsContent}
            >
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
            </ScrollView>
          )}

          {/* Location Cards */}
          <View style={styles.contactCards}>
            {loading ? (
              <>
                <SkeletonItem style={styles.contactCard} />
                <SkeletonItem style={styles.contactCard} />
              </>
            ) : (
              <>
                <View style={styles.contactCard}>
                  <View style={styles.contactCardHeader}>
                    <MaterialCommunityIcons name="city" size={17} color="black" />
                    <Text style={styles.contactLabel}>မြို့</Text>
                  </View>
                  <Text style={styles.contactValue}>
                    {currentAddress?.city || 'Not provided'}
                  </Text>
                </View>
                <View style={styles.contactCard}>
                  <View style={styles.contactCardHeader}>
                    <MaterialIcons name="other-houses" size={17} color="black" />
                    <Text style={styles.contactLabel}>မြို့နယ်</Text>
                  </View>
                  <Text style={styles.contactValue}>
                    {currentAddress?.township || 'Not provided'}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Exact Address */}
          {loading ? (
            <SkeletonItem style={styles.exactAddressCard} />
          ) : (
            <View style={styles.exactAddressCard}>
              <View style={styles.contactCardHeader}>
                <Ionicons name="location-outline" size={17} color="black" />
                <Text style={styles.contactLabel}>
                  ပို့ဆောင်ရန် လိပ်စာ အတိအကျ
                </Text>
              </View>

              <Text style={styles.contactValue}>
                {currentAddress?.address || 'No address provided'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.backActionButton, isNavigating && { opacity: 0.7 }]}
          disabled={isNavigating}
          onPress={() => {
            if (isNavigating) return;
            setIsNavigating(true);
            router.back();
            setTimeout(() => setIsNavigating(false), 1000);
          }}
        >
          <Text style={styles.backActionText}>ပြန်သွားမယ်</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmActionButton, isNavigating && { opacity: 0.7 }]}
          disabled={isNavigating}
          onPress={async () => {
            if (isNavigating) return;
            setIsNavigating(true);
            const success = await saveStep1Data();
            if (success) {
              router.push('/checkout-step2');
              setTimeout(() => setIsNavigating(false), 1000);
            } else {
              setIsNavigating(false); // Enable button if save failed
            }
          }}
        >
          {isNavigating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmActionText}>မှန်ကန်ပါတယ်</Text>
          )}
        </TouchableOpacity>
      </View>
      <DeliveryZoneErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={modalMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  importantInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitleContainer: {
    marginVertical: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactSection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
    marginBottom: 12,
  },
  contactCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  contactCard: {
    backgroundColor: colors.background.secondary,
    width: 163,
    height: 106,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 16,
  },
  addressTabsContent: {
    flexDirection: 'row',
    gap: 8,
  },
  addressTab: {
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    opacity: 0.3,
  },
  addressTabActive: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.light,
    opacity: 1,
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
    paddingHorizontal: 20,
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
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  backActionButton: {
    flex: 1,
    backgroundColor: colors.button.light,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  backActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  confirmActionButton: {
    flex: 1,
    backgroundColor: colors.button.primary,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  confirmActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.light,
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
