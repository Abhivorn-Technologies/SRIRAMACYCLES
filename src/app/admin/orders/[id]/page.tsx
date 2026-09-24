'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Save,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Status *
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
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

          {/* Ordered Products Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Ordered Items ({order.items.length})
            </h3>
            <div className="flex flex-col gap-2.5">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between pb-2 border-b border-slate-100">
                  <div>
                    <strong className="text-slate-900 block">{it.name}</strong>
                    <span className="text-slate-400 text-[10px]">
                      Qty: {it.quantity} {it.variant?.size ? `• ${it.variant.size}` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
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
                <span>GST:</span>
                <span>{formatPrice(order.pricing.tax)}</span>
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
