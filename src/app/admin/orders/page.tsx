'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, ShoppingBag, Eye, Calendar, User, Store, Globe, Printer, Receipt, RefreshCw, ArrowLeft } from 'lucide-react';
import { IOrder, OrderStatusType } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import POSReceiptModal from '@/components/admin/POSReceiptModal';
import Pagination from '@/components/common/Pagination';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialChannel = searchParams.get('channel') === 'POS' ? 'POS' : searchParams.get('channel') === 'ONLINE' ? 'ONLINE' : 'ALL';
  
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'ONLINE' | 'POS'>(initialChannel);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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
    setCurrentPage(1);
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, channelFilter]);

  const posCount = orders.filter((o) => o.orderSource === 'POS').length;
  const onlineCount = orders.filter((o) => o.orderSource !== 'POS').length;

  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <input
            type="text"
            placeholder="Search Order ID, Customer Name, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm font-bold text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-slate-700 absolute left-3 top-3" />
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 bg-slate-200 p-1.5 rounded-xl shrink-0">
          <button
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              channelFilter === 'ALL' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-800'
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setChannelFilter('ONLINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              channelFilter === 'ONLINE' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Online Web ({onlineCount})</span>
          </button>
          <button
            onClick={() => setChannelFilter('POS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              channelFilter === 'POS' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-800'
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
            className="bg-white border-2 border-slate-300 text-xs sm:text-sm font-black text-slate-950 rounded-xl px-3 py-2 focus:outline-none"
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
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-900 font-black uppercase tracking-wider text-xs">
                  <th className="py-4 px-4 font-black">Order ID</th>
                  <th className="py-4 px-4 font-black bg-amber-50/80 border-x border-amber-200 text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-900" />
                      Purchased
                    </span>
                  </th>
                  <th className="py-4 px-4 font-black">Sales Channel</th>
                  <th className="py-4 px-4 font-black">Customer & Phone</th>
                  <th className="py-4 px-4 font-black">Items & Variants</th>
                  <th className="py-4 px-4 font-black bg-blue-50/80 border-x border-blue-200 text-blue-950">
                    Cycle Size
                  </th>
                  <th className="py-4 px-4 font-black">Total Amount</th>
                  <th className="py-4 px-4 font-black">Payment</th>
                  <th className="py-4 px-4 font-black">Status</th>
                  <th className="py-4 px-4 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {paginatedOrders.map((ord) => {
                  const isPOS = ord.orderSource === 'POS';
                  const paymentDisplay = ord.posDetails?.paymentMode || ord.paymentMethod;

                  return (
                    <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Order ID */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-black font-mono text-sm sm:text-base text-slate-950 block tracking-wide">
                          {ord.orderNumber}
                        </span>
                      </td>

                      {/* Dedicated Purchased Date Column */}
                      <td className="py-4 px-4 align-middle bg-amber-50/40 border-x border-amber-200/80 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 shrink-0">
                            <Calendar className="w-4 h-4 text-slate-950" />
                          </div>
                          <div>
                            <span className="text-sm font-black text-slate-950 block">
                              {formatDate(ord.createdAt)}
                            </span>
                            <span className="text-xs font-black text-slate-800 block mt-0.5">
                              {ord.createdAt
                                ? new Date(ord.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  })
                                : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Sales Channel */}
                      <td className="py-4 px-4 align-middle">
                        {isPOS ? (
                          <span className="inline-flex items-center gap-1.5 bg-slate-950 text-white font-black px-3 py-1 rounded-full text-xs shadow-xs border border-slate-950">
                            <Store className="w-3.5 h-3.5 text-amber-400" />
                            <span>In-Store POS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-950 border border-brand-400 font-black px-3 py-1 rounded-full text-xs shadow-2xs">
                            <Globe className="w-3.5 h-3.5 text-brand-700" />
                            <span>Online Order</span>
                          </span>
                        )}
                      </td>

                      {/* Customer & Phone */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-black text-sm text-slate-950 block">
                          {ord.customer.name}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-mono block mt-0.5">
                          📞 {ord.customer.phone || 'Counter Sale'}
                        </span>
                      </td>

                      {/* Items & Variants */}
                      <td className="py-4 px-4 align-middle text-slate-900 min-w-[220px] max-w-[320px]">
                        <div className="flex flex-col gap-2">
                          {ord.items.slice(0, 2).map((it: any, idx: number) => {
                            const itemImg =
                              it.image ||
                              (it.product && typeof it.product === 'object' && it.product.images?.[0]) ||
                              '/images/products/gang-linear-ibc-main.png';
                            const color = it.variant?.color || it.selectedColor || (it as any).color;
                            const size = it.variant?.size || it.selectedSize || (it as any).size;

                            return (
                              <div key={idx} className="flex items-center gap-2.5">
                                <div className="relative w-10 h-10 rounded-lg bg-white border-2 border-slate-300 shrink-0 overflow-hidden p-0.5">
                                  <Image
                                    src={itemImg}
                                    alt={it.name || 'Cycle'}
                                    fill
                                    sizes="40px"
                                    className="object-contain"
                                  />
                                </div>
                                <div className="min-w-0 flex-1 leading-tight">
                                  <p className="font-black text-xs text-slate-950 truncate" title={it.name}>
                                    {it.name}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    <span className="text-xs font-black text-slate-950 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded">
                                      x{it.quantity}
                                    </span>
                                    {color && (
                                      <span
                                        className="inline-flex items-center gap-1 text-[11px] font-black text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded truncate max-w-[140px]"
                                        title={color}
                                      >
                                        <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                                        {color}
                                      </span>
                                    )}
                                    {size && (
                                      <span
                                        className="text-[11px] font-black text-slate-900 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded truncate max-w-[100px]"
                                        title={size}
                                      >
                                        {size}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {ord.items.length > 2 && (
                            <span className="text-xs font-black text-brand-700 pl-12">
                              +{ord.items.length - 2} more item(s)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dedicated Cycle Size Column */}
                      <td className="py-4 px-4 align-middle bg-blue-50/40 border-x border-blue-200/80 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          {ord.items.map((it: any, idx: number) => {
                            const size = it.variant?.size || it.selectedSize || (it as any).size;
                            return (
                              <div key={idx} className="flex items-center gap-1.5">
                                {size ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 border-2 border-blue-400 text-blue-950 font-black text-xs shadow-2xs">
                                    <span className="w-2 h-2 rounded-full bg-blue-700 shrink-0" />
                                    {size}
                                  </span>
                                ) : (
                                  <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[11px]">
                                    Standard / N/A
                                  </span>
                                )}
                                {ord.items.length > 1 && (
                                  <span className="text-[10px] font-bold text-slate-700 max-w-[85px] truncate" title={it.name}>
                                    {it.name}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-black text-base text-slate-950 block">
                          {formatPrice(ord.pricing.total)}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 align-middle">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block border ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-amber-100 text-amber-950 border-amber-400'
                          }`}
                        >
                          {paymentDisplay} ({ord.paymentStatus})
                        </span>
                        {ord.paymentDetails?.paymentId && (
                          <span className="block text-[11px] font-bold font-mono text-slate-900 mt-1" title="Razorpay Payment ID">
                            ID: {ord.paymentDetails.paymentId}
                          </span>
                        )}
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-4 align-middle">
                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full inline-block border shadow-2xs ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : ord.orderStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-950 border-rose-400'
                                : 'bg-brand-100 text-brand-950 border-brand-400'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 align-middle text-right">
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
                              className="bg-slate-200 hover:bg-slate-300 text-slate-950 font-black text-xs py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-300 shadow-2xs"
                              title="Print Receipt / View Bill"
                            >
                              <Receipt className="w-4 h-4 text-brand-800" />
                              <span>Receipt</span>
                            </button>
                          )}

                          <Link
                            href={`/admin/orders/${ord._id}`}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-black text-xs py-2 px-3.5 rounded-xl transition-colors inline-block shadow-xs"
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
              itemLabel="orders"
            />
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

