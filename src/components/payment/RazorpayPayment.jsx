import React, { useState, useEffect } from 'react';
import { createPaymentOrder, verifyPayment, checkPaymentServiceHealth } from '../../api/payment';
import toast from 'react-hot-toast';

const RazorpayPayment = ({ amount, orderDetails, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [isPaymentServiceAvailable, setIsPaymentServiceAvailable] = useState(true);

  // Check payment service health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const health = await checkPaymentServiceHealth();
      if (!health) {
        setIsPaymentServiceAvailable(false);
        toast.error('Payment service is currently unavailable. Please try again later.');
      }
    };
    checkHealth();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Check if payment service is available
    if (!isPaymentServiceAvailable) {
      toast.error('Payment service is unavailable. Please try again later.');
      return;
    }

    setLoading(true);
    
    try {
      // Check if Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Create order on backend payment service
      const { orderId, keyId, amount: orderAmount } = await createPaymentOrder(amount, orderDetails);
      
      const options = {
        key: keyId,
        amount: orderAmount,
        currency: 'INR',
        name: 'CanteenHub',
        description: `Order Payment for ${orderDetails.customerName}`,
        image: '/logo.png',
        order_id: orderId,
        handler: async (paymentResponse) => {
          // Verify payment on backend
          try {
            const verifyResult = await verifyPayment(
              orderId,  // Fixed: using orderId instead of orderResponse.razorpay_order_id
              paymentResponse.razorpay_payment_id,
              paymentResponse.razorpay_signature
            );
            
            if (verifyResult.status === 'success') {
              toast.success('Payment successful! Order placed.');
              if (onSuccess) {
                onSuccess({
                  ...verifyResult,
                  paymentId: paymentResponse.razorpay_payment_id,
                  orderId: orderId
                });
              }
            } else {
              toast.error('Payment verification failed');
              if (onFailure) onFailure(new Error('Payment verification failed'));
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            if (onFailure) onFailure(error);
          }
          setLoading(false);
        },
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          contact: orderDetails.customerPhone
        },
        notes: {
          address: orderDetails.address || 'Canteen Table Service'
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Failed to initiate payment');
      if (onFailure) onFailure(error);
      setLoading(false);
    }
  };

  if (!isPaymentServiceAvailable) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
      >
        Payment Service Unavailable
      </button>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        <>
          <span>💳</span> Pay ₹{amount}
        </>
      )}
    </button>
  );
};

export default RazorpayPayment;