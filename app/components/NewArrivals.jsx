import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import ProductCard from './ProductCard';
import handleGetNewArrivalsProducts from '../../services/products/getNewArrivalsProducts';
import { useHomeCacheStore } from '../../store/homeCacheStore';
import Button from './Button';
import colors from '../../constants/colors';

export default function NewArrivals({ refreshTrigger, onLoadingChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getProducts, setProducts: setProductsCache, isProductsStale } = useHomeCacheStore();

  useEffect(() => {
    // If refreshTrigger is set, always fetch fresh data
    if (refreshTrigger > 0) {
      fetchNewArrivals(false);
      return;
    }

    // Check cache first
    const cachedProducts = getProducts();
    const isStale = isProductsStale();

    if (cachedProducts && !isStale) {
      // Use cached data immediately
      setProducts(cachedProducts);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
      // Fetch in background to update cache
      fetchNewArrivals(true);
    } else {
      // Fetch fresh data
      fetchNewArrivals(false);
    }
  }, [refreshTrigger]);

  const fetchNewArrivals = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
        if (onLoadingChange) onLoadingChange(true);
      }
      const result = await handleGetNewArrivalsProducts();
      if (result.success) {
        // Limit to first 10 products
        const limitedProducts = result.data.data.slice(0, 10);
        setProducts(limitedProducts);
        // Update cache
        setProductsCache(limitedProducts);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch new arrivals');
    } finally {
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  if (loading && products.length === 0) {
    return null;
  }

  // if (loading) {
  //   return (
  //     <View style={styles.section}>
  //       <View style={styles.header}>
  //         <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
  //         <View style={styles.placeholder} />
  //       </View>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="small" color="#333333" />
  //         <Text style={styles.loadingText}>Loading...</Text>
  //       </View>
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No Products Found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
        <Button
          title="ထပ်ကြည့်မယ်"
          variant="outline"
          size="medium"
          borderColor={colors.text.primary}
          textColor={colors.text.primary}
          onPress={() => router.push('/new-arrivals')}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsScrollContainer}
        style={styles.productsScrollView}
      >
        {products.map((product) => (
          <View key={product._id} style={styles.horizontalProductItem}>
            <ProductCard
              id={product._id}
              name={product.name}
              price={product.retailUnitPrice}
              image={
                product.images?.[0]?.url ||
                'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg'
              }
              onPress={() => handleProductPress(product.productCode)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  viewMoreButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewMoreText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
  },
  productsScrollView: {
    paddingLeft: 20,
  },
  productsScrollContainer: {
    paddingRight: 20,
    gap: 16,
  },
  horizontalProductItem: {
    width: 160,
  },
  placeholder: {
    width: 80,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  errorContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
    textAlign: 'center',
  },
});
