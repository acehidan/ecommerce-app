import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';

const PRODUCTS = {
  1: {
    id: 1,
    name: 'Capacitor (1 uf)',
    price: 1000,
    description:
      '1uF ကပက်ဆစ်တာသည် DIY အီလက်ထရောနစ် ပစ္စည်းများအတွက် သင့်လျော်ပြီး၊ လျှပ်စစ်အား သိမ်းဆည်းရန်နှင့် လှိုင်းများကို ထိန်းချုပ်ရန် ကူညီပါတယ်။',
    specs: {
      type: 'Capacitor ups',
      quantity: 477,
      storage: 'ပစ္စည်းရှိ',
      weight: 'KG 0.1',
      price: 'MMK 1,000',
    },
    wholesalePrices: [
      { quantity: 10, price: 950 },
      { quantity: 50, price: 900 },
      { quantity: 100, price: 800 },
    ],
    seller: {
      name: 'ကိုမင်း',
      phone: '09765077123/09964xxxxxx',
      address: '(ရန်ကုန်-ဆူးလေ.ဘားလမ်း)',
    },
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    ],
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
  const product = PRODUCTS[Number(id) as keyof typeof PRODUCTS];
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyProduct = () => {
    if (quantity > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      });
      router.push('/cart');
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container as ViewStyle}>
        <Text style={styles.errorText as TextStyle}>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <ScrollView style={styles.scrollView as ViewStyle}>
        {/* Header */}
        <View style={styles.header as ViewStyle}>
          <Pressable
            style={styles.backButton as ViewStyle}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle as TextStyle}>ပစ္စည်း အသေးစိတ်</Text>
          <View style={styles.placeholder as ViewStyle} />
        </View>

        {/* Product Image and Price */}
        <View style={styles.imageContainer as ViewStyle}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.mainImage as ImageStyle}
            resizeMode="cover"
          />
          <View style={styles.priceBadge as ViewStyle}>
            <Text style={styles.priceBadgeText as TextStyle}>1000ks</Text>
          </View>
        </View>

        {/* Seller Information */}
        {(product as any).seller && (
          <View style={styles.sellerInfo as ViewStyle}>
            <Text style={styles.sellerName as TextStyle}>
              {(product as any).seller.name}
            </Text>
            <Text style={styles.sellerPhone as TextStyle}>
              {(product as any).seller.phone}
            </Text>
            <Text style={styles.sellerAddress as TextStyle}>
              {(product as any).seller.address}
            </Text>
          </View>
        )}

        {/* Product Description */}
        <View style={styles.descriptionContainer as ViewStyle}>
          <Text style={styles.productName as TextStyle}>{product.name}</Text>
          <Text style={styles.productDescription as TextStyle}>
            {product.description}
          </Text>
        </View>

        {/* Product Specifications */}
        {product.specs &&
          typeof product.specs === 'object' &&
          'type' in product.specs && (
            <View style={styles.specsContainer as ViewStyle}>
              <Text style={styles.specsTitle as TextStyle}>အမျိုးအစား</Text>
              <Text style={styles.specValue as TextStyle}>
                {product.specs.type}
              </Text>

              <Text style={styles.specsTitle as TextStyle}>
                လက်ကျန် အရေအတွက်
              </Text>
              <Text style={styles.specValue as TextStyle}>
                {product.specs.quantity} ခု
              </Text>

              <Text style={styles.specsTitle as TextStyle}>သိုလှောင်မှု</Text>
              <Text style={styles.specValue as TextStyle}>
                {product.specs.storage}
              </Text>

              <Text style={styles.specsTitle as TextStyle}>အလေးချိန်</Text>
              <Text style={styles.specValue as TextStyle}>
                {product.specs.weight}
              </Text>

              <Text style={styles.specsTitle as TextStyle}>ဈေးနှုန်း</Text>
              <Text style={styles.specValue as TextStyle}>
                {product.specs.price}
              </Text>
            </View>
          )}

        {/* Wholesale Prices */}
        {(product as any).wholesalePrices && (
          <View style={styles.wholesaleContainer as ViewStyle}>
            <Text style={styles.wholesaleTitle as TextStyle}>
              လက်ကားဈေးနှုန်းများ
            </Text>
            {(product as any).wholesalePrices.map(
              (wholesale: any, index: number) => (
                <Text key={index} style={styles.wholesaleItem as TextStyle}>
                  {wholesale.quantity} ခု အထက်ဈေး: MMK {wholesale.price}
                </Text>
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar as ViewStyle}>
        <View style={styles.quantitySelector as ViewStyle}>
          <Pressable
            style={styles.quantityButton as ViewStyle}
            onPress={() => handleQuantityChange(-1)}
          >
            <Ionicons name="remove" size={20} color="#000000" />
          </Pressable>
          <Text style={styles.quantityText as TextStyle}>{quantity} ခု</Text>
          <Pressable
            style={styles.quantityButton as ViewStyle}
            onPress={() => handleQuantityChange(1)}
          >
            <Ionicons name="add" size={20} color="#000000" />
          </Pressable>
        </View>
        <Pressable
          style={[
            styles.buyButton as ViewStyle,
            quantity === 0 && (styles.buyButtonDisabled as ViewStyle),
          ]}
          onPress={handleBuyProduct}
          disabled={quantity === 0}
        >
          <Text style={styles.buyButtonText as TextStyle}>ပစ္စည်း ဝယ်မယ်</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  } as ViewStyle,
  backButton: {
    padding: 4,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  } as TextStyle,
  placeholder: {
    width: 32,
  } as ViewStyle,
  imageContainer: {
    position: 'relative',
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  } as ViewStyle,
  mainImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  priceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  } as ViewStyle,
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,
  sellerInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  } as ViewStyle,
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  } as TextStyle,
  sellerPhone: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  } as TextStyle,
  sellerAddress: {
    fontSize: 14,
    color: '#666666',
  } as TextStyle,
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  } as TextStyle,
  productDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  } as TextStyle,
  specsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  specsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    marginTop: 12,
  } as TextStyle,
  specValue: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  } as TextStyle,
  wholesaleContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  } as ViewStyle,
  wholesaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  } as TextStyle,
  wholesaleItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  } as TextStyle,
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  } as ViewStyle,
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  } as ViewStyle,
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  } as TextStyle,
  buyButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  } as ViewStyle,
  buyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  } as ViewStyle,
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
});
