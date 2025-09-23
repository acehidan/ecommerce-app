import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {
  getUserProfile,
  updateUserProfile,
} from '../services/user/userProfile';

export default function AccountDetail() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        // console.log('profile', profile);
        if (profile) {
          setUserProfile(profile);
        } else {
          // If no profile found, show default values
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Don't show alert for missing profile, just set to null
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleEditName = () => {
    Alert.alert('Edit Name', 'Name editing functionality will be implemented', [
      { text: 'OK' },
    ]);
  };

  const handleEditPhone = () => {
    Alert.alert(
      'Edit Phone',
      'Phone editing functionality will be implemented',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change functionality will be implemented',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>မိမိအကောင့် အသေးစိတ်</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>မိမိအကောင့် အသေးစိတ်</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={styles.sectionHeaderContainer}>
                  <FontAwesome5 name="user-circle" size={20} color="black" />
                  <Text style={styles.label}>နာမည်</Text>
                </View>
                <View>
                  <Text style={styles.value}>
                    {userProfile?.user?.userName || 'ထက်ဦးဝေယံ'}
                  </Text>
                </View>
              </View>
              <Pressable style={styles.editButton} onPress={handleEditName}>
                <Text style={styles.editButtonText}>ပြင်မယ်</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={styles.sectionHeaderContainer}>
                  <Ionicons name="call-outline" size={20} color="#000000" />
                  <Text style={styles.label}>ဖုန်းနံပါတ်</Text>
                </View>
                <View>
                  <Text style={styles.value}>
                    {userProfile?.user?.phoneNumber || '09 783742004'}
                  </Text>
                </View>
              </View>
              <Pressable style={styles.editButton} onPress={handleEditName}>
                <Text style={styles.editButtonText}>ပြင်မယ်</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={styles.sectionHeaderContainer}>
                  <MaterialCommunityIcons
                    name="key-outline"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.label}>လျှို့ဝှက်နံပါတ်</Text>
                </View>
                <View>
                  <Text style={styles.value}>
                    {userProfile?.user?.password || '*******'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.changePasswordButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.changePasswordButtonText}>
                  လျှို့ဝှက်နံပါတ်ပြောင်းမယ်
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  section: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 20,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '800',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  editButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  changePasswordButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
});
