import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutStep2() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const { setOrderItems, setOrderSummary } = useCheckoutStore();

  // Calculate total weight
  const totalWeight = items.reduce(
    (sum, item) => sum + (item.weight || 1.0),
    0
  );

  // Calculate shipping fee (example: MMK 3,000)
  const shippingFee = 3000;

  // Calculate overweight charge (example: MMK 2,000 for weights over 3KG)
  const overweightCharge = totalWeight > 3 ? 2000 : 0;

  // Calculate grand total
  const grandTotal = getTotalPrice() + shippingFee + overweightCharge;

  const saveStep2Data = () => {
    // Save order items
    const orderItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      weight: item.weight || 1.0,
      price: item.price,
    }));

    setOrderItems(orderItems);

    // Save order summary
    setOrderSummary({
      subtotal: getTotalPrice(),
      shippingFee,
      overweightCharge,
      grandTotal,
      totalWeight,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>စစ်ဆေးပါ</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.totalSteps}>စုစုပေါင်း အဆင့် ၄ ဆင့်</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Purchased Items Section */}
        <View style={styles.purchasedItemsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>ဝယ်ယူထားသော</Text>
              <Text style={styles.sectionTitle}> ပစ္စည်းများ</Text>
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
                  <Text style={styles.itemWeight}>
                    {(item.weight || 1.0).toFixed(1)} KG
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  MMK {item.price.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>စုစုပေါင်း</Text>
            <Text style={styles.summaryValue}>
              MMK {getTotalPrice().toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ပို့ဆောင်ခ</Text>
            <Text style={styles.summaryValue}>
              MMK {shippingFee.toLocaleString()}
            </Text>
          </View>

          {overweightCharge > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.overweightRow}>
                <Text style={styles.summaryLabel}>ဝန်ပိုကြေး</Text>
                <Text style={styles.weightText}>
                  {totalWeight.toFixed(1)} KG
                </Text>
              </View>
              <Text style={styles.summaryValue}>
                MMK {overweightCharge.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>စုစုပေါင်း</Text>
            <Text style={styles.grandTotalValue}>
              MMK {grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Pressable
          style={styles.backActionButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backActionText}>ပြန်သွားမယ်</Text>
        </Pressable>
        <Pressable
          style={styles.confirmActionButton}
          onPress={() => {
            saveStep2Data();
            console.log('Navigating to checkout-step3');
            router.push('/checkout-step3');
          }}
        >
          <Text style={styles.confirmActionText}>မှန်ကန်ပါတယ်</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  stepBadge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stepBadgeText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666666',
    width: 50,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 12,
    color: '#666666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  orderSummarySection: {
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
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
    color: '#000000',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  backActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  backActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  confirmActionButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
