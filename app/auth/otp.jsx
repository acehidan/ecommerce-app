import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as SMS from 'expo-sms';
import { useAuthStore } from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import handleVerifyOTP from '../../services/auth/vertifyOTP';
import { saveUserProfile } from '../../services/user/userProfile';

export default function OTPScreen() {
  const { phoneNumber, name } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(true);
  const inputRefs = useRef([]);
  const { login } = useAuthStore();

  useEffect(() => {
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (showError) {
      setShowError(false);
      setErrorMessage('');
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    if (isVerifying) return;

    setIsVerifying(true);

    try {
      const response = await handleVerifyOTP({
        phoneNumber: phoneNumber,
        otpCode: otpCode,
      });

      if (response.success) {
        console.log('OTP verification response data:', response.data);

        // Validate response data before saving
        if (
          !response.data ||
          !response.data.data.token ||
          !response.data.data.user
        ) {
          Alert.alert('Error', 'Invalid response data received from server');
          return;
        }

        // Save user profile to AsyncStorage
        await saveUserProfile(response.data.data);

        // Update auth store
        login({
          name: response.data.data.user.userName,
          phoneNumber: response.data.data.user.phoneNumber,
        });

        Alert.alert(
          'Success',
          response.data.message || 'Phone number verified successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        setErrorMessage(
          'OTP verification code is incorrect. Please check if the code is correct and re-enter it.'
        );
        setShowError(true);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      setShowError(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      // Simulate sending SMS
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        // In a real app, you would send the OTP via your backend
        Alert.alert('OTP Sent', `Verification code sent to ${phoneNumber}`);

        // Reset timer
        setResendTimer(300);
        setCanResend(false);

        // Start new timer
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Alert.alert('Error', 'SMS is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>အကောင့်အတည်ပြုခြင်း</Text>
        <Text style={styles.description}>
          ဖုန်းနံပါတ်သို့ ပို့ပေးထားသော ၆ လုံး အတည်ပြုကုဒ် ကိုထည့်ပါ။
        </Text>

        {showError && (
          <View style={styles.errorBanner}>
            <Ionicons
              name="warning-outline"
              size={20}
              color="#fff"
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, showError && styles.otpInputError]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={!canResend}
        >
          <Text style={[styles.resendText, !canResend && styles.disabledText]}>
            ကုဒ် နံပါတ်မရဘူးလား? ကုဒ်ပြန်ပို့မယ်
            {!canResend && ` (${resendTimer}s)`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.verifyButton, isVerifying && styles.disabledButton]}
          onPress={() => handleVerifyOtp(otp.join(''))}
          disabled={otp.some((digit) => digit === '') || isVerifying}
        >
          <Text style={styles.verifyButtonText}>
            {isVerifying ? 'Verifying...' : 'OTPကုဒ် အတည်ပြုမယ်'}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 40,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
    // paddingHorizontal: 20,
    // gap: 3,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  resendButton: {
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
  disabledText: {
    color: '#999',
  },
  verifyButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  errorBanner: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 30,
    width: '110%',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  otpInputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
});
