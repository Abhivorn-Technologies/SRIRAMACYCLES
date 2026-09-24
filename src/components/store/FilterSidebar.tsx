'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ICategory } from '@/types';
import { formatPrice } from '@/lib/utils';

interface IFilterSidebarProps {
  categories: ICategory[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  availableBrands: string[];
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxPrice: number;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  availableBrands,
  priceRange,
  onPriceChange,
  maxPrice,
  inStockOnly,
  onToggleInStock,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
}: IFilterSidebarProps) {
  const content = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Filters</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-800 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-brand-50 text-brand-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Max Price</h4>
          <span className="text-xs font-bold text-brand-700">{formatPrice(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={maxPrice > 1000 ? maxPrice : 250000}
          step={1000}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>₹1,000</span>
          <span>{formatPrice(maxPrice > 1000 ? maxPrice : 250000)}</span>
        </div>
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Brands
          </h4>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onSelectBrand('')}
              className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                selectedBrand === ''
                  ? 'bg-brand-50 text-brand-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Brands
            </button>
            {availableBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => onSelectBrand(brand)}
                className={`text-left text-xs py-1.5 px-2.5 rounded-lg font-medium transition-colors ${
                  selectedBrand === brand
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In Stock Toggle */}
      <div className="border-t border-slate-100 pt-5">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-800">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900">Filter Options</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
