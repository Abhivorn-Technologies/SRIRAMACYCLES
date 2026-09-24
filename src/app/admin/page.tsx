'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  MessageSquare,
  Send,
  Mail,
} from 'lucide-react';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    unreadEnquiries: 0,
    totalEnquiries: 0,
  };

  const recentOrders = data?.recentOrders || [];
  const lowStockProducts = data?.lowStockProducts || [];
  const recentEnquiries = data?.recentEnquiries || [];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Executive Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Store Performance & Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">
              {formatPrice(stats.totalRevenue)}
            </span>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Paid verified orders
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">{stats.totalOrders}</span>
            <p className="text-[10px] text-slate-400 mt-1">
              <strong className="text-brand-700 font-bold">{stats.pendingOrders}</strong> pending
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">{stats.totalProducts}</span>
            <p className="text-[10px] text-slate-400 mt-1">Catalog items live</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">{stats.totalCustomers}</span>
            <p className="text-[10px] text-slate-400 mt-1">Registered riders</p>
          </div>
        </div>

        {/* Customer Enquiries */}
        <Link
          href="/admin/enquiries"
          className="bg-white hover:bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-brand-700">
              Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{stats.totalEnquiries}</span>
              {stats.unreadEnquiries > 0 && (
                <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.2 rounded-full animate-pulse">
                  {stats.unreadEnquiries} new
                </span>
              )}
            </div>
            <p className="text-[10px] text-brand-700 font-semibold mt-1 flex items-center gap-1">
              <span>View inbox</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500">Live order flow from public store</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord._id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 font-bold font-mono text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 text-slate-700">
                        <span className="font-semibold block">{ord.customer.name}</span>
                        <span className="text-[10px] text-slate-400">{ord.customer.phone}</span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {formatPrice(ord.pricing.total)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-brand-50 text-brand-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/orders/${ord._id}`}
                          className="bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold py-1 px-3 rounded-lg transition-colors shadow-xs"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">No orders received yet.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Low Inventory Alerts
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Cycles or gear with &le; 3 units in stock
            </p>

            {lowStockProducts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {lowStockProducts.map((p: any) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-slate-500">SKU: {p.sku}</span>
                    </div>
                    <span className="bg-amber-500 text-white font-black text-xs px-2 py-0.5 rounded-md">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                All inventory levels are healthy.
              </p>
            )}
          </div>

          <Link
            href="/admin/products"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 text-center border-t border-slate-100 pt-4"
          >
            Manage Product Catalog &rarr;
          </Link>
        </div>
      </div>

      {/* Customer Enquiries & Messages Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Latest Customer Enquiries
              </h2>
              {stats.unreadEnquiries > 0 && (
                <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  {stats.unreadEnquiries} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted from the public Contact page by potential buyers
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
          >
            <span>Open Inbox ({stats.totalEnquiries})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentEnquiries.map((enq: any) => {
              const cleanPhone = enq.phone ? enq.phone.replace(/[^0-9]/g, '') : '';
              const waNumber = cleanPhone.startsWith('91')
                ? cleanPhone
                : cleanPhone.length === 10
                  ? `91${cleanPhone}`
                  : cleanPhone;
              const waLink = waNumber
                ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Hello ${enq.name}, regarding your enquiry about "${enq.subject}" at Sri Rama Cycles:`
                  )}`
                : null;

              return (
                <div
                  key={enq._id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                    enq.status === 'unread'
                      ? 'bg-rose-50/20 border-rose-200 shadow-2xs ring-1 ring-rose-100'
                      : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-slate-900">{enq.name}</strong>
                        <span
                          className={`text-[9px] font-black px-2 py-0.2 rounded-full uppercase ${
                            enq.status === 'unread'
                              ? 'bg-rose-100 text-rose-800'
                              : enq.status === 'replied'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(enq.createdAt)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-2">
                      <span>{enq.email}</span>
                      {enq.phone && <span>• {enq.phone}</span>}
                    </div>

                    <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <strong className="text-slate-800 block text-[11px] mb-0.5">
                        Topic: {enq.subject}
                      </strong>
                      <p className="text-slate-600 line-clamp-2">{enq.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a
                        href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject)} - Sri Rama Cycles`}
                        className="text-[11px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </a>
                    </div>

                    <Link
                      href="/admin/enquiries"
                      className="text-[11px] font-bold text-brand-700 hover:text-brand-900"
                    >
                      Manage &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">
            No customer enquiries received yet. Messages submitted on the Contact page will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
