import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ORDER_DATA = [
  {
    id: 1,
    date: '12/10/2025',
    amount: 36200,
    status: 'Delivered',
  },
  {
    id: 2,
    date: '6/10/2025',
    amount: 36200,
    status: 'Delivered',
  },
  {
    id: 3,
    date: '1/10/2025',
    amount: 36200,
    status: 'Delivered',
  },
  {
    id: 4,
    date: '11/6/2025',
    amount: 36200,
    status: 'Delivered',
  },
];

export default function OrderHistory() {
  const totalOrders = 30;
  const totalAmount = 756000;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    Alert.alert('ပြင်မယ်', 'ပြင်ဆင်ခြင်း လုပ်ဆောင်မှုများ');
  };

  const handleDateFilter = () => {
    Alert.alert('ရက်ရွေးမယ်', 'ရက်စွဲ ရွေးချယ်ခြင်း');
  };

  const handleReorder = (orderId) => {
    Alert.alert('အော်ဒါ ပြန်မှာမယ်', `အော်ဒါ #${orderId} ကို ပြန်မှာမယ်`);
  };

  const handleOrderDetails = (orderId) => {
    Alert.alert(
      'အော်ဒါ အသေးစိတ်',
      `အော်ဒါ #${orderId} ရဲ့ အသေးစိတ် အချက်အလက်များ`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>အော်ဒါ အနှစ်ချုပ်</Text>
        </View>

        {/* Order Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <View style={styles.summaryIcon}>
                <Ionicons name="bag-outline" size={18} color="#000000" />
              </View>
              <Text style={styles.summaryLabel}>အော်ဒါစုစုပေါင်း</Text>
            </View>
            <View style={styles.summaryCardContent}>
              <Text style={styles.summarySubLabel}>အော်ဒါ</Text>
              <Text style={styles.summaryValue}>{totalOrders}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <View style={styles.summaryIcon}>
                <Ionicons name="receipt-outline" size={18} color="#000000" />
              </View>
              <Text style={styles.summaryLabel}>ငွေစုစုပေါင်း</Text>
            </View>
            <View style={styles.summaryCardContent}>
              <Text style={styles.summaryValue}>
                MMK {totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Placed Orders Section */}
        <View style={styles.placedOrdersHeader}>
          <Text style={styles.placedOrdersTitle}>မှာယူထားသော အော်ဒါများ</Text>
          <Pressable style={styles.dateFilterButton} onPress={handleDateFilter}>
            <Text style={styles.dateFilterButtonText}>ရက်ရွေးမယ်</Text>
          </Pressable>
        </View>

        {/* Order List */}
        <View style={styles.orderList}>
          {ORDER_DATA.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderInfo}>
                    <View style={styles.orderIcon}>
                      <Ionicons name="bag-outline" size={20} color="#000000" />
                    </View>
                    <Text style={styles.orderDate}>{order.date} မှ အော်ဒါ</Text>
                  </View>
                  <Text style={styles.orderAmount}>
                    MMK{order.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.orderActions}>
                  <Pressable
                    style={styles.reorderButton}
                    onPress={() => handleReorder(order.id)}
                  >
                    <Text style={styles.reorderButtonText}>
                      အော်ဒါ ပြန်မှာမယ်
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.detailsButton}
                    onPress={() => handleOrderDetails(order.id)}
                  >
                    <Text style={styles.detailsButtonText}>
                      အော်ဒါ အသေးစိတ်
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  editButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryCardContent: {
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  summarySubLabel: {
    fontSize: 20,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 20,
  },
  placedOrdersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  placedOrdersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  dateFilterButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  dateFilterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  orderList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  orderActions: {
    flexDirection: 'row',
  },
  reorderButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    flex: 1,
    marginRight: 8,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  detailsButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    flex: 1,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
