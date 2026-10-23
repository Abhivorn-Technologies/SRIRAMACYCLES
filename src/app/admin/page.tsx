'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Calendar,
  Filter,
  RefreshCw,
  Store,
  Globe,
  FileSpreadsheet,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  Layers,
} from 'lucide-react';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type FilterPeriod =
  | 'this_month'
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_month'
  | 'month'
  | 'custom'
  | 'all';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  // Filter States
  const [period, setPeriod] = useState<FilterPeriod>('this_month');
  
  // For 'month' selection
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);

  // For 'custom' date range selection
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 29);
  const formatDateForInput = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [customStartDate, setCustomStartDate] = useState<string>(formatDateForInput(thirtyDaysAgo));
  const [customEndDate, setCustomEndDate] = useState<string>(formatDateForInput(now));

  // Tooltip state for chart
  const [hoveredBar, setHoveredBar] = useState<any>(null);

  // Tab for orders display (period vs lifetime recent)
  const [ordersTab, setOrdersTab] = useState<'period' | 'all'>('period');

  const fetchStats = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        else setFilterLoading(true);

        const params = new URLSearchParams();
        params.append('period', period);

        if (period === 'month' && selectedMonth) {
          params.append('month', selectedMonth);
        } else if (period === 'custom') {
          if (customStartDate) params.append('startDate', customStartDate);
          if (customEndDate) params.append('endDate', customEndDate);
        }

        const res = await fetch(`/api/admin/stats?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    },
    [period, selectedMonth, customStartDate, customEndDate]
  );

  useEffect(() => {
    fetchStats(true);
  }, []);

  // When quick preset changes (that don't need manual submit)
  const handlePeriodChange = (newPeriod: FilterPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom' && newPeriod !== 'month') {
      // Trigger fetch immediately
      const params = new URLSearchParams();
      params.append('period', newPeriod);
      setFilterLoading(true);
      fetch(`/api/admin/stats?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setData(json);
        })
        .finally(() => setFilterLoading(false));
    }
  };

  const handleApplyMonth = (mStr: string) => {
    setSelectedMonth(mStr);
    setPeriod('month');
    const params = new URLSearchParams();
    params.append('period', 'month');
    params.append('month', mStr);
    setFilterLoading(true);
    fetch(`/api/admin/stats?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .finally(() => setFilterLoading(false));
  };

  const handleApplyCustomDates = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customStartDate || !customEndDate) return;
    setPeriod('custom');
    const params = new URLSearchParams();
    params.append('period', 'custom');
    params.append('startDate', customStartDate);
    params.append('endDate', customEndDate);
    setFilterLoading(true);
    fetch(`/api/admin/stats?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .finally(() => setFilterLoading(false));
  };

  if (loading) {
    return (
      <div className="py-28 flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-500 font-medium">Loading store metrics & revenue intelligence...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalRevenue: 0,
    lifetimeOrderRevenue: 0,
    lifetimeOfflineRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    unreadEnquiries: 0,
    totalEnquiries: 0,
  };

  const revenueOverview = data?.revenueOverview || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    orderRevenue: 0,
    orderCount: 0,
    onlineRevenue: 0,
    onlineOrders: 0,
    posRevenue: 0,
    posOrders: 0,
    offlineRevenue: 0,
    offlineOrders: 0,
    paymentBreakdown: {
      cash: 0,
      upi: 0,
      card: 0,
      netbanking: 0,
    },
    trend: [],
  };

  const filterInfo = data?.filter || {
    period: 'this_month',
    label: 'This Month',
    startDate: null,
    endDate: null,
  };

  const recentOrders = data?.recentOrders || [];
  const lowStockProducts = data?.lowStockProducts || [];
  const recentEnquiries = data?.recentEnquiries || [];

  // Calculate chart max for proportional scaling
  const trendData = revenueOverview.trend || [];
  const maxRevenueInTrend = Math.max(...trendData.map((d: any) => d.revenue || 0), 1);
  const peakDay = trendData.reduce(
    (max: any, item: any) => ((item.revenue || 0) > (max?.revenue || 0) ? item : max),
    null
  );

  // Generate quick past 5 months for convenient clicking
  const quickMonths: { label: string; value: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const lbl = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    quickMonths.push({ label: lbl, value: val });
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Executive Revenue Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Store Performance & Financial Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live multi-channel revenue analytics, POS sales, and order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/pos"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Open POS Counter</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REVENUE FILTERING & INTELLIGENCE HUB */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle loading overlay when switching filters */}
        {filterLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Calculating revenue for selected period...</span>
            </div>
          </div>
        )}

        {/* Filter Navigation Bar */}
        <div className="flex flex-col gap-3 pb-5 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  Revenue Time Period Filter
                </h2>
                <p className="text-[11px] text-slate-500">
                  Select predefined intervals, filter by specific month, or pick custom date ranges
                </p>
              </div>
            </div>

            {/* Active Period Label Badge */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Showing:</span>
                <span className="text-emerald-950 font-black">{filterInfo.label}</span>
              </div>
              <button
                onClick={() => handlePeriodChange('this_month')}
                title="Reset to current month"
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {[
              { id: 'this_month', label: 'This Month' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'this_week', label: 'Last 7 Days' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'month', label: 'Select Month' },
              { id: 'custom', label: 'Custom Dates (From - To)' },
              { id: 'all', label: 'All Time' },
            ].map((p) => {
              const isActive = period === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id as FilterPeriod)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs scale-102'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Conditional Sub-panel: Specific Month Selector */}
          {period === 'month' && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-brand-600" />
                  <span>Choose Month & Year:</span>
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => handleApplyMonth(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Quick Month Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick pick:</span>
                {quickMonths.map((qm) => (
                  <button
                    key={qm.value}
                    onClick={() => handleApplyMonth(qm.value)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedMonth === qm.value
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {qm.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Sub-panel: Custom Date Range (Start Date to End Date) */}
          {period === 'custom' && (
            <form
              onSubmit={handleApplyCustomDates}
              className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">From:</span>
                  <input
                    type="date"
                    required
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">To:</span>
                  <input
                    type="date"
                    required
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Apply Date Range</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nowD = new Date();
                    const s = new Date();
                    s.setDate(nowD.getDate() - 14);
                    setCustomStartDate(formatDateForInput(s));
                    setCustomEndDate(formatDateForInput(nowD));
                  }}
                  className="text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-xl"
                >
                  Last 14d
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nowD = new Date();
                    const s = new Date();
                    s.setDate(nowD.getDate() - 30);
                    setCustomStartDate(formatDateForInput(s));
                    setCustomEndDate(formatDateForInput(nowD));
                  }}
                  className="text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-2 rounded-xl"
                >
                  Last 30d
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Top Highlight Cards for Selected Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hero Revenue Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4 border border-slate-800 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Period Revenue</span>
              </span>
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {filterInfo.label}
              </span>
            </div>

            <div className="z-10">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatPrice(revenueOverview.totalRevenue)}
              </span>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 font-medium">
                <span>
                  <strong className="text-white font-bold">{revenueOverview.totalOrders}</strong>{' '}
                  transactions
                </span>
                <span>•</span>
                <span>
                  Avg:{' '}
                  <strong className="text-emerald-400 font-bold">
                    {formatPrice(revenueOverview.averageOrderValue)}
                  </strong>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 z-10">
              <span>Lifetime Store Total:</span>
              <strong className="text-slate-200 font-bold">
                {formatPrice(stats.totalRevenue)}
              </strong>
            </div>
          </div>

          {/* Online Web Store Orders */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Online Web Store</span>
              </span>
              <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                Website
              </span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(revenueOverview.onlineRevenue)}
              </span>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="font-bold text-slate-800">{revenueOverview.onlineOrders}</span>{' '}
                paid website orders
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Share:</span>
              <span className="font-bold text-slate-700">
                {revenueOverview.totalRevenue > 0
                  ? `${Math.round((revenueOverview.onlineRevenue / revenueOverview.totalRevenue) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* In-Store POS Sales */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>In-Store POS Sales</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                Counter
              </span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(revenueOverview.posRevenue)}
              </span>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="font-bold text-slate-800">{revenueOverview.posOrders}</span>{' '}
                counter receipts
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Share:</span>
              <span className="font-bold text-slate-700">
                {revenueOverview.totalRevenue > 0
                  ? `${Math.round((revenueOverview.posRevenue / revenueOverview.totalRevenue) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Offline Sales Register */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
                <span>Offline Sales Register</span>
              </span>
              <Link
                href="/admin/offline-sales"
                className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-0.5"
              >
                <span>View Book</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </Link>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(revenueOverview.offlineRevenue)}
              </span>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="font-bold text-slate-800">{revenueOverview.offlineOrders}</span>{' '}
                ledger entries
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Share:</span>
              <span className="font-bold text-slate-700">
                {revenueOverview.totalRevenue > 0
                  ? `${Math.round((revenueOverview.offlineRevenue / revenueOverview.totalRevenue) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Modes Strip */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CreditCard className="w-4 h-4 text-brand-600" />
            <span>Payment Mode Distribution ({filterInfo.label}):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 max-w-3xl">
            {/* Cash */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Banknote className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Cash</span>
                <span className="text-xs font-black text-slate-900">
                  {formatPrice(revenueOverview.paymentBreakdown.cash || 0)}
                </span>
              </div>
            </div>

            {/* UPI */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">UPI</span>
                <span className="text-xs font-black text-slate-900">
                  {formatPrice(revenueOverview.paymentBreakdown.upi || 0)}
                </span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Cards</span>
                <span className="text-xs font-black text-slate-900">
                  {formatPrice(revenueOverview.paymentBreakdown.card || 0)}
                </span>
              </div>
            </div>

            {/* Netbanking */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Online</span>
                <span className="text-xs font-black text-slate-900">
                  {formatPrice(revenueOverview.paymentBreakdown.netbanking || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Daily Revenue Trend Chart */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Daily Revenue Progression ({filterInfo.label})</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Hover over any date bar to view breakdown of daily earnings and order volume
              </p>
            </div>

            {peakDay && peakDay.revenue > 0 && (
              <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Peak Day:</span>
                <span className="font-black text-emerald-950">
                  {peakDay.label} ({formatPrice(peakDay.revenue)})
                </span>
              </div>
            )}
          </div>

          {/* Chart Display */}
          {trendData.length > 0 ? (
            <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80">
              {/* Tooltip display */}
              <div className="h-6 mb-2">
                {hoveredBar ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 animate-in fade-in duration-100">
                    <span className="text-brand-600 font-black">{hoveredBar.label}:</span>
                    <span className="text-emerald-700 font-black text-sm">
                      {formatPrice(hoveredBar.revenue)}
                    </span>
                    <span className="text-slate-400">({hoveredBar.orders} sales)</span>
                    {hoveredBar.online > 0 && (
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        Online: {formatPrice(hoveredBar.online)}
                      </span>
                    )}
                    {hoveredBar.pos > 0 && (
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        POS: {formatPrice(hoveredBar.pos)}
                      </span>
                    )}
                    {hoveredBar.offline > 0 && (
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        Offline: {formatPrice(hoveredBar.offline)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    Hover over bars below to inspect day details
                  </span>
                )}
              </div>

              {/* Bars container */}
              <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-4 px-1 overflow-x-auto pb-1">
                {trendData.map((item: any) => {
                  const heightPercent =
                    item.revenue > 0
                      ? Math.max(Math.round((item.revenue / maxRevenueInTrend) * 100), 8)
                      : 4;
                  const isHovered = hoveredBar?.date === item.date;

                  return (
                    <div
                      key={item.date}
                      onMouseEnter={() => setHoveredBar(item)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex-1 min-w-[20px] max-w-[48px] h-full flex flex-col justify-end items-center group cursor-pointer"
                    >
                      {/* Bar Pillar */}
                      <div className="w-full flex flex-col justify-end h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all duration-200 ${
                            item.revenue > 0
                              ? isHovered
                                ? 'bg-emerald-500 shadow-md ring-2 ring-emerald-300'
                                : 'bg-brand-600 group-hover:bg-brand-500'
                              : 'bg-slate-200/80 group-hover:bg-slate-300'
                          }`}
                        />
                      </div>

                      {/* X-axis Date label */}
                      <span
                        className={`text-[9px] font-bold mt-1.5 truncate max-w-full text-center ${
                          isHovered
                            ? 'text-brand-700 font-black'
                            : item.revenue > 0
                              ? 'text-slate-700'
                              : 'text-slate-400'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No revenue data for this filter period</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try selecting "This Month" or a different date range.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STORE LIFETIME KPI METRIC CARDS */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Store Operations & Catalog Indicators</span>
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">Lifetime Catalog Totals</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalOrders}</span>
              <p className="text-[10px] text-slate-400 mt-1">
                <strong className="text-brand-700 font-bold">{stats.pendingOrders}</strong> pending
                fulfillment
              </p>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Live Products
              </span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalProducts}</span>
              <p className="text-[10px] text-slate-400 mt-1">Catalog items live on storefront</p>
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
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalCustomers}</span>
              <p className="text-[10px] text-slate-400 mt-1">Registered customer accounts</p>
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
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {stats.totalEnquiries}
                </span>
                {stats.unreadEnquiries > 0 && (
                  <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
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
      </div>

      {/* ========================================================================= */}
      {/* ORDERS & INVENTORY ALERTS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  Orders Stream
                </h2>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {recentOrders.length} records
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {period !== 'all'
                  ? `Showing orders for selected period: ${filterInfo.label}`
                  : 'Latest orders across the entire store'}
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Orders</span>
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
                    <th className="pb-3">Channel</th>
                    <th className="pb-3">Date</th>
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
                        <span className="font-semibold block">{ord.customer?.name || 'Walk-in'}</span>
                        <span className="text-[10px] text-slate-400">{ord.customer?.phone}</span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            ord.orderSource === 'POS'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {ord.orderSource === 'POS' ? 'POS Counter' : 'Online Store'}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500 text-[11px]">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {formatPrice(ord.pricing?.total || 0)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.paymentStatus === 'Paid'
                                ? 'bg-sky-50 text-sky-700'
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
            <div className="py-10 text-center">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">No orders found in this time period.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Orders received during {filterInfo.label} will show up here.
              </p>
            </div>
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
              Cycles or gear with &le; 3 units remaining in stock
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

      {/* ========================================================================= */}
      {/* CUSTOMER ENQUIRIES & MESSAGES SECTION */}
      {/* ========================================================================= */}
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
