import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore } from '../store/checkoutStore';
import colors from '../constants/colors';
import PageHeader from './components/PageHeader';
import { useEffect, useState } from 'react';
import getDeliveries from '../services/delivery/getDeliveries';
import DeliveryZoneErrorModal from './components/DeliveryZoneErrorModal';

export default function CheckoutStep2() {
  const router = useRouter();
  const [deliveryData, setDeliveryData] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const { items, getTotalPrice } = useCartStore();
  const { setOrderItems, setOrderSummary, checkoutData } = useCheckoutStore();
  const deliveryZone = checkoutData?.addressInfo?.deliveryZone;

  const getDelidata = async () => {
    const response = await getDeliveries();
    console.log("response", response);
    if (response.status === 'success') {
      const deliveryData = response.data.find(
        (delivery) => delivery._id === deliveryZone,
      );
      if (deliveryData) {
        setDeliveryData(deliveryData);
      } else {
        setModalMessage('ပို့ဆောင်ရေး နယ်မြေ အချက်အလက်များကို ရှာမတွေ့ပါ။');
        setShowErrorModal(true);
      }
    } else {
      setModalMessage(response.message);
      setShowErrorModal(true);
    }
  };
  console.log("deliveryData", deliveryData);
  // console.log("items", items);

  useEffect(() => {
    if (deliveryZone) {
      getDelidata();
    }
  }, [deliveryZone]);

  // Calculate total weight
  const totalWeight = items.reduce(
    (sum, item) => sum + item.unitWeight * item.quantity,
    0,
  );

  // Calculate shipping fee (example: MMK 3,000)
  const shippingFee = deliveryData?.shippingFee || 0;

  // Calculate overweight charge (example: MMK 500 per incremental KG over 2KG)
  const overweightCharge =
    totalWeight > 2 ? Math.ceil(totalWeight - 2) * (deliveryData?.additionalWeightCharge || 0) : 0;

  // Calculate grand total
  const grandTotal = getTotalPrice() + shippingFee + overweightCharge;

  const saveStep2Data = () => {
    // Save order items
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      weight: item.unitWeight,
      price: item.price,
    }));

    setOrderItems(orderItems);

    // Save order summary
    setOrderSummary({
      subtotal: getTotalPrice(),
      shippingFee: deliveryData?.deliveryFee || 0,
      overweightCharge: totalWeight > 2 ?
        Math.ceil(totalWeight - 2) * (deliveryData?.additionalWeightCharge || 0)
        : 0,
      grandTotal:
        getTotalPrice() +
        deliveryData?.deliveryFee +
        (totalWeight > 2
          ? Math.ceil(totalWeight - 2) * (deliveryData?.additionalWeightCharge || 0)
          : 0),
      totalWeight,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <PageHeader title="စစ်ဆေးပါ" sticky={false} showBackButton={true} rightContent="စုစုပေါင်း အဆင့် ၄ ဆင့်" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Purchased Items Section */}
        <View style={styles.purchasedItemsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>ဝယ်ယူထားသော</Text>
              <Text style={styles.sectionTitle}>ပစ္စည်းများ</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>အဆင့် နံပါတ် ၂</Text>
            </View>
          </View>

          <View style={styles.itemsListHeader}>
            <Text style={styles.itemsListTitle}>ပစ္စည်းများစာရင်း</Text>
            <Text style={styles.itemsCount}>{items.length} ခု </Text>
          </View>

          <View style={styles.itemsList}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity} ခု</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemWeight}>{item.unitWeight} kg</Text>
                </View>
                <Text style={styles.itemPrice}>
                  MMK {((item.price * item.quantity)).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>စုစုပေါင်း</Text>
              <Text style={styles.summaryValue}>
                MMK {getTotalPrice().toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ပို့ဆောင်ခ</Text>
              <Text style={styles.summaryValue}>
                MMK {deliveryData?.deliveryFee?.toLocaleString() || '0'}
              </Text>
            </View>

            {totalWeight > 2 && (
              <View style={styles.summaryRow}>
                <View style={styles.overweightRow}>
                  <Text style={styles.summaryLabel}>ဝန်ပိုကြေး</Text>
                  <Text style={styles.weightText}>
                    {totalWeight.toFixed(1)} KG
                  </Text>
                </View>
                <Text style={styles.summaryValue}>
                  MMK{' '}
                  {(
                    totalWeight > 2 ? Math.ceil(totalWeight - 2) * (deliveryData?.additionalWeightCharge || 0) : 0
                  ).toLocaleString()}
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>စုစုပေါင်း</Text>
              <Text style={styles.grandTotalValue}>
                MMK{' '}
                {(
                  getTotalPrice() +
                  deliveryData?.deliveryFee +
                  (totalWeight > 2
                    ? Math.ceil(totalWeight - 2) * (deliveryData?.additionalWeightCharge || 0)
                    : 0)
                ).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.backActionButton, isNavigating && { opacity: 0.7 }]}
          disabled={isNavigating}
          onPress={() => {
            if (isNavigating) return;
            setIsNavigating(true);
            router.back();
            setTimeout(() => setIsNavigating(false), 1000);
          }}
        >
          <Text style={styles.backActionText}>ပြန်သွားမယ်</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmActionButton, isNavigating && { opacity: 0.7 }]}
          disabled={isNavigating}
          onPress={() => {
            if (isNavigating) return;
            if (!deliveryData) {
              setModalMessage('ပို့ဆောင်ရေး အချက်အလက်များ မပြည့်စုံသေးပါ။');
              setShowErrorModal(true);
              return;
            }
            setIsNavigating(true);
            saveStep2Data();
            router.push('/checkout-step3');
            setTimeout(() => setIsNavigating(false), 1000);
          }}
        >
          {isNavigating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmActionText}>မှန်ကန်ပါတယ်</Text>
          )}
        </TouchableOpacity>
      </View>
      <DeliveryZoneErrorModal
        visible={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          router.back();
        }}
        message={modalMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBar: {
    backgroundColor: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  topBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginLeft: 16,
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  totalSteps: {
    fontSize: 12,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  purchasedItemsSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitleContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansMyanmar-Regular',
    lineHeight: 38,
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  stepBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    elevation: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stepBadgeText: {
    fontSize: 12,
    color: colors.button.primary,
    fontWeight: '900',
  },
  itemsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsListTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  itemsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  itemsList: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666666',
    width: "8%"
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  itemWeight: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  summaryContainer: {
    marginTop: 12,
  },
  orderSummarySection: {
    marginBottom: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontFamily: 'NotoSansMyanmar-Regular',

  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'NotoSansMyanmar-Regular',
  },
  overweightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  grandTotalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'NotoSansMyanmar-Regular',
    textShadowColor: colors.text.primary,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textShadowRadius: 0.5,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  backActionButton: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  backActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  confirmActionButton: {
    flex: 1,
    backgroundColor: colors.button.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});