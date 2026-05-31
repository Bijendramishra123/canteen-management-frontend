import axios from 'axios';

// Get payment service URL from env or use default
const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8080';

// Create separate axios instance for payment service
const paymentAxios = axios.create({
  baseURL: PAYMENT_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for payment service
paymentAxios.interceptors.request.use(
  (config) => {
    console.log(`[Payment API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for payment service
paymentAxios.interceptors.response.use(
  (response) => {
    console.log(`[Payment API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[Payment API Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Create payment order
export const createPaymentOrder = async (amount, orderDetails) => {
  const response = await paymentAxios.post('/api/payment/create-order', {
    amount: amount,
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    customerName: orderDetails.customerName,
    customerEmail: orderDetails.customerEmail,
    customerPhone: orderDetails.customerPhone
  });
  return response.data;
};

// Verify payment
export const verifyPayment = async (orderId, paymentId, signature) => {
  const response = await paymentAxios.post('/api/payment/verify', {
    orderId: orderId,
    paymentId: paymentId,
    signature: signature
  });
  return response.data;
};

// Health check
export const checkPaymentServiceHealth = async () => {
  try {
    const response = await paymentAxios.get('/api/payment/health');
    return response.data;
  } catch (error) {
    console.error('Payment service health check failed:', error);
    return null;
  }
};

export default paymentAxios;