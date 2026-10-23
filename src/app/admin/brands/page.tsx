'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Building2,
  X,
} from 'lucide-react';
import { IBrand } from '@/types';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';
import { slugify } from '@/lib/utils';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: '',
    order: '0',
    isActive: true,
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brands?all=true');
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch {
      error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo: '',
      order: String(brands.length + 1),
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b: IBrand) => {
    setEditingBrand(b);
    setFormData({
      name: b.name,
      slug: b.slug,
      description: b.description || '',
      logo: b.logo || '',
      order: String(b.order ?? 0),
      isActive: b.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (brandItem: IBrand) => {
    const updatedStatus = !brandItem.isActive;
    // Optimistic update
    setBrands((prev) =>
      prev.map((b) => (b._id === brandItem._id ? { ...b, isActive: updatedStatus } : b))
    );
    try {
      const res = await fetch(`/api/brands/${brandItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(`"${brandItem.name}" is now ${updatedStatus ? 'Active' : 'Hidden/Inactive'}`);
      } else {
        // Rollback
        setBrands((prev) =>
          prev.map((b) => (b._id === brandItem._id ? { ...b, isActive: brandItem.isActive } : b))
        );
        error(data.message || 'Failed to update brand status');
      }
    } catch {
      setBrands((prev) =>
        prev.map((b) => (b._id === brandItem._id ? { ...b, isActive: brandItem.isActive } : b))
      );
      error('Failed to update brand status');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleteTarget(null);

    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success(`Brand "${name}" deleted successfully`);
        setBrands((p) => p.filter((b) => b._id !== id));
      } else {
        error(data.message || 'Failed to delete brand');
      }
    } catch {
      error('An error occurred while deleting brand');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Brand Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || slugify(formData.name.trim()),
        description: formData.description.trim(),
        logo: formData.logo.trim(),
        order: Number(formData.order) || 0,
        isActive: formData.isActive,
      };

      if (editingBrand) {
        const res = await fetch(`/api/brands/${editingBrand._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          success(`Brand "${data.brand.name}" updated successfully!`);
          setBrands((prev) =>
            prev.map((b) => (b._id === editingBrand._id ? data.brand : b))
          );
          setModalOpen(false);
        } else {
          error(data.message || 'Failed to update brand');
        }
      } else {
        const res = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          success(`Brand "${data.brand.name}" added successfully!`);
          setBrands((prev) => [...prev, data.brand]);
          setModalOpen(false);
        } else {
          error(data.message || 'Failed to create brand');
        }
      }
    } catch {
      error('Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered brands
  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && b.isActive) ||
      (statusFilter === 'inactive' && !b.isActive);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage) || 1;
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Brand Management
            </h1>
            <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-200/60">
              {brands.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage bicycle & spare parts brands (Gang, Zeus, Ralco, Rajanik, Vallabha, Speed & new brands)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Brand
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Brands</p>
              <p className="text-lg sm:text-xl font-black text-slate-900">{brands.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Brands</p>
              <p className="text-lg sm:text-xl font-black text-emerald-600">
                {brands.filter((b) => b.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Default Stock</p>
              <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                Gang, Zeus, Ralco, Rajanik...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brands by company name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Hidden/Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-xs text-slate-500 font-semibold">Loading brands...</p>
          </div>
        ) : paginatedBrands.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No brands found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No brands matched "${searchQuery}". Try clearing search.`
                : 'Click "Add New Brand" to add your first company brand.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Brand / Company Name</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBrands.map((b, idx) => {
                  const serialNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center font-mono text-slate-400 font-medium">
                        {serialNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-50 to-slate-100 border border-brand-100 flex items-center justify-center text-brand-600 font-black text-sm shrink-0 shadow-2xs">
                            {b.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors text-sm">
                              {b.name}
                            </span>
                            {['Gang', 'Zeus', 'Ralco', 'Rajanik', 'Vallabha', 'Speed'].includes(b.name) && (
                              <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                                Official
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {b.slug}
                      </td>

                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {b.description || '—'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(b)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            b.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {b.isActive ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Brand"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b._id, b.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredBrands.length > itemsPerPage && (
          <div className="p-4 border-t border-slate-100 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBrands.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Brand Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand / Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gang, Zeus, Hero..."
                  value={formData.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name: newName,
                      slug: !editingBrand ? slugify(newName) : prev.slug,
                    }));
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Slug (URL / Key)
                </label>
                <input
                  type="text"
                  placeholder="e.g. gang"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-600 font-mono focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Premium MTB & Geared Bicycles"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">Active / Enabled</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : editingBrand ? (
                    'Update Brand'
                  ) : (
                    'Add Brand'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Brand?"
        message={`Are you sure you want to delete brand "${deleteTarget?.name}"? Offline records that already have this brand will retain their saved name.`}
        confirmText="Delete Brand"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
