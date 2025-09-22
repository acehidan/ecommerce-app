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
import { router } from 'expo-router';
import { useWishlistStore } from '../../store/wishlistStore';

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>Sarah Johnson</Text>
          <Text style={styles.email}>sarah.johnson@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <Pressable style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/favorites')}
          >
            <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Favorites</Text>
            {wishlistItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{wishlistItems.length}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Ionicons name="location-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Shipping Address</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Ionicons name="card-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {ORDERS.map((order) => (
            <Pressable key={order.id} style={styles.orderItem}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>Order • {order.date}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    {
                      color:
                        order.status === 'Delivered' ? '#00C853' : '#FF9800',
                    },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
              {order.items.map((item, index) => (
                <Text key={index} style={styles.orderItemText}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
              <Text style={styles.orderTotal}>Total: ${order.total}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#999999',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: '#999999',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});
