import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import handleGetNewArrivalsProducts from '../../services/products/getNewArrivalsProducts';
import Button from './Button';
import colors from '../../constants/colors';

// --- Constants ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DISPLAY_LIMIT = 10;
const FALLBACK_IMAGE = 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg';

// --- Main Component ---

export default function NewArrivals({ refreshTrigger, onLoadingChange }) {
  // Use TanStack Query for products fetching
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const result = await handleGetNewArrivalsProducts();
      if (result && result.success && result.data?.data) {
        return result.data.data.slice(0, DISPLAY_LIMIT);
      }
      throw new Error(result?.error || 'Failed to fetch new arrivals');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Notify parent of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Handle manual refresh trigger
  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleProductPress = useCallback((productCode) => {
    router.push(`/product/${productCode}`);
  }, []);

  const showContent = useMemo(() => {
    return !isLoading && products && products.length > 0;
  }, [isLoading, products]);

  // Hide section if either there is an error or no content exists when not loading/refreshing
  if (!showContent && !isLoading && !refreshTrigger) return null;
  if (isError && !products) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
        <Button
          title="ထပ်ကြည့်မယ်"
          variant="outline"
          size="medium"
          onPress={() => router.push('/(tabs)/search')}
          borderColor={colors.text.primary}
          textColor={colors.text.primary}
        />
      </View>

      {isLoading && !products ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>ခနစောင့်ပါ...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScrollContainer}
          style={styles.productsScrollView}
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {products?.map((product) => (
            <View key={product._id} style={styles.productWrapper}>
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.retailUnitPrice}
                image={product.images?.[0]?.url || FALLBACK_IMAGE}
                onPress={() => handleProductPress(product.productCode)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
    flex: 1,
    // Faux bold effect for Myanmar font
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  productsScrollView: {
    paddingLeft: 20,
  },
  productsScrollContainer: {
    paddingRight: 20,
    gap: 16,
  },
  productWrapper: {
    width: 165,
  },
  loadingContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: colors.text.muted,
    fontFamily: 'NotoSansMyanmar-Regular',
    marginLeft: 12,
  },
});
