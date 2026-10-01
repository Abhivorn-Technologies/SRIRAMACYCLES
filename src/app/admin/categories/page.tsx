'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, FolderTree, X, Eye, EyeOff } from 'lucide-react';
import { ICategory } from '@/types';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    order: '0',
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories?all=true');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '', order: '0', isActive: true });
    setModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order?.toString() || '0',
      isActive: cat.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (cat: ICategory) => {
    const updatedStatus = cat.isActive === false ? true : false;
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c._id === cat._id ? { ...c, isActive: updatedStatus } : c))
    );
    try {
      const res = await fetch(`/api/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        success(`"${cat.name}" is now ${updatedStatus ? 'Live on Website' : 'Hidden from Website'}`);
      } else {
        // Rollback
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? { ...c, isActive: cat.isActive } : c))
        );
        error(data.message || 'Failed to update visibility');
      }
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: cat.isActive } : c))
      );
      error('Failed to update category visibility');
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
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Category deleted successfully');
        setCategories((p) => p.filter((c) => c._id !== id));
      } else {
        error(data.message || 'Failed to delete category');
      }
    } catch (err) {
      error('An error occurred');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order),
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();

      if (data.success) {
        success(editingCategory ? 'Category updated' : 'Category created');
        setModalOpen(false);
        fetchCategories();
      } else {
        error(data.message || 'Operation failed');
      }
    } catch (err) {
      error('An error occurred');
    }
  };

  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Hierarchy & Classification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Website Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FolderTree className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{cat.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {cat.description || 'No description'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-md text-slate-700">
                        {cat.productCount || 0} items
                      </span>
                    </td>

                    {/* Website Visibility */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border shadow-2xs hover:scale-105 active:scale-95 cursor-pointer ${
                          cat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={
                          cat.isActive !== false
                            ? 'Currently LIVE on website. Click to Hide.'
                            : 'Currently HIDDEN from website. Click to Publish.'
                        }
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cat.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {cat.isActive !== false ? (
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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
              itemLabel="categories"
            />
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No categories found.</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Mountain Cycles"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="e.g. mountain-cycles"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Category description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium resize-none"
                />
              </div>

              {/* Show on Website Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Show on Website</span>
                  <span className="text-[11px] text-slate-500">Enable this category across customer shop navigation and filters</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? All items under this category may be affected.`}
        confirmText="Delete Category"
        type="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
