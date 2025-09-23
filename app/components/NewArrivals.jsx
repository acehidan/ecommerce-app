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

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const result = await handleGetNewArrivalsProducts();
        if (result.success) {
          // Limit to first 10 products
          const limitedProducts = result.data.data.slice(0, 10);
          setProducts(limitedProducts);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch new arrivals');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#333333" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load products</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
        <Pressable
          style={styles.viewMoreButton}
          onPress={() => router.push('/new-arrivals')}
        >
          <Text style={styles.viewMoreText}>ထပ်ကြည့်မယ်</Text>
        </Pressable>
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
                product.images?.[0]?.url || 'https://via.placeholder.com/300'
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
