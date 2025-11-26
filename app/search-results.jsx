import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import handleGetStocks from '../services/products/getStocks';
import ProductCard from './components/ProductCard';

export default function SearchResults() {
  const { query, category } = useLocalSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterVisible, setFilterVisible] = useState(false);
  const [error, setError] = useState(null);

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

  const handleBack = () => {
    router.back();
  };

  const handleProductPress = (productId) => {
    console.log('productId', productId);
    router.push(`/product/${productId}`);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sortedResults = [...searchResults];

    switch (sortType) {
      case 'price-low':
        sortedResults.sort((a, b) => a.retailUnitPrice - b.retailUnitPrice);
        break;
      case 'price-high':
        sortedResults.sort((a, b) => b.retailUnitPrice - a.retailUnitPrice);
        break;
      case 'stock':
        sortedResults.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      case 'newest':
        sortedResults.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setSearchResults(sortedResults);
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
        onPress={() => handleProductPress(item.productCode)}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </Pressable>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>ကိုက်ညီသော ပစ္စည်းများ</Text>
      </View>
      {/* <Pressable
        style={styles.filterButton}
        onPress={() => setFilterVisible(!filterVisible)}
      >
        <Ionicons name="filter-outline" size={24} color="#000000" />
      </Pressable> */}
    </View>
  );

  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'relevance', label: 'သက်ဆိုင်မှု' },
          { key: 'price-low', label: 'စျေးနည်း' },
          { key: 'price-high', label: 'စျေးများ' },
          { key: 'stock', label: 'လက်ကျန်' },
          { key: 'newest', label: 'အသစ်ဆုံး' },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.sortOption,
              sortBy === option.key && styles.sortOptionActive,
            ]}
            onPress={() => handleSort(option.key)}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === option.key && styles.sortOptionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>ရှာဖွေနေသည်...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {/* {renderSortOptions()} */}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  searchQuery: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
  },
  sortContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  sortOptionActive: {
    backgroundColor: '#000000',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
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
