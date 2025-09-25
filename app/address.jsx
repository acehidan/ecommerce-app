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

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderAddressCard = (address) => (
    <View key={address._id} style={styles.addressCard}>
      <View style={styles.addressIcon}>
        <Ionicons name="location" size={24} color="#000000" />
      </View>

      <View style={styles.addressInfo}>
        <Text style={styles.addressLabel}>လိပ်စာ နာမည်</Text>
        <Text style={styles.addressName}>{address.note}</Text>
        <Text style={styles.addressDetails}>
          {address.address}, {address.township}, {address.city}
        </Text>
      </View>

      <Pressable style={styles.editButton}>
        <Text style={styles.editButtonText}>ပြင်မယ်</Text>
      </Pressable>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
});
