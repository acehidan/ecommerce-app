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
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/authStore';
import { updatePassword } from '../services/user/updatePassword';

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { passwordChangeToken, setPasswordChangeToken } = useAuthStore();

  const handleSave = async () => {
    if (!newPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ်အသစ်ကို ရိုက်ထည့်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ်အသစ်ကို နောက်တစ်ကြိမ် ရိုက်ထည့်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ်များ မတူညီပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!passwordChangeToken) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ် ပြောင်းလဲမှု အတည်ပြုခြင်း မရှိပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await updatePassword(
        passwordChangeToken,
        newPassword.trim()
      );

      if (response.success) {
        // Clear the password change token after successful update
        setPasswordChangeToken(null);

        Toast.show({
          type: 'success',
          text1: 'အောင်မြင်',
          text2:
            response.message || 'လျှို့ဝှက်နံပါတ် ပြောင်းလဲမှု အောင်မြင်ပါပြီ',
          position: 'top',
          visibilityTime: 2000,
          onHide: () => router.back(),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'အမှား',
          text2:
            response.message || 'လျှို့ဝှက်နံပါတ် ပြောင်းလဲမှု မအောင်မြင်ပါ',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'လျှို့ဝှက်နံပါတ် ပြောင်းလဲမှု မအောင်မြင်ပါ',
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

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <Text style={styles.headerTitle}>မိမိအကောင့် အသေးစိတ်ပြင်မယ်</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* New Password Input Card */}
          <View style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Ionicons name="key-outline" size={20} color="#000000" />
                <Text style={styles.inputLabel}>လျှို့ဝှက်နံပါတ်အသစ်</Text>
              </View>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="လျှို့ဝှက်နံပါတ်အသစ်ကို ရိုက်ထည့်ပါ"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showNewPassword}
                  autoFocus={true}
                  editable={!loading}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={toggleNewPasswordVisibility}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666666"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Confirm Password Input Card */}
          <View style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Ionicons name="key-outline" size={20} color="#000000" />
                <Text style={styles.inputLabel}>
                  လျှို့ဝှက်နံပါတ်အသစ် အတည်ပြုမယ်
                </Text>
              </View>
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.inputField}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="လျှို့ဝှက်နံပါတ်အသစ်ကို နောက်တစ်ကြိမ် ရိုက်ထည့်ပါ"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666666"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>မပြင်တော့ပါ</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.saveButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'ပြင်နေဆဲ...' : 'အချက်လက်များ ပြင်မယ်'}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  inputCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inputField: {
    flex: 1,
    fontSize: 13,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    // flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#2C2C2C',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
