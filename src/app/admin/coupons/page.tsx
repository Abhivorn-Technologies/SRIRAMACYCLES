'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  Search,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';

interface ICouponAdmin {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { success, error, info } = useToast();
  const [coupons, setCoupons] = useState<ICouponAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICouponAdmin | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderAmount: '0',
    maxDiscountAmount: '',
    expiryDate: '',
    usageLimit: '1000',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      } else {
        error(data.message || 'Failed to fetch coupons');
      }
    } catch (err) {
      error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '0',
      maxDiscountAmount: '',
      expiryDate: '',
      usageLimit: '1000',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: ICouponAdmin) => {
    setEditingCoupon(coupon);
    let expStr = '';
    if (coupon.expiryDate) {
      try {
        expStr = new Date(coupon.expiryDate).toISOString().split('T')[0];
      } catch (e) {
        expStr = '';
      }
    }
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue ? coupon.discountValue.toString() : '',
      minOrderAmount: coupon.minOrderAmount !== undefined ? coupon.minOrderAmount.toString() : '0',
      maxDiscountAmount: coupon.maxDiscountAmount !== undefined && coupon.maxDiscountAmount !== null ? coupon.maxDiscountAmount.toString() : '',
      expiryDate: expStr,
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '1000',
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      error('Please enter coupon code');
      return;
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      error('Please enter a valid discount value');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = !!editingCoupon;
      const url = isEdit ? `/api/admin/coupons/${editingCoupon._id}` : '/api/admin/coupons';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        success(isEdit ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        setIsModalOpen(false);
        setEditingCoupon(null);
        setFormData({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: '',
          minOrderAmount: '0',
          maxDiscountAmount: '',
          expiryDate: '',
          usageLimit: '1000',
          isActive: true,
        });
        fetchCoupons();
      } else {
        error(data.message || (isEdit ? 'Failed to update coupon' : 'Failed to create coupon'));
      }
    } catch (err) {
      error('An error occurred while saving coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon: ICouponAdmin) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Coupon ${coupon.code} is now ${!coupon.isActive ? 'Active' : 'Inactive'}`);
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !c.isActive } : c))
        );
      } else {
        error(data.message || 'Failed to update status');
      }
    } catch (err) {
      error('Error updating status');
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, code } = deleteTarget;
    setDeleteTarget(null);

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        success(`Coupon ${code} deleted successfully`);
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        error(data.message || 'Failed to delete coupon');
      }
    } catch (err) {
      error('Error deleting coupon');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredCoupons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Coupons & Discounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create promotional discount codes for customer checkout
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Coupons</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{coupons.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {coupons.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Redemptions</span>
          <p className="text-2xl font-black text-brand-700 mt-1">
            {coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCoupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Order</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 tracking-wider text-xs bg-brand-50 text-brand-700 border border-brand-200/80 px-2.5 py-0.5 rounded-md inline-block w-fit">
                          {coupon.code}
                        </span>
                        {coupon.description && (
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            {coupon.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `${formatPrice(coupon.discountValue)} OFF`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {coupon.minOrderAmount > 0
                        ? formatPrice(coupon.minOrderAmount)
                        : 'No Minimum'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(coupon)}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                          aria-label="Edit coupon"
                          title="Edit Coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: coupon._id, code: coupon.code })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          aria-label="Delete coupon"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
              itemLabel="coupons"
            />
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No coupons found. Click &quot;Create Coupon&quot; to add your first promotion.
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCoupon(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="flex flex-col gap-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                    }
                    placeholder="e.g. FESTIVE20"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs uppercase font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData((p) => ({ ...p, discountValue: e.target.value }))}
                    placeholder={formData.discountType === 'percentage' ? '15' : '500'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min. Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, minOrderAmount: e.target.value }))
                    }
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. 15% discount on all cycles"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit}
                    onChange={(e) => setFormData((p) => ({ ...p, usageLimit: e.target.value }))}
                    placeholder="1000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCoupon(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                >
                  {submitting
                    ? 'Saving...'
                    : editingCoupon
                    ? 'Update Coupon'
                    : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deleteTarget?.code}"? This action cannot be undone.`}
        confirmText="Delete Coupon"
        type="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
