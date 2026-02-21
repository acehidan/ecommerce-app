import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  generatePaymentResultLink,
  openDeepLink,
  testDeepLinkSupport,
  EXAMPLE_LINKS,
} from '../services/utils/deepLinkUtils';

export default function DeepLinkTest() {
  const [isTesting, setIsTesting] = useState(false);

  const testDeepLink = async (link, description) => {
    setIsTesting(true);
    try {
      const canOpen = await testDeepLinkSupport();
      if (canOpen) {
        await openDeepLink(link);
      } else {
        Alert.alert(
          'Deep Link Not Supported',
          'This app cannot handle the deep link. Make sure the app is properly installed and configured.',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open deep link: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const linkTests = [
    {
      description: 'Successful Payment',
      link: EXAMPLE_LINKS.success,
      color: '#4CAF50',
    },
    {
      description: 'Failed Payment',
      link: EXAMPLE_LINKS.failed,
      color: '#F44336',
    },
    {
      description: 'Pending Payment',
      link: EXAMPLE_LINKS.pending,
      color: '#FF9800',
    },
    {
      description: 'Basic Link (No Params)',
      link: EXAMPLE_LINKS.basic,
      color: '#2196F3',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Link Test</Text>
      <Text style={styles.subtitle}>
        Test the komin-diy://payment_result deep link
      </Text>

      {linkTests.map((test, index) => (
        <View key={index} style={styles.testItem}>
          <Text style={styles.description}>{test.description}</Text>
          <Text style={styles.link}>{test.link}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: test.color }]}
            onPress={() => testDeepLink(test.link, test.description)}
            disabled={isTesting}
          >
            <Text style={styles.buttonText}>
              {isTesting ? 'Testing...' : 'Test Link'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How to test:</Text>
        <Text style={styles.infoText}>
          1. Install the app on your device/simulator
        </Text>
        <Text style={styles.infoText}>2. Click any test button above</Text>
        <Text style={styles.infoText}>
          3. The app should open to the payment result screen
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  testItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  link: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
