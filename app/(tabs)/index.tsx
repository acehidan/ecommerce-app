import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import ShoppingCart from '../../assets/images/bag.png';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import Animated from 'react-native-reanimated';

const CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    image:
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
  {
    id: 3,
    name: 'Home & Living',
    slug: 'home-living',
    image:
      'https://images.unsplash.com/photo-1469504512102-900f29606341?w=800&q=80',
  },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    brand: 'SoundTech',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    id: 2,
    name: 'Modern Minimalist Watch',
    brand: 'TimeStyle',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
  {
    id: 3,
    name: 'Designer Sunglasses',
    brand: 'VisionStyle',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  },
];

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: toggleWishlist, isInWishlist } = useWishlistStore();

  const handleShopNow = (slug: string) => {
    router.push(`/collection/${slug}`);
  };

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <ScrollView style={styles.scrollView as ViewStyle}>
        {/* Hero Banner */}
        <View style={styles.heroBanner as ViewStyle}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
            }}
            style={styles.heroImage as ImageStyle}
          />
          <View style={styles.heroContent as ViewStyle}>
            <Text style={styles.heroTitle as TextStyle}>Summer Collection</Text>
            <Text style={styles.heroSubtitle as TextStyle}>Up to 50% off</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section as ViewStyle}>
          <Text style={styles.sectionTitle as TextStyle}>Collections</Text>
          <View style={styles.categoriesGrid as ViewStyle}>
            {CATEGORIES.map((category, index) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryCard as ViewStyle,
                  index === 0 && (styles.categoryCardLarge as ViewStyle),
                  index > 0 && (styles.categoryCardSmall as ViewStyle),
                ]}
              >
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage as ImageStyle}
                  resizeMode="cover"
                />
                <View style={styles.categoryOverlay as ViewStyle}>
                  <Text style={styles.categoryName as TextStyle}>
                    {category.name}
                  </Text>
                  <Pressable
                    style={styles.shopNowButton as ViewStyle}
                    onPress={() => handleShopNow(category.slug)}
                  >
                    <Text style={styles.shopNowText as TextStyle}>
                      Shop Now
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section as ViewStyle}>
          <Text style={styles.sectionTitle as TextStyle}>
            Featured Products
          </Text>
          <View style={styles.productsGrid as ViewStyle}>
            {FEATURED_PRODUCTS.map((product) => (
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
                        name={
                          isInWishlist(product.id) ? 'heart' : 'heart-outline'
                        }
                        size={20}
                        color={isInWishlist(product.id) ? '#FF3B30' : '#000000'}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.productInfo as ViewStyle}>
                    <Text style={styles.brandName as TextStyle}>
                      {product.brand}
                    </Text>
                    <Text
                      style={styles.productName as TextStyle}
                      numberOfLines={2}
                    >
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
                    addItem(product);
                  }}
                  android_ripple={{ color: '#ddd' }} // Set ripple color for Android
                >
                  <Image
                    source={ShoppingCart}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={styles.addButtonText as TextStyle}>Add</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  heroBanner: {
    height: 300,
    position: 'relative',
  } as ViewStyle,
  heroImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as ViewStyle,
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  } as TextStyle,
  heroSubtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 8,
  } as TextStyle,
  section: {
    padding: 20,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  } as TextStyle,
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,
  categoryCard: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  } as ViewStyle,
  categoryCardLarge: {
    width: '100%',
    aspectRatio: 2,
  } as ViewStyle,
  categoryCardSmall: {
    width: '48%',
    aspectRatio: 1,
  } as ViewStyle,
  categoryImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  } as ViewStyle,
  categoryName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  } as TextStyle,
  shopNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  } as ViewStyle,
  shopNowText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,
  productCard: {
    width: '48%',
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
  } as TextStyle,
});
