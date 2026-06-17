import axios from 'axios';

// Get payment service URL from env or use Render URL
const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL || 'https://canteen-payment-service.onrender.com';

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
    console.log('[Payment API] Request data:', config.data);
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
    console.log('[Payment API] Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('[Payment API Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Create payment order - FIXED WITH CURRENCY
export const createPaymentOrder = async (amount, orderDetails) => {
  try {
    console.log('[Payment] Creating order for amount:', amount);
    
    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Prepare payload - NOW INCLUDES CURRENCY
    const payload = {
      amount: Number(amount),
      currency: 'INR', // REQUIRED FIELD - FIXED!
      customerName: orderDetails?.customerName || 'Customer',
      customerEmail: orderDetails?.customerEmail || 'customer@example.com', 
      customerPhone: orderDetails?.customerPhone || '9999999999'
    };

    console.log('[Payment] Sending payload:', payload);

    const response = await paymentAxios.post('/api/payment/create-order', payload);
    
    console.log('[Payment] Order created:', response.data);
    
    // Handle different response formats
    const data = response.data;
    return {
      orderId: data.orderId || data.id,
      keyId: data.keyId,
      amount: data.amount || amount * 100,
      currency: data.currency || 'INR'
    };
    
  } catch (error) {
    console.error('[Payment] Create order error:', error.response?.data || error.message);
    
    // Show user-friendly error
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Failed to create payment order. Please try again.';
    
    throw new Error(errorMessage);
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