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

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color="#666666" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <ScrollView style={styles.cartList}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
              <View style={styles.quantityContainer}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1);
                    }
                  }}
                >
                  <Ionicons name="remove" size={20} color="#fff" />
                </Pressable>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        {/* <Pressable style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    borderRadius: 20,
    marginHorizontal: 16,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
    color: '#000',
  },
  removeButton: {
    marginTop: 30,
    padding: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#000000',
    marginBottom: 80,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
