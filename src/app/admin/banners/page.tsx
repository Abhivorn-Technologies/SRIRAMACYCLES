'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, Image as ImageIcon, X, Compass, Link as LinkIcon, ExternalLink, Sparkles, Check } from 'lucide-react';
import { IBanner } from '@/types';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';
import Pagination from '@/components/common/Pagination';

interface ICategoryOption {
  _id: string;
  name: string;
  slug: string;
}

interface IProductOption {
  _id: string;
  name: string;
  slug: string;
  price: number;
}

const IMAGE_PRESETS = [
  { label: '🏔️ Mountain MTB', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&auto=format&fit=crop&q=80' },
  { label: '⚡ Road Speed', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&auto=format&fit=crop&q=80' },
  { label: '👧 Kids Cycling', url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1600&auto=format&fit=crop&q=80' },
  { label: '🏙️ City Commute', url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1600&auto=format&fit=crop&q=80' },
  { label: '🛠️ Workshop', url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1600&auto=format&fit=crop&q=80' },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [categories, setCategories] = useState<ICategoryOption[]>([]);
  const [products, setProducts] = useState<IProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomUrl, setIsCustomUrl] = useState(false);
  const itemsPerPage = 6;
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tag: '',
    image: '',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
    position: 'hero',
    order: '0',
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (err) {
      error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreOptions = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products?limit=100'),
      ]);
      const catData = await catRes.json();
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
      const prodData = await prodRes.json();
      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }
    } catch (err) {
      // Non-critical: presets still provide sensible defaults
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchStoreOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setIsCustomUrl(false);
    setFormData({
      title: '',
      subtitle: '',
      tag: '',
      image: '',
      ctaText: 'Shop Now',
      ctaLink: '/shop',
      position: 'hero',
      order: '0',
    });
    setModalOpen(true);
  };

  const openEditModal = (b: IBanner) => {
    setEditingBanner(b);
    // Check if the current ctaLink is an external URL or custom format
    const link = b.ctaLink || '/shop';
    const isStandard =
      link === '/shop' ||
      link.startsWith('/shop?') ||
      link.startsWith('/product/') ||
      link === '/about' ||
      link === '/contact' ||
      link === '/track-order';
    setIsCustomUrl(!isStandard);

    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      tag: b.tag || '',
      image: b.image,
      ctaText: b.ctaText || 'Shop Now',
      ctaLink: link,
      position: b.position || 'hero',
      order: b.order?.toString() || '0',
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);

    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        success('Banner deleted');
        setBanners((p) => p.filter((x) => x._id !== id));
      } else {
        error(data.message || 'Error deleting banner');
      }
    } catch (err) {
      error('An error occurred');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return;

    try {
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order),
        }),
      });

      const data = await res.json();

      if (data.success) {
        success(editingBanner ? 'Banner updated' : 'Banner created');
        setModalOpen(false);
        fetchBanners();
      } else {
        error(data.message || 'Failed to save banner');
      }
    } catch (err) {
      error('An error occurred');
    }
  };

  const totalItems = banners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedBanners = banners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Marketing & Homepage
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Banner Management ({banners.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : banners.length > 0 ? (
          paginatedBanners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative aspect-[16/8] w-full bg-slate-900">
                <Image src={b.image} alt={b.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover opacity-80" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white bg-gradient-to-t from-slate-950/90 to-transparent">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    {b.tag || 'Hero Slide'}
                  </span>
                  <h3 className="text-base font-bold leading-snug line-clamp-2">{b.title}</h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-slate-100 text-xs text-slate-600">
                <span>
                  CTA: <strong>{b.ctaText}</strong> ({b.ctaLink})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-brand-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-slate-400 text-xs">
            No active banners found.
          </div>
        )}
      </div>

      {banners.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
          itemLabel="banners"
          className="rounded-2xl border border-slate-200/80 shadow-xs"
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 shrink-0 bg-white z-10">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingBanner ? 'Edit Banner' : 'Create Banner'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Configure headline, image & button destination</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-8 sm:py-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Banner Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Conquer Mountain Trails"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sub-headline / Supporting Text
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Short description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Badge Tag (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="e.g. 2026 Pro Series Launch"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Background Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Quick Photos:</span>
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, image: preset.url }))}
                      className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border transition-all ${
                        formData.image === preset.url
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Destination Picker (No coding needed) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-brand-600" />
                    Button Destination (Where it takes customer)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomUrl(!isCustomUrl)}
                    className="text-[11px] text-brand-600 hover:text-brand-700 font-bold underline"
                  >
                    {isCustomUrl ? '← Select from Store Menu' : 'Type Custom Link →'}
                  </button>
                </div>

                {!isCustomUrl ? (
                  <div>
                    <select
                      value={formData.ctaLink}
                      onChange={(e) => {
                        const selectedUrl = e.target.value;
                        if (selectedUrl === 'custom') {
                          setIsCustomUrl(true);
                          return;
                        }
                        // Auto-suggest button text if default or empty
                        let suggestedText = formData.ctaText;
                        if (!formData.ctaText || formData.ctaText === 'Shop Now') {
                          if (selectedUrl.startsWith('/shop?category=')) {
                            const catSlug = selectedUrl.replace('/shop?category=', '');
                            const foundCat = categories.find((c) => c.slug === catSlug);
                            if (foundCat) suggestedText = `Explore ${foundCat.name}`;
                          } else if (selectedUrl.startsWith('/product/')) {
                            suggestedText = 'Buy Now';
                          } else if (selectedUrl === '/shop?onSale=true') {
                            suggestedText = 'View Discount Deals';
                          } else if (selectedUrl === '/about') {
                            suggestedText = 'Our Heritage Story';
                          } else if (selectedUrl === '/contact') {
                            suggestedText = 'Visit Showroom';
                          } else if (selectedUrl === '/track-order') {
                            suggestedText = 'Track Order';
                          }
                        }

                        setFormData((p) => ({
                          ...p,
                          ctaLink: selectedUrl,
                          ctaText: suggestedText,
                        }));
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
                    >
                      <option value="/shop">🛒 All Cycles & Products Catalog (/shop)</option>

                      <optgroup label="🚴 Cycle Categories">
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <option key={cat._id} value={`/shop?category=${cat.slug}`}>
                              {cat.name} ({cat.slug})
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="/shop?category=road-bikes">Road Bikes (/shop?category=road-bikes)</option>
                            <option value="/shop?category=mountain-bikes">Mountain Bikes (/shop?category=mountain-bikes)</option>
                            <option value="/shop?category=kids-bikes">Kids Bikes (/shop?category=kids-bikes)</option>
                            <option value="/shop?category=electric-bikes">Electric Bikes (/shop?category=electric-bikes)</option>
                            <option value="/shop?category=spare-parts">Spare Parts & Accessories (/shop?category=spare-parts)</option>
                          </>
                        )}
                      </optgroup>

                      {products.length > 0 && (
                        <optgroup label="🚲 Direct Cycle / Product Pages">
                          {products.map((prod) => (
                            <option key={prod._id} value={`/product/${prod.slug}`}>
                              {prod.name} — ₹{prod.price?.toLocaleString('en-IN')}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      <optgroup label="🔥 Special Deals & Collections">
                        <option value="/shop?onSale=true">On Sale / Discounted Deals (/shop?onSale=true)</option>
                        <option value="/shop?sort=newest">New Arrivals (/shop?sort=newest)</option>
                        <option value="/shop?sort=rating">Top Rated Cycles (/shop?sort=rating)</option>
                      </optgroup>

                      <optgroup label="📍 Key Store Information">
                        <option value="/about">Sri Rama 50-Year Heritage Story (/about)</option>
                        <option value="/contact">Showroom & Workshop Location (/contact)</option>
                        <option value="/track-order">Track Customer Order (/track-order)</option>
                      </optgroup>

                      <optgroup label="⚙️ Custom Destination">
                        <option value="custom">Type Custom / External URL...</option>
                      </optgroup>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData((p) => ({ ...p, ctaLink: e.target.value }))}
                        placeholder="e.g. /shop?category=road-bikes or https://..."
                        className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Enter an internal route (starting with /) or an external link (https://).
                    </p>
                  </div>
                )}

                {/* Target Route Verification Pill */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-brand-50/70 border border-brand-200/80 rounded-xl text-[11px] text-brand-900">
                  <span className="font-bold text-brand-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    Target Destination:
                  </span>
                  <code className="bg-white px-2 py-0.5 rounded text-[11px] font-mono text-brand-800 border border-brand-100 shadow-2xs">
                    {formData.ctaLink || '/shop'}
                  </code>
                </div>

                {/* Button Label & Fast Suggestions */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Button Label (Text on Button) *</label>
                    <span className="text-[10px] text-slate-400">Displayed inside the button</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData((p) => ({ ...p, ctaText: e.target.value }))}
                    placeholder="e.g. Explore Bikes, Shop Now, Buy Now"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Quick Labels:</span>
                    {['Shop Now', 'Explore Bikes', 'Buy Now', 'View Deals', 'Visit Showroom', 'Our Story'].map(
                      (label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, ctaText: label }))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border transition-colors ${
                            formData.ctaText === label
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-between px-6 py-3.5 sm:px-8 sm:py-4 border-t border-slate-100 bg-slate-50/80 shrink-0 z-10">
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  {editingBanner ? 'Updating existing banner' : 'Creating new homepage banner'}
                </span>
                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 active:scale-95 rounded-xl shadow-sm transition-all"
                  >
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Banner"
        message="Are you sure you want to delete this promo banner? This action cannot be undone."
        confirmText="Delete Banner"
        type="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
