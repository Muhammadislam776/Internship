import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import OtpVerificationModal from '../components/OtpVerificationModal';
import QrPaymentModal from '../components/QrPaymentModal';
import SmsOtpModal from '../components/SmsOtpModal';
import { 
  CreditCard, 
  QrCode, 
  Truck, 
  Lock, 
  MapPin, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Tag
} from 'lucide-react';

export default function ECommerceCheckout() {
  const { user, setIsAuthModalOpen } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { setCurrentView, showToast, startCheckoutProcess, selectedProduct, triggerIncomingSmsBanner } = useApp();

  const [step, setStep] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Alex Morgan',
    addressLine: user?.addresses?.[0]?.addressLine || '742 Evergreen Terrace',
    city: user?.addresses?.[0]?.city || 'San Francisco',
    state: user?.addresses?.[0]?.state || 'CA',
    zip: user?.addresses?.[0]?.zip || '94107',
    country: 'United States',
    phone: user?.phone || '+1 (555) 234-5678'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardForm, setCardForm] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardName: user?.name || 'ALEX MORGAN',
    expDate: '12/28',
    cvc: '123'
  });

  const [walletType, setWalletType] = useState('Easypaisa / JazzCash / Mobile Wallet');

  // Modals
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const checkoutItems = cartItems.length > 0 ? cartItems : [selectedProduct || { id: 'pro', name: 'Pro Flow', price: 49, quantity: 1 }];
  const totalDue = cartItems.length > 0 ? cartTotal : (selectedProduct?.price || 49);

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.phone) {
      showToast('Please complete required shipping & mobile phone number fields', 'error');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 📲 Triggers Mobile Phone SMS OTP Dispatch
   */
  const handleTriggerSmsOtpPayment = async () => {
    if (!shippingAddress.phone) {
      showToast('Please enter a valid mobile phone number for OTP verification', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: shippingAddress.phone })
      });

      const data = await response.json();
      if (data.success) {
        if (data.smsNotification) {
          triggerIncomingSmsBanner(data.smsNotification);
        }
        setIsSmsModalOpen(true);
        showToast(data.message || `SMS OTP code dispatched to ${shippingAddress.phone}`, 'info');
      } else {
        throw new Error(data.error || 'Failed to send SMS OTP');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSmsOtpVerified = async (verifiedCode) => {
    setIsSmsModalOpen(false);

    if (paymentMethod === 'card') {
      setIsOtpModalOpen(true); // Bank ATM PIN / 3D Secure Verification
    } else if (paymentMethod === 'qr') {
      setIsQrModalOpen(true);
    } else if (paymentMethod === 'stripe_hosted') {
      startCheckoutProcess(checkoutItems[0]);
    } else if (paymentMethod === 'cod') {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/process-cod-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingAddress,
            items: checkoutItems,
            totalAmount: totalDue,
            customerEmail: user?.email || 'customer@payflow.io'
          })
        });
        const data = await response.json();
        clearCart();
        showToast('Order placed with Cash on Delivery & Verified Phone!', 'success');
        setCurrentView('success');
      } catch (e) {
        showToast('COD order failed', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBankOtpVerified = async (pin) => {
    setIsOtpModalOpen(false);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/process-card-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: cardForm.cardNumber,
          expDate: cardForm.expDate,
          cvc: cardForm.cvc,
          atmPin: pin,
          phoneNumber: shippingAddress.phone,
          shippingAddress,
          items: checkoutItems,
          totalAmount: totalDue,
          customerEmail: user?.email || 'customer@payflow.io'
        })
      });
      const data = await response.json();
      if (data.success) {
        clearCart();
        showToast('Payment authorized with SMS OTP & Bank 3D Secure!', 'success');
        setCurrentView('success');
      } else {
        showToast(data.error || 'Payment failed', 'error');
      }
    } catch (e) {
      showToast('Payment processing error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQrVerified = async (refId) => {
    setIsQrModalOpen(false);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/process-qr-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType,
          transactionRef: refId,
          shippingAddress,
          items: checkoutItems,
          totalAmount: totalDue,
          customerEmail: user?.email || 'customer@payflow.io'
        })
      });
      const data = await response.json();
      if (data.success) {
        clearCart();
        showToast('QR Mobile Wallet Payment verified!', 'success');
        setCurrentView('success');
      }
    } catch (e) {
      showToast('QR Verification error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Stepper */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-around max-w-2xl mx-auto text-xs font-bold">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading ${
              step >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
            }`}>
              1
            </div>
            <span className="hidden sm:inline">1. Shipping & Mobile Phone</span>
          </div>

          <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading ${
              step >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </div>
            <span className="hidden sm:inline">2. Payment & SMS OTP Verification</span>
          </div>

          <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading ${
              step >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </div>
            <span className="hidden sm:inline">3. Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: SHIPPING & PHONE */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">Shipping Address & Mobile Verification</h3>
                    <p className="text-xs text-slate-500">OTP code will be sent to your mobile phone number</p>
                  </div>
                </div>

                {!user && (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100"
                  >
                    Sign In
                  </button>
                )}
              </div>

              <form onSubmit={handleNextToPayment} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  {/* MOBILE PHONE NUMBER WITH OTP REQUIREMENT */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                        <span>Mobile Phone (for SMS OTP)</span>
                      </span>
                      <span className="text-[10px] text-orange-600 font-bold uppercase">SMS Verification Required</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 234-5678"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="742 Evergreen Terrace, Suite 100"
                    value={shippingAddress.addressLine}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">City</label>
                    <input
                      type="text"
                      required
                      placeholder="San Francisco"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">State</label>
                    <input
                      type="text"
                      required
                      placeholder="CA"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="94107"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-sm shadow-md flex items-center justify-center space-x-2 transition-all mt-4"
                >
                  <span>Continue to Payment & SMS OTP Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD & SMS OTP */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">Choose Payment Method</h3>
                    <p className="text-xs text-slate-500">SMS OTP Code will be sent to {shippingAddress.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 bg-slate-100 px-3 py-1.5 rounded-xl"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      💳
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Credit / Debit Card</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay directly with Card + SMS OTP + Bank ATM PIN verification.</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'qr'
                      ? 'border-orange-500 bg-orange-50/40 ring-4 ring-orange-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    {paymentMethod === 'qr' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">QR Code / Mobile Wallet</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Scan QR with Easypaisa, JazzCash, Paytm, WeChat Pay, or UPI.</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('stripe_hosted')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'stripe_hosted'
                      ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                      Stripe
                    </div>
                    {paymentMethod === 'stripe_hosted' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Stripe Hosted Checkout</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Redirect to Stripe's official PCI-DSS hosted checkout page.</p>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/40 ring-4 ring-emerald-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      💵
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay in cash directly when package arrives at your address.</p>
                </div>

              </div>

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <span className="font-bold text-slate-900 block">Card Payment Information</span>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardForm.expDate}
                        onChange={(e) => setCardForm({ ...cardForm, expDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold">CVC / CVV Code</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardForm.cvc}
                        onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTON: TRIGGER SMS OTP VERIFICATION FIRST */}
              <button
                onClick={handleTriggerSmsOtpPayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
              >
                <Smartphone className="w-5 h-5 text-orange-300" />
                <span>
                  {loading ? 'Sending SMS OTP...' : `Send Mobile OTP & Pay ($${totalDue.toFixed(2)})`}
                </span>
              </button>

            </div>
          )}

        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading pb-3 border-b border-slate-100">
              Order Summary ({checkoutItems.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.quantity || 1}x</span>
                    <span className="text-slate-800 truncate font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">${((item.price) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${totalDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Express Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                <span className="text-sm">Total Payable</span>
                <span className="text-2xl text-blue-600 font-heading">${totalDue.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-2xl text-[11px] text-slate-600 space-y-1 border border-orange-100">
              <div className="flex items-center space-x-1 text-slate-900 font-bold">
                <Smartphone className="w-4 h-4 text-orange-500" />
                <span>SMS OTP Protection Active</span>
              </div>
              <p>A 6-digit code will be dispatched to {shippingAddress.phone || 'your phone'} before payment authorization.</p>
            </div>
          </div>
        </div>

      </div>

      {/* SMS OTP VERIFICATION DIALOG */}
      <SmsOtpModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        phoneNumber={shippingAddress.phone}
        onOtpVerified={handleSmsOtpVerified}
      />

      {/* ATM PIN / 3D Secure Bank Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={handleBankOtpVerified}
        amount={totalDue}
        cardLast4={cardForm.cardNumber.replace(/\s+/g, '').slice(-4)}
      />

      {/* QR Code Wallet Modal */}
      <QrPaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onVerify={handleQrVerified}
        walletType={walletType}
        amount={totalDue}
      />

    </div>
  );
}
