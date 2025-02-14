import { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    id: 2,
    name: 'Modern Minimalist Watch',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  },
  {
    id: 3,
    name: 'Designer Sunglasses',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  },
  {
    id: 4,
    name: 'Smart Watch Pro',
    price: 249.99,
    image:
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  },
  {
    id: 5,
    name: 'Wireless Bluetooth Speaker',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1589001181560-a8df1800e501?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 6,
    name: 'Wireless Earbuds',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1606763106198-4ffc663c2419?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  // {},
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666666"
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Pressable style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </Pressable>
          </Link>
        )}
        style={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    margin: 16,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: '#FFFFFF',
    // paddingVertical: 8,
    outlineStyle: 'none',
  },

  productList: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#999999',
  },
});
