import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
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
import { getDeliveries } from '../services/delivery/getDeliveries';

// const CITIES = [
//   'ရန်ကုန်',
//   'မန္တလေး',
//   'နေပြည်တော်',
//   'မော်လမြိုင်',
//   'ပဲခူး',
//   'ပြည်',
//   'သီရိလင်္ကာ',
//   'အခြား',
// ];

// const TOWNSHIPS = {
//   ရန်ကုန်: ['ဗဟန်း', 'ဒဂုံ', 'သင်္ဃန်းကျွန်း', 'မရမ်းကုန်း', 'အခြား'],
//   မန္တလေး: ['အမရပူရ', 'ပုသိမ်', 'အခြား'],
//   နေပြည်တော်: ['ဇမ္ဗူသီရိ', 'ပျဉ်းမနား', 'အခြား'],
//   မော်လမြိုင်: ['အခြား'],
//   ပဲခူး: ['အခြား'],
//   ပြည်: ['အခြား'],
//   သီရိလင်္ကာ: ['အခြား'],
//   အခြား: ['အခြား'],
// };

export default function AddAddress() {
  const params = useLocalSearchParams();
  const addressData = params.addressData
    ? JSON.parse(params.addressData)
    : null;
  const isEditMode = !!addressData;

  const [addressName, setAddressName] = useState(addressData?.note || '');
  const [selectedCity, setSelectedCity] = useState(addressData?.city || '');
  const [selectedTownship, setSelectedTownship] = useState(
    addressData?.township || ''
  );
  const [exactAddress, setExactAddress] = useState(addressData?.address || '');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showTownshipDropdown, setShowTownshipDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
      Alert.alert(
        'အမှား',
        'မြို့နှင့် မြို့နယ် အချက်အလက်များ ရယူရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
      );
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    Alert.alert(
      'မလုပ်တော့ပါ',
      isEditMode
        ? 'သင်လိပ်စာပြင်ဆင်ခြင်းကို ရပ်တန့်ရန်သေချာပါသလား?'
        : 'သင်လိပ်စာအသစ်ထည့်ခြင်းကို ရပ်တန့်ရန်သေချာပါသလား?',
      [
        {
          text: 'ဆက်လုပ်မယ်',
          style: 'cancel',
        },
        {
          text: 'ရပ်တန့်မယ်',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleAddAddress = async () => {
    if (!addressName.trim()) {
      Alert.alert('အမှား', 'လိပ်စာ နာမည်ထည့်ပေးပါ');
      return;
    }
    if (!selectedCity) {
      Alert.alert('အမှား', 'မြို့ရွေးချယ်ပေးပါ');
      return;
    }
    if (!selectedTownship) {
      Alert.alert('အမှား', 'မြို့နယ် ရွေးချယ်ပေးပါ');
      return;
    }
    if (!exactAddress.trim()) {
      Alert.alert('အမှား', 'လိပ်စာ အတိအကျ ထည့်ပေးပါ');
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
          setShowSuccessMessage(true);
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          Alert.alert(
            'အမှား',
            response.message || 'လိပ်စာပြင်ဆင်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
          );
        }
      } else {
        // Add new address
        const userProfile = await getUserProfile();
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
          setShowSuccessMessage(true);
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          Alert.alert(
            'အမှား',
            response.message || 'လိပ်စာထည့်သွင်းရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
          );
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert(
        'အမှား',
        isEditMode
          ? 'လိပ်စာပြင်ဆင်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
          : 'လိပ်စာထည့်သွင်းရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
      );
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
    showDropdown = false
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Success Message Banner */}
        {showSuccessMessage && (
          <View style={styles.successBanner}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.successText}>
              {isEditMode
                ? 'လိပ်စာ အချက်အလက်များ အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ'
                : 'လိပ်စာ အချက်အလက်များ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ'}
            </Text>
          </View>
        )}
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'လိပ်စာ ပြင်ဆင်မယ်' : 'လိပ်စာအသစ် ထည့်မယ်'}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Address Name Field */}
          {renderField(
            'location-outline',
            'လိပ်စာ နာမည်',
            'လိပ်စာ နာမည်ထည့်ပါ',
            addressName,
            setAddressName
          )}

          {/* Exact Delivery Address Field */}
          {renderField(
            'location-outline',
            'ပို့ဆောင်ရန် လိပ်စာ အတိအကျ',
            'လိပ်စာ အတိအကျ ထည့်ပေးပါ',
            exactAddress,
            setExactAddress
          )}

          {/* City Selection Field */}
          {renderField(
            'business-outline',
            'မြို့',
            'မြို့ရွေးချယ်ပေးပါ',
            selectedCity,
            null,
            () => setShowCityDropdown(!showCityDropdown),
            true
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

          {/* Township Selection Field */}
          {renderField(
            'home-outline',
            'မြို့နယ်',
            'မြို့နယ် ရွေးချယ်ပေးပါ',
            selectedTownship,
            null,
            () => setShowTownshipDropdown(!showTownshipDropdown),
            true
          )}

          {/* Township Dropdown */}
          {showTownshipDropdown && (
            <View style={styles.dropdownContainer}>
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
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>မလုပ်တော့ပါ</Text>
        </Pressable>
        <Pressable
          style={[styles.addButton, isLoading && styles.addButtonDisabled]}
          onPress={handleAddAddress}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>
            {isLoading
              ? isEditMode
                ? 'ပြင်ဆင်နေသည်...'
                : 'ထည့်သွင်းနေသည်...'
              : isEditMode
              ? 'လိပ်စာ ပြင်ဆင်မယ်'
              : 'လိပ်စာအသစ် ထည့်မယ်'}
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
    paddingVertical: 5,
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
  addButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  successBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  successIcon: {
    marginRight: 12,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
});
