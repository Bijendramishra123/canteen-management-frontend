import axios from 'axios';

// Smart URL detection for different environments
const getPaymentApiUrl = () => {
  // Production - Render URL
  if (import.meta.env.PROD) {
    return 'https://canteen-payment-service.onrender.com';
  }
  
  // Development - use env variable or fallback
  return import.meta.env.VITE_PAYMENT_API_URL || 'https://canteen-payment-service.onrender.com';
};

const PAYMENT_API_URL = getPaymentApiUrl();

console.log(`[Payment Service] Using API URL: ${PAYMENT_API_URL}`);

// Create axios instance for payment service
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
    console.error('[Payment API Request Error]', error);
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
    console.error('[Payment API Error]', error.response?.status, error.response?.data || error.message);
    
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('Payment service timeout - service might be down or slow');
    }
    
    return Promise.reject(error);
  }
);

// Create payment order
export const createPaymentOrder = async (amount, orderDetails) => {
  try {
    const payload = {
      amount: amount,
      customerName: orderDetails?.customerName || 'Customer',
      customerEmail: orderDetails?.customerEmail || 'customer@example.com',
      customerPhone: orderDetails?.customerPhone || '9999999999',
      orderDetails: orderDetails || {}
    };
    
    const response = await paymentAxios.post('/api/payment/create-order', payload);
    
    // Transform response to match component expectations
    return {
      orderId: response.data.orderId || response.data.id,
      keyId: response.data.keyId,
      amount: response.data.amount || amount * 100,
      currency: response.data.currency || 'INR'
    };
  } catch (error) {
    console.error('[Create Order Error]', error.response?.data || error.message);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (orderId, paymentId, signature) => {
  try {
    const response = await paymentAxios.post('/api/payment/verify', {
      orderId: orderId,
      paymentId: paymentId,
      signature: signature
    });
    
    return {
      status: response.data.status || 'success',
      message: response.data.message || 'Payment verified successfully'
    };
  } catch (error) {
    console.error('[Verify Payment Error]', error.response?.data || error.message);
    throw error;
  }
};

// Health check
export const checkPaymentServiceHealth = async () => {
  try {
    const response = await paymentAxios.get('/api/payment/health');
    return response.data.status === 'UP';
  } catch (error) {
    console.error('[Health Check Failed]', error.message);
    return false;
  }
};

export default paymentAxios;