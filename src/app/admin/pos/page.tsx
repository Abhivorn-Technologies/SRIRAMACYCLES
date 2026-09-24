'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  CreditCard,
  QrCode,
  Banknote,
  Percent,
  CheckCircle2,
  Printer,
  Sparkles,
  History,
  X,
  Package,
  Wrench,
  RotateCcw,
  ArrowRight,
  Send,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import POSReceiptModal from '@/components/admin/POSReceiptModal';
import { IProduct, ICategory } from '@/types';
import { validateName, validatePhone } from '@/lib/validations';

interface IPOSCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  image?: string;
  sku?: string;
  isCustom?: boolean;
}

export default function AdminPOSBillingPage() {
  const { success, error, info } = useToast();

  // Data states
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Catalog Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Cart & Bill State
  const [cart, setCart] = useState<IPOSCartItem[]>([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    isExisting: false,
  });
  const [customerErrors, setCustomerErrors] = useState<{ phone?: string; name?: string }>({});

  // Discount & Tax State
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Payment State
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Split'>('Cash');
  const [cashReceived, setCashReceived] = useState<string>('');

  // Modals & Drawers
  const [isCustomItemModalOpen, setIsCustomItemModalOpen] = useState(false);
  const [customItemForm, setCustomItemForm] = useState({ name: '', price: '' });
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [posHistory, setPosHistory] = useState<any[]>([]);
  const [todaySummary, setTodaySummary] = useState<any>(null);

  // Fetch products and categories on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [prodRes, catRes, posStatsRes] = await Promise.all([
          fetch('/api/products?limit=200'),
          fetch('/api/categories'),
          fetch('/api/admin/pos'),
        ]);

        const [prodData, catData, posData] = await Promise.all([
          prodRes.json(),
          catRes.json(),
          posStatsRes.json(),
        ]);

        if (prodData.success) setProducts(prodData.products || []);
        if (catData.success) setCategories(catData.categories || []);
        if (posData.success) {
          setPosHistory(posData.orders || []);
          setTodaySummary(posData.todaySummary || null);
        }
      } catch (err) {
        error('Failed to load POS catalog data');
      } finally {
        setLoading(false);
        searchInputRef.current?.focus();
      }
    }
    loadInitialData();
  }, [error]);

  // Customer phone lookup
  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setCustomer((p) => ({ ...p, phone: rawVal }));
    setCustomerErrors((p) => ({ ...p, phone: undefined }));

    const cleanPhone = rawVal.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 10) {
      try {
        const res = await fetch(`/api/admin/pos/customer-lookup?phone=${cleanPhone}`);
        const data = await res.json();
        if (data.success && data.customers && data.customers.length > 0) {
          const match = data.customers[0];
          setCustomer({
            name: match.name || '',
            phone: match.phone || cleanPhone,
            email: match.email || '',
            isExisting: true,
          });
          setCustomerErrors({});
          info(`Recognized Customer: ${match.name}`);
        }
      } catch (err) {
        // quiet fallback
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setCustomer((p) => ({ ...p, name: rawVal }));
    setCustomerErrors((p) => ({ ...p, name: undefined }));
  };

  // Add catalog item to cart
  const addToCart = (product: IProduct) => {
    if (product.stock <= 0) {
      error(`"${product.name}" is out of stock!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          error(`Cannot exceed in-stock quantity (${product.stock})`);
          return prev;
        }
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.salePrice || product.price,
          quantity: 1,
          stock: product.stock,
          image: product.images?.[0] || '/images/placeholder-bike.png',
          sku: product.sku,
          isCustom: false,
        },
      ];
    });
  };

  // Add custom service charge / workshop repair item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customItemForm.price);
    if (!customItemForm.name.trim() || isNaN(priceNum) || priceNum <= 0) {
      error('Please enter a valid item/service name and amount');
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        productId: `custom-${Date.now()}`,
        name: customItemForm.name.trim(),
        price: priceNum,
        quantity: 1,
        isCustom: true,
      },
    ]);

    setCustomItemForm({ name: '', price: '' });
    setIsCustomItemModalOpen(false);
    success('Service / Custom item added to bill');
  };

  // Quantity updates
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (item.stock && newQty > item.stock) {
              error(`Maximum available stock is ${item.stock}`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as IPOSCartItem[]
    );
  };

  // Remove single item
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Clear bill
  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (confirm('Clear current items from the billing counter?')) {
      setCart([]);
      setDiscountValue(0);
      setCashReceived('');
      setCustomer({ name: '', phone: '', email: '', isExisting: false });
    }
  };

  // Pricing calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!discountValue || discountValue <= 0) return 0;
    if (discountType === 'percent') {
      return Math.round((subtotal * Math.min(discountValue, 100)) / 100);
    }
    return Math.min(discountValue, subtotal);
  }, [subtotal, discountValue, discountType]);

  const netTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const changeToReturn = useMemo(() => {
    const rec = parseFloat(cashReceived) || 0;
    return Math.max(0, rec - netTotal);
  }, [cashReceived, netTotal]);

  // Filtered Catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (typeof p.category === 'object'
          ? (p.category as any)?._id === selectedCategory || (p.category as any)?.slug === selectedCategory
          : p.category === selectedCategory);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Complete POS Sale
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      error('Please add at least one item to generate bill');
      return;
    }

    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const cleanName = customer.name.trim();

    const phoneCheck = validatePhone(cleanPhone);
    if (!phoneCheck.isValid) {
      setCustomerErrors((p) => ({ ...p, phone: phoneCheck.errorMessage! }));
      phoneInputRef.current?.focus();
      error(phoneCheck.errorMessage!);
      return;
    }

    const nameCheck = validateName(cleanName);
    if (!nameCheck.isValid) {
      setCustomerErrors((p) => ({ ...p, name: nameCheck.errorMessage! }));
      nameInputRef.current?.focus();
      error(nameCheck.errorMessage!);
      return;
    }

    if (paymentMode === 'Cash') {
      const rec = parseFloat(cashReceived) || 0;
      if (rec > 0 && rec < netTotal) {
        error(`Cash received (₹${rec}) is less than Net Payable (₹${netTotal})`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: cleanName,
          phone: cleanPhone,
          email: '', // Never auto-inject fake/dummy email for offline walk-in POS
        },
        items: cart.map((item) => ({
          productId: item.productId.startsWith('custom-') ? 'custom-service' : item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        pricing: {
          subtotal,
          tax: 0, // Included in pricing
          discount: discountAmount,
          total: netTotal,
        },
        paymentMode,
        cashReceived: parseFloat(cashReceived) || netTotal,
        changeReturned: changeToReturn,
        customDiscount: discountAmount,
        notes,
      };

      const res = await fetch('/api/admin/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        success(`Sale completed! Invoice #${data.receipt.invoiceNumber}`);
        setReceiptData(data.receipt);

        // Update local POS stats
        setPosHistory((prev) => [data.order, ...prev]);
        if (todaySummary) {
          setTodaySummary((prev: any) => ({
            ...prev,
            todaySalesCount: (prev.todaySalesCount || 0) + 1,
            todayTotalRevenue: (prev.todayTotalRevenue || 0) + netTotal,
          }));
        }

        // Deduct inventory from local product list
        setProducts((prev) =>
          prev.map((p) => {
            const bought = cart.find((i) => i.productId === p._id);
            if (bought) {
              return { ...p, stock: Math.max(0, p.stock - bought.quantity) };
            }
            return p;
          })
        );
      } else {
        error(data.message || 'Failed to complete POS sale');
      }
    } catch (err) {
      error('An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNextSale = () => {
    setReceiptData(null);
    setCart([]);
    setDiscountValue(0);
    setCashReceived('');
    setNotes('');
    setCustomer({ name: '', phone: '', email: '', isExisting: false });
    searchInputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto pb-12">
      {/* Top Banner & Quick Metrics */}
      {/* Sleek Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:px-6 sm:py-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>In-Store Billing Terminal</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Counter Live</span>
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 font-medium">
              Walk-in Customer Billing, Barcode Scanning & Instant Thermal Receipts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {todaySummary && (
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold text-[11px]">Today:</span>
              <span className="font-black text-emerald-700 font-mono">
                {formatPrice(todaySummary.todayTotalRevenue || 0)}
              </span>
              <span className="text-[10px] text-slate-400">({todaySummary.todaySalesCount || 0})</span>
            </div>
          )}

          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <History className="w-3.5 h-3.5 text-brand-400" />
            <span>Recent Bills ({posHistory.length})</span>
          </button>

          <Link
            href="/admin/orders?channel=POS"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100/80 border border-brand-200 text-brand-700 text-xs font-bold shadow-2xs transition-colors"
          >
            <span>All Counter Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Dual-Pane POS Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Product Selector & Barcode Scan (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Search & Scan Input */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan Barcode or Search SKU, Bike Name, Auto Part..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Service Charge Shortcut */}
            <button
              onClick={() => setIsCustomItemModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Workshop Service</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat._id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const inCart = cart.find((i) => i.productId === p._id);
                const isOutOfStock = p.stock <= 0;

                return (
                  <button
                    key={p._id}
                    onClick={() => addToCart(p)}
                    disabled={isOutOfStock}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all relative group ${
                      isOutOfStock
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : inCart
                          ? 'bg-brand-50/40 border-brand-400 shadow-sm ring-1 ring-brand-300'
                          : 'bg-white border-slate-200/80 hover:border-brand-300 hover:shadow-md'
                    }`}
                  >
                    {/* Image & Badges */}
                    <div className="relative w-full aspect-square rounded-xl bg-slate-50 overflow-hidden mb-1 flex items-center justify-center">
                      <Image
                        src={p.images?.[0] || '/images/placeholder-bike.png'}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                      />
                      {inCart && (
                        <span className="absolute top-1.5 right-1.5 bg-brand-700 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                          {inCart.quantity}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        SKU: {p.sku || 'N/A'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-900">
                        {formatPrice(p.salePrice || p.price)}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700'
                            : p.stock <= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {isOutOfStock ? 'Sold Out' : `${p.stock} in stock`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No products match your search or filter.
            </div>
          )}
        </div>

        {/* RIGHT PANE: Live Bill & Checkout (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-lg p-5 sm:p-6 flex flex-col gap-5 sticky top-4">
          {/* Customer Details Header (Mandatory for Invoice) */}
          <div
            className={`p-4 rounded-2xl transition-all ${
              customerErrors.phone || customerErrors.name
                ? 'bg-rose-50/70 border-2 border-rose-300 ring-2 ring-rose-100 shadow-xs'
                : 'bg-slate-50 border border-slate-200/90'
            } flex flex-col gap-2.5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-700" />
                <span>Customer Details <span className="text-rose-500">*</span></span>
              </span>
              {customer.isExisting ? (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Existing Member</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">
                  Walk-in Buyer
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {/* Phone Input with Inline Validation */}
              <div className="relative flex-1">
                <Phone
                  className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    customerErrors.phone ? 'text-rose-500' : 'text-slate-400'
                  }`}
                />
                <input
                  ref={phoneInputRef}
                  type="tel"
                  required
                  maxLength={10}
                  value={customer.phone}
                  onChange={handlePhoneChange}
                  placeholder="Mobile (10 digits) *"
                  className={`w-full bg-white border rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none transition-all ${
                    customerErrors.phone
                      ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 text-rose-900 placeholder:text-rose-300'
                      : customer.phone && customer.phone.replace(/[^0-9]/g, '').length < 10
                        ? 'border-amber-300 ring-1 ring-amber-200'
                        : 'border-slate-200 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                />
              </div>

              {/* Name Input with Inline Validation */}
              <div className="w-full sm:w-44">
                <input
                  ref={nameInputRef}
                  type="text"
                  required
                  value={customer.name}
                  onChange={handleNameChange}
                  placeholder="Customer Name *"
                  className={`w-full bg-white border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none transition-all ${
                    customerErrors.name
                      ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 text-rose-900 placeholder:text-rose-300'
                      : 'border-slate-200 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                />
              </div>
            </div>

            {/* Inline Error Messages */}
            {(customerErrors.phone || customerErrors.name) ? (
              <div className="flex flex-col gap-1 bg-rose-100/70 text-rose-800 p-2 rounded-xl text-[11px] font-bold border border-rose-200">
                {customerErrors.phone && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>{customerErrors.phone}</span>
                  </span>
                )}
                {customerErrors.name && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>{customerErrors.name}</span>
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">
                Name and 10-digit mobile number are required to generate and print invoice.
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-brand-700" />
                <span>Bill Items ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
              </span>
              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 px-2 py-0.5 rounded-md hover:bg-rose-50 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {cart.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col gap-2 text-xs shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    {/* Top Row: Title & Remove */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h5 className="font-bold text-slate-900 leading-snug break-words">
                          {item.name}
                        </h5>
                        {item.sku && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Row: Unit Price x Qty Stepper = Total */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium text-[11px]">
                        {formatPrice(item.price)} each
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-black text-slate-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-1.5">
                <ShoppingCart className="w-6 h-6 text-slate-300" />
                <span>Select items from catalog on the left to start bill</span>
              </div>
            )}
          </div>

          {/* Discount & Calculations */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2 text-xs">
            {/* Discount Inputs */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 font-bold">Counter Discount:</span>
              <div className="flex items-center gap-1">
                <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 text-[10px] font-bold">
                  <button
                    onClick={() => setDiscountType('flat')}
                    className={`px-2 py-0.5 rounded ${discountType === 'flat' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                  >
                    ₹
                  </button>
                  <button
                    onClick={() => setDiscountType('percent')}
                    className={`px-2 py-0.5 rounded ${discountType === 'percent' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                  >
                    %
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-right focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-col gap-1 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Net Amount:</span>
                <span className="text-brand-700 text-base">{formatPrice(netTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  paymentMode === 'Cash'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  paymentMode === 'UPI'
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('Card')}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  paymentMode === 'Card'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card (POS)</span>
              </button>
            </div>

            {/* Cash Received calculator */}
            {paymentMode === 'Cash' && (
              <div className="mt-1 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-900">Cash Received from Customer:</label>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder={`₹${netTotal}`}
                    className="w-28 bg-white border border-emerald-300 rounded-lg px-2.5 py-1 font-black text-right text-xs focus:outline-none"
                  />
                </div>
                {parseFloat(cashReceived) > 0 && (
                  <div className="flex justify-between font-black text-xs pt-1 border-t border-emerald-200 text-emerald-800">
                    <span>Change to Return:</span>
                    <span>{formatPrice(changeToReturn)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Inline Validation Warning Banner if Errors Exist */}
          {(customerErrors.phone || customerErrors.name) && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-bold">
                Please provide customer phone and name in the section above before generating bill.
              </span>
            </div>
          )}

          {/* Primary Checkout Button */}
          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>Complete Sale & Print Bill ({formatPrice(netTotal)})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal: Add Custom Service / Repair Item */}
      {isCustomItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Add Workshop / Custom Item</h3>
              </div>
              <button
                onClick={() => setIsCustomItemModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service / Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={customItemForm.name}
                  onChange={(e) => setCustomItemForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Gear Tuning & Oiling Service"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={customItemForm.price}
                  onChange={(e) => setCustomItemForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="e.g. 250"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomItemModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
                >
                  Add to Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer: Counter Sales History */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>Recent Counter Bills</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {posHistory.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Quick reprints from counter terminal</p>
                </div>
                <button
                  onClick={() => {
                    setIsHistoryDrawerOpen(false);
                    setDrawerSearch('');
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search inside Drawer */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Bill #, Customer Name, Phone..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                {drawerSearch && (
                  <button
                    onClick={() => setDrawerSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Drawer List */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {(() => {
                const filteredHistory = posHistory.filter((ord) => {
                  if (!drawerSearch.trim()) return true;
                  const q = drawerSearch.toLowerCase().trim();
                  return (
                    ord.orderNumber?.toLowerCase().includes(q) ||
                    ord.posDetails?.gstInvoiceNumber?.toLowerCase().includes(q) ||
                    ord.customer?.name?.toLowerCase().includes(q) ||
                    ord.customer?.phone?.includes(q)
                  );
                });

                if (filteredHistory.length === 0) {
                  return (
                    <div className="text-center py-12 flex flex-col items-center gap-2">
                      <Receipt className="w-8 h-8 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-500">
                        {drawerSearch ? 'No matching bills found' : 'No counter bills generated yet.'}
                      </p>
                      {drawerSearch && (
                        <button
                          onClick={() => setDrawerSearch('')}
                          className="text-xs font-bold text-brand-600 hover:underline mt-1"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  );
                }

                return filteredHistory.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col gap-2 hover:border-brand-300 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">
                        {ord.posDetails?.gstInvoiceNumber || ord.orderNumber}
                      </span>
                      <span className="font-black text-brand-700 font-mono">
                        {formatPrice(ord.pricing?.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span className="font-semibold text-slate-700">{ord.customer?.name || 'Walk-in'}</span>
                      <span>{formatDateTime(ord.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>Phone: {ord.customer?.phone || '—'}</span>
                      <span className="capitalize bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-md">
                        {ord.posDetails?.paymentMode || 'Cash'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setReceiptData({
                          invoiceNumber: ord.posDetails?.gstInvoiceNumber || ord.orderNumber,
                          orderNumber: ord.orderNumber,
                          date: ord.createdAt,
                          cashier: ord.posDetails?.cashierName || 'Counter',
                          customer: ord.customer,
                          items: ord.items,
                          pricing: ord.pricing,
                          posDetails: ord.posDetails,
                        });
                        setIsHistoryDrawerOpen(false);
                      }}
                      className="w-full text-center py-2 rounded-xl bg-white border border-slate-200 font-bold text-brand-700 hover:bg-brand-50 hover:border-brand-200 transition-colors shadow-2xs mt-1 flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Reprint Receipt / Tax Invoice</span>
                    </button>
                  </div>
                ));
              })()}
            </div>

            {/* Drawer Footer with Page Navigation Link */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-col gap-2 shrink-0">
              <Link
                href="/admin/orders?channel=POS"
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Full Bills & Search Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* POS Printable Receipt Modal */}
      {receiptData && (
        <POSReceiptModal
          receiptData={receiptData}
          onClose={() => setReceiptData(null)}
          onNewSale={handleStartNextSale}
        />
      )}
    </div>
  );
}
