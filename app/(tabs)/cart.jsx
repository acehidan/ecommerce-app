import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import Navbar from '../components/Navbar';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar title="စျေးဝယ်ခြင်းတောင်း" />
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color="#666666" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar title="စျေးဝယ်ခြင်းတောင်း" />
      <View style={styles.content}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>ပစ္စည်းများစာရင်း</Text>
          <Text style={styles.quantityLabel}>အရေအတွက် {items.length} ခု</Text>
        </View>

        <ScrollView style={styles.cartList}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <View style={styles.itemDetails}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemWeight}>1.0 KG</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    MMK {item.price.toLocaleString()}
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
          <Text style={styles.totalAmount}>
            MMK {getTotalPrice().toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.checkoutButtonContainer}>
        <Pressable style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>ပိုက်ဆံရှင်းမယ်</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginVertical: 16,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    // borderWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#000000',
    marginRight: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 50,
    marginTop: 16,
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
  },
  checkoutButton: {
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  checkoutButtonText: {
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
  },
});
