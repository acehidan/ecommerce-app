import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {
  getUserProfile,
  // updateUserProfile,
} from '../services/user/userProfile';
import { verifyPassword } from '../services/user/verifyPassword';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/authStore';

export default function AccountDetail() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState(
    'လျှို့ဝှက်နံပါတ်အဟောင်းမှားနေသည်'
  );
  const { setPasswordChangeToken } = useAuthStore();

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
    router.push('/update-username');
  };

  const handleChangePhone = () => {
    router.push('/change-phone');
  };

  const handleEditPhone = () => {
    Alert.alert(
      'Edit Phone',
      'Phone editing functionality will be implemented',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setShowPassword(false);
    setPasswordError(false);
  };

  const handleConfirmPassword = async () => {
    if (!currentPassword.trim()) {
      setPasswordError(true);
      return;
    }

    setPasswordLoading(true);
    setPasswordError(false);

    try {
      const phoneNumber = userProfile?.user?.phoneNumber || '09422625883';
      const response = await verifyPassword(
        phoneNumber,
        currentPassword.trim()
      );
      console.log('response', response.message);

      if (response.success && response.data?.token) {
        // Store the token for password change
        setPasswordChangeToken(response.data.token);

        // Close modal and navigate to new password page
        handleCloseModal();
        router.push('/new-password');
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      setPasswordError(true);
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <Pressable style={styles.editButton} onPress={handleChangePhone}>
              <Text style={styles.editButtonText}>ပြင်မယ်</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.sectionHeaderContainer}>
                <FontAwesome5 name="key" size={20} color="black" />
                <Text style={styles.label}>လျှို့ဝှက်နံပါတ်</Text>
              </View>
              <View>
                <Text style={styles.value}>{'*******'}</Text>
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
      </ScrollView>

      {/* Password Verification Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalBox}>
              <View style={styles.modalContent}>
                {/* Verification Section */}
                <View style={styles.modalVerificationSection}>
                  <Text style={styles.modalVerificationTitle}>
                    အတည်ပြုခြင်း
                  </Text>
                  <Text style={styles.modalVerificationDescription}>
                    လျှို့ဝှက်နံပါတ်ပြောင်းရန်အတွက် ဦးစွာ
                    လျှို့ဝှက်နံပါတ်အဟောင်းကို ရိုက်ထည့်ပြီး
                    အတည်ပြုရန်လိုအပ်ပါတယ် ။
                  </Text>

                  {/* Password Input Card */}
                  <View style={styles.modalPasswordCard}>
                    <View style={styles.modalPasswordContainer}>
                      <View style={styles.modalPasswordHeader}>
                        <Ionicons
                          name="key-outline"
                          size={20}
                          color="#000000"
                        />
                        <Text style={styles.modalPasswordLabel}>
                          လျှို့ဝှက်နံပါတ်အဟောင်း
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.modalPasswordInputContainer,
                          passwordError &&
                            styles.modalPasswordInputContainerError,
                        ]}
                      >
                        <TextInput
                          style={[styles.modalPasswordInput, passwordError]}
                          value={currentPassword}
                          onChangeText={(text) => {
                            setCurrentPassword(text);
                            if (passwordError) {
                              setPasswordError(false);
                            }
                          }}
                          placeholder="လျှို့ဝှက်နံပါတ်အဟောင်းကို ရိုက်ထည့်ပါ"
                          placeholderTextColor="#999999"
                          secureTextEntry={!showPassword}
                          autoFocus={true}
                          editable={!passwordLoading}
                        />

                        <Pressable
                          style={styles.modalEyeButton}
                          onPress={togglePasswordVisibility}
                        >
                          <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#666666"
                          />
                        </Pressable>
                      </View>
                      {passwordError && (
                        <Text style={styles.modalPasswordInputErrorText}>
                          {'လျှို့ဝှက်နံပါတ်အဟောင်းမှားနေသည်'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalButtonContainer}>
                  <Pressable
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={handleCloseModal}
                    disabled={passwordLoading}
                  >
                    <Text style={styles.modalCancelButtonText}>
                      မလုပ်တော့ပါ
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.modalButton,
                      styles.modalConfirmButton,
                      passwordLoading && styles.modalDisabledButton,
                    ]}
                    onPress={handleConfirmPassword}
                    disabled={passwordLoading}
                  >
                    <Text style={styles.modalConfirmButtonText}>
                      {passwordLoading ? 'အတည်ပြုနေဆဲ...' : 'အတည်ပြုမယ်'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalBackButton: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  modalEditButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalEditButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalInfoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  modalInfoContainer: {
    gap: 16,
  },
  modalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  modalInfoInput: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  modalVerificationSection: {
    marginBottom: 20,
  },
  modalVerificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  modalVerificationDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalPasswordCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
  },
  modalPasswordContainer: {
    gap: 16,
  },
  modalPasswordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalPasswordLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  modalPasswordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalPasswordInputContainerError: {
    borderBottomColor: '#F44336',
    borderBottomWidth: 2,
  },
  modalPasswordInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  modalPasswordInputErrorText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 12,
  },

  modalEyeButton: {
    padding: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    // paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  modalConfirmButton: {
    backgroundColor: '#2C2C2C',
  },
  modalConfirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  modalDisabledButton: {
    opacity: 0.6,
  },
});
