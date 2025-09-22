import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ProductCard({ id, name, price, image, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      router.push(`/product/${id}`);
    }
  };

  return (
    <View style={styles.productCard}>
      <Pressable style={styles.productCardContent} onPress={handlePress}>
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.productPrice}>MMK {price.toLocaleString()}</Text>
        </View>
      </Pressable>
      <Pressable style={styles.viewButton} onPress={handlePress}>
        <Text style={styles.viewButtonText}>ကြည့်မယ်</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  productCardContent: {
    flex: 1,
  },
  productImageContainer: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  viewButton: {
    backgroundColor: '#333333',
    marginHorizontal: 10,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
