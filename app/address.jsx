import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { getUserAddresses } from '../services/user/getUserAddresses';
import { getUserProfile } from '../services/user/userProfile';
import deleteAddress from '../services/user/deleteAddress';

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Refetch addresses when screen comes into focus (e.g., returning from add-address)
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const userProfile = await getUserProfile();
      // console.log('userProfile', userProfile.user._id);
      if (!userProfile?.user) {
        throw new Error('User not found');
      }

      if (!userProfile.user._id) {
        throw new Error('User ID not found');
      }

      const response = await getUserAddresses(userProfile.user._id);
      console.log('response', response);
      setAddresses(response.data.userAddressInfo);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
      Alert.alert('Error', 'Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (address) => {
    Alert.alert(
      'လိပ်စာ ဖျက်မယ်',
      `သင်ဤလိပ်စာကို ဖျက်ရန်သေချာပါသလား?\n\n${address.note}\n${address.address}, ${address.township}, ${address.city}`,
      [
        {
          text: 'မဖျက်ပါ',
          style: 'cancel',
        },
        {
          text: 'ဖျက်မယ်',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingAddressId(address._id);
              const response = await deleteAddress(address._id);

              if (response.success) {
                // Remove the deleted address from the list
                setAddresses((prevAddresses) =>
                  prevAddresses.filter((addr) => addr._id !== address._id)
                );
                Alert.alert(
                  'အောင်မြင်ပါသည်',
                  'လိပ်စာ အောင်မြင်စွာ ဖျက်ပြီးပါပြီ'
                );
              } else {
                Alert.alert(
                  'အမှား',
                  response.message || 'လိပ်စာဖျက်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်'
                );
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('အမှား', 'လိပ်စာဖျက်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်');
            } finally {
              setDeletingAddressId(null);
            }
          },
        },
      ]
    );
  };

  const renderAddressCard = (address) => (
    <View key={address._id} style={styles.addressCard}>
      <View style={styles.addressIcon}>
        <Ionicons name="location" size={16} color="#000000" />
        {/* <Text style={styles.addressLabel}>လိပ်စာ နာမည်</Text> */}
      </View>

      <View style={styles.addressInfo}>
        <Text style={styles.addressName}>{address.note}</Text>
        <Text style={styles.addressDetails}>
          {address.address}, {address.township}, {address.city}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          style={styles.editButton}
          onPress={() => {
            router.push({
              pathname: '/add-address',
              params: {
                addressData: JSON.stringify(address),
              },
            });
          }}
        >
          <Text style={styles.editButtonText}>ပြင်မယ်</Text>
        </Pressable>
        <Pressable
          style={[
            styles.deleteButton,
            deletingAddressId === address._id && styles.deleteButtonDisabled,
          ]}
          onPress={() => handleDeleteAddress(address)}
          disabled={deletingAddressId === address._id}
        >
          {deletingAddressId === address._id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="location-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyStateTitle}>လိပ်စာ မရှိသေးပါ</Text>
      <Text style={styles.emptyStateSubtitle}>
        ပစ္စည်းများ ပို့ဆောင်ရန်အတွက် လိပ်စာ ထည့်သွင်းပါ
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Navigation Bar */}
        <View style={styles.navbar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>

          <Text style={styles.navTitle}>နေရပ် လိပ်စာ</Text>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/add-address')}
          >
            <Text style={styles.addButtonText}>လိပ်စာ အသစ်ထည့်မယ်</Text>
          </Pressable>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A4A4A" />
            <Text style={styles.loadingText}>လိပ်စာများ ရယူနေသည်...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
            <Text style={styles.errorTitle}>အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchAddresses}>
              <Text style={styles.retryButtonText}>ပြန်လည် ကြိုးစားမယ်</Text>
            </Pressable>
          </View>
        ) : addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.addressesContainer}>
            {addresses.map(renderAddressCard)}
          </View>
        )}
      </ScrollView>
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
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  addressesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  addressIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
});
