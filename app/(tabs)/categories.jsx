import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
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
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import handleGetAllCategory from '../../services/products/getAllCategory';
import colors from '../../constants/colors';
import LoadingState from '../components/LoadingState';

/**
 * Sub-component for individual category items
 */
const CategoryItem = React.memo(({ item, onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.categoryItem,
      pressed && styles.categoryItemPressed,
    ]}
    onPress={() => onPress(item.name)}
  >
    <View style={styles.categoryContent}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryCount}>
          ပစ္စည်း စုစုပေါင်း - {item.itemCount} ခု
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-forward" size={20} color={colors.text.primary} />
      </View>
    </View>
  </Pressable>
));

/**
 * Sub-component for error state
 */
const ErrorState = ({ headerHeight, error, onRetry }) => (
  <View style={[styles.centerContainer, { paddingTop: headerHeight }]}>
    <Ionicons
      name="alert-circle-outline"
      size={64}
      color={colors.error.main}
    />
    <Text style={styles.errorText}>{error}</Text>
    <Pressable style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>ပြန်လည်ကြိုးစားမယ်</Text>
    </Pressable>
  </View>
);

/**
 * Sub-component for empty search results
 */
const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons
      name="search-outline"
      size={64}
      color={colors.text.muted}
    />
    <Text style={styles.emptyText}>ရှာတွေ့သော အမျိုးအစား မရှိပါ</Text>
  </View>
);

export default function Categories() {
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top;

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleGetAllCategory();
      console.log(response);

      if (response.success) {
        const transformedCategories = (response.data?.data?.items || []).map(
          (item, index) => ({
            id: index + 1,
            name: item.category,
            itemCount: item.totalStockItems,
          }),
        );
        setCategories(transformedCategories);
      } else {
        const errMsg = response.error || 'Failed to fetch categories';
        setError(errMsg);
      }
    } catch (err) {
      setError('Internal server error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, searchQuery]);

  const handleCategoryPress = useCallback((categoryName) => {
    router.push(`/collection/${categoryName}`);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <CategoryItem item={item} onPress={handleCategoryPress} />
  ), [handleCategoryPress]);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="ပစ္စည်း အမျိုးအစားများ" sticky={true} />

      {isLoading ? (
        <LoadingState headerHeight={headerHeight} />
      ) : error ? (
        <ErrorState
          headerHeight={headerHeight}
          error={error}
          onRetry={fetchCategories}
        />
      ) : (
        <View style={{ paddingTop: headerHeight, flex: 1 }}>
          <SearchBar
            placeholder="အမျိုးအစားတွေ ရှာမယ်"
            value={searchQuery}
            onChangeText={setSearchQuery}
            hintText="မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်"
            showHint={true}
          />

          <FlatList
            data={filteredCategories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={EmptyState}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  categoryItemPressed: {
    backgroundColor: colors.background.secondary,
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
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  categoryCount: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '400',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    opacity: 0.5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.text.muted,
    fontWeight: '500',
  },
});
