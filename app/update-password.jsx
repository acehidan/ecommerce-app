import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { verifyPassword } from '../services/user/verifyPassword';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!currentPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ်အဟောင်းကို ရိုက်ထည့်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await verifyPassword(currentPassword.trim());

      if (response.success && response.data?.isValid) {
        Toast.show({
          type: 'success',
          text1: 'အောင်မြင်',
          text2:
            response.message || 'လျှို့ဝှက်နံပါတ် အတည်ပြုခြင်း အောင်မြင်ပါပြီ',
          position: 'top',
          visibilityTime: 2000,
          onHide: () => router.back(),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'အမှား',
          text2: response.message || 'လျှို့ဝှက်နံပါတ် မမှန်ကန်ပါ',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ် အတည်ပြုခြင်း မအောင်မြင်ပါ',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>မိမိအကောင့် အသေးစိတ်</Text>
          <Pressable style={styles.editButton} onPress={handleCancel}>
            <Text style={styles.editButtonText}>ပြင်မယ်</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* User Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoContainer}>
              <View style={styles.infoHeader}>
                <FontAwesome5 name="user-circle" size={20} color="black" />
                <Text style={styles.infoLabel}>နာမည်</Text>
              </View>
              <TextInput
                style={styles.infoInput}
                value="ထက်ဦးဝေယံ"
                editable={false}
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          {/* Verification Section */}
          <View style={styles.verificationSection}>
            <Text style={styles.verificationTitle}>အတည်ပြုခြင်း</Text>
            <Text style={styles.verificationDescription}>
              လျှို့ဝှက်နံပါတ်ပြောင်းရန်အတွက် ဦးစွာ လျှို့ဝှက်နံပါတ်အဟောင်းကို
              ရိုက်ထည့်ပြီး အတည်ပြုရန်လိုအပ်ပါတယ် ။
            </Text>

            {/* Password Input Card */}
            <View style={styles.passwordCard}>
              <View style={styles.passwordContainer}>
                <View style={styles.passwordHeader}>
                  <Ionicons name="key-outline" size={20} color="#000000" />
                  <Text style={styles.passwordLabel}>
                    လျှို့ဝှက်နံပါတ်အဟောင်း
                  </Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="လျှို့ဝှက်နံပါတ်အဟောင်းကို ရိုက်ထည့်ပါ"
                    placeholderTextColor="#999999"
                    secureTextEntry={!showPassword}
                    autoFocus={true}
                    editable={!loading}
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={togglePasswordVisibility}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#666666"
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>မလုပ်တော့ပါ</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.confirmButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'အတည်ပြုနေဆဲ...' : 'အတည်ပြုမယ်'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  infoContainer: {
    gap: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  infoInput: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  verificationSection: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  verificationDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 20,
  },
  passwordCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
  },
  passwordContainer: {
    gap: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passwordLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 0,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#2C2C2C',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
