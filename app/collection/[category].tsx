import { useLocalSearchParams } from 'expo-router';
import ShoppingCart from '../../assets/images/bag.png';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { router } from 'expo-router';

const PRODUCTS_BY_CATEGORY = {
  electronics: [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      brand: 'SoundTech',
      price: 299.99,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    },
    {
      id: 4,
      name: 'Smart Watch Pro',
      brand: 'TechWear',
      price: 249.99,
      image:
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    },
  ],
  fashion: [
    {
      id: 2,
      name: 'Modern Minimalist Watch',
      brand: 'TimeStyle',
      price: 199.99,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    },
    {
      id: 6,
      name: 'Leather Wallet',
      brand: 'LuxLeather',
      price: 79.99,
      image:
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    },
  ],
  'home-living': [
    {
      id: 8,
      name: 'Modern Table Lamp',
      brand: 'HomeLux',
      price: 129.99,
      image:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    },
    {
      id: 9,
      name: 'Decorative Vase',
      brand: 'ArtHome',
      price: 69.99,
      image:
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&q=80',
    },
  ],
  beauty: [
    {
      id: 3,
      name: 'Designer Sunglasses',
      brand: 'VisionStyle',
      price: 159.99,
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    },
    {
      id: 11,
      name: 'Luxury Perfume',
      brand: 'Essence',
      price: 189.99,
      image:
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    },
  ],
};

const CATEGORY_TITLES = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  'home-living': 'Home & Living',
  beauty: 'Beauty',
};

export default function Collection() {
  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const { category } = useLocalSearchParams<{
    category: keyof typeof PRODUCTS_BY_CATEGORY;
  }>();
  const products = PRODUCTS_BY_CATEGORY[category] || [];
  const title = CATEGORY_TITLES[category] || 'Collection';
  const addItem = useCartStore((state) => state.addItem);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href=".." asChild>
          <Pressable style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </Link>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={products}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleProductPress(item.id)}>
            <View style={styles.productCard}>
              <Link href={`/product/${item.id}`} asChild>
                <Pressable style={styles.productImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.wishlistButton}>
                    <Ionicons name="heart-outline" size={20} color="#000000" />
                  </View>
                </Pressable>
              </Link>
              <View style={styles.productInfo}>
                <Text style={styles.brandName}>{item.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>
                  {item.price.toLocaleString()} MMK
                </Text>
                <Pressable
                  style={styles.addButton}
                  onPress={() => addItem(item)}
                >
                  <Image
                    source={ShoppingCart}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  productGrid: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 12,
  },
  brandName: {
    fontSize: 14,
    color: 'red',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
    height: 44,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 30,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 4,
  },
});
