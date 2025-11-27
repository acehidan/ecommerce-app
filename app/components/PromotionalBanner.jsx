import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import handleGetBanners from '../../services/banners/getBanners';
import { useHomeCacheStore } from '../../store/homeCacheStore';
import colors from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 40; // Account for margin

export default function PromotionalBanner({ refreshTrigger }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { getBanners, setBanners: setBannersCache, isBannersStale } = useHomeCacheStore();

  useEffect(() => {
    // If refreshTrigger is set, always fetch fresh data
    if (refreshTrigger > 0) {
      fetchBanners(false);
      return;
    }

    // Check cache first
    const cachedBanners = getBanners();
    const isStale = isBannersStale();

    if (cachedBanners && !isStale) {
      // Use cached data immediately
      setBanners(cachedBanners);
      setLoading(false);
      // Fetch in background to update cache
      fetchBanners(true);
    } else {
      // Fetch fresh data
      fetchBanners(false);
    }
  }, [refreshTrigger]);

  const fetchBanners = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      }
      setError(null);
      const result = await handleGetBanners();
      if (result.success) {
        // Filter out soft deleted banners
        const activeBanners = result.data.data.filter(
          (banner) => !banner.softDeleted
        );
        setBanners(activeBanners);
        // Update cache
        setBannersCache(activeBanners);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch banners');
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setCurrentIndex(index);
  };

  const handleBannerPress = (banner) => {
    // Navigate to first product if available
    if (banner.stockIds && banner.stockIds.length > 0) {
      const firstProduct = banner.stockIds[0];
      if (firstProduct.productCode) {
        router.push(`/product/${firstProduct.productCode}`);
      }
    }
  };

  const getBannerImage = (banner) => {
    if (banner.useStockImage && banner.stockIds && banner.stockIds.length > 0) {
      const firstStock = banner.stockIds[0];
      if (firstStock.images && firstStock.images.length > 0) {
        return firstStock.images[0].url;
      }
    }
    if (banner.image) {
      return banner.image;
    }
    // Fallback image
    return 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg';
  };

  // Dummy banner data for fallback
  const dummyBanner = {
    _id: 'dummy-banner',
    title: 'ကိုမင်း D.I.Y ပစ္စည်းများ',
    description: 'အကောင်းဆုံး ပစ္စည်းများကို ရှာဖွေဝယ်ယူပါ',
    image: 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg',
  };

  // Show dummy banner if there's an error or no banners
  const displayBanners =
    error || banners.length === 0 ? [dummyBanner] : banners;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.text.light} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {displayBanners.map((banner, index) => (
          <Pressable
            key={banner._id || `banner-${index}`}
            style={styles.bannerWrapper}
            onPress={() => handleBannerPress(banner)}
            disabled={banner._id === 'dummy-banner'}
          >
            <View style={styles.promotionalBanner}>
              <Image
                source={{ uri: getBannerImage(banner) }}
                style={styles.backgroundImage}
                resizeMode="cover"
                onError={() => {
                  // If image fails to load, it will use the fallback in getBannerImage
                  console.log('Banner image failed to load');
                }}
              />
              <View style={styles.overlay}>
                <View style={styles.bannerContent}>
                  <View style={styles.bannerText}>
                    <Text style={styles.bannerTitle}>
                      {banner.title || 'ကိုမင်း D.I.Y ပစ္စည်းများ'}
                    </Text>
                    <Text style={styles.bannerSubtitle}>
                      {banner.description ||
                        'အကောင်းဆုံး ပစ္စည်းများကို ရှာဖွေဝယ်ယူပါ'}
                    </Text>
                    {/* <Pressable style={styles.buyNowButton}>
                      <Text style={styles.buyNowText}>မြန်မြန်ဝယ်မယ်</Text>
                    </Pressable> */}
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {displayBanners.length > 1 && (
        <View style={styles.bannerDots}>
          {displayBanners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.dark,
    borderRadius: 0,
    overflow: 'hidden',
    paddingTop: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
    marginRight: 0,
  },
  promotionalBanner: {
    height: 220,
    position: 'relative',
    borderRadius: 5,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.darkOverlay,
    padding: 20,
    justifyContent: 'center',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: colors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  bannerSubtitle: {
    color: colors.text.light,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  buyNowButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buyNowText: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
