import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import colors from '../../constants/colors';


export default function ProductCard({ id, name, price, image, onPress, isDiscounted, discountPercentage, tags }) {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      router.push(`/product/${id}`);
    }
  };

  const discountedPrice = isDiscounted && discountPercentage ? price - (price * (discountPercentage / 100)) : price;

  return (
    <View style={styles.productCard}>
      <Pressable style={styles.productCardContent} onPress={handlePress}>
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* {isDiscounted && discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            </View>
          )} */}
          {/* {tags && tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )} */}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>MMK {discountedPrice.toLocaleString()}</Text>
            {isDiscounted && discountPercentage > 0 && (
              <Text style={styles.originalPrice}>MMK {price.toLocaleString()}</Text>
            )}
          </View>
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
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.error || '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagsContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
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
  priceContainer: {
    height: 30,
    flexDirection: 'column',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
    marginTop: 2,
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
