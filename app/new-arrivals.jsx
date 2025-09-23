import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ProductCard from './components/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import handleGetNewArrivalsProducts from '../services/products/getNewArrivalsProducts';

export default function NewArrivalsPage() {
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
        image={item.images?.[0]?.url || 'https://via.placeholder.com/300'}
        onPress={() => handleProductPress(item.productCode)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>Loading new arrivals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
        <Text style={styles.productCount}>
          ပစ္စည်း {filteredProducts.length} ခု
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="အသစ်ရောက် ပစ္စည်းတွေရှာမယ်"
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <Text style={styles.searchHint}>
          * မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို
          ရိုက်ပြီးရှာနိုင်ပါတယ်
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  productCount: {
    fontSize: 14,
    color: '#666666',
    minWidth: 80,
    textAlign: 'right',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  searchHint: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
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
