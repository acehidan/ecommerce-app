import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../components/PageHeader';
import colors from '../../constants/colors';
import { getOrderDetail } from '../../services/order/getOrderDetail';

export default function OrderDetail() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [activeTab, setActiveTab] = useState('payment');
    const [error, setError] = useState(null);

    // Fetch order detail from API
    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                if (!id) {
                    throw new Error('Order ID is required');
                }

                setLoading(true);
                const response = await getOrderDetail(id);
                console.log('response', response);

                if (response.success) {
                    setOrderData(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch order details');
                }
            } catch (error) {
                console.error('Error fetching order detail:', error);
                setError(error.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    const handleReorder = () => {
        console.log('Reorder items');
        // Implement reorder functionality
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>

                <PageHeader title="အော်ဒါ အသေးစိတ်" sticky={false} showBackButton={true} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.button.primary} />
                    <Text style={styles.loadingText}>Loading order details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !orderData) {
        return (
            <SafeAreaView style={styles.container}>

                <PageHeader title="အော်ဒါ အသေးစိတ်" sticky={false} showBackButton={true} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || 'Order not found'}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Calculate subtotal
    const subtotal = orderData.products.reduce(
        (sum, product) => sum + product.unitPrice * product.quantity,
        0,
    );

    return (
        <SafeAreaView style={styles.container}>

            <PageHeader
                title={`${formatDate(orderData.createdAt)} မှ အော်ဒါ`}
                sticky={false}
                showBackButton={true}
            // subcomponent={false}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Payment Method Section */}
                <View style={styles.section}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 5,
                            }}
                        >
                            <Ionicons
                                name="cash-outline"
                                size={20}
                                color={colors.button.primary}
                            />
                            <Text style={styles.sectionTitle}>ငွေပေးချေမှု</Text>
                        </View>

                        <Text style={styles.paymentMethodTitle}>
                            {orderData.paymentMethod === 'cash-on-delivery'
                                ? 'အိမ်အရောက်ငွေချေ'
                                : 'ငွေကြိုရှင်း'}
                        </Text>
                    </View>
                </View>

                {/* Purchased Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ဝယ်ယူထားသောပစ္စည်းများ</Text>

                    <View style={styles.itemsList}>
                        {orderData.products.map((product) => (
                            <View key={product.stockId} style={styles.itemRow}>
                                <View style={styles.itemQuantity}>
                                    <Text style={styles.itemQuantityText}>
                                        {product.quantity} ခု
                                    </Text>
                                </View>
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{product.name}</Text>
                                </View>
                                <Text style={styles.itemPrice}>
                                    MMK {(product.unitPrice * product.quantity).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Order Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>အော်ဒါ အကျဉ်းချုပ်</Text>

                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>စုစုပေါင်း</Text>
                            <Text style={styles.summaryValue}>
                                MMK {subtotal.toLocaleString()}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>ပို့ဆောင်ခ</Text>
                            <Text style={styles.summaryValue}>
                                MMK {orderData.delivery.baseDeliveryFee.toLocaleString()}
                            </Text>
                        </View>

                        {orderData.delivery.totalWeight > 2 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>အပိုဝန်ဆောင်ခ</Text>
                                <View style={styles.overweightDetails}>
                                    <Text style={styles.summaryValue}>
                                        MMK{' '}
                                        {(
                                            orderData.delivery.calculatedDeliveryFee -
                                            orderData.delivery.baseDeliveryFee
                                        ).toLocaleString()}
                                    </Text>
                                    <Text style={styles.overweightNote}>
                                        စုစုပေါင်း အလေးချိန်: {orderData.delivery.totalWeight}{' '}
                                        {orderData.products[0]?.weightUnit || 'kg'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>စုစုပေါင်း</Text>
                            <Text style={styles.totalValue}>
                                MMK{' '}
                                {(
                                    orderData.totalAmount +
                                    orderData.delivery.calculatedDeliveryFee
                                ).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                {/* <View style={styles.buttonContainer}>
          <Pressable style={styles.downloadButton} onPress={handleDownload}>
            <Ionicons
              name="download-outline"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.downloadButtonText}>
              ဒေါင်းလုတ်လုပ်ပြီးသိမ်းမယ်
            </Text>
          </Pressable>

          <Pressable style={styles.reorderButton} onPress={handleReorder}>
            <Ionicons
              name="refresh-outline"
              size={20}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.reorderButtonText}>အော်ဒါ ပြန်မှာမယ်</Text>
          </Pressable>
        </View> */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#FF0000',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 8,
        padding: 4,
        marginTop: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: colors.button.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 16,
    },
    paymentMethodIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    paymentMethodInfo: {
        flex: 1,
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    paymentMethodStatus: {
        fontSize: 14,
        color: '#666666',
    },
    itemsList: {
        borderRadius: 8,
        paddingY: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    itemQuantity: {
        marginRight: 5,
    },
    itemQuantityText: {
        fontSize: 14,
        color: '#666666',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 2,
    },
    itemWeight: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 2,
    },
    itemCode: {
        fontSize: 12,
        color: '#999999',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
    },
    summaryContainer: {
        marginTop: 16,
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    overweightDetails: {
        alignItems: 'flex-end',
        flex: 1,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
    },
    summaryValue: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
    overweightNote: {
        fontSize: 12,
        color: '#666666',
        marginTop: 2,
        textAlign: 'right',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 32,
    },
    downloadButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.button.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.button.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    downloadButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    reorderButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});