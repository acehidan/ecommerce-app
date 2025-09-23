import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import handleGetProductById from '../../services/products/getProductById';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  console.log(id);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log(product.data);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await handleGetProductById(id);
        if (result.success) {
          setProduct(result.data.data.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyProduct = () => {
    if (quantity > 0 && product) {
      addItem(
        {
          id: product._id,
          name: product.name,
          price: product.retailUnitPrice,
          image: product.images?.[0]?.url || '',
        },
        quantity
      );
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>ပစ္စည်း အသေးစိတ်</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                product.images?.[0]?.url || 'https://via.placeholder.com/300',
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>
              {product.retailUnitPrice}ks
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        <View style={styles.specsContainer}>
          <Text style={styles.specsTitle}>အမျိုးအစား</Text>
          <Text style={styles.specValue}>{product.category}</Text>

          <Text style={styles.specsTitle}>ပစ္စည်းကုဒ်</Text>
          <Text style={styles.specValue}>{product.productCode}</Text>

          <Text style={styles.specsTitle}>လက်ကျန် အရေအတွက်</Text>
          <Text style={styles.specValue}>{product.stockQuantity} ခု</Text>

          <Text style={styles.specsTitle}>အလေးချိန်</Text>
          <Text style={styles.specValue}>
            {product.unitWeight} {product.weightUnit}
          </Text>

          <Text style={styles.specsTitle}>ဈေးနှုန်း</Text>
          <Text style={styles.specValue}>MMK {product.retailUnitPrice}</Text>
        </View>

        {product.wholeSale && product.wholeSale.length > 0 && (
          <View style={styles.wholesaleContainer}>
            <Text style={styles.wholesaleTitle}>လက်ကားဈေးနှုန်းများ</Text>
            {product.wholeSale.map((wholesale, index) => (
              <Text key={index} style={styles.wholesaleItem}>
                {wholesale.wholeSaleQuantity} ခု အထက်ဈေး: MMK{' '}
                {wholesale.wholeSaleUnitPrice}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <Ionicons name="remove" size={20} color="#000000" />
          </Pressable>
          <Text style={styles.quantityText}>{quantity} ခု</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <Ionicons name="add" size={20} color="#000000" />
          </Pressable>
        </View>
        <Pressable
          style={[styles.buyButton, quantity === 0 && styles.buyButtonDisabled]}
          onPress={handleBuyProduct}
          disabled={quantity === 0}
        >
          <Text style={styles.buyButtonText}>ပစ္စည်း ဝယ်မယ်</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sellerInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sellerPhone: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  sellerAddress: {
    fontSize: 14,
    color: '#666666',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  specsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  specsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    marginTop: 12,
  },
  specValue: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  wholesaleContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  wholesaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  wholesaleItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
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
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
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
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
});
