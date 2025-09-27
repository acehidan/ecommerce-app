import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getUserProfile } from '../services/user/userProfile';
import { updateUsername } from '../services/user/updateUsername';
import Toast from 'react-native-toast-message';

export default function UpdateUsername() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentUsername();
  }, []);

  const loadCurrentUsername = async () => {
    try {
      const profile = await getUserProfile();
      if (profile?.user?.userName) {
        setUsername(profile.user.userName);
      }
    } catch (error) {
      console.error('Error loading current username:', error);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'နာမည်ကို ရိုက်ထည့်ပေးပါ',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await updateUsername(username.trim());

      if (response.success) {
        Toast.show({
          type: 'success',
          text2:
            'မိမိအကောင့်  အသေးစိတ် အချက်အလက်များကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ ။',
          position: 'top',
          visibilityTime: 3000,
          onHide: () => router.push('/profile'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'အမှား',
          text2: response.message || 'နာမည် ပြောင်းလဲမှု မအောင်မြင်ပါ',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating username:', error);
      Toast.show({
        type: 'error',
        text1: 'အမှား',
        text2: 'နာမည် ပြောင်းလဲမှု မအောင်မြင်ပါ။ ပြန်လည် ကြိုးစားကြည့်ပါ။',
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
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>မိမိအကောင့် အသေးစိတ်ပြင်မယ််</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputSection}>
            {/* Username Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputContainer}>
                <View style={styles.inputHeader}>
                  <FontAwesome5 name="user-circle" size={20} color="black" />
                  <Text style={styles.inputLabel}>နာမည်</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="နာမည်ကို ရိုက်ထည့်ပါ"
                  placeholderTextColor="#999999"
                  autoFocus={true}
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons - Fixed at bottom */}
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
    fontSize: 16,
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
    // backgroundColor: 'red',
    paddingHorizontal: 20,
  },
  inputSection: {
    flex: 1,
    paddingTop: 40,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
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
  textInput: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
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
