import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, createPaymentSession, validateCouponCode, updateStripeApiKeys } from '../services/paymentApi';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('landing');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Real Checkout Details
  const [customerEmail, setCustomerEmail] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Settings
  const [currency, setCurrency] = useState(() => localStorage.getItem('payflow_currency') || 'USD');
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem('payflow_animations') !== 'false');
  const [stripeStatus, setStripeStatus] = useState('Checking...');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');

  // Incoming SMS Phone Banner Notification
  const [incomingSms, setIncomingSms] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const triggerIncomingSmsBanner = (smsData) => {
    setIncomingSms(smsData);
    // Hide banner after 12 seconds
    setTimeout(() => setIncomingSms(null), 12000);
  };

  useEffect(() => {
    async function init() {
      try {
        const prodData = await fetchProducts();
        setProducts(prodData);
        if (prodData.length > 0) {
          setSelectedProduct(prodData[1] || prodData[0]);
        }

        const healthRes = await fetch('http://localhost:5001/api/health').catch(() => null);
        if (healthRes && healthRes.ok) {
          const health = await healthRes.json();
          setStripeStatus(health.stripeConfigured ? 'Stripe Live API Active' : 'Stripe Test Mode');
        }
      } catch (err) {
        console.error('Init error:', err);
      }
    }
    init();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    const res = await validateCouponCode(couponCodeInput.trim());
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon);
      showToast(`Coupon "${res.coupon.code}" applied! ${res.coupon.description}`, 'success');
    } else {
      showToast(res.error || 'Invalid promotional coupon code', 'error');
    }
  };

  const openCheckoutDrawer = (product) => {
    if (product) setSelectedProduct(product);
    setCheckoutError(null);
    setIsCheckoutDrawerOpen(true);
  };

  const closeCheckoutDrawer = () => {
    setIsCheckoutDrawerOpen(false);
    setCheckoutError(null);
  };

  const startCheckoutProcess = async (productToCheckout) => {
    const prod = productToCheckout || selectedProduct;
    if (!prod) return;

    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      showToast(`Generating Stripe Checkout Session for ${prod.name}...`, 'info');

      const response = await createPaymentSession(prod.id, {
        customerEmail,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      });

      if (response.url) {
        setTimeout(() => {
          window.location.href = response.url;
        }, 500);
      } else {
        throw new Error('No checkout session URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Failed to start Stripe checkout session.');
      showToast(err.message || 'Checkout failed', 'error');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleSaveKeys = async (secKey, pubKey) => {
    const res = await updateStripeApiKeys(secKey, pubKey);
    if (res.success) {
      setStripeSecretKey(secKey);
      setStripePublishableKey(pubKey);
      setStripeStatus(res.stripeConfigured ? 'Stripe Live API Active' : 'Stripe Test Mode');
      showToast(res.message, 'success');
    } else {
      showToast(res.error || 'Failed to save Stripe keys', 'error');
    }
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrency('USD');
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setIncomingSms(null);
    showToast('Demo data reset to default.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        selectedProduct,
        setSelectedProduct,
        isCheckoutDrawerOpen,
        openCheckoutDrawer,
        closeCheckoutDrawer,
        isCheckoutLoading,
        checkoutError,
        startCheckoutProcess,
        customerEmail,
        setCustomerEmail,
        couponCodeInput,
        setCouponCodeInput,
        appliedCoupon,
        setAppliedCoupon,
        handleApplyCoupon,
        currency,
        setCurrency,
        animationsEnabled,
        setAnimationsEnabled,
        stripeStatus,
        stripeSecretKey,
        stripePublishableKey,
        handleSaveKeys,
        incomingSms,
        setIncomingSms,
        triggerIncomingSmsBanner,
        toast,
        showToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
