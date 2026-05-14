import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../components/PageHeader';
import { useCartStore } from '../../store/cartStore';
import handleGetProductById from '../../services/products/getProductById';
import colors from '../../constants/colors';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const items = useCartStore((state) => state.items);
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top; // Approximate header height (padding + content + safe area)
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');

  // console.log(product.data);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await handleGetProductById(id);
        if (result.success) {
          // console.log('product', result.data.data.data);
          setProduct(result.data.data.data);
          // console.log('product', result.data.data.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (items.find((item) => item.productCode === id)) {
      setQuantity(items.find((item) => item.productCode === id).quantity);
    }
  }, [items, id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0 && product && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
      setSelectedQuantity((prev) => prev + change);
    }
  };

  const handleBuyProduct = async () => {
    if (quantity > 0 && product && !buying) {
      setBuying(true);
      try {
        // Simulate a brief delay to show the loading modal
        await new Promise((resolve) => setTimeout(resolve, 100));

        addItem(
          {
            id: product._id,
            productCode: product.productCode,
            name: product.name,
            image: product.images?.[0]?.url || '',
            retailUnitPrice: product.isDiscounted
              ? product.retailUnitPrice -
                product.retailUnitPrice * (product.discountPercentage / 100)
              : product.retailUnitPrice,
            wholeSale: product.wholeSale || [],
            unitWeight: product.unitWeight || 0,
          },
          selectedQuantity,
        );

        // Show success modal instead of direct navigation
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setBuying(false);
      }
    }
  };

  const handleImageScroll = (event) => {
    const slideWidth = screenWidth;
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / slideWidth);
    setCurrentImageIndex(newIndex);
  };

  const renderImageIndicator = (index) => {
    return (
      <View
        key={index}
        style={[
          styles.indicator,
          index === currentImageIndex && styles.activeIndicator,
        ]}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="ပစ္စည်း အသေးစိတ်" />
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="ပစ္စည်း အသေးစိတ်" />
        <View style={[styles.errorContainer, { paddingTop: headerHeight }]}>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title="ပစ္စည်း အသေးစိတ်"
        sticky={true}
        showBackButton={true}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            style={styles.carousel}
          >
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.url }}
                  style={[styles.carouselImage, { width: screenWidth }]}
                  resizeMode="contain"
                />
              ))
            ) : (
              <Image
                source={require('../../assets/images/komin.jpg')}
                style={[styles.carouselImage, { width: screenWidth }]}
                resizeMode="cover"
              />
            )}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.indicatorContainer}>
            {product.images && product.images.length > 0
              ? product.images.map((_, index) => renderImageIndicator(index))
              : renderImageIndicator(0)}
          </View>

          {/* Discount Badge */}
          {product.isDiscounted && product.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{product.discountPercentage}%
              </Text>
            </View>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {product.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        <View style={styles.specsContainer}>
          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>အမျိုးအစား</Text>
            <Text style={styles.specValue}>{product.category}</Text>
          </View>

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>သိုလှောင်မှု</Text>
            <Text style={styles.specValue}>
              {product.onSale ? 'ပစ္စည်းရှိ' : 'Store in'}
            </Text>
          </View>

          {/* <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>လက်ကျန် အရေအတွက်</Text>
            <Text style={styles.specValue}>{product.stockQuantity}</Text>
          </View> */}

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>အလေးချိန်</Text>
            <Text style={styles.specValue}>
              {product.weightUnit} {product.unitWeight}
            </Text>
          </View>

          <View style={styles.specsItem}>
            <Text style={styles.specsTitle}>ဈေးနှုန်း</Text>
            <View style={styles.priceContainer}>
              {product.isDiscounted && product.discountPercentage > 0 ? (
                <>
                  <Text style={styles.specValueDiscounted}>
                    MMK{' '}
                    {(
                      product.retailUnitPrice -
                      product.retailUnitPrice *
                        (product.discountPercentage / 100)
                    ).toLocaleString()}
                  </Text>
                  <Text style={styles.specValueOriginal}>
                    MMK {product?.retailUnitPrice?.toLocaleString()}
                  </Text>
                </>
              ) : (
                <Text style={styles.specValue}>
                  MMK {product?.retailUnitPrice?.toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        </View>

        {product.wholeSale && product.wholeSale.length > 0 && (
          <View style={styles.wholesaleContainer}>
            <Text style={styles.wholesaleTitle}>လက်ကားဈေးနှုန်းများ</Text>
            {product.wholeSale.map((wholesale, index) => (
              <View key={index} style={styles.wholesaleItem}>
                <View style={styles.specsItem}>
                  <Text style={styles.specsTitle}>
                    {wholesale.wholeSaleQuantity} ခု အထက်ဈေး
                  </Text>
                  <Text style={styles.specValue}>
                    MMK {wholesale?.wholeSaleUnitPrice}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantity === 0 && styles.quantityButtonDisabled,
            ]}
            onPress={() => handleQuantityChange(-1)}
            disabled={quantity === 0}
          >
            <Ionicons
              name="remove"
              size={20}
              color={quantity === 0 ? '#CCCCCC' : '#000000'}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity} ခု</Text>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              (product.onSale === false ||
                quantity === product.stockQuantity) &&
                styles.quantityButtonDisabled,
            ]}
            onPress={() => handleQuantityChange(1)}
            disabled={
              product.onSale === false || quantity === product.stockQuantity
            }
          >
            <Ionicons
              name="add"
              size={20}
              color={
                product.onSale === false || quantity === product.stockQuantity
                  ? '#CCCCCC'
                  : '#000000'
              }
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.buyButton, quantity === 0 && styles.buyButtonDisabled]}
          onPress={handleBuyProduct}
          disabled={quantity === 0 || buying}
        >
          {buying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buyButtonText}>ပစ္စည်း ဝယ်မယ်</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading Modal */}
      <Modal
        transparent={true}
        visible={buying}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={colors.button.primary} />
            <Text style={styles.modalText}>Adding to cart...</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={showSuccessModal}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons
                name="cart-outline"
                size={40}
                color={colors.button.primary}
              />
            </View>
            <Text style={styles.successModalTitle}>
              🛒 ပစ္စည်းကို Cart ထဲသို့ ထည့်ပြီးပါပြီ
            </Text>
            <Text style={styles.successModalMessage}>
              သင် နောက်ထပ် ဘာလုပ်ချင်ပါသလဲ?
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.continueButton]}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
              >
                <Text style={styles.continueButtonText}>ပစ္စည်း ဆက်ဝယ်မယ်</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.goToCartButton]}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push('/cart');
                }}
              >
                <Text style={styles.goToCartButtonText}>Cart ထဲ သွားမယ်</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 350,
    marginBottom: 20,
  },
  carousel: {
    height: '100%',
  },
  carouselImage: {
    height: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderColor: colors.button.primary,
    borderWidth: 1,
  },
  activeIndicator: {
    backgroundColor: colors.button.primary,
    width: 20,
  },
  priceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sellerInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  sellerPhone: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  sellerAddress: {
    fontSize: 14,
    color: '#666666',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  specsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  specsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 0,
    marginTop: 5,
  },
  specValue: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 0,
    fontWeight: '700',
  },
  wholesaleContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  wholesaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  wholesaleItem: {
    fontSize: 10,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: colors.button.primary,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 16,
    fontWeight: '600',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.error || '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  specValueDiscounted: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  specValueOriginal: {
    fontSize: 12,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successModalMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonContainer: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  continueButtonText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  goToCartButton: {
    backgroundColor: colors.button.primary,
  },
  goToCartButtonText: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
