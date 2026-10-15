'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Star,
  Search,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  ShoppingBag,
  Calendar,
  Sparkles,
  TrendingUp,
  RefreshCw,
  MessageSquare,
  Package,
  Award,
} from 'lucide-react';
import { IReview } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';

interface IReviewStats {
  totalReviews: number;
  averageRating: number;
  fiveStarCount: number;
  satisfactionRate: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [stats, setStats] = useState<IReviewStats>({
    totalReviews: 0,
    averageRating: 5.0,
    fiveStarCount: 0,
    satisfactionRate: 100,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [deleteTarget, setDeleteTarget] = useState<IReview | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { success, error } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('admin', 'true');
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        error(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      error('Failed to connect to review service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingFilter, search]);

  const handleToggleApproval = async (review: IReview) => {
    const updatedStatus = !review.isApproved;
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => (r._id === review._id ? { ...r, isApproved: updatedStatus } : r))
    );

    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(
          `Review by ${review.name} is now ${updatedStatus ? 'Approved & Visible' : 'Hidden'}`
        );
      } else {
        // Rollback
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, isApproved: review.isApproved } : r))
        );
        error(data.message || 'Failed to update review visibility');
      }
    } catch (err) {
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? { ...r, isApproved: review.isApproved } : r))
      );
      error('Failed to update review visibility');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);

    try {
      const res = await fetch(`/api/reviews/${target._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Review deleted successfully');
        setReviews((prev) => prev.filter((r) => r._id !== target._id));
        setStats((prev) => ({
          ...prev,
          totalReviews: Math.max(0, prev.totalReviews - 1),
        }));
      } else {
        error(data.message || 'Failed to delete review');
      }
    } catch (err) {
      error('An error occurred while deleting review');
    }
  };

  const totalItems = reviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Customer Voice &amp; Feedback</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Customer Reviews &amp; Ratings ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified ratings and review messages submitted by customers after placing and receiving orders.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= Math.round(stats.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.totalReviews}
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-1">
            Across online orders &amp; doorstep deliveries
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">5-Star Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.fiveStarCount}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1">
            {stats.satisfactionRate}% Top Satisfaction
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Customer Trust</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            100%
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-1">
            Verified buyer order linkage
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by customer name, phone, email, order #, or review text..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Rating Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto self-start sm:self-auto shrink-0">
          {(['all', '5', '4', '3', '2', '1'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRatingFilter(r);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                ratingFilter === r
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r === 'all' ? (
                'All Ratings'
              ) : (
                <>
                  <span>{r}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Content Grid */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-3xl border border-slate-200">
          <LoadingSpinner size="lg" />
        </div>
      ) : paginatedReviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedReviews.map((rev) => {
              const customerInitial = rev.name ? rev.name.charAt(0).toUpperCase() : 'C';

              return (
                <div
                  key={rev._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between gap-5 hover:border-slate-300 transition-all group"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Row: Customer Info & Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                          {customerInitial}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900 truncate">
                              {rev.name}
                            </h3>
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                              Verified Order
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                            {rev.phone && (
                              <a
                                href={`tel:${rev.phone}`}
                                className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                                title="Call customer"
                              >
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{rev.phone}</span>
                              </a>
                            )}
                            {rev.email && (
                              <a
                                href={`mailto:${rev.email}`}
                                className="flex items-center gap-1 hover:text-brand-600 transition-colors"
                                title="Email customer"
                              >
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span className="truncate max-w-[140px]">{rev.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Golden Star Rating Badge */}
                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl">
                          <span className="text-xs font-black text-amber-800">{rev.rating}.0</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Reference Badge & Cycle Tag */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      {rev.orderNumber && (
                        <Link
                          href={`/admin/orders`}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                          title="View order in Orders panel"
                        >
                          <ShoppingBag className="w-3 h-3 text-brand-600" />
                          <span>Order #{rev.orderNumber}</span>
                        </Link>
                      )}

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                          rev.reviewContext === 'order_received'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {rev.reviewContext === 'order_received'
                          ? '📦 Delivery / Received Review'
                          : '⚡ Order Placed Feedback'}
                      </span>

                      {rev.productName && (
                        <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[200px] flex items-center gap-1">
                          <Package className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{rev.productName}</span>
                        </span>
                      )}
                    </div>

                    {/* Customer Review Message Box */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium relative">
                      <p className="italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer: Date & Admin Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDateTime(rev.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => handleToggleApproval(rev)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer border ${
                          rev.isApproved !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={
                          rev.isApproved !== false
                            ? 'Visible on public store. Click to hide.'
                            : 'Hidden from public store. Click to publish.'
                        }
                      >
                        {rev.isApproved !== false ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Approved</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Delete Action */}
                      <button
                        onClick={() => setDeleteTarget(rev)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
              itemLabel="customer reviews"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Customer Reviews Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            {search || ratingFilter !== 'all'
              ? 'Try clearing your search query or rating filter to view all feedback.'
              : 'When customers complete an order or track their delivery, their ratings and feedback messages will appear here.'}
          </p>
          {(search || ratingFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setRatingFilter('all');
              }}
              className="mt-2 text-xs font-bold text-brand-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Customer Review"
        message={`Are you sure you want to delete the review by "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Review"
        type="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
