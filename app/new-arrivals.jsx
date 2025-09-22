import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ProductCard from './components/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Capacitor (1 uf)',
    price: 20000,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
  },
  {
    id: 2,
    name: 'Mini Grinder',
    price: 30000,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
  },
  {
    id: 3,
    name: 'Capacitor (2 uf)',
    price: 20000,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
  },
  {
    id: 4,
    name: 'အလှဆင် ရေနွေးငွေ့ ဖန်းစက်',
    price: 17000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 5,
    name: 'LED Strip Lights',
    price: 25000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 6,
    name: 'Arduino Starter Kit',
    price: 45000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 7,
    name: 'Smart Sensors',
    price: 35000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 8,
    name: 'Resistor Pack',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 9,
    name: 'Motor Controller',
    price: 55000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 10,
    name: 'Breadboard Kit',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 11,
    name: 'Jumper Wires',
    price: 8000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 12,
    name: 'Power Supply',
    price: 40000,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
];

export default function NewArrivalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(ALL_PRODUCTS);
    } else {
      const filtered = ALL_PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <ProductCard
        id={item.id}
        name={item.name}
        price={item.price}
        image={item.image}
        onPress={handleProductPress}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>အသစ်ရောက် ပစ္စည်းများ</Text>
        <Text style={styles.productCount}>
          ပစ္စည်း {filteredProducts.length} ခု
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="အသစ်ရောက် ပစ္စည်းတွေရှာမယ်"
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <Text style={styles.searchHint}>
          * မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို
          ရိုက်ပြီးရှာနိုင်ပါတယ်
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  productCount: {
    fontSize: 14,
    color: '#666666',
    minWidth: 80,
    textAlign: 'right',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  searchHint: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productItem: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },
});
