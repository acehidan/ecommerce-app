import { useLocalSearchParams, router } from 'expo-router';
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

const PRODUCTS = {
  1: {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    description:
      'Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium materials for ultimate comfort.',
    specs: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Bluetooth 5.0',
      'Touch controls',
      'Voice assistant support',
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80',
    ],
    rating: 4.8,
    reviews: 128,
  },
  2: {
    id: 2,
    name: 'Modern Minimalist Watch',
    price: 199.99,
    description:
      'A timepiece that combines elegance with functionality. This minimalist watch features a scratch-resistant sapphire crystal, premium leather strap, and water resistance up to 50m.',
    specs: [
      'Sapphire crystal glass',
      'Genuine leather strap',
      'Water resistant 50m',
      'Japanese quartz movement',
      'Stainless steel case',
    ],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80',
    ],
    rating: 4.6,
    reviews: 89,
  },
  3: {
    id: 3,
    name: 'Designer Sunglasses',
    price: 159.99,
    description:
      'Protect your eyes in style with these designer sunglasses. Featuring UV400 protection, polarized lenses, and a lightweight yet durable frame.',
    specs: [
      'UV400 protection',
      'Polarized lenses',
      'Lightweight frame',
      'Anti-reflective coating',
      'Premium case included',
    ],
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
    ],
    rating: 4.7,
    reviews: 156,
  },
  4: {
    id: 4,
    name: 'Smart Watch Pro',
    price: 249.99,
    description:
      'Stay connected and track your fitness goals with this smart watch. Featuring a 1.69-inch AMOLED display, GPS tracking, and a heart rate monitor.',
    specs: [
      '1.69-inch AMOLED display',
      'GPS tracking',
      'Heart rate monitor',
      'Water resistant 50m',
      'Bluetooth 5.0',
    ],
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  5: {
    id: 5,
    name: 'Wireless Bluetooth Speaker',
    price: 99.99,
    description:
      'Experience high-quality sound with this wireless Bluetooth speaker. Featuring a built-in microphone, voice assistant support, and a rechargeable battery.',
    specs: [
      'Built-in microphone',
      'Voice assistant support',
      'Rechargeable battery',
      'Bluetooth 5.0',
      'Water resistant IPX7',
    ],
    images: [
      'https://images.unsplash.com/photo-1507878566509-a0dbe19677a5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1589001181560-a8df1800e501?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1632073383420-01461da1e082?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJsdWV0b290aCUyMHNwZWFrZXJ8ZW58MHx8MHx8fDA%3D',
    ],
  },
  6: {
    id: 6,
    name: 'Wireless Earbuds',
    price: 79.99,
    description:
      'Enjoy your music without wires with these wireless earbuds. Featuring noise-canceling technology, touch controls, and a rechargeable battery.',
    specs: [
      'Noise-canceling technology',
      'Touch controls',
      'Rechargeable battery',
      'Bluetooth 5.0',
      'Water resistant IPX7',
    ],
    images: [
      'https://images.unsplash.com/photo-1564632516501-16af063d382f?q=80&w=1524&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1606763106198-4ffc663c2419?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1604214684476-2ecbacbb477e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS[Number(id)];
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    router.push('/cart');
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageGallery}
        >
          {product.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={
                    star <= Math.floor(product.rating) ? 'star' : 'star-outline'
                  }
                  size={20}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Specifications */}
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {product.specs.map((spec, index) => (
              <View key={index} style={styles.specItem}>
                <Ionicons name="checkmark-circle" size={20} color="#00C853" />
                <Text style={styles.specText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="#000000" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  imageGallery: {
    height: 400,
  },
  productImage: {
    width: 400,
    height: 400,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviews: {
    color: '#999999',
    fontSize: 14,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 24,
  },
  specSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#000000',
  },
  addToCartButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
