import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import handleGetBannerById from '../../services/banners/getBannerById';
import Toast from 'react-native-toast-message';

export default function BannerProducts() {
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top;
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerTitle, setBannerTitle] = useState('Banner Products');
  const [bannerDescription, setBannerDescription] = useState('');

  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      fetchBannerProducts();
    }
  }, [id]);

  const fetchBannerProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleGetBannerById(id);

      if (response.success && response.data.status === 'success') {
        const bannerData = response.data.data;
        setBannerTitle(bannerData.title || 'Banner Products');
        setBannerDescription(bannerData.description || '');

        // Transform stockIds to match ProductCard component structure
        if (bannerData.stockIds && bannerData.stockIds.length > 0) {
          const transformedProducts = bannerData.stockIds.map((item) => ({
            id: item._id,
            name: item.name,
            price: item.retailUnitPrice,
            image:
              item.images && item.images.length > 0
                ? item.images[0].url
                : 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg',
            productCode: item.productCode,
            stockQuantity: item.stockQuantity,
            description: item.description,
            category: item.category,
          }));

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        } else {
          const errorMsg = response.error || 'Failed to fetch banner products';
          setError(errorMsg);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMsg,
          });
        }
      } catch (error) {
        const errorMessage = 'Failed to fetch banner products';
        setError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
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

  const handleProductPress = (productCode) => {
    router.push(`/product/${productCode}`);
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
        <PageHeader title={bannerTitle} rightContent="Loading..." />
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>ပစ္စည်းများ ရယူနေပါသည်...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title={bannerTitle} rightContent="Error" />
        <View style={[styles.errorContainer, { paddingTop: headerHeight }]}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchBannerProducts}>
            <Text style={styles.retryButtonText}>ပြန်လည်ကြိုးစားမယ်</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title={bannerTitle}
        rightContent={`ပစ္စည်း ${filteredProducts.length} ခု`}
      />

      <View style={{ paddingTop: headerHeight }}>
        {/* {bannerDescription ? (
          <View style={styles.bannerDescriptionContainer}>
            <Text style={styles.bannerDescription}>{bannerDescription}</Text>
          </View>
        ) : null} */}

        <SearchBar
          placeholder={`${bannerTitle} တွေ ရှာမယ်`}
          value={searchQuery}
          onChangeText={handleSearch}
          hintText="* မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်"
        />

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
  bannerDescriptionContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },
});
