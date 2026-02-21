import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import LoadingState from '../components/LoadingState';
import handleGetByCategory from '../../services/products/getByCategory';
import colors from '../../constants/colors';

const CATEGORY_TITLES = {
  capacitor: 'Capacitor များ',
  'diy-decoration-kits': 'D.I.Y အလှဆင် Kits များ',
  electronics: 'Electronics',
};

/**
 * Sub-component for empty search results
 */
const EmptyState = React.memo(() => (
  <View style={styles.emptyContainer}>
    <Ionicons name="search-outline" size={64} color={colors.text.muted} />
    <Text style={styles.emptyText}>ရှာတွေ့သော ပစ္စည်း မရှိပါ</Text>
  </View>
));

/**
 * Sub-component for error state
 */
const ErrorState = ({ headerHeight, error, onRetry }) => (
  <View style={[styles.centerContainer, { paddingTop: headerHeight }]}>
    <Ionicons name="alert-circle-outline" size={64} color={colors.error.main} />
    <Text style={styles.errorText}>{error}</Text>
    <Pressable style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>ပြန်လည်ကြိုးစားမယ်</Text>
    </Pressable>
  </View>
);

export default function Collection() {
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top;

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useLocalSearchParams();
  const title = CATEGORY_TITLES[category] || category || 'Collection';

  const fetchProductsByCategory = useCallback(async () => {
    if (!category) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await handleGetByCategory(category);

      if (response.success) {
        const transformedProducts = (response.data?.data?.data || []).map((item) => ({
          id: item._id,
          name: item.name,
          price: item.retailUnitPrice,
          image: item.images?.[0]?.url || 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg',
          productCode: item.productCode,
          stockQuantity: item.stockQuantity,
          description: item.description,
          category: item.category,
        }));
        setProducts(transformedProducts);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Internal server error');
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.productCode?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleProductPress = useCallback((productCode) => {
    router.push(`/product/${productCode}`);
  }, []);

  const renderProduct = useCallback(({ item }) => (
    <View style={styles.productItem}>
      <ProductCard
        id={item.id}
        name={item.name}
        price={item.price}
        image={item.image}
        onPress={() => handleProductPress(item.productCode)}
      />
    </View>
  ), [handleProductPress]);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title={title}
        rightContent={!isLoading && !error ? `ပစ္စည်း ${filteredProducts.length} ခု` : null}
        sticky={true}
        showBackButton={true}
      />

      {isLoading ? (
        <LoadingState headerHeight={headerHeight} />
      ) : error ? (
        <ErrorState
          headerHeight={headerHeight}
          error={error}
          onRetry={fetchProductsByCategory}
        />
      ) : (
        <View style={{ paddingTop: headerHeight, flex: 1 }}>
          <SearchBar
            placeholder={`${title} တွေ ရှာမယ်`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            hintText="မိမိရှာလိုတဲ့ ပစ္စည်းရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်"
            showHint={true}
          />

          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyState}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.text.muted,
    fontWeight: '500',
  },
});

