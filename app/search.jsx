import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import handleGetStocks from '../services/products/getStocks';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounced search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await handleGetStocks({ name: query.trim() });

      if (response.success) {
        setSearchResults(response.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debouncing
  const handleSearchChange = (text) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If empty, clear results immediately
    if (!text.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    // Set loading state
    setIsSearching(true);
    setHasSearched(true);

    // Debounce search - wait 500ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(text);
    }, 500);
  };

  // Focus search input when component mounts
  useEffect(() => {
    // Small delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
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
        onPress={handleProductPress}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#666666" />
          <Text style={styles.emptyText}>ရှာဖွေနေသည်...</Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>ရှာဖွေမှုရလဒ်မရှိပါ</Text>
          <Text style={styles.emptySubtext}>
            အခြားစကားလုံးများဖြင့် ပြန်လည်ရှာဖွေကြည့်ပါ
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={60} color="#CCCCCC" />
        <Text style={styles.emptyText}>
          လိုချင်တဲ့ ပစ္စည်းတွေ ရှာမယ်
        </Text>
        <Text style={styles.emptySubtext}>
          ပစ္စည်းရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.stickyNavbar, { top: insets.top }]}>
        <Navbar title="ပစ္စည်း တွေရှာမယ်" />
      </View>

      <View style={[styles.content, { paddingTop: 80 + insets.top }]}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar} pointerEvents="box-none">
            <Ionicons name="search" size={20} color="#666666" />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="လိုချင်တဲ့ ပစ္စည်းတွေ ရှာမယ်"
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus={true}
              editable={true}
              returnKeyType="search"
              selectTextOnFocus={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#666666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results */}
        {hasSearched && searchResults.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchResults.length} ခု ရှာတွေ့ပါပြီ
            </Text>
          </View>
        )}

        {/* Product List or Empty State */}
        {hasSearched && searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProductCard}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            contentContainerStyle={[
              styles.productList,
              { paddingBottom: tabBarHeight },
            ]}
            columnWrapperStyle={styles.productRow}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>{renderEmptyState()}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  stickyNavbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  resultsTitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

