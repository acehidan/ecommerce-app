import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import ProductCard from './components/ProductCard';
import PageHeader from './components/PageHeader';
import SearchBar from './components/SearchBar';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import handleGetNewArrivalsProducts from '../services/products/getNewArrivalsProducts';
import { Ionicons } from '@expo/vector-icons';

export default function NewArrivalsPage() {
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top; // Approximate header height (padding + content + safe area)
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const result = await handleGetNewArrivalsProducts();
        if (result.success) {
          setProducts(result.data.data);
          setFilteredProducts(result.data.data);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <ProductCard
        id={item._id}
        name={item.name}
        price={item.retailUnitPrice}
        image={
          item.images?.[0]?.url ||
          'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg'
        }
        onPress={() => handleProductPress(item.productCode)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="အသစ်ရောက် ပစ္စည်းများ" />
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>Loading new arrivals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="အသစ်ရောက် ပစ္စည်းများ" />
        <View style={[styles.errorContainer, { paddingTop: headerHeight }]}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="အသစ်ရောက် ပစ္စည်းများ"
        rightContent={`ပစ္စည်း ${filteredProducts.length} ခု`}
      />

      <View style={{ paddingTop: headerHeight }}>
        <SearchBar
          placeholder="အသစ်ရောက် ပစ္စည်းတွေရှာမယ်"
          value={searchQuery}
          onChangeText={handleSearch}
          hintText="* မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်"
        />

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 16,
  },
  placeholder: {
    width: 80,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
});
