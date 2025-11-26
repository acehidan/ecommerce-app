import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder as createOrderService } from '../services/order/createOrder';

export interface ContactInfo {
  name: string;
  phoneNumber: string;
}

export interface AddressInfo {
  addressId: string;
  addressType: string;
  city: string;
  township: string;
  fullAddress: string;
  deliveryType: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  price: number;
}

export interface OrderSummary {
  subtotal: number;
  shippingFee: number;
  overweightCharge: number;
  grandTotal: number;
  totalWeight: number;
}

export interface PaymentInfo {
  selectedMethod: string;
  receiptImage: {
    uri: string;
    fileName?: string;
    type?: string;
  } | null;
  paymentDetails: {
    bankName?: string;
    transactionAmount?: string;
    transactionDate?: string;
    transactionNo?: string;
    transferTo?: string;
  };
}

export interface OrderResponse {
  orderId: string;
  status: string;
  totalAmount: number;
  delivery: {
    city: string;
    township: string;
    totalWeight: number;
    deliveryFee: number;
    baseDeliveryFee: number;
    additionalWeightCharge: number;
  };
  products: Array<{
    stockId: string;
    quantity: number;
    name: string;
    productCode: string;
    unitPrice: number;
    unitWeight: number;
    weightUnit: string;
    sale: string;
  }>;
  address: string;
}

export interface CheckoutData {
  // Step 1 Data
  contactInfo: ContactInfo | null;
  addressInfo: AddressInfo | null;

  // Step 2 Data
  orderItems: OrderItem[];
  orderSummary: OrderSummary | null;

  // Step 3 Data
  paymentInfo: PaymentInfo | null;

  // Step 4 Data
  orderResponse: OrderResponse | null;
  isCompleted: boolean;
}

interface CheckoutState {
  checkoutData: CheckoutData;

  // Step 1 Actions
  setContactInfo: (contactInfo: ContactInfo) => void;
  setAddressInfo: (addressInfo: AddressInfo) => void;

  // Step 2 Actions
  setOrderItems: (items: OrderItem[]) => void;
  setOrderSummary: (summary: OrderSummary) => void;

  // Step 3 Actions
  setPaymentMethod: (method: string) => void;
  setReceiptImage: (image: PaymentInfo['receiptImage']) => void;
  setPaymentDetails: (details: PaymentInfo['paymentDetails']) => void;

  // Step 4 Actions
  createOrder: (orderData: any) => Promise<void>;
  setOrderResponse: (orderResponse: OrderResponse) => void;
  completeCheckout: () => void;
  clearCheckoutData: () => void;

  // Utility Actions
  getStepData: (step: number) => any;
}

const initialCheckoutData: CheckoutData = {
  contactInfo: null,
  addressInfo: null,
  orderItems: [],
  orderSummary: null,
  paymentInfo: null,
  orderResponse: null,
  isCompleted: false,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      checkoutData: initialCheckoutData,

      // Step 1 Actions
      setContactInfo: (contactInfo: ContactInfo) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            contactInfo,
          },
        })),

      setAddressInfo: (addressInfo: AddressInfo) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            addressInfo,
          },
        })),

      // Step 2 Actions
      setOrderItems: (orderItems: OrderItem[]) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            orderItems,
          },
        })),

      setOrderSummary: (orderSummary: OrderSummary) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            orderSummary,
          },
        })),

      // Step 3 Actions
      setPaymentMethod: (selectedMethod: string) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            paymentInfo: {
              ...state.checkoutData.paymentInfo,
              selectedMethod,
              receiptImage:
                state.checkoutData.paymentInfo?.receiptImage || null,
              paymentDetails:
                state.checkoutData.paymentInfo?.paymentDetails || {},
            },
          },
        })),

      setReceiptImage: (receiptImage: PaymentInfo['receiptImage']) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            paymentInfo: {
              ...state.checkoutData.paymentInfo,
              selectedMethod:
                state.checkoutData.paymentInfo?.selectedMethod || 'prepayment',
              receiptImage,
              paymentDetails:
                state.checkoutData.paymentInfo?.paymentDetails || {},
            },
          },
        })),

      setPaymentDetails: (paymentDetails: PaymentInfo['paymentDetails']) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            paymentInfo: {
              ...state.checkoutData.paymentInfo,
              selectedMethod:
                state.checkoutData.paymentInfo?.selectedMethod || 'prepayment',
              receiptImage:
                state.checkoutData.paymentInfo?.receiptImage || null,
              paymentDetails,
            },
          },
        })),

      // Step 4 Actions
      createOrder: async (orderData: any) => {
        try {
          const response = await createOrderService(orderData);
          set((state) => ({
            checkoutData: {
              ...state.checkoutData,
              orderResponse: response.data,
            },
          }));
          return response;
        } catch (error) {
          console.error('Error creating order:', error);
          throw error;
        }
      },

      setOrderResponse: (orderResponse: OrderResponse) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            orderResponse,
          },
        })),

      completeCheckout: () =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            isCompleted: true,
          },
        })),

      clearCheckoutData: () =>
        set({
          checkoutData: initialCheckoutData,
        }),

      // Utility Actions

      getStepData: (step: number) => {
        const { checkoutData } = get();
        switch (step) {
          case 1:
            return {
              contactInfo: checkoutData.contactInfo,
              addressInfo: checkoutData.addressInfo,
            };
          case 2:
            return {
              orderItems: checkoutData.orderItems,
              orderSummary: checkoutData.orderSummary,
            };
          case 3:
            return {
              paymentInfo: checkoutData.paymentInfo,
            };
          case 4:
            return checkoutData;
          default:
            return null;
        }
      },
    }),
    {
      name: 'checkout-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Checkout state rehydrated');
        }
      },
    }
  )
);
