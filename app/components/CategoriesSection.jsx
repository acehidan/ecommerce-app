import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import handleGetAllCategory from '../../services/products/getAllCategory';
import colors from '../../constants/colors';
import Button from './Button';

// --- Sub-components ---

const CategoryItem = ({ name, slug }) => {
  const handlePress = useCallback(() => {
    router.push(`/collection/${slug}`);
  }, [slug]);

  return (
    <TouchableOpacity style={styles.categoryButton} onPress={handlePress}>
      <Text style={styles.categoryButtonText}>{name} များ</Text>
    </TouchableOpacity>
  );
};

// --- Main Component ---

export default function CategoriesSection({ refreshTrigger, onLoadingChange }) {
  // Use TanStack Query for categories fetching
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['all-categories'],
    queryFn: async () => {
      const response = await handleGetAllCategory();
      if (response && response.success) {
        // Transform API response
        return response.data.data.items
          .slice(0, 10)
          .map((item, index) => ({
            id: index + 1,
            name: item.category,
            slug: item.category,
          }));
      }
      throw new Error(response?.error || 'Failed to load categories');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Notify parent of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Handle manual refresh trigger
  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const showContent = useMemo(() => {
    return !isLoading && categories && categories.length > 0;
  }, [isLoading, categories]);

  if (!showContent && !isLoading) return null;

  if (isError) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.sectionTitle}>ပစ္စည်းအမျိူးအစားများ</Text>
        <Button
          title="အားလုံးကြည့်မယ်"
          onPress={() => router.push('/categories')}
          variant="outline"
          size="medium"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContainer}
        style={styles.categoriesScrollView}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.white} />
            <Text style={styles.loadingText}>ခနစောင့်ပါ...</Text>
          </View>
        ) : (
          categories.map((item) => (
            <CategoryItem key={item.id} name={item.name} slug={item.slug} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    backgroundColor: '#0B231C',
  },
  categoriesHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text.light,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 1,
    flex: 1,
  },
  categoriesScrollView: {
    paddingLeft: 20,
  },
  categoriesScrollContainer: {
    paddingRight: 20,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: colors.background.primary,
    minWidth: 126,
    paddingHorizontal: 24,
    height: 62,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSansMyanmar-Regular',
    fontWeight: '700',
    // Subtle shadow for Myanmar text clarity
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'NotoSansMyanmar-Regular',
    marginLeft: 12,
  },
  errorContainer: {
    paddingVertical: 12,
  },
  errorText: {
    color: colors.error.light,
    fontSize: 14,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
});
