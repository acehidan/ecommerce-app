import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';

export default function OrderProcessing() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo/Brand Square */}
        <View style={styles.logoContainer}>
          <View style={styles.logoSquare}>
            <Image
              source={require('../assets/images/komin.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Status Messages */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>အော်ဒါတင်နေပါပြီ</Text>
          <Text style={styles.statusText}>ခနစောင့်ပေးပါ</Text>
        </View>

        {/* Store Information */}
        <View style={styles.storeInfoContainer}>
          <Text style={styles.storeInfoText}>
            အပြင်မှာ ကိုယ်တိုင်လာရောက် ကြည့်ရှုပြီး ဝယ်ယူလိုပါက
          </Text>
          <Text style={styles.storeInfoText}>
            ဆိုင်လိပ်စာ "မဟာဗန္ဓုလလမ်း, အလယ် ဘလောက်, ဆူးလေ,
          </Text>
          <Text style={styles.storeInfoText}>
            ရန်ကုန် " မှာ ရောင်းချပေးနေပါတယ်
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoSquare: {
    width: 120,
    height: 120,
    backgroundColor: '#000000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  storeInfoContainer: {
    alignItems: 'center',
  },
  storeInfoText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 6,
  },
});
