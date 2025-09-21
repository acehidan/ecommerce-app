import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';

export default function PromotionalBanner() {
  return (
    <View style={styles.container as ViewStyle}>
      <View style={styles.promotionalBanner as ViewStyle}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          }}
          style={styles.backgroundImage as ImageStyle}
          resizeMode="cover"
        />
        <View style={styles.overlay as ViewStyle}>
          <View style={styles.bannerContent as ViewStyle}>
            <View style={styles.bannerText as ViewStyle}>
              <Text style={styles.bannerTitle as TextStyle}>
                ၅ ရက်နေ့မှ ၁ဝ ရက်နေ့ထိသာ အချိန် အကန့်သတ် လျှော့စျေး
              </Text>
              <Text style={styles.bannerSubtitle as TextStyle}>
                ၅၀ % လျော့ဈေးနဲ့မြန်မြန် ဝယ်လိုက်ပါ
              </Text>
              <Pressable style={styles.buyNowButton as ViewStyle}>
                <Text style={styles.buyNowText as TextStyle}>
                  မြန်မြန်ဝယ်မယ်
                </Text>
              </Pressable>
            </View>
          </View>
          {/* <View style={styles.bannerDots as ViewStyle}>
            <View style={[styles.dot, styles.dotInactive]} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotInactive]} />
          </View> */}
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
  } as ViewStyle,
  promotionalBanner: {
    height: 200,
    position: 'relative',
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  } as ViewStyle,
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  } as ImageStyle,
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
  } as ViewStyle,
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  bannerText: {
    flex: 1,
  } as ViewStyle,
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  } as TextStyle,
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
  } as TextStyle,
  buyNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  } as ViewStyle,
  buyNowText: {
    color: '#2D5A27',
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  } as ViewStyle,
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  } as ViewStyle,
  dotActive: {
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  } as ViewStyle,
});
