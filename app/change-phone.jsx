import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { updatePhoneNumber } from '../services/user/updatePhoneNumber';
import { useAuthStore } from '../store/authStore';
import PageHeader from './components/PageHeader';

export default function ChangePhone() {
  const router = useRouter();
  const { updatePhoneNumber: updatePhoneInStore } = useAuthStore();
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePhone = async () => {
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
      const response = await updatePhoneNumber(newPhoneNumber.trim());

      if (response.success) {
        // Update auth store with new phone number if response includes user data
        if (response.data?.user) {
          updatePhoneInStore(
            response.data.user.phoneNumber,
            response.data.user.isVerified
          );
        } else {
          // Fallback: update with the new phone number we just set
          // Note: isVerified might be false initially until OTP is verified
          updatePhoneInStore(newPhoneNumber.trim(), false);
        }

        Toast.show({
          type: 'success',
          text1: 'အောင်မြင်',
          text2: response.message || 'ဖုန်းနံပါတ် ပြောင်းလဲပြီးပါပြီ',
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            // Navigate back to account detail page
            router.push('/account-detail');
          },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'အမှား',
          text2: response.message || 'ဖုန်းနံပါတ် ပြောင်းလဲခြင်း မအောင်မြင်ပါ',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'ဖုန်းနံပါတ် ပြောင်းလဲခြင်း မအောင်မြင်ပါ';
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: errorMessage,
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
        <PageHeader
          title="ဖုန်းနံပါတ် ပြောင်းလဲမယ်"
          onBackPress={handleCancel}
          sticky={false}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>ဖုန်းနံပါတ် အသစ်ပြောင်းမယ်</Text>

          {/* Instruction Text */}
          <Text style={styles.instructionText}>
            မိမိပြောင်းလိုတဲ့ ဖုန်းနံပါတ် အသစ်ကို ရိုက်ထည့်ပြီး ပြောင်းလဲလိုက်ပါ
            ။
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
              loading ||
                (!newPhoneNumber.trim() && styles.getOTPButtonDisabled),
            ]}
            onPress={handleUpdatePhone}
            disabled={loading}
          >
            <Text style={styles.getOTPButtonText}>
              {loading ? 'Loading...' : 'ဖုန်းနံပါတ် ပြောင်းလဲမယ်'}
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
    backgroundColor: '#000',
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
    color: '#fff',
  },
});
