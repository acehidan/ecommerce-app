import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/colors';
import PageHeader from '../components/PageHeader';

export default function Cart() {
  const router = useRouter();
  const { items, updateQuantity, getTotalPrice } = useCartStore();
  console.log('items', items);
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;
  // Check if user needs to authenticate (no user object means guest or not authenticated)
  const needsAuth = !user;
  // Show auth modal for users who need to authenticate
  if (needsAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="စျေးခြင်း" sticky={false} backIcon={true} />
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color="#666666" />
          <Text style={styles.emptyText}>
            Please login to view your profile
          </Text>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>
        {/* <AuthRequiredModal
          visible={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        /> */}
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="စျေးခြင်း" sticky={false} backIcon={true} />
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color={colors.text.primary} />
          <Text style={styles.emptyCartText}>စျေးခြင်းထဲမှာ ပစ္စည်းမရှိသေးပါ</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="စျေးခြင်း" sticky={false} backIcon={true} />
      <View style={styles.content}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>ပစ္စည်းများစာရင်း</Text>
          <Text style={styles.quantityLabel}>အရေအတွက် {items.length} ခု</Text>
        </View>

        <ScrollView
          style={styles.cartList}
          contentContainerStyle={{ paddingBottom: tabBarHeight }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <View style={styles.itemDetails}>
                  <View style={{ width: '50%' }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    MMK {(item.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.quantityRow}>
                  <View style={styles.quantityContainer}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => {
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={24}
                        color="black"
                      />
                    </Pressable>

                    <Text style={styles.quantityText}>{item.quantity} ခု</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>စုစုပေါင်း</Text>
          <Text style={styles.totalAmount}>MMK {getTotalPrice().toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.checkoutButtonContainer}>
        <Pressable
          style={styles.checkoutButton}
          onPress={() => router.push('/terms-and-conditions')}
        >
          <Text style={styles.checkoutButtonText}>ပိုက်ဆံရှင်းမယ်</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
    marginVertical: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,

  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    padding: 12,
    marginBottom: 12, // borderWidth: 1,
    borderBottomColor: colors.border.light,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  quantityLabel: {
    fontFamily: 'NotoSansMyanmar-Regular',
    fontSize: 12,
    color: colors.text.primary,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quantityContainer: {
    borderRadius: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 16,
    color: '#000000',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 20,
    marginTop: 16,
    elevation: 1,
    shadowColor: colors.button.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  checkoutButtonContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginBottom: 60,
  },
  checkoutButton: {
    backgroundColor: colors.button.primary,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  loginButton: {
    backgroundColor: colors.button.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
    width: '100%',
    textAlign: 'center',
  },
});