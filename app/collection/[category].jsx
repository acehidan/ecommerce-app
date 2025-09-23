import React, { useState, useMemo, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import handleGetByCategory from '../../services/products/getByCategory';

const CATEGORY_TITLES = {
  capacitor: 'Capacitor များ',
  'diy-decoration-kits': 'D.I.Y အလှဆင် Kits များ',
  electronics: 'Electronics',
};

export default function Collection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useLocalSearchParams();

  const title = CATEGORY_TITLES[category] || category || 'Collection';

  useEffect(() => {
    if (category) {
      fetchProductsByCategory();
    }
  }, [category]);

  const fetchProductsByCategory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleGetByCategory(category);

      if (response.success) {
        // Transform API response to match ProductCard component structure
        const transformedProducts = response.data.data.data.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.retailUnitPrice,
          image:
            item.images && item.images.length > 0
              ? item.images[0].url
              : 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', // fallback image
          productCode: item.productCode,
          stockQuantity: item.stockQuantity,
          description: item.description,
          category: item.category,
        }));

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } else {
        setError(response.error);
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      const errorMessage = 'Failed to fetch products';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

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
        id={item.id}
        name={item.name}
        price={item.price}
        image={item.image}
        onPress={() => handleProductPress(item.productCode)}
      />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.productCount}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>ပစ္စည်းများ ရယူနေပါသည်...</Text>
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
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.productCount}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={fetchProductsByCategory}
          >
            <Text style={styles.retryButtonText}>ပြန်လည်ကြိုးစားမယ်</Text>
          </Pressable>
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
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.productCount}>
          ပစ္စည်း {filteredProducts.length} ခု
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder={`${title} တွေ ရှာမယ်`}
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
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>ရှာတွေ့သော ပစ္စည်း မရှိပါ</Text>
          </View>
        )}
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
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
