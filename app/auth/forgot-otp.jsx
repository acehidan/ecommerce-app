import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import handleResetPassword from '../../services/auth/resetPassword';

export default function ForgotOTPScreen() {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const inputRefs = useRef([]);

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

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    Alert.alert('Resend OTP', 'OTP resend functionality will be implemented', [
      { text: 'OK' },
    ]);

    // Reset timer
    setResendTimer(60);
    setCanResend(false);
  };

  const handleResetPasswordPress = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (otp.some((digit) => digit === '')) {
      Alert.alert('Error', 'Please enter the complete OTP code');
      return;
    }

    setIsResetting(true);

    try {
      const response = await handleResetPassword({
        phoneNumber: phoneNumber,
        otpCode: otp.join(''),
        newPassword,
        confirmPassword,
      });

      console.log('Reset password response:', response);

      if (response.success) {
        Alert.alert(
          'Success',
          response.data.data.message || 'Password has been reset successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/auth/login');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response?.error || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>လျှို့ဝှက်ကုဒ် ပြန်လည်သတ်မှတ်မယ်</Text>
        <Text style={styles.description}>
          ဖုန်းနံပါတ်သို့ ပို့ပေးထားသော ၆ လုံး အတည်ပြုကုဒ် ကိုထည့်ပြီး
          လျှို့ဝှက်ကုဒ်အသစ် ဖန်တီးပါ။
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
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

        <View style={styles.passwordSection}>
          <Text style={styles.sectionTitle}>လျှို့ဝှက်ကုဒ်အသစ် ဖန်တီးမယ်</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapperContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputLabel}>လျှို့ဝှက်နံပါတ်အသစ်</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="လျှို့ဝှက်နံပါတ်အသစ် ရိုက်ထည့်ပါ"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapperContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputLabel}>
                  လျှို့ဝှက်နံပါတ်အတည်ပြုမယ်
                </Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="လျှို့ဝှက်နံပါတ်အတည်ပြုမယ် ရိုက်ထည့်ပါ"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, isResetting && styles.disabledButton]}
          onPress={handleResetPasswordPress}
          disabled={isResetting}
        >
          <Text style={styles.resetButtonText}>
            {isResetting ? 'Resetting...' : 'လျှို့ဝှက်ကုဒ် ပြန်လည်သတ်မှတ်မယ်'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
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
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
  disabledText: {
    color: '#999',
  },
  passwordSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
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
  resetButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
});
