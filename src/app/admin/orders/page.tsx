'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ShoppingBag, Eye, Calendar, User, Store, Globe, Printer, Receipt, RefreshCw, ArrowLeft } from 'lucide-react';
import { IOrder, OrderStatusType } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import POSReceiptModal from '@/components/admin/POSReceiptModal';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialChannel = searchParams.get('channel') === 'POS' ? 'POS' : searchParams.get('channel') === 'ONLINE' ? 'ONLINE' : 'ALL';
  
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'ONLINE' | 'POS'>(initialChannel);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const { error } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (channelFilter !== 'ALL') params.append('channel', channelFilter);
      params.append('limit', '100');

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, channelFilter]);

  const posCount = orders.filter((o) => o.orderSource === 'POS').length;
  const onlineCount = orders.filter((o) => o.orderSource !== 'POS').length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Fulfillment & Invoicing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Order & In-Store Sales Management ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Online website orders and offline in-store POS counter transactions.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search Order ID, Customer Name, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              channelFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setChannelFilter('ONLINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              channelFilter === 'ONLINE' ? 'bg-brand-600 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Online Web ({onlineCount})</span>
          </button>
          <button
            onClick={() => setChannelFilter('POS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              channelFilter === 'POS' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>In-Store POS ({posCount})</span>
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing & Assembly</option>
            <option value="Packed">Packed & Crated</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Sales Channel</th>
                  <th className="py-3.5 px-4">Customer & Phone</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => {
                  const isPOS = ord.orderSource === 'POS';
                  const paymentDisplay = ord.posDetails?.paymentMode || ord.paymentMethod;

                  return (
                    <tr key={ord._id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono text-slate-900 block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(ord.createdAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPOS ? (
                          <span className="inline-flex items-center gap-1 bg-slate-900 text-white font-black px-2.5 py-0.5 rounded-full text-[10px] shadow-2xs">
                            <Store className="w-3 h-3 text-amber-400" />
                            <span>In-Store POS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            <Globe className="w-3 h-3" />
                            <span>Online Order</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{ord.customer.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {ord.customer.phone || 'Counter'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {ord.items.length} item(s) ({ord.items.reduce((a, b) => a + b.quantity, 0)}{' '}
                        units)
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatPrice(ord.pricing.total)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {paymentDisplay} ({ord.paymentStatus})
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.orderStatus === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-brand-50 text-brand-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPOS && (
                            <button
                              onClick={() =>
                                setSelectedReceipt({
                                  invoiceNumber:
                                    ord.posDetails?.gstInvoiceNumber || ord.orderNumber,
                                  orderNumber: ord.orderNumber,
                                  date: ord.createdAt,
                                  cashier: ord.posDetails?.cashierName || 'Counter',
                                  customer: ord.customer,
                                  items: ord.items,
                                  pricing: ord.pricing,
                                  posDetails: ord.posDetails,
                                })
                              }
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                              title="Print Receipt / View Bill"
                            >
                              <Receipt className="w-3.5 h-3.5 text-brand-700" />
                              <span>Receipt</span>
                            </button>
                          )}

                          <Link
                            href={`/admin/orders/${ord._id}`}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg transition-colors inline-block shadow-xs"
                          >
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No orders found.</div>
        )}
      </div>

      {/* POS Receipt Modal for Reprints */}
      {selectedReceipt && (
        <POSReceiptModal
          receiptData={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onNewSale={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}

