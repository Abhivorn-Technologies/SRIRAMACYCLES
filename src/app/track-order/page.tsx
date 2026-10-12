'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { IOrder, OrderStatusType } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { STORE_CONTACT } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

function TrackOrderContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const trackingStepsConfig: { status: OrderStatusType; labelKey: string; descKey: string }[] = [
    { status: 'Placed', labelKey: 'track.steps_placed', descKey: 'track.steps_placed_desc' },
    { status: 'Confirmed', labelKey: 'track.steps_confirmed', descKey: 'track.steps_confirmed_desc' },
    { status: 'Processing', labelKey: 'track.steps_processing', descKey: 'track.steps_processing_desc' },
    { status: 'Packed', labelKey: 'track.steps_packed', descKey: 'track.steps_packed_desc' },
    { status: 'Shipped', labelKey: 'track.steps_shipped', descKey: 'track.steps_shipped_desc' },
    { status: 'Out for Delivery', labelKey: 'track.steps_out', descKey: 'track.steps_out_desc' },
    { status: 'Delivered', labelKey: 'track.steps_delivered', descKey: 'track.steps_delivered_desc' },
  ];

  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderId') || '');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTracking = async (orderIdToFetch: string, contactToFetch = '') => {
    if (!orderIdToFetch.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMessage('');

    try {
      const params = new URLSearchParams();
      params.append('orderNumber', orderIdToFetch.trim());
      if (contactToFetch) params.append('contact', contactToFetch.trim());

      const res = await fetch(`/api/orders/track?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMessage(data.message || 'No order found with the provided details.');
      }
    } catch (err) {
      setOrder(null);
      setErrorMessage('Failed to connect to tracking server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramId = searchParams.get('orderId');
    if (paramId) {
      setOrderNumber(paramId);
      fetchTracking(paramId);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumber, contact);
  };

  const getStepStatus = (stepIndex: number, currentStatus: OrderStatusType) => {
    const statusOrder: OrderStatusType[] = [
      'Placed',
      'Confirmed',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    if (currentStatus === 'Cancelled') {
      return 'cancelled';
    }

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/50 flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            {t('track.badge')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t('track.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t('track.subtitle')}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('track.order_id_label')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SRC-100823"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs uppercase font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('track.contact_label')}
              </label>
              <input
                type="text"
                placeholder="rajesh@example.com / 9876543210"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t('track.btn')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tracking Details View */}
        {searched && order && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col gap-8 p-6 sm:p-10 animate-in fade-in">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  {t('track.order_details')}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {order.orderNumber}
                  </h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-900'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:text-right text-xs text-slate-500 dark:text-slate-400">
                <span>Booked on: {formatDate(order.createdAt)}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  Courier: {order.tracking.carrier || 'Srirama Express'} (
                  {order.tracking.trackingNumber || 'TRK-DEFAULT'})
                </span>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">
                Live Shipment Progress
              </h3>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-8">
                {trackingStepsConfig.map((step, idx) => {
                  const state = getStepStatus(idx, order.orderStatus);

                  return (
                    <div key={step.status} className="relative group">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                          state === 'completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : state === 'current'
                              ? 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950 animate-pulse'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            state === 'current'
                              ? 'text-brand-600 dark:text-brand-400'
                              : state === 'completed'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {t(step.labelKey)}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t(step.descKey)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Log from Database */}
            {order.tracking.statusUpdates && order.tracking.statusUpdates.length > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Status Activity Updates
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 flex flex-col gap-2.5">
                  {order.tracking.statusUpdates.map((update, i) => (
                    <div key={i} className="flex items-start justify-between text-xs gap-4">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">{update.message}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {formatDateTime(update.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destination & Ordered Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  {t('track.delivery_address')}:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">{order.customer.name}</p>
                <p className="text-slate-500 dark:text-slate-400">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-2">
                  {t('cart.title')} ({order.items.length}):
                </span>
                <div className="flex flex-col gap-2">
                  {order.items.map((it: any, i: number) => {
                    const itemImg =
                      it.image ||
                      (it.product && typeof it.product === 'object' && it.product.images?.[0]) ||
                      '/images/products/gang-linear-ibc-main.png';
                    const color = it.variant?.color || it.selectedColor || (it as any).color;
                    const size = it.variant?.size || it.selectedSize || (it as any).size;

                    return (
                      <div key={i} className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                            <Image
                              src={itemImg}
                              alt={it.name || 'Cycle'}
                              fill
                              sizes="40px"
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white text-xs truncate" title={it.name}>
                              {it.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 mt-0.5">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1 rounded">
                                x{it.quantity}
                              </span>
                              {color && (
                                <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 rounded truncate max-w-[120px]" title={color}>
                                  {color}
                                </span>
                              )}
                              {size && (
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 rounded truncate max-w-[90px]" title={size}>
                                  {size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white text-xs shrink-0">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {searched && !order && !loading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-8 text-center flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Not Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">{errorMessage}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Need assistance? Contact support at {STORE_CONTACT.phone} or {STORE_CONTACT.supportEmail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
