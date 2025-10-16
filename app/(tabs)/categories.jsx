import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import handleGetAllCategory from '../../services/products/getAllCategory';

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleGetAllCategory();
      console.log('response', response);

      if (response.success) {
        // Transform API response to match our component structure
        const transformedCategories = response.data.data.items.map(
          (item, index) => ({
            id: index + 1,
            name: item.category,
            itemCount: item.totalStockItems,
          })
        );

        setCategories(transformedCategories);
        setFilteredCategories(transformedCategories);
      } else {
        setError(response.error);
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      const errorMessage = 'Failed to fetch categories';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const handleCategoryPress = (categoryId) => {
    router.push(`/collection/${categoryId}`);
  };

  const renderCategory = ({ item }) => (
    <Pressable
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item.name)}
    >
      <View style={styles.categoryContent}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryCount}>
            ပစ္စည်း စုစုပေါင်း - {item.itemCount} ခု
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999999" />
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ပစ္စည်း အမျိုးအစားများ</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>အမျိုးအစားများ ရယူနေပါသည်</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ပစ္စည်း အမျိုးအစားများ</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchCategories}>
            <Text style={styles.retryButtonText}>ပြန်လည်ကြိုးစားမယ်</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ပစ္စည်း အမျိုးအစားများ</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="အမျိုးအစားတွေ ရှာမယ်"
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
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.categoriesList,
          { paddingBottom: tabBarHeight },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>ရှာတွေ့သော အမျိုးအစား မရှိပါ</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  categoriesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryItem: {
    paddingVertical: 16,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginLeft: 0,
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
    width: '100%',
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
    width: '100%',
  },
});
