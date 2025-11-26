import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useState, useRef } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PromotionalBanner from '../components/PromotionalBanner';
import CategoriesSection from '../components/CategoriesSection';
import NewArrivals from '../components/NewArrivals';
import colors from '../../constants/colors';

export default function Home() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom + 16; // Tab bar height + bottom inset + padding
  const navbarHeight = 80; // Approximate navbar height (padding + content)
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const loadingCountRef = useRef(0);
  const timeoutRef = useRef(null);

  const handleLoadingChange = (isLoading) => {
    if (isLoading) {
      loadingCountRef.current += 1;
    } else {
      loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
      // When all components finish loading, stop the refresh indicator
      if (loadingCountRef.current === 0) {
        setRefreshing((prev) => {
          if (prev) {
            // Clear timeout if still exists
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            return false;
          }
          return prev;
        });
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadingCountRef.current = 0;
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Trigger refresh by updating the refreshTrigger value
    // This will cause CategoriesSection and NewArrivals to re-fetch their data
    setRefreshTrigger((prev) => prev + 1);
    // Fallback timeout in case API calls take too long or fail silently
    timeoutRef.current = setTimeout(() => {
      setRefreshing(false);
      loadingCountRef.current = 0;
      timeoutRef.current = null;
    }, 10000); // 10 second timeout
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.stickyNavbar, { top: insets.top }]}>
        <Navbar title="ကိုမင်း D.I.Y ပစ္စည်းများ" />
      </View>
      {/* {refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.text.primary} />
        </View>
      )} */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: tabBarHeight,
            paddingTop: navbarHeight,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text.primary}
            colors={[colors.text.primary]}
          />
        }
      >
        <SearchBar onPress={() => router.push('/search')} />
        <PromotionalBanner refreshTrigger={refreshTrigger} />
        <CategoriesSection
          refreshTrigger={refreshTrigger}
          onLoadingChange={handleLoadingChange}
        />
        <NewArrivals
          refreshTrigger={refreshTrigger}
          onLoadingChange={handleLoadingChange}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  stickyNavbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.secondary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
