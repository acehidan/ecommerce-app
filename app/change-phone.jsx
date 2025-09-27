import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { requestPhoneChangeOTP } from '../services/user/requestPhoneChangeOTP';

export default function ChangePhone() {
  const router = useRouter();
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetOTP = async () => {
    if (!newPhoneNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'ဖုန်းနံပါတ်အသစ် ထည့်သွင်းပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(newPhoneNumber.replace(/\s/g, ''))) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'ဖုန်းနံပါတ် မမှန်ကန်ပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await requestPhoneChangeOTP(newPhoneNumber.trim());

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'အောင်မြင်',
          text2: response.message || 'OTP ကုဒ် ပို့ပေးပြီးပါပြီ',
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            // Navigate to OTP verification page with phone number
            router.push({
              pathname: '/verify-phone-otp',
              params: { newPhoneNumber: newPhoneNumber.trim() },
            });
          },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'အမှား',
          text2: response.message || 'OTP ကုဒ် ပို့ပေးခြင်း မအောင်မြင်ပါ',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'OTP ကုဒ် ပို့ပေးခြင်း မအောင်မြင်ပါ',
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>Forget Password Screen</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>ဖုန်းနံပါတ် အသစ်ပြောင်းမယ်</Text>

          {/* Instruction Text */}
          <Text style={styles.instructionText}>
            မိမိပြောင်းလိုတဲ့ ဖုန်းနံပါတ် အသစ်ကို ရိုက်ထည့်ပြီး တစ်ခါသုံး
            အတည်ပြု ကုဒ် ၆ လုံးနဲ့ အတည်ပြု လိုက်ပါ ။
          </Text>

          {/* Phone Number Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ဖုန်းနံပါတ် အသစ်</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="call-outline" size={20} color="#666666" />
              </View>
              <TextInput
                style={styles.phoneInput}
                value={newPhoneNumber}
                onChangeText={setNewPhoneNumber}
                placeholder="ဖုန်းနံပါတ်အသစ် ရိုက်ထည့်ပါ"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                maxLength={11}
                autoFocus={true}
                editable={!loading}
              />
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.getOTPButton,
              loading && styles.getOTPButtonDisabled,
            ]}
            onPress={handleGetOTP}
            disabled={loading}
          >
            <Text style={styles.getOTPButtonText}>
              {loading ? 'ဆက်သွယ်နေသည်...' : 'OTPကုဒ် ယူမယ်'}
            </Text>
          </Pressable>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  inputSection: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  getOTPButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getOTPButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  getOTPButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
});
