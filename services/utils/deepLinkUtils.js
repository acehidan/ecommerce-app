import { Linking } from 'react-native';

/**
 * Deep Link utility functions for komin-diy app
 */

export const DEEP_LINK_SCHEME = 'komin-diy';

/**
 * Generate a payment result deep link
 * @param {Object} params - Payment parameters
 * @param {string} params.status - Payment status (success, failed, pending)
 * @param {string} params.transaction_id - Transaction ID
 * @param {string} params.amount - Payment amount
 * @param {string} params.message - Optional message
 * @returns {string} Complete deep link URL
 */
export const generatePaymentResultLink = (params) => {
  const baseUrl = `${DEEP_LINK_SCHEME}://payment_result`;
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.append('status', params.status);
  if (params.transaction_id)
    queryParams.append('transaction_id', params.transaction_id);
  if (params.amount) queryParams.append('amount', params.amount);
  if (params.message) queryParams.append('message', params.message);

  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Test if the app can handle the deep link
 * @returns {Promise<boolean>} True if the app can handle the deep link
 */
export const testDeepLinkSupport = async () => {
  try {
    const supported = await Linking.canOpenURL(
      `${DEEP_LINK_SCHEME}://payment_result`,
    );
    return supported;
  } catch (error) {
    console.error('Error testing deep link support:', error);
    return false;
  }
};

/**
 * Open a deep link
 * @param {string} url - Deep link URL to open
 * @returns {Promise<boolean>} True if the link was opened successfully
 */
export const openDeepLink = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      // console.log('Cannot handle URL:', url);
      return false;
    }
  } catch (error) {
    console.error('Error opening deep link:', error);
    return false;
  }
};

/**
 * Example usage:
 *
 * // Generate a successful payment link
 * const successLink = generatePaymentResultLink({
 *   status: 'success',
 *   transaction_id: 'TXN123456',
 *   amount: '99.99',
 *   message: 'Payment completed successfully'
 * });
 *
 * // Generate a failed payment link
 * const failedLink = generatePaymentResultLink({
 *   status: 'failed',
 *   transaction_id: 'TXN123456',
 *   amount: '99.99',
 *   message: 'Payment failed due to insufficient funds'
 * });
 *
 * // Test and open the link
 * openDeepLink(successLink);
 */

export const EXAMPLE_LINKS = {
  success: generatePaymentResultLink({
    status: 'success',
    transaction_id: 'TXN123456',
    amount: '99.99',
    message: 'Payment completed successfully',
  }),
  failed: generatePaymentResultLink({
    status: 'failed',
    transaction_id: 'TXN123456',
    amount: '99.99',
    message: 'Payment failed due to insufficient funds',
  }),
  pending: generatePaymentResultLink({
    status: 'pending',
    transaction_id: 'TXN123456',
    amount: '99.99',
    message: 'Payment is being processed',
  }),
  basic: `${DEEP_LINK_SCHEME}://payment_result`,
};
