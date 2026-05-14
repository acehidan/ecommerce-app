import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import addAddress from '../services/user/addAddress';
import updateAddress from '../services/user/updateAddress';
import { getUserProfile } from '../services/user/userProfile';
import Toast from 'react-native-toast-message';
import { getDeliveries } from '../services/delivery/getDeliveries';
import PageHeader from './components/PageHeader';

export default function AddAddress() {
  const params = useLocalSearchParams();
  const addressData = params.addressData
    ? JSON.parse(params.addressData)
    : null;
  const isEditMode = !!addressData;

  const [addressName, setAddressName] = useState(addressData?.note || '');
  const [selectedCity, setSelectedCity] = useState(addressData?.city || '');
  const [selectedTownship, setSelectedTownship] = useState(
    addressData?.township || '',
  );
  const [exactAddress, setExactAddress] = useState(addressData?.address || '');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showTownshipDropdown, setShowTownshipDropdown] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [cities, setCities] = useState([]);
  const [townships, setTownships] = useState({});
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [deliveryError, setDeliveryError] = useState(null);

  // Fetch delivery data on component mount
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoadingDeliveries(true);
      setDeliveryError(null);
      const response = await getDeliveries();

      if (response.status === 'success' && response.data) {
        setDeliveries(response.data);

        // Extract unique cities
        const uniqueCities = [
          ...new Set(response.data.map((item) => item.city)),
        ];
        setCities(uniqueCities);

        // Group townships by city
        const townshipsByCity = {};
        uniqueCities.forEach((city) => {
          townshipsByCity[city] = response.data
            .filter((item) => item.city === city)
            .map((item) => item.township);
        });
        setTownships(townshipsByCity);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setDeliveryError(error.message);
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2:
          'မြို့နှင့် မြို့နယ် အချက်အလက်များ ရယူရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleAddAddress = async () => {
    if (!addressName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လိပ်စာ နာမည်ထည့်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    if (!selectedCity) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'မြို့ရွေးချယ်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    if (!selectedTownship) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'မြို့နယ် ရွေးချယ်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    if (!exactAddress.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လိပ်စာ အတိအကျ ထည့်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        // Update existing address
        const updateData = {
          note: addressName.trim(),
          address: exactAddress.trim(),
          city: selectedCity,
          township: selectedTownship,
        };

        const response = await updateAddress(addressData._id, updateData);

        if (response.success) {
          Toast.show({
            type: 'success',
            text1: 'အောင်မြင်',
            text2: 'လိပ်စာ အချက်အလက်များ အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ',
            position: 'top',
            visibilityTime: 2000,
            onHide: () => router.back(),
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'အမှား',
            text2:
              response.message || 'လိပ်စာပြင်ဆင်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်',
            position: 'top',
            visibilityTime: 3000,
          });
        }
      } else {
        // Add new address
        const userProfile = await getUserProfile();
        // console.log(userProfile);
        if (!userProfile?.user?._id) {
          throw new Error('User not found');
        }

        const newAddressData = {
          userId: userProfile.user._id,
          note: addressName.trim(),
          address: exactAddress.trim(),
          city: selectedCity,
          township: selectedTownship,
        };

        const response = await addAddress(newAddressData);

        if (response.success) {
          router.back();
        } else {
          Toast.show({
            type: 'error',
            text1: 'အမှား',
            text2:
              response.message ||
              'လိပ်စာထည့်သွင်းရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်',
            position: 'top',
            visibilityTime: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: isEditMode
          ? 'လိပ်စာပြင်ဆင်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
          : 'လိပ်စာထည့်သွင်းရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedTownship(''); // Reset township when city changes
    setShowCityDropdown(false);
  };

  const handleTownshipSelect = (township) => {
    setSelectedTownship(township);
    setShowTownshipDropdown(false);
  };

  const renderField = (
    icon,
    label,
    placeholder,
    value,
    onChangeText,
    onPress,
    showDropdown = false,
  ) => (
    <View style={styles.fieldWrapper}>
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Ionicons name={icon} size={20} color="#666666" />
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <Pressable style={styles.inputContainer} onPress={onPress}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#999999"
            editable={!showDropdown}
          />
          {showDropdown && (
            <Ionicons name="chevron-down" size={20} color="#666666" />
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.container}
      pointerEvents={isLoading ? 'none' : 'auto'}
    >
      <ScrollView style={styles.content}>
        {/* Header */}
        <PageHeader
          title={isEditMode ? 'လိပ်စာ ပြင်ဆင်မယ်' : 'လိပ်စာအသစ် ထည့်မယ်'}
          showBackButton={true}
        />

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Address Name Field */}
          {renderField(
            'location-outline',
            'လိပ်စာ နာမည်',
            'လိပ်စာ နာမည်ထည့်ပါ',
            addressName,
            setAddressName,
          )}

          {/* Exact Delivery Address Field */}
          {renderField(
            'location-outline',
            'ပို့ဆောင်ရန် လိပ်စာ အတိအကျ',
            'လိပ်စာ အတိအကျ ထည့်ပေးပါ',
            exactAddress,
            setExactAddress,
          )}

          {/* City Selection Field */}
          {renderField(
            'business-outline',
            'မြို့',
            'မြို့ရွေးချယ်ပေးပါ',
            selectedCity,
            null,
            () => setShowCityDropdown(!showCityDropdown),
            true,
          )}

          {/* City Dropdown */}
          {showCityDropdown && (
            <View style={styles.dropdownContainer}>
              {loadingDeliveries ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#666666" />
                  <Text style={styles.loadingText}>ဖတ်နေသည်...</Text>
                </View>
              ) : deliveryError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{deliveryError}</Text>
                </View>
              ) : cities.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>မြို့များ မရှိပါ</Text>
                </View>
              ) : (
                cities.map((city) => (
                  <Pressable
                    key={city}
                    style={styles.dropdownItem}
                    onPress={() => handleCitySelect(city)}
                  >
                    <Text style={styles.dropdownItemText}>{city}</Text>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {/* Township Wrapper */}
          <View style={{ zIndex: 10 }}>
            {/* Township Selection Field */}
            {renderField(
              'home-outline',
              'မြို့နယ်',
              'မြို့နယ် ရွေးချယ်ပေးပါ',
              selectedTownship,
              null,
              () => setShowTownshipDropdown(!showTownshipDropdown),
              true,
            )}

            {/* Township Dropdown */}
            {showTownshipDropdown && (
              <ScrollView
                style={[
                  styles.dropdownContainer,
                  {
                    position: 'absolute',
                    bottom: 85,
                    left: 0,
                    right: 0,
                    maxHeight: 250,
                    zIndex: 1000,
                  },
                ]}
                nestedScrollEnabled={true}
              >
                {!selectedCity ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      မြို့နယ် ရွေးချယ်ရန် မြို့ကို အရင် ရွေးချယ်ပေးပါ
                    </Text>
                  </View>
                ) : loadingDeliveries ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#666666" />
                    <Text style={styles.loadingText}>ဖတ်နေသည်...</Text>
                  </View>
                ) : !townships[selectedCity] ||
                  townships[selectedCity].length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>မြို့နယ်များ မရှိပါ</Text>
                  </View>
                ) : (
                  townships[selectedCity].map((township) => (
                    <Pressable
                      key={township}
                      style={styles.dropdownItem}
                      onPress={() => handleTownshipSelect(township)}
                    >
                      <Text style={styles.dropdownItemText}>{township}</Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.cancelButton,
            isLoading && styles.cancelButtonDisabled,
          ]}
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>မလုပ်တော့ပါ</Text>
        </Pressable>
        <Pressable
          style={[styles.addButton, isLoading && styles.addButtonDisabled]}
          onPress={handleAddAddress}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingButtonContent}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.addButtonText}>
                {isEditMode ? 'ပြင်ဆင်နေသည်...' : 'ထည့်သွင်းနေသည်...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.addButtonText}>
              {isEditMode ? 'လိပ်စာ ပြင်ဆင်မယ်' : 'လိပ်စာအသစ် ထည့်မယ်'}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Cancel Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCancelModal}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning-outline" size={32} color="#FF3B30" />
            </View>
            <Text style={styles.modalTitle}>မလုပ်တော့ပါ</Text>
            <Text style={styles.modalMessage}>
              {isEditMode
                ? 'သင်လိပ်စာပြင်ဆင်ခြင်းကို ရပ်တန့်ရန်သေချာပါသလား?'
                : 'သင်လိပ်စာအသစ်ထည့်ခြင်းကို ရပ်တန့်ရန်သေချာပါသလား?'}
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>ဆက်လုပ်မယ်</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => {
                  setShowCancelModal(false);
                  router.back();
                }}
              >
                <Text style={styles.modalConfirmButtonText}>ရပ်တန့်မယ်</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldWrapper: {
    marginBottom: 15,
  },
  fieldContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 8,
    paddingVertical: 5,
  },
  inputContainer: {
    paddingVertical: 0,
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4A4A4A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F5F5F5',
  },
  modalConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  modalConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
