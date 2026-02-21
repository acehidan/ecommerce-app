import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentResult() {
  const router = useRouter();
  const { status, transaction_id, amount, message } = useLocalSearchParams();

  useEffect(() => {
    // Log the received parameters for debugging
    console.log('Payment result received:', {
      status,
      transaction_id,
      amount,
      message
    });

    // Auto-redirect after 3 seconds if no user interaction
    const timer = setTimeout(() => {
      router.replace('/(tabs)/index');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const getPaymentStatus = () => {
    if (status === 'success') {
      return {
        color: '#4CAF50',
        title: 'Payment Successful!',
        icon: '✅'
      };
    } else if (status === 'failed') {
      return {
        color: '#F44336',
        title: 'Payment Failed',
        icon: '❌'
      };
    } else if (status === 'pending') {
      return {
        color: '#FF9800',
        title: 'Payment Pending',
        icon: '⏳'
      };
    } else {
      return {
        color: '#2196F3',
        title: 'Payment Status',
        icon: 'ℹ️'
      };
    }
  };

  const paymentStatus = getPaymentStatus();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{paymentStatus.icon}</Text>
        <Text style={[styles.title, { color: paymentStatus.color }]}>
          {paymentStatus.title}
        </Text>
        
        {transaction_id && (
          <Text style={styles.detail}>
            Transaction ID: {transaction_id}
          </Text>
        )}
        
        {amount && (
          <Text style={styles.detail}>
            Amount: {amount}
          </Text>
        )}
        
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}
        
        <View style={styles.buttonContainer}>
          <Text 
            style={styles.button}
            onPress={() => router.replace('/(tabs)/index')}
          >
            Back to Home
          </Text>
        </View>
        
        <Text style={styles.autoRedirect}>
          Auto-redirecting in 3 seconds...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 200,
  },
  autoRedirect: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
