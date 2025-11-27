import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import PageHeader from './components/PageHeader';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;

  const settingsMenuItems = [
    // {
    //   id: 1,
    //   title: 'ဘာသာစကား ရွေးမယ်',
    //   icon: 'language-outline',
    //   onPress: () => {
    //     // Navigate to language selection page
    //     console.log('Language selection');
    //   },
    // },
    {
      id: 2,
      title: 'အသံနှင့် အသိပေးချက်',
      icon: 'notifications-outline',
      onPress: () => {
        router.push('/sound-and-notifications');
      },
    },
    // {
    //   id: 3,
    //   title: 'စည်းမျဉ်း စည်းကမ်းများ',
    //   icon: 'document-text-outline',
    //   onPress: () => {
    //     // Navigate to terms and conditions page
    //     console.log('Terms and conditions');
    //   },
    // },
    // {
    //   id: 4,
    //   title: 'လုံခြုံရေးဆိုင်ရာ အချက်အလက်များ',
    //   icon: 'lock-closed-outline',
    //   onPress: () => {
    //     // Navigate to security information page
    //     console.log('Security information');
    //   },
    // },
    // {
    //   id: 5,
    //   title: 'Admin တွေနဲ့ဆက်သွယ်မယ်',
    //   icon: 'person-circle-outline',
    //   onPress: () => {
    //     // Navigate to contact admin page
    //     console.log('Contact admin');
    //   },
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="ဆက်တင်" sticky={false} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          {settingsMenuItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={24} color="#000000" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </Pressable>
          ))}
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
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});
