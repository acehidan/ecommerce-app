import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import ProductCard from './ProductCard';

const NEW_ARRIVALS = [
  {
    id: 1,
    name: 'Mini Grinder',
    price: 30000,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
  },
  {
    id: 2,
    name: 'အလှဆင် ရေနွေးငွေ့ ဖန်းစက်',
    price: 17000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 3,
    name: 'LED Strip Lights',
    price: 25000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 4,
    name: 'Arduino Starter Kit',
    price: 45000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 5,
    name: 'Smart Sensors',
    price: 35000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
];

export default function NewArrivals() {
  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
        <Pressable
          style={styles.viewMoreButton}
          onPress={() => router.push('/new-arrivals')}
        >
          <Text style={styles.viewMoreText}>ထပ်ကြည့်မယ်</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsScrollContainer}
        style={styles.productsScrollView}
      >
        {NEW_ARRIVALS.map((product) => (
          <View key={product.id} style={styles.horizontalProductItem}>
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              onPress={handleProductPress}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  viewMoreButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewMoreText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
  },
  productsScrollView: {
    paddingLeft: 20,
  },
  productsScrollContainer: {
    paddingRight: 20,
    gap: 16,
  },
  horizontalProductItem: {
    width: 160,
  },
});
