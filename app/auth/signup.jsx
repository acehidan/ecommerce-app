import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import handleSignUp from '../../services/auth/signUp';
import { sendMessage } from '../../services/chat/messages';
import colors from '../../constants/colors';

export default function SignupScreen() {
  const { login } = useAuthStore();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [language, setLanguage] = useState('ENG');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSignup = async () => {
    if (!name || !phoneNumber || !password) {
      showError('ကျေးဇူးပြုပြီး အချက်အလက်အားလုံးကို ဖြည့်စွက်ပေးပါ');
      return;
    }
    if (!agreeToTerms) {
      showError('စည်းမျဉ်းစည်းကမ်းများကို သဘောတူရန် လိုအပ်ပါသည်');
      return;
    }

    setIsLoading(true);

    try {
      const response = await handleSignUp({
        userName: name,
        phoneNumber,
        password,
        confirmPassword: password,
      });

      if (response.success) {
        // Handle new response structure: { success, message, data: { token, user } }
        const token = response.data?.data?.token || response.data?.token;
        const user = response.data?.data?.user || response.data?.user;

        if (token && user) {
          // Store token and user in auth store
          const userData = {
            _id: user._id || '',
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            isVerified: user.isVerified || false,
            role: user.role || 'user',
          };

          await login(userData, token);

          // Send welcome message to chat
          try {
            await sendMessage('Join the chat');
            // console.log('Welcome message sent successfully');
          } catch (chatError) {
            console.error('Failed to send welcome message:', chatError);
            // Don't block signup flow if chat message fails
          }

          // Show login modal instead of direct redirect
          setShowLoginModal(true);
        } else {
          showError(
            'အကောင့်ဖွင့်ခြင်း အောင်မြင်သော်လည်း အသုံးပြုသူအချက်အလက် ပျောက်ဆုံးနေပါသည်။ ပြန်လည်ကြိုးစားပါ။',
          );
        }
      } else {
        showError(
          response.error ||
            'အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ။ ပြန်လည်ကြိုးစားပါ။',
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError('စနစ်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်။ ပြန်လည်ကြိုးစားပါ။');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsPress = () => {
    Linking.openURL('https://komindiystore.com/terms-and-conditions').catch(
      (err) => console.error('Failed to open URL:', err),
    );
  };

  const handlePoliciesPress = () => {
    Linking.openURL('https://komindiystore.com/privacy-policy').catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };

  const handleModalLogin = () => {
    setShowLoginModal(false);
    router.push('/auth/login');
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      > */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>အကောင့်ဝင်မယ်</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>အကောင့်အသစ်ဖွင့်မယ်</Text>
          <Text style={styles.description}>
            အကောင့်အသစ်ဖွင့်ဖို့ အတွက် အသုံးပြုလို့တဲ့ နာမည်နဲ့ ဖုန်းနံပါတ်ကို
            ရိုက်ထည့်ပြီး မိနစ်ပိုင်းအတွင်း ဖွင့်လိုက်ပါ။
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapperContainer}>
              <View style={styles.inputLabelContainer}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <Text style={styles.inputLabel}>နာမည်</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="အကောင့်နာမည် ရိုက်ထည့်ပါ"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          </View>

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
                  placeholder="09 783742004"
                  placeholderTextColor="#666"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
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
                <Text style={styles.inputLabel}>လျှို့ဝှက်နံပါတ်</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="873614@"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <Ionicons
                name={agreeToTerms ? 'checkbox' : 'square-outline'}
                size={20}
                color={agreeToTerms ? '#007AFF' : '#666'}
              />
            </TouchableOpacity>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                အကောင့်ဖွင့်ရန်အတွက် ကျွန်တော်တို့ရဲ့{' '}
                <Text style={styles.linkText} onPress={handleTermsPress}>
                  စည်းမျဉ်း စည်းကမ်း
                </Text>{' '}
                နဲ့{' '}
                <Text style={styles.linkText} onPress={handlePoliciesPress}>
                  မူဝါဒများကို
                </Text>{' '}
                သဘောတူဖို့ လိုအပါပါတယ်
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Loading...' : 'အကောင့်အသစ်ဖွင့်မယ်'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}

      {/* Login Modal */}
      {showLoginModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              <Text style={styles.modalTitle}>အကောင့်ဖွင့်ပြီးပါပြီ!</Text>
              <Text style={styles.modalMessage}>
                သင့်အကောင့်ကို အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ။ ဆက်လက်အသုံးပြုရန်
                အကောင့်ဝင်ပါ။
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalLogin}
            >
              <Text style={styles.modalButtonText}>အကောင့်ဝင်မယ်</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="alert-circle" size={60} color="#F44336" />
              <Text style={styles.modalTitle}>အမှား</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleErrorModalClose}
            >
              <Text style={styles.modalButtonText}>ကောင်းပြီ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.background.primary,
  },
  loginButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '700',
    fontFamily: 'NotoSansMyanmar-Regular',
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
    marginBottom: 30,
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
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  signupButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    margin: 20,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  modalButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
