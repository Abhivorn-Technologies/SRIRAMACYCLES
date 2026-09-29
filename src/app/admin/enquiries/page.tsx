'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Clock,
  Send,
} from 'lucide-react';
import { IEnquiry } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const { success, error } = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
      } else {
        error(data.message || 'Failed to load enquiries');
      }
    } catch (err) {
      error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Enquiry marked as ${status}`);
        setEnquiries((p) => p.map((e) => (e._id === id ? { ...e, status } : e)));
      } else {
        error(data.message || 'Failed to update status');
      }
    } catch (err) {
      error('Failed to update enquiry status');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);

    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Enquiry deleted successfully');
        setEnquiries((p) => p.filter((e) => e._id !== id));
      } else {
        error(data.message || 'Failed to delete enquiry');
      }
    } catch (err) {
      error('Failed to delete enquiry');
    }
  };

  // Filtered list based on search and status
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      const matchesStatus = statusFilter === 'all' || enq.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        enq.name?.toLowerCase().includes(q) ||
        enq.email?.toLowerCase().includes(q) ||
        enq.phone?.toLowerCase().includes(q) ||
        enq.subject?.toLowerCase().includes(q) ||
        enq.message?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, searchQuery]);

  const unreadCount = enquiries.filter((e) => e.status === 'unread').length;
  const readCount = enquiries.filter((e) => e.status === 'read').length;
  const repliedCount = enquiries.filter((e) => e.status === 'replied').length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Customer Communications
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Contact & Enquiries Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Messages and sizing/quote requests submitted by customers from the public Contact page.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({enquiries.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'unread'
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Unread</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                statusFilter === 'unread' ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {unreadCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'read'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Read ({readCount})
          </button>
          <button
            onClick={() => setStatusFilter('replied')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'replied'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Replied</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                statusFilter === 'replied'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {repliedCount}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px] sm:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, topic..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Enquiries Listing */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <span className="text-xs text-slate-400 font-medium">Loading enquiries...</span>
          </div>
        ) : filteredEnquiries.length > 0 ? (
          filteredEnquiries.map((enq) => {
            const cleanPhone = enq.phone ? enq.phone.replace(/[^0-9]/g, '') : '';
            const waNumber = cleanPhone.startsWith('91')
              ? cleanPhone
              : cleanPhone.length === 10
                ? `91${cleanPhone}`
                : cleanPhone;

            const waText = encodeURIComponent(
              `Hello ${enq.name}, thank you for contacting Sri Rama Cycles & Auto Spare Parts regarding "${enq.subject}". How can we help you further?`
            );
            const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : null;
            const mailtoLink = `mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject)} - Sri Rama Cycles`;

            return (
              <div
                key={enq._id}
                className={`p-6 rounded-3xl border transition-all ${
                  enq.status === 'unread'
                    ? 'bg-white border-brand-300 shadow-md ring-1 ring-brand-200'
                    : enq.status === 'replied'
                      ? 'bg-white/95 border-emerald-200/80 shadow-xs'
                      : 'bg-white/90 border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <strong className="text-sm font-black text-slate-900">{enq.name}</strong>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          enq.status === 'unread'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : enq.status === 'replied'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-1.5">
                      <a
                        href={mailtoLink}
                        className="flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {enq.email}
                      </a>
                      {enq.phone && (
                        <a
                          href={`tel:${enq.phone}`}
                          className="flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {enq.phone}
                        </a>
                      )}
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        {formatDateTime(enq.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Badges & Status Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Quick WhatsApp Link */}
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {/* Quick Email Link */}
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-colors"
                      title="Send email reply"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </a>

                    {/* Status Toggle Dropdown / Buttons */}
                    {enq.status === 'unread' ? (
                      <button
                        onClick={() => handleStatusChange(enq._id, 'read')}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Mark as Read
                      </button>
                    ) : enq.status === 'read' ? (
                      <button
                        onClick={() => handleStatusChange(enq._id, 'replied')}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                      >
                        Mark as Replied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(enq._id, 'read')}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Reset to Read
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(enq._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete this message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Subject / Topic:
                    </span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {enq.subject}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap mt-2">
                    {enq.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No enquiries found</p>
              <p className="text-slate-400 mt-0.5">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try changing your search keywords or status filter.'
                  : 'Messages submitted on the Contact page will show up here.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Enquiry"
        message="Are you sure you want to permanently delete this customer enquiry?"
        confirmText="Delete Enquiry"
        type="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

