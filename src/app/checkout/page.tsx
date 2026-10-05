'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Tag,
  Lock,
  User,
  MapPin,
  CheckCircle2,
  Bike,
  Sparkles,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { IUserAddress } from '@/types';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { APP_NAME } from '@/lib/constants';
import { validatePhone, validateAddress, validateName, validateEmail, validatePostalCode } from '@/lib/validations';

type CheckoutStep = 'phone' | 'address' | 'payment';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === '1' || searchParams.get('mode') === 'buynow';

  const { cart, subtotal, shipping, tax, discount, total, appliedCoupon, applyCoupon, removeCoupon, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { error, success, info } = useToast();

  const [buyNowItem, setBuyNowItem] = useState<any | null>(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [buyNowCoupon, setBuyNowCoupon] = useState<string | null>(null);
  const [buyNowDiscount, setBuyNowDiscount] = useState<number>(0);

  useEffect(() => {
    setIsClientLoaded(true);
    if (isBuyNow) {
      try {
        const stored = sessionStorage.getItem('srirama_buy_now');
        if (stored) {
          setBuyNowItem(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to parse buyNow from sessionStorage', e);
      }
    }
  }, [isBuyNow]);

  const checkoutItems: any[] = useMemo(() => {
    return isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cart;
  }, [isBuyNow, buyNowItem, cart]);

  const checkoutSubtotal = useMemo(() => {
    return checkoutItems.reduce((acc, item) => {
      const unitPrice =
        item.product?.salePrice && item.product.salePrice > 0
          ? item.product.salePrice
          : (item.product?.price || item.price || 0);
      return acc + unitPrice * (item.quantity || 1);
    }, 0);
  }, [checkoutItems]);

  const activeCoupon = isBuyNow ? buyNowCoupon : appliedCoupon;

  const checkoutDiscount = useMemo(() => {
    if (isBuyNow) {
      return buyNowDiscount;
    }
    return discount;
  }, [isBuyNow, buyNowDiscount, discount]);

  const discountedSubtotal = Math.max(0, checkoutSubtotal - checkoutDiscount);
  const checkoutShipping =
    discountedSubtotal >= 999 || discountedSubtotal === 0 ? 0 : 99;
  const checkoutTotal = discountedSubtotal + checkoutShipping;

  const handleUpdateBuyNowQty = (newQty: number) => {
    if (!buyNowItem) return;
    if (newQty <= 0) {
      try {
        sessionStorage.removeItem('srirama_buy_now');
      } catch (e) {}
      setBuyNowItem(null);
      return;
    }
    const updated = { ...buyNowItem, quantity: newQty };
    setBuyNowItem(updated);
    try {
      sessionStorage.setItem('srirama_buy_now', JSON.stringify(updated));
    } catch (e) {}
  };

  const finishOrder = (orderNumber: string) => {
    if (isBuyNow) {
      try {
        sessionStorage.removeItem('srirama_buy_now');
      } catch (e) {}
    } else {
      clearCart();
    }
    router.push(`/order-success/${orderNumber}`);
  };

  const [step, setStep] = useState<CheckoutStep>('phone');
  const [loading, setLoading] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);

  // Form State
  const isCustomer = user && user.role !== 'admin';
  const [phone, setPhone] = useState(isCustomer ? (user?.phone || '') : '');
  const [sendUpdates, setSendUpdates] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<IUserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);

  const [addressData, setAddressData] = useState({
    pincode: '',
    city: '',
    state: '',
    street: '',
    landmark: '',
    fullName: isCustomer ? (user?.name || '') : '',
    email: isCustomer ? (user?.email || '') : '',
    phone: isCustomer ? (user?.phone || '') : '',
    addressType: 'Home' as 'Home' | 'Work',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NETBANKING'>('COD');
  const [activeOffers, setActiveOffers] = useState<Array<{ code: string; discountValue: number; discountType: string }>>([]);

  // Fetch saved addresses from server (by customer phone or customer account)
  const loadAddresses = async (phoneNumber?: string) => {
    try {
      const activePhone = phoneNumber || phone || (isCustomer ? user?.phone : '') || '';
      const cleanPhone = activePhone.replace(/\D/g, '');
      const queryParam = cleanPhone.length >= 10 ? `?phone=${cleanPhone}` : '';
      const res = await fetch(`/api/user/addresses${queryParam}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.addresses) && data.addresses.length > 0) {
        setSavedAddresses(data.addresses);
        const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
        const addrId = defaultAddr._id || (defaultAddr as any).id || 'addr_0';
        setSelectedAddressId(addrId);
        setAddressData({
          pincode: defaultAddr.pincode,
          city: defaultAddr.city,
          state: defaultAddr.state,
          street: defaultAddr.street,
          landmark: defaultAddr.landmark || '',
          fullName: defaultAddr.name || (isCustomer ? user?.name : '') || '',
          email: defaultAddr.email || (isCustomer ? user?.email : '') || '',
          phone: defaultAddr.phone || cleanPhone || (isCustomer ? user?.phone : '') || '',
          addressType: (defaultAddr.addressType as 'Home' | 'Work') || 'Home',
        });
        setPincodeVerified(true);
        setIsAddingNewAddress(false);
        return data.addresses;
      } else {
        setSavedAddresses([]);
        setIsAddingNewAddress(true);
        return [];
      }
    } catch (e) {
      console.error('Failed to load saved addresses:', e);
      return [];
    }
  };

  // Fetch active coupons & initial saved addresses
  useEffect(() => {
    fetch('/api/coupons/active')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.coupons)) {
          setActiveOffers(data.coupons);
        }
      })
      .catch(() => {});

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // If customer already logged in with phone, auto-advance to address step and prefill
  useEffect(() => {
    if (isCustomer && user?.phone) {
      setPhone(user.phone);
      setStep('address');
    }
    if (isCustomer && user?.name && !addressData.fullName) {
      setAddressData((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle selecting an existing saved address (1-click select like Meesho)
  const handleSelectSavedAddress = (addr: IUserAddress) => {
    const addrId = addr._id || (addr as any).id || '';
    setSelectedAddressId(addrId);
    setIsAddingNewAddress(false);
    setAddressData({
      pincode: addr.pincode,
      city: addr.city,
      state: addr.state,
      street: addr.street,
      landmark: addr.landmark || '',
      fullName: addr.name || user?.name || '',
      email: user?.email || addressData.email,
      phone: addr.phone || user?.phone || phone,
      addressType: (addr.addressType as 'Home' | 'Work') || 'Home',
    });
    setPincodeVerified(true);
  };

  // Handle Automatic Pincode Lookup
  const handlePincodeChange = async (val: string) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setAddressData((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      setIsPincodeLoading(true);
      setPincodeVerified(false);
      try {
        const res = await fetch(`/api/pincode/${cleanPin}`);
        const data = await res.json();
        if (data.success && data.city && data.state) {
          setAddressData((prev) => ({
            ...prev,
            city: data.city,
            state: data.state,
          }));
          setPincodeVerified(true);
          success(`Delivery verified for ${data.city}, ${data.state}`);
        } else {
          setPincodeVerified(false);
          info('Could not auto-detect city. Please enter city and state manually.');
        }
      } catch (err) {
        console.error('Failed to lookup pincode:', err);
      } finally {
        setIsPincodeLoading(false);
      }
    } else {
      setPincodeVerified(false);
    }
  };

  // Step 1 -> Step 2 (Look up repeat order addresses for this phone number)
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneCheck = validatePhone(cleanPhone);
    if (!phoneCheck.isValid) { error(phoneCheck.errorMessage!); return; }

    const addrs = await loadAddresses(cleanPhone);
    if (!addrs || addrs.length === 0) {
      setIsAddingNewAddress(true);
      setAddressData((prev) => ({
        ...prev,
        phone: cleanPhone,
        fullName: prev.fullName || user?.name || '',
        email: prev.email || user?.email || '',
      }));
    } else {
      setIsAddingNewAddress(false);
    }

    setStep('address');
  };

  // Step 2 -> Step 3 (Save new address and proceed)
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pincodeCheck = validatePostalCode(addressData.pincode);
    if (!pincodeCheck.isValid) { error(pincodeCheck.errorMessage!); return; }
    const streetCheck = validateAddress(addressData.street);
    if (!streetCheck.isValid) { error(streetCheck.errorMessage!); return; }
    if (!addressData.city || !addressData.state) {
      error('Please enter city and state');
      return;
    }
    const nameCheck = validateName(addressData.fullName);
    if (!nameCheck.isValid) { error(nameCheck.errorMessage!); return; }
    const emailCheck = validateEmail(addressData.email);
    if (!emailCheck.isValid) { error(emailCheck.errorMessage!); return; }

    // If saving address for future orders
    if (saveNewAddress) {
      try {
        await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: addressData.fullName,
            phone: addressData.phone || phone,
            addressType: addressData.addressType,
            street: addressData.street,
            landmark: addressData.landmark,
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            isDefault: savedAddresses.length === 0,
          }),
        });
      } catch (err) {
        // Silently continue to payment
      }
    }

    setStep('payment');
  };

  // Step 3 -> Place Order
  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      error(isBuyNow ? 'No product selected for instant checkout' : 'Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const customerName = (addressData.fullName || (isCustomer ? user?.name : '') || 'Customer').trim();
      const customerPhone = (addressData.phone || phone || (isCustomer ? user?.phone : '') || '').trim();
      const customerEmail = (
        addressData.email ||
        (isCustomer ? user?.email : '') ||
        (customerPhone ? `${customerPhone.replace(/\D/g, '')}@sriramacycles.com` : '')
      ).trim();

      const orderPayload = {
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        shippingAddress: {
          name: (addressData.fullName || customerName).trim(),
          phone: (addressData.phone || customerPhone).trim(),
          addressType: addressData.addressType || 'Home',
          street: addressData.street.trim(),
          landmark: addressData.landmark || '',
          city: addressData.city.trim(),
          state: addressData.state.trim(),
          pincode: addressData.pincode.trim(),
          country: 'India',
        },
        items: checkoutItems,
        paymentMethod: paymentMethod,
        notes: sendUpdates ? 'Subscribed to WhatsApp order updates' : '',
        couponCode: activeCoupon || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success) {
        const targetOrderNumber = data.order?.orderNumber || data.orderNumber;
        const targetAmount = data.order?.pricing?.total || checkoutTotal;

        // 1. If Cash on Delivery, complete immediately
        if (paymentMethod === 'COD') {
          success('Order placed successfully! Redirecting...');
          finishOrder(targetOrderNumber);
          return;
        }

        // 2. If Online Payment (UPI / Card / Net Banking), initiate Razorpay
        info('Connecting to secure payment gateway...');
        const rzpOrderRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber: targetOrderNumber,
            amount: targetAmount,
            customer: orderPayload.customer,
          }),
        });

        const rzpData = await rzpOrderRes.json();

        if (rzpData.success && rzpData.isLiveGateway) {
          // Dynamic script loader for Razorpay checkout.js
          const loadScript = () =>
            new Promise<boolean>((resolve) => {
              if ((window as any).Razorpay) return resolve(true);
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.onload = () => resolve(true);
              script.onerror = () => resolve(false);
              document.body.appendChild(script);
            });

          const loaded = await loadScript();
          if (!loaded) {
            error('Failed to load Razorpay payment SDK. Please try again.');
            setLoading(false);
            return;
          }

          const options = {
            key: rzpData.keyId,
            amount: rzpData.amount,
            currency: rzpData.currency || 'INR',
            name: 'Sri Rama Cycle & Auto Spare Parts',
            description: `Order #${targetOrderNumber}`,
            image: '/favicon.svg',
            order_id: rzpData.orderId,
            prefill: {
              name: customerName,
              contact: customerPhone,
              email: customerEmail,
            },
            theme: {
              color: '#dc2626',
            },
            handler: async function (response: any) {
              try {
                const verifyRes = await fetch('/api/payment/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderNumber: targetOrderNumber,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                  success('Payment verified successfully! Redirecting...');
                  finishOrder(targetOrderNumber);
                } else {
                  error(verifyData.message || 'Payment verification failed');
                  router.push(`/order-success/${targetOrderNumber}`);
                }
              } catch (vErr) {
                error('Payment verification request failed');
                router.push(`/order-success/${targetOrderNumber}`);
              }
            },
            modal: {
              ondismiss: function () {
                info('Payment window was closed. Your order was created as Pending.');
                router.push(`/order-success/${targetOrderNumber}`);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        } else {
          // Demo / Test Mode fallback
          info('Online Payment Architecture Ready. Completing test verification...');
          await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderNumber: targetOrderNumber,
              isDemoMode: true,
            }),
          });
          success('Online payment confirmed! Redirecting...');
          finishOrder(targetOrderNumber);
          return;
        }
      } else {
        error(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      error('An unexpected error occurred while placing order');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCouponCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (isBuyNow) {
      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: cleanCode, cartSubtotal: checkoutSubtotal }),
        });
        const data = await res.json();
        if (data.success && data.coupon) {
          setBuyNowCoupon(data.coupon.code);
          const disc =
            data.coupon.discountType === 'percentage'
              ? Math.round((checkoutSubtotal * data.coupon.discountValue) / 100)
              : data.coupon.discountAmount;
          setBuyNowDiscount(disc);
          success(data.message || `Coupon ${data.coupon.code} applied!`);
          setCouponCodeInput('');
        } else if (cleanCode === 'RIDE10') {
          setBuyNowCoupon('RIDE10');
          setBuyNowDiscount(Math.round(checkoutSubtotal * 0.1));
          success('Coupon RIDE10 applied: 10% Off!');
          setCouponCodeInput('');
        } else if (cleanCode === 'SRIRAMA15') {
          setBuyNowCoupon('SRIRAMA15');
          setBuyNowDiscount(Math.round(checkoutSubtotal * 0.15));
          success('Coupon SRIRAMA15 applied: 15% Off!');
          setCouponCodeInput('');
        } else if (cleanCode === 'WELCOME5') {
          setBuyNowCoupon('WELCOME5');
          setBuyNowDiscount(Math.round(checkoutSubtotal * 0.05));
          success('Coupon WELCOME5 applied: 5% Off!');
          setCouponCodeInput('');
        } else {
          error(data.message || 'Invalid coupon code');
        }
      } catch (err) {
        error('Failed to validate coupon code');
      }
    } else {
      const applied = await applyCoupon(cleanCode);
      if (applied) {
        setCouponCodeInput('');
      }
    }
  };

  const handleRemoveCoupon = () => {
    if (isBuyNow) {
      setBuyNowCoupon(null);
      setBuyNowDiscount(0);
      info('Coupon removed');
    } else {
      removeCoupon();
    }
  };

  if (isClientLoaded && checkoutItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 text-center shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4 border border-brand-200">
            <Bike className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isBuyNow ? 'No Product Selected for Instant Purchase' : 'Your Cart is Empty'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {isBuyNow
              ? 'Please select a cycle and click "Instant Buy Now" to proceed.'
              : 'Add cycles or accessories to your cart to proceed with fast checkout.'}
          </p>
          <Link
            href="/shop"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-xs"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 sm:py-10 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col">
        
        {/* Top Fast-Checkout Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            {step !== 'phone' ? (
              <button
                onClick={() => setStep(step === 'payment' ? 'address' : 'phone')}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/shop"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="Back to Shop"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
                SRI RAMA <span className="text-brand-600">CYCLES</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full">
            <span>100% Secured</span>
            <Lock className="w-3 h-3 text-emerald-600" />
          </div>
        </div>

        {/* Scrollable Main Flow Container */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          
          {/* Order Summary Accordion Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 transition-all">
            <button
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">Order Summary</h3>
                    {isBuyNow && (
                      <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                        ⚡ Instant Buy Now
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {checkoutItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} item(s){' '}
                    {isBuyNow ? '(Selected Product Only)' : 'in cart'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">{formatPrice(checkoutTotal)}</span>
                {isOrderSummaryOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {/* Collapsible Item Details */}
            {isOrderSummaryOpen && (
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-col gap-3 animate-in fade-in duration-150">
                {checkoutItems.map((item, idx) => {
                  const unitPrice =
                    item.product?.salePrice && item.product.salePrice > 0
                      ? item.product.salePrice
                      : (item.product?.price || item.price || 0);
                  const itemImg =
                    item.image ||
                    item.product?.images?.[0] ||
                    '/images/products/gang-linear-ibc-main.png';
                  const color = item.selectedColor || item.variant?.color;
                  const size = item.selectedSize || item.variant?.size;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 p-0.5 flex items-center justify-center">
                          <Image
                            src={itemImg}
                            alt={item.product?.name || item.name || 'Cycle'}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{item.product?.name || item.name}</p>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {color && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                {color}
                              </span>
                            )}
                            {size && (
                              <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-full">
                                {size}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-slate-900 mt-0.5">{formatPrice(unitPrice)} each</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              isBuyNow
                                ? handleUpdateBuyNowQty((item.quantity || 1) - 1)
                                : updateQuantity(
                                    item.product._id,
                                    item.quantity - 1,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-700 font-bold transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              isBuyNow
                                ? handleUpdateBuyNowQty((item.quantity || 1) + 1)
                                : updateQuantity(
                                    item.product._id,
                                    item.quantity + 1,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-700 font-bold transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Total price for item */}
                        <span className="font-black text-slate-900 text-xs min-w-[70px] text-right">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() =>
                            isBuyNow
                              ? handleUpdateBuyNowQty(0)
                              : removeFromCart(
                                  item.product._id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label="Remove item"
                          title="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(checkoutSubtotal)}</span>
                  </div>
                  {checkoutDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(checkoutDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-bold">
                      {checkoutShipping === 0 ? 'FREE' : formatPrice(checkoutShipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Estimated Delivery</span>
                    <span>5 Working Days</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 text-xs">
                    <span>Total Amount</span>
                    <span>{formatPrice(checkoutTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
            {activeCoupon ? (
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Code: {activeCoupon} applied (-{formatPrice(checkoutDiscount)})
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-rose-600 font-bold text-[11px] hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <form onSubmit={handleApplyCouponCode} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {/* Available Offers Chips */}
                {activeOffers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Offers:</span>
                    {activeOffers.map((offer) => (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => applyCoupon(offer.code)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-50 border border-brand-200/80 text-brand-700 hover:bg-brand-100 hover:border-brand-300 px-2 py-0.5 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-brand-600" />
                        <span>{offer.code}</span>
                        <span className="text-slate-500 font-normal">
                          ({offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: Fast Mobile Login */}
          {/* ========================================================================= */}
          {step === 'phone' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Login to continue</h2>
                  <p className="text-[11px] text-slate-500">Fast 1-click checkout with your mobile number</p>
                </div>
              </div>

              <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1 text-xs font-bold text-slate-700 select-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                      <span className="text-slate-300 ml-1">|</span>
                    </div>
                    <input
                      type="tel"
                      required
                      autoFocus
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-3 pl-20 pr-4 text-sm font-semibold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendUpdates}
                    onChange={(e) => setSendUpdates(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 accent-brand-600"
                  />
                  <span>Send me order updates & delivery tracking (no spam)</span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all active:scale-98"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Address Selection / Entry (Meesho-style 1-click checkout) */}
          {/* ========================================================================= */}
          {step === 'address' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {savedAddresses.length > 0 && !isAddingNewAddress
                      ? 'Select Delivery Address'
                      : 'Add New Delivery Address'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {savedAddresses.length > 0 && !isAddingNewAddress
                      ? 'Select address or add new for delivery'
                      : 'Enter delivery location and recipient details'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {/* MEESHO-STYLE: If Customer has saved addresses from 1st order or account */}
              {savedAddresses.length > 0 && !isAddingNewAddress ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2.5">
                    {savedAddresses.map((addr) => {
                      const addrId = addr._id || (addr as any).id;
                      const isSelected = selectedAddressId === addrId;
                      return (
                        <div
                          key={addrId}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 relative ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50/25 shadow-xs ring-1 ring-brand-500/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <input
                                type="radio"
                                name="savedAddress"
                                checked={isSelected}
                                onChange={() => handleSelectSavedAddress(addr)}
                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
                              />
                              <span className="font-bold text-xs text-slate-900">
                                {addr.name || user?.name || 'Customer'}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                                {addr.addressType || 'Home'}
                              </span>
                            </div>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="pl-6 text-[11px] text-slate-600 leading-relaxed">
                            <p className="line-clamp-2">
                              {addr.street}
                              {addr.landmark ? `, ${addr.landmark}` : ''}
                            </p>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {addr.city}, {addr.state} - <span className="font-bold text-slate-900">{addr.pincode}</span>
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">
                              Mobile: <span className="font-semibold text-slate-700">{addr.phone || user?.phone || phone}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* + Add New Address Button (Meesho Style) */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setSelectedAddressId('new');
                      setAddressData({
                        pincode: '',
                        city: '',
                        state: '',
                        street: '',
                        landmark: '',
                        fullName: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || phone,
                        addressType: 'Home',
                      });
                      setPincodeVerified(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl border border-dashed border-brand-400 bg-brand-50/30 hover:bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-brand-600" />
                    <span>+ Add New Address</span>
                  </button>

                  {/* Shipping Method Card */}
                  <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Doorstep Insured Delivery</p>
                        <p className="text-[10px] text-emerald-700">95% Assembled with hex tool kit</p>
                      </div>
                    </div>
                    <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      FREE
                    </span>
                  </div>

                  {/* Direct 1-Click Deliver To This Address CTA */}
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all active:scale-98 mt-1"
                  >
                    <span>Deliver to this Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* New Address Input Form (First order OR "+ Add New Address" clicked) */
                <div>
                  {savedAddresses.length > 0 && (
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewAddress(false);
                          if (savedAddresses.length > 0) {
                            handleSelectSavedAddress(savedAddresses[0]);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>← Back to Saved Addresses</span>
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleAddressSubmit} className="flex flex-col gap-3.5 pt-1">
                    {/* Pincode with Auto-fill */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Delivery Pincode *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressData.pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder="6-digit PIN code"
                          className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
                        />
                        {isPincodeLoading && (
                          <div className="absolute right-3 top-2.5">
                            <LoadingSpinner size="sm" />
                          </div>
                        )}
                        {pincodeVerified && (
                          <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* City and State (Auto-populated) */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          City / District *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressData.city}
                          onChange={(e) => setAddressData((p) => ({ ...p, city: e.target.value }))}
                          placeholder="City"
                          className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressData.state}
                          onChange={(e) => setAddressData((p) => ({ ...p, state: e.target.value }))}
                          placeholder="State"
                          className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Full Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Address (House No, Building, Street, Area, Landmark) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={addressData.street}
                        onChange={(e) => setAddressData((p) => ({ ...p, street: e.target.value }))}
                        placeholder="House No., Building, Street, Area, Landmark"
                        className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Customer / Recipient Information */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900">Delivery Recipient Information</h3>
                        <span className="text-[10px] text-slate-400">(Person receiving parcel)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Recipient Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressData.fullName}
                            onChange={(e) => setAddressData((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="Recipient Full Name"
                            className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Recipient Mobile Number *
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 flex items-center gap-1 text-[11px] font-bold text-slate-700 select-none">
                              <span>+91</span>
                              <span className="text-slate-300 ml-0.5">|</span>
                            </div>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={addressData.phone}
                              onChange={(e) =>
                                setAddressData((p) => ({
                                  ...p,
                                  phone: e.target.value.replace(/\D/g, ''),
                                }))
                              }
                              placeholder="10-digit mobile"
                              className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2 pl-14 pr-3 text-xs text-slate-900 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Order Updates Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={addressData.email}
                          onChange={(e) => setAddressData((p) => ({ ...p, email: e.target.value }))}
                          placeholder="Email for invoices & tracking"
                          className="w-full bg-slate-50/70 border border-slate-300 focus:border-brand-600 focus:bg-white rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Save Address As */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Save Address As
                      </label>
                      <div className="flex gap-2">
                        {(['Home', 'Work'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAddressData((p) => ({ ...p, addressType: type }))}
                            className={`py-1.5 px-4 rounded-xl text-xs font-bold border transition-colors ${
                              addressData.addressType === type
                                ? 'bg-brand-50 border-brand-600 text-brand-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auto-Save Checkbox */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>Save this address to my account for future orders</span>
                    </label>

                    {/* Shipping Method Card */}
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">Doorstep Insured Delivery</p>
                          <p className="text-[10px] text-emerald-700">95% Assembled with hex tool kit</p>
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all active:scale-98 mt-1"
                    >
                      <span>Save Address & Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: Payment Method & Place Order */}
          {/* ========================================================================= */}
          {step === 'payment' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Select Payment Method</h2>
                  <p className="text-[11px] text-slate-500">All transactions are encrypted and safe</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Address Quick Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{addressData.fullName} • {phone}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {addressData.street}, {addressData.city}, {addressData.state} - {addressData.pincode}
                  </p>
                </div>
                <button
                  onClick={() => setStep('address')}
                  className="text-brand-600 font-bold text-[11px] hover:underline shrink-0 ml-2"
                >
                  Edit
                </button>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-2.5">
                {/* COD Option */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500">Pay via cash or UPI upon delivery</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-brand-600 accent-brand-600"
                  />
                </label>

                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Instant UPI QR / GPay / PhonePe</p>
                      <p className="text-[11px] text-slate-500">Zero surcharge, instantaneous order confirmation</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="w-4 h-4 text-brand-600 accent-brand-600"
                  />
                </label>

                {/* Card / NetBanking */}
                <label
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Credit / Debit Card / Net Banking</p>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay & all major Indian banks</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="w-4 h-4 text-brand-600 accent-brand-600"
                  />
                </label>
              </div>

              {/* Delivery Timeframe Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3 text-xs">
                <Truck className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950">Insured Delivery Timeframe: 5 Working Days</h4>
                  <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                    Your cycle & spares will be assembled, pre-tuned, and delivered to your doorstep within 5 working days.
                  </p>
                </div>
              </div>

              {/* Final Submit Place Order */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all active:scale-98 mt-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order • {formatPrice(checkoutTotal)}</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Official store guarantee • Sri Rama Cycle and Auto Spare Parts, Kazipet, Hanumakonda
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
