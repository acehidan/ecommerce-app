import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import handleGetBanners from '../../services/banners/getBanners';
import colors from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH;
const FALLBACK_IMAGE = 'https://pub-e2d317c977e5422bbf6be2feb6800a10.r2.dev/komin.jpg';

// --- Constants & Helper Data ---

const DUMMY_BANNER = {
  _id: 'dummy-banner',
  title: 'ကိုမင်း D.I.Y ပစ္စည်းများ',
  description: 'အကောင်းဆုံး ပစ္စည်းများကို ရှာဖွေဝယ်ယူပါ',
  image: { url: FALLBACK_IMAGE },
};

// --- Helper Functions ---

const resolveBannerImage = (banner) => {
  if (banner.useStockImage && banner.stockIds?.[0]?.images?.[0]?.url) {
    return banner.stockIds[0].images[0].url;
  }
  return banner.image?.url || FALLBACK_IMAGE;
};

// --- Sub-components ---

const BannerItem = ({ banner, index }) => {
  // const handleBannerPress = useCallback(() => {
  //   if (banner.stockIds?.[0]?.productCode) {
  //     router.push(`/product/${banner.stockIds[0].productCode}`);
  //   }
  // }, [banner]);

  const handleBuyNow = useCallback(() => {
    if (banner._id && banner._id !== 'dummy-banner') {
      router.push(`/banner/${banner._id}`);
    }
  }, [banner._id]);

  const isDummy = banner._id === 'dummy-banner';
  const imageUrl = resolveBannerImage(banner);

  return (
    <Pressable
      style={styles.bannerWrapper}
      // onPress={handleBannerPress}
      disabled={isDummy}
    >
      <View style={styles.promotionalBanner}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>
                {banner.title || 'ကိုမင်း D.I.Y ပစ္စည်းများ'}
              </Text>
              <Text style={styles.bannerSubtitle}>
                {banner.description || 'အကောင်းဆုံး ပစ္စည်းများကို ရှာဖွေဝယ်ယူပါ'}
              </Text>
              {!isDummy && (
                <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
                  <Text style={styles.buyNowText}>မြန်မြန်ဝယ်မယ်</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// --- Main Component ---

export default function PromotionalBanner({ refreshTrigger }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const { data: banners, isLoading, error, refetch } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const result = await handleGetBanners();
      if (result && result.success && result.data?.status === 'success') {
        return result.data.data.filter((b) => !b.softDeleted);
      }
      throw new Error(result?.error || 'Failed to fetch');
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (refreshTrigger) refetch();
  }, [refreshTrigger, refetch]);

  const displayBanners = useMemo(() => {
    if (error || !banners || banners.length === 0) return [DUMMY_BANNER];
    return banners;
  }, [banners, error]);

  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    setCurrentIndex(index);
  }, []);

  if (isLoading && !refreshTrigger) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.white} />
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
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {displayBanners.map((banner, index) => (
          <BannerItem key={banner._id || index} banner={banner} index={index} />
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
    paddingTop: 20,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
  },
  promotionalBanner: {
    height: 220,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.darkOverlay,
    padding: 24,
    justifyContent: 'center',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerText: {
    maxWidth: '80%',
  },
  bannerTitle: {
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.text.light,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
    // Add sharp shadow for better readability
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitle: {
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.text.light,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.9,
  },
  buyNowButton: {
    backgroundColor: colors.white,
    width: 100,
    height: 38,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buyNowText: {
    fontFamily: 'NotoSansMyanmar-Regular',
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 20,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 6,
  },
});
