'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Truck,
  Save,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Tag,
  CreditCard,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { IOrder, OrderStatusType } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { success, error } = useToast();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable Form states
  const [orderStatus, setOrderStatus] = useState<OrderStatusType>('Placed');
  const [paymentStatus, setPaymentStatus] = useState<any>('Pending');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [notes, setNotes] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setOrderStatus(data.order.orderStatus);
        setPaymentStatus(data.order.paymentStatus);
        setCarrier(data.order.tracking?.carrier || 'Srirama Express Courier');
        setTrackingNumber(data.order.tracking?.trackingNumber || '');
        setNotes(data.order.notes || '');
      }
    } catch (err) {
      error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        orderStatus,
        paymentStatus,
        statusMessage: statusMessage || undefined,
        tracking: {
          carrier,
          trackingNumber,
        },
        notes,
      };

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        success('Order updated & tracking timeline synced');
        setStatusMessage('');
        fetchOrder();
      } else {
        error(data.message || 'Failed to update order');
      }
    } catch (err) {
      error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-slate-500">
        <h2>Order Not Found</h2>
        <Link href="/admin/orders" className="text-brand-600 font-bold mt-2 inline-block">
          &larr; Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              Order {order.orderNumber}
            </h1>
            <span className="text-xs text-slate-400">({formatDate(order.createdAt)})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Order Management & Status Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5"
          >
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Update Order Status & Dispatch
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fulfillment Status *
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatusType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="Placed">1. Placed</option>
                  <option value="Confirmed">2. Confirmed</option>
                  <option value="Processing">3. Processing & Tuning</option>
                  <option value="Packed">4. Packed & Crated</option>
                  <option value="Shipped">5. Shipped</option>
                  <option value="Out for Delivery">6. Out for Delivery</option>
                  <option value="Delivered">7. Delivered</option>
                  <option value="Cancelled">8. Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Payment Status *</span>
                  {order.paymentStatus === 'Paid' && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${
                      order.paymentDetails?.paymentId ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {order.paymentDetails?.paymentId ? <><Lock className="w-2.5 h-2.5" /> Locked</> : <><AlertTriangle className="w-2.5 h-2.5" /> Action Needed</>}
                    </span>
                  )}
                </label>
                {/* 1. Genuinely verified online payment with Razorpay paymentId or POS counter payment */}
                {order.paymentStatus === 'Paid' && (order.paymentDetails?.paymentId || order.orderSource === 'POS') ? (
                  <div className="w-full bg-emerald-50/80 border border-emerald-200/90 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Paid (Verified & Immutable)
                    </span>
                    <Lock className="w-3 h-3 text-emerald-600" />
                  </div>
                ) : order.paymentStatus === 'Paid' && !order.paymentDetails?.paymentId ? (
                  /* 2. Unverified: Marked Paid previously without a paymentId -> Allow admin to fix */
                  <div className="flex flex-col gap-2">
                    <div className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Unverified (No Bank / Razorpay Txn ID)
                      </span>
                    </div>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Pending">Revert to Pending (Unpaid)</option>
                      <option value="Failed">Mark as Failed</option>
                      <option value="Paid">Keep as Paid (Manual Store Override)</option>
                    </select>
                  </div>
                ) : (
                  /* 3. Normal Pending / Failed status -> can be updated */
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid (Cash / Store Received)</option>
                    <option value="Failed">Failed</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Courier Partner Name
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. Srirama Express, BlueDart, Delhivery"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Waybill / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="TRK-98765432"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Custom Status Milestone Message (Optional)
                </label>
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="e.g. Cycle successfully calibrated by Senior Technician Rajesh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors self-start shadow-sm"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
              <span>Save & Sync Customer Tracking</span>
            </button>
          </form>

          {/* Timeline History */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">
              Tracking Timeline Log
            </h3>
            <div className="flex flex-col gap-3">
              {order.tracking?.statusUpdates?.map((upd, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">{upd.status}</strong>
                      <span className="text-slate-600">{upd.message}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatDateTime(upd.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Order Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Payment & Gateway Verification */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Payment Verification
                </h3>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                  order.paymentDetails?.paymentId || order.orderSource === 'POS'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : order.paymentStatus === 'Paid'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {order.paymentDetails?.paymentId
                  ? '✓ Verified with Bank'
                  : order.orderSource === 'POS'
                  ? '✓ Counter Sale'
                  : order.paymentStatus === 'Paid'
                  ? '⚠️ Unverified (No Bank Txn ID)'
                  : '⏳ Pending Payment'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Method:</span>
                <strong className="text-slate-900 font-bold">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Gateway:</span>
                <span className="text-slate-800 font-medium">
                  {order.paymentDetails?.gateway || (order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay')}
                </span>
              </div>
              {order.paymentDetails?.paymentId ? (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Razorpay Txn ID:</span>
                  <code className="text-[11px] font-mono font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                    {order.paymentDetails.paymentId}
                  </code>
                </div>
              ) : order.paymentMethod !== 'COD' && order.orderSource !== 'POS' ? (
                <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                  ⚠️ <strong>No Transaction ID:</strong> Customer did not complete Razorpay payment.
                </div>
              ) : null}
              {order.paymentDetails?.orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Razorpay Order ID:</span>
                  <code className="text-[11px] font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {order.paymentDetails.orderId}
                  </code>
                </div>
              )}
              {order.paymentDetails?.paidAt && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Verified On:</span>
                  <span className="text-slate-700 font-medium">{formatDateTime(order.paymentDetails.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer & Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Customer & Delivery Destination
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Recipient</span>
              <strong className="text-slate-900 text-sm">{order.customer.name}</strong>
              <p className="text-slate-500 mt-1">{order.customer.email}</p>
              <p className="text-slate-500">{order.customer.phone}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Shipping Address</span>
              <p className="text-slate-700 font-medium leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Ordered Products Summary & Packing Verification */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Ordered Items & Packing Checklist ({order.items.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Verify Color Variant
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((it: any, i: number) => {
                const itemImg =
                  it.image ||
                  (it.product && typeof it.product === 'object' && it.product.images?.[0]) ||
                  '/images/products/gang-linear-ibc-main.png';
                const color = it.variant?.color || it.selectedColor || (it as any).color;
                const size = it.variant?.size || it.selectedSize || (it as any).size;

                return (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Product Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200 shrink-0 overflow-hidden p-1 shadow-2xs flex items-center justify-center">
                        <Image
                          src={itemImg}
                          alt={it.name || 'Ordered Cycle'}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Item Details & Badges */}
                      <div className="min-w-0 flex flex-col gap-1">
                        <strong className="text-slate-900 font-bold text-xs sm:text-sm line-clamp-1 block">
                          {it.name}
                        </strong>

                        {/* Variant Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {color ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-200 shrink-0" />
                              <span>Color: {color}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Standard Color
                            </span>
                          )}

                          {size && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                              <span>Size: {size}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Unit: {formatPrice(it.price)} × Qty: {it.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Price Total */}
                    <div className="text-right sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/60 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-[10px] text-slate-400 font-medium sm:hidden">
                        Item Total:
                      </span>
                      <span className="font-black text-slate-900 text-sm">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatPrice(order.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping:</span>
                <span>{order.pricing.shipping === 0 ? 'FREE' : formatPrice(order.pricing.shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST Charges:</span>
                <span className="font-semibold text-emerald-700">Included in Price</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-brand-600">{formatPrice(order.pricing.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
