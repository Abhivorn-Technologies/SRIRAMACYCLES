'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PackageCheck, ArrowRight, Truck, Calendar, ShoppingBag, FileText } from 'lucide-react';
import { IOrder } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TaxInvoiceModal from '@/components/common/TaxInvoiceModal';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/my-orders');
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              My Orders
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Order History ({orders.length})
            </h1>
          </div>
          <Link
            href="/account"
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            &larr; Back to Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center">
            <PackageCheck className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
              When you purchase a cycle or accessories, your order history and invoices will appear here.
            </p>
            <Link
              href="/shop"
              className="bg-brand-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-brand-50 text-brand-700'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" /> Booked on {formatDate(order.createdAt)} •{' '}
                      {order.items.length} item(s)
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="text-[11px] text-slate-400 font-medium">Total Amount</span>
                    <span className="text-base font-black text-slate-900">
                      {formatPrice(order.pricing.total)}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({order.paymentMethod})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="flex flex-col gap-2.5">
                  {order.items.map((it: any, idx: number) => {
                    const itemImg =
                      it.image ||
                      (it.product && typeof it.product === 'object' && it.product.images?.[0]) ||
                      '/images/products/gang-linear-ibc-main.png';
                    const color = it.variant?.color || it.selectedColor || (it as any).color;
                    const size = it.variant?.size || it.selectedSize || (it as any).size;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-14 h-14 rounded-xl bg-white border border-slate-200 shrink-0 overflow-hidden p-1 shadow-2xs flex items-center justify-center">
                            <Image
                              src={itemImg}
                              alt={it.name || 'Ordered Cycle'}
                              fill
                              sizes="56px"
                              className="object-contain p-0.5"
                            />
                          </div>

                          <div className="min-w-0 flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {it.name}
                            </h4>

                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              {color ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                  <span>Color: {color}</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Standard Spec</span>
                              )}

                              {size && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                                  <span>Size: {size}</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-slate-500 mt-0.5">
                              Qty: {it.quantity} × {formatPrice(it.price)}
                            </span>
                          </div>
                        </div>

                        <span className="font-black text-slate-900 text-xs sm:self-center shrink-0">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                  >
                    <span>View Full Order Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-brand-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      <span>Download Invoice</span>
                    </button>
                    <Link
                      href={`/track-order?orderId=${order.orderNumber}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedInvoiceOrder && (
        <TaxInvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
