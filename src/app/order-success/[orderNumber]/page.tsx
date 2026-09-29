'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText,
} from 'lucide-react';
import { IOrder } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TaxInvoiceModal from '@/components/common/TaxInvoiceModal';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-lg text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Order Confirmed & Booked
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2 mb-6">
            We have received your cycle booking. Our certified technicians are preparing and tuning
            your cycle for dispatch.
          </p>

          {/* Order ID & Tracking Bar */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left mb-8">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">Order Reference</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {order?.orderNumber || orderNumber}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {order && (
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Tax Invoice</span>
                </button>
              )}
              <Link
                href={`/track-order?orderId=${order?.orderNumber || orderNumber}`}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order Live</span>
              </Link>
            </div>
          </div>

          {/* Delivery Timeframe Notice */}
          <div className="w-full bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-center gap-3.5 text-left mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">Estimated Doorstep Delivery</h4>
              <p className="text-sm font-black text-amber-900 mt-0.5">Within 5 Working Days</p>
              <p className="text-[11px] text-amber-800 mt-0.5">Includes 95% pre-assembly, precision tuning, and doorstep delivery.</p>
            </div>
          </div>

          {/* Order Details Details Breakdown */}
          {order && (
            <div className="w-full text-left flex flex-col gap-6 pt-4 border-t border-slate-100">
              {/* Shipping Address */}
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <h4 className="font-bold text-slate-900 mb-0.5">Delivering to:</h4>
                  <p className="font-semibold">{order.customer.name} ({order.customer.phone})</p>
                  <p className="text-slate-500">
                    {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Ordered Items
                </h4>
                <div className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-100 text-xs"
                    >
                      <span className="font-medium text-slate-800">
                        {item.name} <span className="text-slate-400">x{item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Total */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-50/60 border border-brand-200 text-xs font-bold">
                <span className="text-brand-950">Total Amount Paid / Payable ({order.paymentMethod})</span>
                <span className="text-base text-brand-700">{formatPrice(order.pricing.total)}</span>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 w-full">
            <Link
              href="/shop"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/account/orders"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-6 rounded-xl transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>

      {order && (
        <TaxInvoiceModal
          order={order}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
}
