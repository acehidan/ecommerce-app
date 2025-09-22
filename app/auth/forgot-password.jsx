import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import handleForgotPassword from '../../services/auth/forgotPassword';

export default function ForgotPasswordScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [language, setLanguage] = useState('ENG');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await handleForgotPassword({
        phoneNumber,
      });

      if (response.success) {
        Alert.alert(
          'OTP Sent',
          response.data.message || 'OTP sent for password reset.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to forgot password OTP screen
                router.push({
                  pathname: '/auth/forgot-otp',
                  params: { phoneNumber },
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.langButton,
              language === 'ENG' && styles.activeLangButton,
            ]}
            onPress={() => setLanguage('ENG')}
          >
            <Text
              style={[
                styles.langText,
                language === 'ENG' && styles.activeLangText,
              ]}
            >
              ENG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>အကောင့်ဝင်မယ်</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>လျှို့ဝှက်ကုဒ်အသစ် ဖန်တီးမယ်</Text>
        <Text style={styles.description}>
          မိမိအကောင့်ကို မှန်မမှန် တစ်ခါသုံး OTP ကုဒ်နံပါတ်နဲ့ အတည်ပြုပြီး
          လျှို့ဝှက်ကုဒ်အသစ် ဖန်တီးလိုက်ပါ
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapperContainer}>
            <View style={styles.inputLabelContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Text style={styles.inputLabel}>ဖုန်းနံပါတ်</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="ဖုန်းနံပါတ် ရိုက်ထည့်ပါ"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.otpButton, isLoading && styles.disabledButton]}
          onPress={handleGetOTP}
          disabled={isLoading}
        >
          <Text style={styles.otpButtonText}>
            {isLoading ? 'Sending...' : 'OTPကုဒ် ယူမယ်'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeLangButton: {
    backgroundColor: '#333',
  },
  langText: {
    fontSize: 14,
    color: '#666',
  },
  activeLangText: {
    color: 'white',
  },
  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  loginButtonText: {
    fontSize: 14,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputWrapperContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  inputLabelContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
  },
  otpButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
});
