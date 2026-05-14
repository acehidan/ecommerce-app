import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import PromotionalBanner from '../components/PromotionalBanner';
import CategoriesSection from '../components/CategoriesSection';
import ProductSection from '../components/ProductSection';
import handleGetTags from '../../services/products/getTags';
import handleGetProductsByTag from '../../services/products/getProductsByTag';
import handleGetDiscountedProducts from '../../services/products/getDiscountedProducts';
import colors from '../../constants/colors';
import getSectionTitle from '../../utils/getSectionTitle';

// --- Constants ---
const NAVBAR_HEIGHT = 80;
const TABBAR_FIXED_HEIGHT = 60;
const MIN_LOADING_TIME = 500; // 0.5s minimum duration

export default function Home() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch Tags
  const {
    data: tagsData,
    isLoading: isLoadingTags,
    refetch: refetchTags,
  } = useQuery({
    queryKey: ['product-tags'],
    queryFn: handleGetTags,
    staleTime: 5 * 60 * 1000,
  });

  const tags = tagsData?.data || [];

  // Use a ref to track how many components are currently loading
  const loadingCountRef = useRef(0);
  const refreshStartTimeRef = useRef(0);
  const timeoutRef = useRef(null);

  /**
   * Synchronized loading handler
   * Ensures the Pull-to-Refresh spinner stays visible until all
   * child components have finished their data fetching and
   * at least MIN_LOADING_TIME has passed.
   */
  const handleLoadingChange = useCallback((isLoading) => {
    if (isLoading) {
      loadingCountRef.current += 1;
    } else {
      loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);

      // If we were refreshing and everything is now loaded, check for min time
      if (loadingCountRef.current === 0) {
        const elapsedTime = Date.now() - refreshStartTimeRef.current;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        setTimeout(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setRefreshing(false);
        }, remainingTime);
      }
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshStartTimeRef.current = Date.now();
    loadingCountRef.current = 0; // Reset count for the new cycle

    // Trigger a refresh across all components
    setRefreshTrigger((prev) => prev + 1);
    refetchTags();

    // Safety timeout: stop the spinner after 10 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setRefreshing(false);
      // console.warn('Refresh timed out');
    }, 10000);
  }, [refetchTags]);

  const bottomPadding = TABBAR_FIXED_HEIGHT + insets.bottom + 16;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Sticky Top Header */}
      <PageHeader title="ကိုမင်း D.I.Y ပစ္စည်းများ" sticky={true} />

      {/* Loading Animation Overlay */}
      {refreshing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>ခနစောင့်ပေးပါ...</Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: bottomPadding,
            paddingTop: NAVBAR_HEIGHT, // Reserve space for sticky navbar
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <SearchBar
          onPress={() => router.push('/search')}
          placeholder="အမျိုးအစားတွေ ရှာမယ်"
          hintText="မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို ရိုက်ပြီးရှာနိုင်ပါတယ်"
          showHint={true}
        />

        {/* Banner Section - uses refreshTrigger to reload */}
        <PromotionalBanner refreshTrigger={refreshTrigger} />

        {/* Categories - reports loading state to sync with refreshControl */}
        <CategoriesSection
          refreshTrigger={refreshTrigger}
          onLoadingChange={handleLoadingChange}
        />

        {/* Discounted Products Section */}
        <ProductSection
          title={getSectionTitle('discount')}
          queryKey={['products-discounted']}
          fetchDataFn={handleGetDiscountedProducts}
          onSeeAllPress={() => router.push(`/section/discount`)}
          refreshTrigger={refreshTrigger}
          onLoadingChange={handleLoadingChange}
        />

        {/* Dynamic Product Sections based on Tags */}
        {tags?.map((tag) => (
          <ProductSection
            key={tag}
            title={getSectionTitle(tag)}
            queryKey={['products-by-tag', tag]}
            fetchDataFn={() => handleGetProductsByTag(tag)}
            onSeeAllPress={() => router.push(`/section/${tag}`)}
            refreshTrigger={refreshTrigger}
            onLoadingChange={handleLoadingChange}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
  },
});
