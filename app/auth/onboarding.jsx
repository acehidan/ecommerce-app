import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import colors from '../../constants/colors';

export default function OnboardingScreen() {
  const { continueAsGuest } = useAuthStore();

  const handleGuestLogin = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Image
            source={require('../../assets/images/komin.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Ko Min D.I.Y Store</Text>
          <Text style={styles.description}>
            သင်ရဲ့ D.I.Y လိုအပ်ချက်များအတွက် တစ်နေရာတည်းမှာ ရရှိနိုင်သော ဆိုင်
            မှ ကြိုဆိုပါတယ်ဗျ
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="အကောင့်ပြန်ဝင်မယ်"
            onPress={() => router.push('/auth/login')}
            variant="filled"
            size="large"
            backgroundColor={colors.text.secondary}
            textColor={colors.text.light}
            style={styles.button}
          />

          <Button
            title="အကောင့်အသစ်ဖွင့်မယ်"
            onPress={() => router.push('/auth/signup')}
            variant="filled"
            size="large"
            backgroundColor={colors.text.secondary}
            textColor={colors.text.light}
            style={styles.button}
          />

          <Button
            title="ဧည့်သည်အကောင့်နဲ့ဝင်မယ်"
            onPress={handleGuestLogin}
            variant="outline"
            size="large"
            borderColor={colors.text.secondary}
            textColor={colors.text.secondary}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 20,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    letterSpacing: 0.5,
    lineHeight: 28,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
