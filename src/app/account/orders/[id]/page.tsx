'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Truck, MapPin, ArrowLeft, ShieldCheck, Printer } from 'lucide-react';
import { IOrder } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
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
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <Link href="/account/orders" className="text-brand-600 text-xs font-bold mt-4 inline-block">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/account/orders"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 bg-white border border-slate-200 py-1.5 px-3 rounded-xl shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-10 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">
                Srirama Cycles Invoice
              </span>
              <h1 className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                {order.orderNumber}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Order Date: {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex flex-col sm:text-right gap-1">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full w-fit sm:self-end ${
                  order.orderStatus === 'Delivered'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-brand-50 text-brand-700'
                }`}
              >
                Status: {order.orderStatus}
              </span>
              <span className="text-xs text-slate-500">
                Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Customer & Shipping addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Customer Details:</h3>
              <p className="font-semibold">{order.customer.name}</p>
              <p className="text-slate-500">{order.customer.email}</p>
              <p className="text-slate-500">{order.customer.phone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Shipping Destination:</h3>
              <p className="text-slate-600 leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Itemized table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Items Purchased
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-2.5 w-16">Item</th>
                  <th className="py-2.5">Description & Variant</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i: number) => {
                  const itemImg =
                    item.image ||
                    (item.product && typeof item.product === 'object' && item.product.images?.[0]) ||
                    '/images/products/gang-linear-ibc-main.png';
                  const color = item.variant?.color || item.selectedColor || (item as any).color;
                  const size = item.variant?.size || item.selectedSize || (item as any).size;

                  return (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                      {/* Image Thumbnail */}
                      <td className="py-3 pr-2">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden p-1 shrink-0 flex items-center justify-center">
                          <Image
                            src={itemImg}
                            alt={item.name || 'Ordered Cycle'}
                            fill
                            sizes="56px"
                            className="object-contain p-0.5"
                          />
                        </div>
                      </td>

                      {/* Product Name & Variants */}
                      <td className="py-3 font-semibold text-slate-900">
                        <span className="block text-slate-900 font-bold text-xs sm:text-sm">
                          {item.name}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {color && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>Color: {color}</span>
                            </span>
                          )}

                          {size && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                              <span>Size: {size}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                          1-Year Sri Rama Frame Warranty Included
                        </span>
                      </td>

                      <td className="py-3 text-center text-slate-700 font-semibold">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-600">{formatPrice(item.price)}</td>
                      <td className="py-3 text-right font-black text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing breakdown */}
          <div className="flex flex-col sm:items-end text-xs gap-2 pt-2 border-t border-slate-100">
            <div className="w-full sm:w-64 flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">
                {formatPrice(order.pricing.subtotal)}
              </span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="w-full sm:w-64 flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span>-{formatPrice(order.pricing.discount)}</span>
              </div>
            )}
            <div className="w-full sm:w-64 flex justify-between text-slate-600">
              <span>Shipping:</span>
              <span className="font-semibold text-slate-900">
                {order.pricing.shipping === 0 ? 'FREE' : formatPrice(order.pricing.shipping)}
              </span>
            </div>
            <div className="w-full sm:w-64 flex justify-between text-slate-600">
              <span>GST Tax (12%):</span>
              <span className="font-semibold text-slate-900">
                {formatPrice(order.pricing.tax)}
              </span>
            </div>
            <div className="w-full sm:w-64 flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-brand-600">{formatPrice(order.pricing.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
