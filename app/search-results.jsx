import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
// import { FlashList } from '@shopify/flash-list';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import handleGetStocks from '../services/products/getStocks';
import ProductCard from './components/ProductCard';
import PageHeader from './components/PageHeader';
import colors from '../constants/colors';

export default function SearchResults() {
  const { query, category } = useLocalSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top;

  useEffect(() => {
    fetchSearchResults();
  }, [query, category]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = {};
      if (query) {
        searchParams.name = query;
      }
      if (category) {
        searchParams.category = category;
      }

      const response = await handleGetStocks(searchParams);

      if (response.success) {
        setSearchResults(response.data);
      } else {
        setError(response.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('ရှာဖွေမှုတွင်အမှားတစ်ခုဖြစ်ပွားခဲ့သည်');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };


  const handleProductPress = (productId) => {
    // console.log('productId', productId);
    router.push(`/product/${productId}`);
  };

  const renderProductCard = ({ item }) => (
    <View style={styles.productItem}>
      <ProductCard
        id={item._id}
        name={item.name}
        price={item.retailUnitPrice}
        image={
          item.images && item.images.length > 0
            ? item.images[0].url
            : 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg'
        }
        isDiscounted={item.isDiscounted}
        discountPercentage={item.discountPercentage}
        tags={item.tags}
        onPress={() => handleProductPress(item.productCode)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="ကိုက်ညီသော ပစ္စည်းများ" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>ရှာဖွေနေသည်...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="ကိုက်ညီသော ပစ္စည်းများ" showBackButton={true} sticky={true} />

      <View style={{ paddingTop: headerHeight }}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
            <Text style={styles.errorText}>အမှားတစ်ခုဖြစ်ပွားခဲ့သည်</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchSearchResults}
            >
              <Text style={styles.retryButtonText}>ပြန်လည်ကြိုးစားမယ်</Text>
            </TouchableOpacity>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProductCard}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.productRow}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={60} color="#CCCCCC" />
            <Text style={styles.noResultsText}>ရှာဖွေမှုရလဒ်မရှိပါ</Text>
            <Text style={styles.noResultsSubtext}>
              အခြားစကားလုံးများဖြင့် ပြန်လည်ရှာဖွေကြည့်ပါ
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  searchQuery: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  productList: {
    padding: 16,

  },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
