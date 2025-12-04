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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../components/PageHeader';
import { useCartStore } from '../../store/cartStore';
import handleGetProductById from '../../services/products/getProductById';
import colors from '../../constants/colors';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  console.log(id);
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top; // Approximate header height (padding + content + safe area)
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

  // Calculate unit price based on quantity and wholesale tiers
  const getUnitPrice = (qty) => {
    if (!product || qty === 0) return 0;

    // If quantity is 1, use retail price
    if (qty === 1) {
      return product.retailUnitPrice;
    }

    // Check if wholesale tiers exist
    if (product.wholeSale && product.wholeSale.length > 0) {
      // Sort wholesale tiers by quantity (descending) to find the best match
      const sortedWholesale = [...product.wholeSale].sort(
        (a, b) => b.wholeSaleQuantity - a.wholeSaleQuantity
      );

      // Find the highest wholesale tier that the quantity qualifies for
      const matchingTier = sortedWholesale.find(
        (tier) => qty >= tier.wholeSaleQuantity
      );

      // If quantity qualifies for wholesale, use wholesale price
      if (matchingTier) {
        return matchingTier.wholeSaleUnitPrice;
      }
    }

    // Default to retail price if no wholesale tier matches
    return product.retailUnitPrice;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0 && product && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyProduct = () => {
    if (quantity > 0 && product) {
      addItem(
        {
          id: product._id,
          name: product.name,
          price: product.retailUnitPrice, // Will be recalculated in store
          image: product.images?.[0]?.url || '',
          retailUnitPrice: product.retailUnitPrice,
          wholeSale: product.wholeSale || [],
        },
        quantity
      );
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="ပစ္စည်း အသေးစိတ်" />
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="ပစ္စည်း အသေးစိတ်" />
        <View style={[styles.errorContainer, { paddingTop: headerHeight }]}>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="ပစ္စည်း အသေးစိတ်" sticky={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerHeight - 20 }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                product.images?.[0]?.url ||
                'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg',
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {/* <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>
              {product.retailUnitPrice}ks
            </Text>
          </View> */}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        <View style={styles.specsContainer}>
          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>အမျိုးအစား</Text>
            <Text style={styles.specValue}>{product.category}</Text>
          </View>

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>ပစ္စည်းကုဒ်</Text>
            <Text style={styles.specValue}>{product.productCode}</Text>
          </View>

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>လက်ကျန် အရေအတွက်</Text>
            <Text style={styles.specValue}>{product.stockQuantity} ခု</Text>
          </View>

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>အလေးချိန်</Text>
            <Text style={styles.specValue}>
              {product.unitWeight} {product.weightUnit}
            </Text>
          </View>

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>ဈေးနှုန်း (အနည်းဆုံး)</Text>
            <Text style={styles.specValue}>
              MMK {product?.retailUnitPrice?.toLocaleString()}
            </Text>
          </View>
        </View>

        {product.wholeSale && product.wholeSale.length > 0 && (
          <View style={styles.wholesaleContainer}>
            <Text style={styles.wholesaleTitle}>လက်ကားဈေးနှုန်းများ</Text>
            {product.wholeSale.map((wholesale, index) => (
              <View key={index} style={styles.wholesaleItem}>
                <View style={styles.specsItem}>
                  <Text style={styles.specsTitle}>
                    {wholesale.wholeSaleQuantity} ခု အထက်ဈေး
                  </Text>
                  <Text style={styles.specValue}>
                    MMK {wholesale?.wholeSaleUnitPrice?.toLocaleString()}
                  </Text>
                </View>
              </View>
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
  imageContainer: {
    position: 'relative',
    height: 350,
    marginBottom: 20,
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
  specsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 0,
    marginTop: 5,
  },
  specValue: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 0,
    fontWeight: '700',
  },
  wholesaleContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  wholesaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  wholesaleItem: {
    fontSize: 10,
    color: colors.text.secondary,
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
    paddingTop: 16,
    paddingBottom: 35,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
});
