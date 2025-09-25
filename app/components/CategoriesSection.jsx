import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import handleGetAllCategory from '../../services/products/getAllCategory';

// Fallback categories for when API fails
const CATEGORIES = [
  {
    id: 1,
    name: 'Capacitor',
    slug: 'capacitor',
  },
  {
    id: 2,
    name: 'Electronics',
    slug: 'electronics',
  },
  {
    id: 3,
    name: 'Resistors',
    slug: 'resistors',
  },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await handleGetAllCategory();
      console.log('response', response);

      if (response.success) {
        // Transform API response to match our component structure
        const transformedCategories = response.data.data.items
          .slice(0, 10) // Limit to first 3 categories
          .map((item, index) => ({
            id: index + 1,
            name: item.category,
            slug: item.category,
          }));

        setCategories(transformedCategories);
      } else {
        setError(response.error || 'Failed to load categories');
        // Fallback to static categories if API fails
        setCategories(CATEGORIES);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
      // Fallback to static categories
      setCategories(CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = (slug) => {
    router.push(`/collection/${slug}`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.sectionTitle}>ပစ္စည်းအမျိူးအစားများ</Text>
        <Pressable
          style={styles.viewAllButton}
          onPress={() => router.push('/categories')}
        >
          <Text style={styles.viewAllText}>အမျိုးအစားများ</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContainer}
        style={styles.categoriesScrollView}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load categories</Text>
          </View>
        ) : (
          categories.map((category) => (
            <Pressable
              key={category.id}
              style={styles.categoryButton}
              onPress={() => handleShopNow(category.slug)}
            >
              <Text style={styles.categoryButtonText}>{category.name}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    backgroundColor: '#0B231C',
  },
  categoriesHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  categoriesScrollView: {
    paddingLeft: 20,
    marginTop: 8,
  },
  categoriesScrollContainer: {
    paddingHorizontal: 2,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    marginRight: 12,
  },
  categoryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
});
