'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, Mail, Phone, Calendar, ShoppingBag, Store, Globe, RefreshCw } from 'lucide-react';
import { IUser } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'registered' | 'offline'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { error } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/customers?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (err) {
      error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [channelFilter]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (channelFilter === 'registered') return c.isRegistered;
      if (channelFilter === 'offline') return !c.isRegistered;
      return true;
    });
  }, [customers, channelFilter]);

  const registeredCount = customers.filter((c) => c.isRegistered).length;
  const offlineCount = customers.filter((c) => !c.isRegistered).length;

  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Rider & Buyer Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered website members and in-store POS walk-in customers.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by customer name, mobile phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              channelFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setChannelFilter('registered')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              channelFilter === 'registered' ? 'bg-brand-600 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            Web Accounts ({registeredCount})
          </button>
          <button
            onClick={() => setChannelFilter('offline')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              channelFilter === 'offline' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            In-Store POS ({offlineCount})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Mobile Phone</th>
                  <th className="py-3.5 px-4">Customer Type</th>
                  <th className="py-3.5 px-4">First Interaction</th>
                  <th className="py-3.5 px-4">Total Purchases</th>
                  <th className="py-3.5 px-4 text-right">Total Lifetime Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-black border border-brand-200 flex items-center justify-center text-xs">
                          {c.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <strong className="text-slate-900 block">{c.name}</strong>
                          <span className="text-[11px] text-slate-400">
                            {c.email?.includes('@pos.') ? 'POS Counter Buyer' : c.email || 'No email provided'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-semibold font-mono">
                      {c.phone || 'Walk-in'}
                    </td>

                    <td className="py-3.5 px-4">
                      {c.isRegistered ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          <Globe className="w-3 h-3" />
                          <span>Registered Member</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          <Store className="w-3 h-3" />
                          <span>In-Store Walk-in</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">{formatDate(c.createdAt)}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-md text-slate-800">
                          {c.orderCount || 0} bills
                        </span>
                        {c.posCount > 0 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            ({c.posCount} POS)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 text-right">
                      {formatPrice(c.totalSpent || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
              itemLabel="customers"
            />
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No customer records found.</div>
        )}
      </div>
    </div>
  );
}

