import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
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

  const handleSearch = (query: string) => {
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

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const renderProduct = ({ item }: { item: (typeof ALL_PRODUCTS)[0] }) => (
    <View style={styles.productItem as ViewStyle}>
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
    <SafeAreaView style={styles.container as ViewStyle}>
      {/* Header */}
      <View style={styles.header as ViewStyle}>
        <Pressable
          style={styles.backButton as ViewStyle}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle as TextStyle}>
          အသစ်ရောက် ပစ္စည်းများ
        </Text>
        <Text style={styles.productCount as TextStyle}>
          ပစ္စည်း {filteredProducts.length} ခု
        </Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection as ViewStyle}>
        <View style={styles.searchBar as ViewStyle}>
          <Ionicons name="search" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput as TextStyle}
            placeholder="အသစ်ရောက် ပစ္စည်းတွေရှာမယ်"
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <Text style={styles.searchHint as TextStyle}>
          * မိမိရှာလိုတဲ့ ပစ္စည်း အမျိုးအစားရဲ့ နာမည် (သို့) စကားလုံး အချို့ကို
          ရိုက်ပြီးရှာနိုင်ပါတယ်
        </Text>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsGrid as ViewStyle}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  } as ViewStyle,
  backButton: {
    padding: 4,
  } as ViewStyle,
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  } as TextStyle,
  productCount: {
    fontSize: 14,
    color: '#666666',
    minWidth: 80,
    textAlign: 'right',
  } as TextStyle,
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  } as ViewStyle,
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  } as ViewStyle,
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  } as TextStyle,
  searchHint: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  } as TextStyle,
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  } as ViewStyle,
  productItem: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  } as ViewStyle,
});
