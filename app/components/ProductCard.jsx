import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import colors from '../../constants/colors';

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
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  productCardContent: {
    flex: 1,
  },
  productImageContainer: {
    height: 150,
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
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  viewButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 50,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.text.light,
    fontSize: 10,
    fontWeight: '700',
  },
});
