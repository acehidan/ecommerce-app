import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

export default function PromotionalBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.promotionalBanner}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>
                ၅ ရက်နေ့မှ ၁ဝ ရက်နေ့ထိသာ အချိန် အကန့်သတ် လျှော့စျေး
              </Text>
              <Text style={styles.bannerSubtitle}>
                ၅၀ % လျော့ဈေးနဲ့မြန်မြန် ဝယ်လိုက်ပါ
              </Text>
              <Pressable style={styles.buyNowButton}>
                <Text style={styles.buyNowText}>မြန်မြန်ဝယ်မယ်</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B231C',
    borderRadius: 0,
    overflow: 'hidden',
  },
  promotionalBanner: {
    height: 200,
    position: 'relative',
    margin: 20,
    borderRadius: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
  },
  buyNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buyNowText: {
    color: '#2D5A27',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
