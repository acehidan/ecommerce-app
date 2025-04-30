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
import { useWishlistStore } from '../../store/wishlistStore';

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
  beauty: 'Beauty',
};

export default function Collection() {
  const { addItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const handleProductPress = (productId: number) => {
    router.push(`/cart`);
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

      <View style={styles.productsGrid as ViewStyle}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard as ViewStyle}>
            <Pressable
              style={styles.productCardContent as ViewStyle}
              onPress={() => handleProductPress(product.id)}
            >
              <View style={styles.productImageContainer as ViewStyle}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage as ImageStyle}
                />
                <Pressable
                  style={[
                    styles.wishlistButton as ViewStyle,
                    isInWishlist(product.id) &&
                      (styles.wishlistButtonActive as ViewStyle),
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <Ionicons
                    name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isInWishlist(product.id) ? '#FF3B30' : '#000000'}
                  />
                </Pressable>
              </View>
              <View style={styles.productInfo as ViewStyle}>
                <Text style={styles.brandName as TextStyle}>
                  {product.brand}
                </Text>
                <Text style={styles.productName as TextStyle} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice as TextStyle}>
                  {product.price.toLocaleString()} MMK
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.addButton as ViewStyle,
                { opacity: pressed ? 0.7 : 1 }, // Change opacity when pressed for feedback
              ]}
              onPress={(e) => {
                e.stopPropagation();
                handleProductPress(product.id);
                addItem(product);
              }}
              android_ripple={{ color: '#ddd' }} // Set ripple color for Android
            >
              <Image source={ShoppingCart} style={{ width: 20, height: 20 }} />
              <Text style={styles.addButtonText as TextStyle}>Add</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* <FlatList
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
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,
  productCard: {
    width: '48%',
    height: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  } as ViewStyle,
  productCardContent: {
    flex: 1,
  } as ViewStyle,
  productImageContainer: {
    position: 'relative',
    aspectRatio: 1,
  } as ViewStyle,
  productImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  wishlistButtonActive: {
    backgroundColor: '#FFF0F0',
  } as ViewStyle,
  productInfo: {
    padding: 12,
  } as ViewStyle,
  brandName: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  } as TextStyle,
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
    height: 44,
  } as TextStyle,
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  } as TextStyle,
  addButton: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 30,
  } as ViewStyle,
  addButtonText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
    color: '#000000',
  },
});
