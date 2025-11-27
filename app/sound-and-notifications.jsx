import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useState } from 'react';
import PageHeader from './components/PageHeader';

export default function SoundAndNotifications() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;
  
  const [notificationSound, setNotificationSound] = useState(true);
  const [phoneVibration, setPhoneVibration] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="အသံနှင့် အသိပေးချက်" sticky={false} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingsContainer}>
          {/* Notification Sound Setting */}
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>အသိပေးချက်အသံ</Text>
              <Text style={styles.settingSubtitle}>
                ဝယ်ယူမှု ပြီးဆုံးတိုင်း အသိပေးချက် အသံ
              </Text>
            </View>
            <Switch
              value={notificationSound}
              onValueChange={setNotificationSound}
              trackColor={{ false: '#E5E5E5', true: '#000000' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </View>

          {/* Phone Vibration Setting */}
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>ဖုန်း တူန်ခါမှု</Text>
              <Text style={styles.settingSubtitle}>
                ဝယ်ယူမှု ပြီးဆုံးတိုင်း / လုပ်ဆောင်မှု ပြီးဆုံးတိုင်း
                အသိပေးသော ဖုန်းတုန်ခါမှု
              </Text>
            </View>
            <Switch
              value={phoneVibration}
              onValueChange={setPhoneVibration}
              trackColor={{ false: '#E5E5E5', true: '#000000' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  settingsContainer: {
    padding: 20,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
});

