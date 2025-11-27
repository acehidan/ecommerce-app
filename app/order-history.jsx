import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getOrderHistory, Order } from '../services/order/getOrderHistory';
import { useAuthStore } from '../store/authStore';

export default function OrderHistory() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Store all orders for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    Alert.alert('ပြင်မယ်', 'ပြင်ဆင်ခြင်း လုပ်ဆောင်မှုများ');
  };

  const handleDateFilter = () => {
    setShowDateFilter(true);
  };

  const handleQuickFilter = (filterType) => {
    setSelectedFilter(filterType);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start = null;
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    switch (filterType) {
      case 'today':
        start = new Date(today);
        break;
      case 'week':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        break;
      case 'all':
        start = null;
        end = null;
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
    applyDateFilter(start, end);
  };

  const applyDateFilter = (start, end) => {
    if (!start && !end) {
      // Show all orders
      setOrders(allOrders);
      setTotalOrders(allOrders.length);
      const total = allOrders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      setTotalAmount(total);
      return;
    }

    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);

      if (start && end) {
        return orderDate >= start && orderDate <= end;
      } else if (start) {
        return orderDate >= start;
      } else if (end) {
        return orderDate <= end;
      }
      return true;
    });

    setOrders(filtered);
    setTotalOrders(filtered.length);
    const total = filtered.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    setTotalAmount(total);
  };

  const handleApplyFilter = () => {
    applyDateFilter(startDate, endDate);
    setShowDateFilter(false);
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedFilter('all');
    setOrders(allOrders);
    setTotalOrders(allOrders.length);
    const total = allOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    setTotalAmount(total);
    setShowDateFilter(false);
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const showDatePicker = (type) => {
    // For simplicity, using Alert with date input
    // In a real app, you'd use a proper date picker library
    Alert.prompt(
      type === 'start' ? 'စတင်ရက် ရွေးချယ်ပါ' : 'အဆုံးရက် ရွေးချယ်ပါ',
      'ရက်စွဲ (DD/MM/YYYY)',
      [
        {
          text: 'ပယ်ဖျက်မယ်',
          style: 'cancel',
        },
        {
          text: 'အတည်ပြုမယ်',
          onPress: (dateStr) => {
            if (dateStr) {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                const date = new Date(
                  parseInt(parts[2]),
                  parseInt(parts[1]) - 1,
                  parseInt(parts[0])
                );
                if (type === 'start') {
                  setStartDate(date);
                  setSelectedFilter('custom');
                } else {
                  setEndDate(date);
                  setSelectedFilter('custom');
                }
              }
            }
          },
        },
      ],
      'plain-text'
    );
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: 'ဆိုင်းငံ့ထား',
      processing: 'လုပ်ဆောင်နေဆဲ',
      shipped: 'ပို့ဆောင်ပြီး',
      delivered: 'ပို့ဆောင်ပြီး',
      cancelled: 'ပယ်ဖျက်ပြီး',
    };
    return statusMap[status] || status;
  };

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderHistory();

      if (response.success) {
        const orders = response.data.orders || [];
        const count = response.data.count || orders.length;

        // Store all orders for filtering
        setAllOrders(orders);
        setOrders(orders);
        setTotalOrders(count);

        const total = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        setTotalAmount(total);
      } else {
        setError(
          response.message || 'အော်ဒါ မှတ်တမ်း ရယူရာတွင် အမှား ဖြစ်ပွားပါသည်'
        );
      }
    } catch (err) {
      const errorMessage =
        err.message || 'အော်ဒါ မှတ်တမ်း ရယူရာတွင် အမှား ဖြစ်ပွားပါသည်';
      setError(errorMessage);
      console.error('Error fetching order history:', err);

      // If authentication error, redirect to login
      if (
        errorMessage.includes('Authentication') ||
        errorMessage.includes('login')
      ) {
        setTimeout(() => {
          router.replace('/auth/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated
    if (user && token) {
      fetchOrderHistory();
    } else {
      setLoading(false);
      setError('အကောင့်ဝင်ရမည်');
      setTimeout(() => {
        router.replace('/auth/login');
      }, 2000);
    }
  }, [user, token]);

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
            <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
            <Text style={styles.dateFilterButtonText}>ရက်ရွေးမယ်</Text>
          </Pressable>
        </View>

        {/* Date Filter Info */}
        {(startDate || endDate || selectedFilter !== 'all') && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterInfoText}>
              {selectedFilter === 'today'
                ? 'ယနေ့'
                : selectedFilter === 'week'
                ? 'ပြီးခဲ့သော ၇ ရက်'
                : selectedFilter === 'month'
                ? 'ပြီးခဲ့သော ၁ လ'
                : startDate || endDate
                ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
                    endDate
                  )}`
                : 'အားလုံး'}
            </Text>
            <Pressable onPress={handleClearFilter}>
              <Ionicons name="close-circle" size={20} color="#666666" />
            </Pressable>
          </View>
        )}

        {/* Order List */}
        <View style={styles.orderList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
              <Text style={styles.loadingText}>အော်ဒါ မှတ်တမ်း ရယူနေဆဲ...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={fetchOrderHistory}>
                <Text style={styles.retryButtonText}>ပြန်လည် ကြိုးစားမယ်</Text>
              </Pressable>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bag-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>အော်ဒါ မရှိပါ</Text>
              <Text style={styles.emptySubText}>
                သင်မှာယူထားသော အော်ဒါများ ဤနေရာတွင် ပေါ်လာမည်
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order._id} style={styles.orderCard}>
                <View style={styles.orderInfo}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderHeaderInfo}>
                      <View style={styles.orderIcon}>
                        <Ionicons
                          name="bag-outline"
                          size={20}
                          color="#000000"
                        />
                      </View>
                      <View>
                        <Text style={styles.orderDate}>
                          {formatDate(order.createdAt)} မှ အော်ဒါ
                        </Text>
                        <Text style={styles.orderStatus}>
                          {formatStatus(order.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.orderAmount}>
                      MMK {order.totalAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.orderActions}>
                    <Pressable
                      style={styles.reorderButton}
                      onPress={() => handleReorder(order._id)}
                    >
                      <Text style={styles.reorderButtonText}>
                        အော်ဒါ ပြန်မှာမယ်
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.detailsButton}
                      onPress={() => handleOrderDetails(order._id)}
                    >
                      <Text style={styles.detailsButtonText}>
                        အော်ဒါ အသေးစိတ်
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Date Filter Modal */}
      <Modal
        visible={showDateFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ရက်စွဲ စစ်ထုတ်မယ်</Text>
              <Pressable onPress={() => setShowDateFilter(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </Pressable>
            </View>

            {/* Quick Filter Options */}
            <View style={styles.quickFilters}>
              <Text style={styles.sectionLabel}>အမြန်ရွေးချယ်မှု</Text>
              <View style={styles.quickFilterButtons}>
                <Pressable
                  style={[
                    styles.quickFilterButton,
                    selectedFilter === 'today' &&
                      styles.quickFilterButtonActive,
                  ]}
                  onPress={() => handleQuickFilter('today')}
                >
                  <Text
                    style={[
                      styles.quickFilterButtonText,
                      selectedFilter === 'today' &&
                        styles.quickFilterButtonTextActive,
                    ]}
                  >
                    ယနေ့
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.quickFilterButton,
                    selectedFilter === 'week' && styles.quickFilterButtonActive,
                  ]}
                  onPress={() => handleQuickFilter('week')}
                >
                  <Text
                    style={[
                      styles.quickFilterButtonText,
                      selectedFilter === 'week' &&
                        styles.quickFilterButtonTextActive,
                    ]}
                  >
                    ပြီးခဲ့သော ၇ ရက်
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.quickFilterButton,
                    selectedFilter === 'month' &&
                      styles.quickFilterButtonActive,
                  ]}
                  onPress={() => handleQuickFilter('month')}
                >
                  <Text
                    style={[
                      styles.quickFilterButtonText,
                      selectedFilter === 'month' &&
                        styles.quickFilterButtonTextActive,
                    ]}
                  >
                    ပြီးခဲ့သော ၁ လ
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.quickFilterButton,
                    selectedFilter === 'all' && styles.quickFilterButtonActive,
                  ]}
                  onPress={() => handleQuickFilter('all')}
                >
                  <Text
                    style={[
                      styles.quickFilterButtonText,
                      selectedFilter === 'all' &&
                        styles.quickFilterButtonTextActive,
                    ]}
                  >
                    အားလုံး
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Custom Date Range */}
            <View style={styles.customDateRange}>
              <Text style={styles.sectionLabel}>ကိုယ်ပိုင် ရက်စွဲ</Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => showDatePicker('start')}
              >
                <Ionicons name="calendar-outline" size={20} color="#666666" />
                <Text style={styles.dateInputText}>
                  {startDate
                    ? formatDateForDisplay(startDate)
                    : 'စတင်ရက် ရွေးချယ်ပါ'}
                </Text>
              </Pressable>
              <Pressable
                style={styles.dateInput}
                onPress={() => showDatePicker('end')}
              >
                <Ionicons name="calendar-outline" size={20} color="#666666" />
                <Text style={styles.dateInputText}>
                  {endDate
                    ? formatDateForDisplay(endDate)
                    : 'အဆုံးရက် ရွေးချယ်ပါ'}
                </Text>
              </Pressable>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Pressable style={styles.clearButton} onPress={handleClearFilter}>
                <Text style={styles.clearButtonText}>ရှင်းလင်းမယ်</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={handleApplyFilter}>
                <Text style={styles.applyButtonText}>အတည်ပြုမယ်</Text>
              </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateFilterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 8,
  },
  filterInfoText: {
    fontSize: 14,
    color: '#666666',
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
  orderStatus: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  quickFilters: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 12,
  },
  quickFilterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickFilterButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  quickFilterButtonText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  quickFilterButtonTextActive: {
    color: '#FFFFFF',
  },
  customDateRange: {
    marginBottom: 24,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 12,
  },
  dateInputText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
