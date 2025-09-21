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
import { router } from 'expo-router';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onPress?: (id: number) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  onPress,
}: ProductCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      router.push(`/product/${id}`);
    }
  };

  return (
    <View style={styles.productCard as ViewStyle}>
      <Pressable
        style={styles.productCardContent as ViewStyle}
        onPress={handlePress}
      >
        <View style={styles.productImageContainer as ViewStyle}>
          <Image
            source={{ uri: image }}
            style={styles.productImage as ImageStyle}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfo as ViewStyle}>
          <Text style={styles.productName as TextStyle} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.productPrice as TextStyle}>
            MMK {price.toLocaleString()}
          </Text>
        </View>
      </Pressable>
      <Pressable style={styles.viewButton as ViewStyle} onPress={handlePress}>
        <Text style={styles.viewButtonText as TextStyle}>ကြည့်မယ်</Text>
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
  } as ViewStyle,
  productCardContent: {
    flex: 1,
  } as ViewStyle,
  productImageContainer: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  } as ViewStyle,
  productImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  productInfo: {
    padding: 12,
    flex: 1,
  } as ViewStyle,
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 18,
  } as TextStyle,
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    // marginBottom: 12,
  } as TextStyle,
  viewButton: {
    backgroundColor: '#333333',
    marginHorizontal: 10,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  } as ViewStyle,
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,
});
