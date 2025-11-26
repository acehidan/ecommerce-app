import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import PageHeader from '../components/PageHeader';
import AuthRequiredModal from '../components/AuthRequiredModal';

const ORDERS = [
  {
    id: 1,
    date: '2024-02-15',
    status: 'Delivered',
    total: 299.99,
    items: [
      {
        name: 'Premium Wireless Headphones',
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    date: '2024-02-10',
    status: 'In Transit',
    total: 399.98,
    items: [
      {
        name: 'Modern Minimalist Watch',
        quantity: 2,
      },
    ],
  },
];

export default function Profile() {
  const wishlistItems = useWishlistStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { isAuthenticated, user, logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;
  // Check if user needs to authenticate (no user object means guest or not authenticated)
  const needsAuth = !user;

  // Debug log
  console.log('Profile - Auth state:', {
    isAuthenticated,
    hasUser: !!user,
    needsAuth,
  });

  const handleLogout = () => {
    Alert.alert('အကောင့်မှထွက်မယ်', 'သင်အကောင့်မှထွက်ရန်သေချာပါသလား?', [
      {
        text: 'မထွက်ပါ',
        style: 'cancel',
      },
      {
        text: 'ထွက်မယ်',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            clearCart();
            router.replace('/auth/login');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('အမှား', 'အကောင့်မှထွက်ရာတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်');
          }
        },
      },
    ]);
  };

  if (needsAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="မိမိအကောင့်" sticky={false} />
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color="#666666" />
          <Text style={styles.emptyText}>
            Please login to view your profile
          </Text>
        </View>
        <AuthRequiredModal
          visible={true}
          onClose={() => {
            router.back();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="မိမိအကောင့်" sticky={false} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/account-detail')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={24} color="#000000" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>မိမိအကောင့် အသေးစိတ်</Text>
              <Text style={styles.menuSubtitle}>
                အကောင့်နဲ့ ပက်သတ်တဲ့ အသေးစိတ် အချက်အလက်များ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/order-history')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="time-outline" size={24} color="#000000" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>မှာယူမှု အနှစ်ချုပ်</Text>
              <Text style={styles.menuSubtitle}>
                မှာယူထားသော အမှာစာတွေရဲ့ အသေးစိတ် မှတ်တမ်းများ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/address')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="location-outline" size={24} color="#000000" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>နေရပ် လိပ်စာ</Text>
              <Text style={styles.menuSubtitle}>
                ပစ္စည်းများ ပို့ဆောင်ရမဲ့ နေရပ်လိပ်စာ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="#000000"
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>ဆက်တင်</Text>
              <Text style={styles.menuSubtitle}>
                ဆက်တင်နဲ့ အသေးစိတ် အချက်အလက်များ
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/chat')}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="#000000"
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Chat</Text>
              <Text style={styles.menuSubtitle}>
                Chat with the customer service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutContainer}>
              <View style={styles.logoutIcon}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.logoutTitle}>အကောင့်မှထွက်မယ်</Text>
              </View>
            </View>
          </Pressable>
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
    // paddingHorizontal: 20,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 28,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },

  logoutIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
});
