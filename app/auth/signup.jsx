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
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import handleSignUp from '../../services/auth/signUp';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [language, setLanguage] = useState('ENG');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to terms and conditions');
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
        Alert.alert(
          'Success',
          response.data.message || 'OTP sent successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                router.push({
                  pathname: '/auth/otp',
                  params: { phoneNumber, name },
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

  const handleTermsPress = () => {
    Alert.alert(
      'Terms & Conditions',
      'Terms and conditions will be displayed here'
    );
  };

  const handlePoliciesPress = () => {
    Alert.alert('Policies', 'Privacy policies will be displayed here');
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
});
