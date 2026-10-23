'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  X,
  Layers,
  DollarSign,
  Tag,
  FileText,
  Sliders,
  RotateCw,
  Sparkles,
  Bike,
} from 'lucide-react';
import { ICategory, ISpecification, IVariant } from '@/types';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const COMMON_CYCLE_SIZES = [
  '20T',
  '24T',
  '26T',
  '27.5T',
  '29T',
  '17" (Medium)',
  '18.5" (Large)',
  'Small',
  'Medium',
  'Large',
];

const generateSku = (categoryName?: string) => {
  const prefix = 'SRC';
  let catPart = 'CYC';
  if (categoryName) {
    const clean = categoryName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    if (clean.length >= 2) catPart = clean;
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${catPart}-${randomNum}`;
};

export default function AddProductPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<string[]>([
    'Gang',
    'Zeus',
    'Ralco',
    'Rajanik',
    'Vallabha',
    'Speed',
  ]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Gang',
    category: '',
    price: '',
    salePrice: '',
    stock: '10',
    sku: generateSku(),
    shortDescription: '',
    description: '',
    images: [] as string[],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
  });

  const [variants, setVariants] = useState<Array<{ size: string; stock: number; color?: string }>>([
    { size: '26T', stock: 10 },
    { size: '27.5T', stock: 10 },
  ]);
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [specs, setSpecs] = useState<ISpecification[]>([
    { key: 'Frame', value: '6061 Double Butted Aluminium Alloy' },
    { key: 'Gears', value: 'Shimano 21-Speed' },
    { key: 'Brakes', value: 'Dual Mechanical Disc Brakes 160mm' },
    { key: 'Weight', value: '11.5 kg' },
  ]);

  const handleToggleSize = (sizeName: string) => {
    const exists = variants.some((v) => v.size.toLowerCase() === sizeName.toLowerCase());
    if (exists) {
      setVariants((prev) => prev.filter((v) => v.size.toLowerCase() !== sizeName.toLowerCase()));
    } else {
      const defaultStock = parseInt(formData.stock, 10) || 10;
      setVariants((prev) => [...prev, { size: sizeName, stock: defaultStock }]);
    }
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customSizeInput.trim();
    if (!clean) return;
    const exists = variants.some((v) => v.size.toLowerCase() === clean.toLowerCase());
    if (!exists) {
      const defaultStock = parseInt(formData.stock, 10) || 10;
      setVariants((prev) => [...prev, { size: clean, stock: defaultStock }]);
    }
    setCustomSizeInput('');
  };

  const handleRemoveSize = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantStockChange = (index: number, val: number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, stock: Math.max(0, val) } : v))
    );
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands?all=true'),
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();

        if (catData.success && catData.categories.length > 0) {
          setCategories(catData.categories);
          setFormData((p) => ({
            ...p,
            category: catData.categories[0]._id,
            sku: p.sku && p.sku !== 'SRC-CYC-1000' ? p.sku : generateSku(catData.categories[0].name),
          }));
        }

        if (brandData.success && brandData.brands?.length > 0) {
          const names: string[] = brandData.brands.map((b: any) => b.name);
          setBrands(names);
          setFormData((p) => ({
            ...p,
            brand: names[0] || 'Gang',
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => {
        const updated = { ...p, [name]: value };
        if (name === 'category') {
          const cat = categories.find((c) => c._id === value);
          if (cat && (!p.sku || p.sku.startsWith('SRC-'))) {
            updated.sku = generateSku(cat.name);
          }
        }
        return updated;
      });
    }
  };

  // Direct Image File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadData = new FormData();
        uploadData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
          success(`Image "${file.name}" uploaded successfully!`);
        } else {
          error(data.message || 'Failed to upload image');
        }
      }
    } catch (err) {
      error('An error occurred during file upload');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add image by URL
  const handleAddUrlImage = () => {
    if (!customImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, customImageUrl.trim()],
    }));
    setCustomImageUrl('');
    success('Image URL added to gallery');
  };

  const removeImage = (index: number) => {
    setFormData((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const addSpecField = () => {
    setSpecs((p) => [...p, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    setSpecs((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name || !formData.price || !formData.category) {
      error('Please provide Product Name, Price, and Category');
      return;
    }

    setLoading(true);

    try {
      const selectedCategoryObj = categories.find((c) => c._id === formData.category);

      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || 'Srirama Cycles',
        category: formData.category,
        categorySlug: selectedCategoryObj?.slug || '',
        categoryName: selectedCategoryObj?.name || '',
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
        stock: parseInt(formData.stock, 10) || 0,
        sku:
          formData.sku.trim() ||
          `SRC-${Date.now().toString().slice(-6)}`,
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        images:
          formData.images.length > 0
            ? formData.images
            : ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000&q=80'],
        variants: variants.filter((v) => v.size && v.size.trim().length > 0),
        specifications: specs.filter((s) => s.key && s.value),
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        isActive: true,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        success('Product successfully published to store catalog!');
        router.push('/admin/products');
      } else {
        error(data.message || 'Failed to create product');
      }
    } catch (err) {
      error('An error occurred while creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-20">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Add New Product
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish a new cycle, accessory, or auto spare part to the public catalog
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white text-xs sm:text-sm font-extrabold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all btn-glow cursor-pointer"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Publish Product</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* 1. Basic Information Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Product Title / Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Srirama Apex Carbon Road Bike 700C"
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Brand / Manufacturer <span className="text-rose-500">*</span>
                </label>
                <a
                  href="/admin/brands"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  + Add New Brand
                </a>
              </div>
              <select
                name="brand"
                required
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-medium cursor-pointer"
              >
                <option value="" disabled>-- Select Brand --</option>
                {brands.map((bName) => (
                  <option key={bName} value={bName}>
                    {bName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Store Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Item Code / SKU</span>
                  <span className="text-rose-500">*</span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Auto-generated
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const cat = categories.find((c) => c._id === formData.category);
                    const newCode = generateSku(cat?.name);
                    setFormData((p) => ({ ...p, sku: newCode }));
                    success(`New Item Code generated: ${newCode}`);
                  }}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Generate a new Item Code"
                >
                  <RotateCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g. SRC-ROA-4821"
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-mono font-bold uppercase tracking-wider"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Unique identifier automatically assigned for in-store billing &amp; inventory tracking.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Stock Available
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="10"
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* 2. Pricing & Financials */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Pricing & Discount
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Regular Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 29999"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Discounted / Offer Sale Price (₹)
              </label>
              <input
                type="number"
                name="salePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleInputChange}
                placeholder="e.g. 24999 (Leave empty if no discount)"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-bold text-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 3. Cycle Sizes & Frame Dimensions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Available Cycle Sizes &amp; Dimensions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify cycle frame / wheel sizes (e.g. 26T, 27.5T, 29T). Customers can pick their size on product &amp; checkout pages.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Selection Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Quick Click to Add Common Cycle Sizes:
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_CYCLE_SIZES.map((size) => {
                const isSelected = variants.some((v) => v.size.toLowerCase() === size.toLowerCase());
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleToggleSize(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{size}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Size Input */}
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSize();
                }
              }}
              placeholder="Or type custom size (e.g. 28T, 20 Inch, Junior 16T)..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none font-medium"
            />
            <button
              type="button"
              onClick={() => handleAddCustomSize()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Size</span>
            </button>
          </div>

          {/* Active Sizes List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Configured Sizes for this Product ({variants.length}):
            </label>
            {variants.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-semibold">
                ⚠️ No specific sizes added. Product will be sold as standard one-size. Click any button above to add sizes.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 border border-blue-200/80 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                        {v.size}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-bold">Qty:</span>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => handleVariantStockChange(idx, parseInt(e.target.value, 10) || 0)}
                          className="w-14 bg-white border border-slate-300 rounded-lg px-1.5 py-0.5 text-xs font-black text-slate-900 text-center"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      className="w-6 h-6 rounded-full bg-white hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove size"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Product Images & Direct Upload */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                4. Product Images Gallery
              </h2>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  imageInputMode === 'upload'
                    ? 'bg-white text-purple-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  imageInputMode === 'url'
                    ? 'bg-white text-purple-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Add via Web URL
              </button>
            </div>
          </div>

          {/* Direct File Upload Dropzone or URL Input */}
          <div className="flex flex-col gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {imageInputMode === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 group-hover:text-emerald-600 group-hover:border-emerald-300 flex items-center justify-center shadow-xs transition-colors">
                  {uploadingImage ? (
                    <LoadingSpinner size="md" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {uploadingImage
                      ? 'Uploading image files...'
                      : 'Click here to Upload Images from your device'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports PNG, JPG, WEBP, and SVG (You can select multiple photos)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700">Direct Web Image Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrlImage();
                      }
                    }}
                    placeholder="https://images.unsplash.com/... or any direct HTTPS image link"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
                  >
                    Add to Gallery
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tip: Press Enter or click &quot;Add to Gallery&quot; to append this image.
                </p>
              </div>
            )}
          </div>

          {/* Gallery Previews */}
          {formData.images.length > 0 && (
            <div className="mt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2.5">
                Current Gallery Photos ({formData.images.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {formData.images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        Cover
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Descriptions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              5. Descriptions
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Short Description (Card Summary)
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="e.g. Ultra-light 6061 alloy with Shimano 21-speed shifters and dual disc brakes."
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Detailed Product Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed specifications, frame build, riding posture, gearing, and warranty info..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all font-medium resize-y"
            />
          </div>
        </div>

        {/* 6. Technical Specifications */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                6. Technical Specifications
              </h2>
            </div>

            <button
              type="button"
              onClick={addSpecField}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spec Row</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  placeholder="Specification Name (e.g. Frame)"
                  className="w-1/3 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none font-semibold"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Value / Details (e.g. 6061 Alloy)"
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none font-medium"
                />
                {specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecField(index)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 7. Visibility Badges */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              7. Catalog Badges
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800">Featured on Home Page</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800">Best Seller Tag</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800">New Arrival Tag</span>
            </label>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm py-3 px-6 rounded-2xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white text-xs sm:text-sm font-extrabold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all btn-glow cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
