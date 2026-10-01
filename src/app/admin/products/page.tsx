'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Package,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import { IProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { success, error } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const activeParam =
        statusFilter === 'active'
          ? '&isActive=true'
          : statusFilter === 'inactive'
            ? '&isActive=false'
            : '';
      const res = await fetch(
        `/api/products?all=true&page=${currentPage}&limit=${itemsPerPage}${search ? `&search=${encodeURIComponent(search)}` : ''}${activeParam}`
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
          setTotalItems(data.pagination.total || 0);
        }
      }
    } catch (err) {
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, currentPage, statusFilter]);

  const handleToggleActive = async (p: IProduct) => {
    const updatedStatus = p.isActive === false ? true : false;
    // Optimistic update
    setProducts((prev) =>
      prev.map((item) => (item._id === p._id ? { ...item, isActive: updatedStatus } : item))
    );
    try {
      const res = await fetch(`/api/products/${p._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(`"${p.name}" is now ${updatedStatus ? 'Live on Website' : 'Hidden from Website'}`);
      } else {
        // Rollback
        setProducts((prev) =>
          prev.map((item) => (item._id === p._id ? { ...item, isActive: p.isActive } : item))
        );
        error(data.message || 'Failed to update visibility');
      }
    } catch (err) {
      setProducts((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, isActive: p.isActive } : item))
      );
      error('Failed to update product visibility');
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
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Product deleted successfully');
        setProducts((p) => p.filter((x) => x._id !== id));
      } else {
        error(data.message || 'Error deleting product');
      }
    } catch (err) {
      error('An error occurred during deletion');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Inventory & Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Product Management ({totalItems || products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Cycle / Gear</span>
        </Link>
      </div>

      {/* Filter Bar with Visibility Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by product name, SKU, brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Website Visibility Quick Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => {
              setStatusFilter('active');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live on Website
          </button>
          <button
            onClick={() => {
              setStatusFilter('inactive');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'inactive'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <EyeOff className="w-3 h-3 text-slate-400" />
            Hidden
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Website Visibility</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const img = p.images?.[0] || '';
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {img && <Image src={img} alt={p.name} fill sizes="48px" className="object-cover" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {p.sku || 'N/A'} • {p.brand}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {p.categoryName || (p.category as any)?.name || 'Standard'}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">
                          {formatPrice(p.salePrice && p.salePrice > 0 ? p.salePrice : p.price)}
                        </span>
                        {p.salePrice && p.salePrice > 0 && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full ${
                            p.stock > 5
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.stock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>

                      {/* Website Visibility */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border shadow-2xs hover:scale-105 active:scale-95 cursor-pointer ${
                            p.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={p.isActive !== false ? 'Currently LIVE on website. Click to Hide.' : 'Currently HIDDEN from website. Click to Publish.'}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          {p.isActive !== false ? (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-emerald-600" /> Live on Website
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Hidden
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.isFeatured && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p._id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
              itemLabel="products"
            />
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No products found matching the criteria.
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete product "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        type="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
