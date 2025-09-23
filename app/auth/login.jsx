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
import { useAuthStore } from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import handleLogin from '../../services/auth/login';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('ENG');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLoginPress = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await handleLogin({
        phoneNumber,
        password,
      });

      if (response.success) {
        console.log('Login response data:', response.data);

        if (
          !response.data ||
          !response.data.data.token ||
          !response.data.data.user
        ) {
          Alert.alert('Error', 'Invalid response data received from server');
          return;
        }

        login(
          {
            name: response.data.data.user.userName,
            phoneNumber: response.data.data.user.phoneNumber,
          },
          response.data.data.token
        );

        Alert.alert(
          'Success',
          response.data.message || 'Logged in successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
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

  const handleForgotPasswordPress = () => {
    router.push('/auth/forgot-password');
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
            style={styles.signupButton}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.signupButtonText}>အကောင့်သစ်ဖွင့်မယ်</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>အကောင့်ပြန်ဝင်မယ်</Text>
        <Text style={styles.description}>
          အကောင့်ထဲသို့ ပြန်လည်ဝင်ရောက်ရန် ဖုန်းနံပါတ် နဲ့ လျှိုဝှက် နံပါတ်
          ကိုထည့်ပါ။
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

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={handleForgotPasswordPress}
        >
          <Text style={styles.forgotPasswordText}>
            လျှို့ဝှက်နံပါတ်မေ့သွားပြီ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLoginPress}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Loading...' : 'အကောင့်ပြန်ဝင်မယ်'}
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
  signupButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signupButtonText: {
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
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
  },
  loginButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
});
