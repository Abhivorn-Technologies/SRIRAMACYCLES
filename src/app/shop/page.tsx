'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { SlidersHorizontal, PackageSearch, RefreshCw } from 'lucide-react';
import { IProduct, ICategory } from '@/types';
import ProductCard from '@/components/store/ProductCard';
import FilterSidebar from '@/components/store/FilterSidebar';
import QuickViewModal from '@/components/store/QuickViewModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [isBestSellerOnly, setIsBestSellerOnly] = useState(searchParams.get('bestSeller') === 'true');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  // Sync URL search params on initial load or param change
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const q = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const feat = searchParams.get('featured') === 'true';
    const best = searchParams.get('bestSeller') === 'true';

    setSelectedCategory(cat);
    setSelectedBrand(brand);
    setSearchQuery(q);
    setSortBy(sort);
    setIsFeaturedOnly(feat);
    setIsBestSellerOnly(best);
  }, [searchParams]);

  // Fetch Categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Products based on active filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (searchQuery) params.append('search', searchQuery);
      if (isFeaturedOnly) params.append('featured', 'true');
      if (isBestSellerOnly) params.append('bestSeller', 'true');
      if (priceRange[1] < 150000) params.append('maxPrice', priceRange[1].toString());
      if (inStockOnly) params.append('inStock', 'true');
      if (sortBy) params.append('sort', sortBy);
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.pages || 1);
        setTotalCount(data.pagination.total || 0);
        if (data.availableBrands) {
          setAvailableBrands(data.availableBrands);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, searchQuery, isFeaturedOnly, isBestSellerOnly, priceRange, inStockOnly, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    setIsFeaturedOnly(false);
    setIsBestSellerOnly(false);
    setPriceRange([0, 150000]);
    setInStockOnly(false);
    setSortBy('newest');
    setPage(1);
    router.push('/shop');
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    if (slug) {
      router.push(`/shop?category=${slug}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Integrated Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Srirama Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || 'Filtered Cycles'
                : searchQuery
                  ? `Search: "${searchQuery}"`
                  : 'All Cycles & Accessories'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {products.length} of {totalCount} items
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-brand-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Compact Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Popular & Best Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags (Shown only if any filter is active) */}
        {(selectedCategory || selectedBrand || searchQuery || isFeaturedOnly || isBestSellerOnly) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 -mt-2">
            {isFeaturedOnly && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">
                Featured Cycles
                <button
                  onClick={() => {
                    setIsFeaturedOnly(false);
                    router.push(selectedCategory ? `/shop?category=${selectedCategory}` : '/shop');
                  }}
                  className="hover:text-amber-950 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {isBestSellerOnly && (
              <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-300 text-brand-800 text-xs font-semibold px-3 py-1 rounded-full">
                Best Sellers
                <button
                  onClick={() => {
                    setIsBestSellerOnly(false);
                    router.push(selectedCategory ? `/shop?category=${selectedCategory}` : '/shop');
                  }}
                  className="hover:text-brand-950 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full">
                Category: {selectedCategory}
                <button onClick={() => handleCategorySelect('')} className="hover:text-brand-900 font-bold ml-0.5">
                  ×
                </button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('')} className="hover:text-brand-900 font-bold ml-0.5">
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-slate-900 font-bold ml-0.5">
                  ×
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-1"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Grid & Sidebar Layout */}
        <div className="flex items-start gap-8">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            selectedBrand={selectedBrand}
            onSelectBrand={(b) => {
              setSelectedBrand(b);
              setPage(1);
            }}
            availableBrands={availableBrands}
            priceRange={priceRange}
            onPriceChange={(r) => {
              setPriceRange(r);
              setPage(1);
            }}
            maxPrice={150000}
            inStockOnly={inStockOnly}
            onToggleInStock={(val) => {
              setInStockOnly(val);
              setPage(1);
            }}
            onReset={handleResetFilters}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Products Grid Area */}
          <div className="flex-1">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-slate-200/80">
                <LoadingSpinner size="lg" />
                <p className="text-xs font-semibold text-slate-500">Loading catalog...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-10">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    itemLabel="products"
                    className="rounded-2xl border border-slate-200/80 shadow-xs"
                  />
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Cycles Found</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                  We couldn't find any products matching your active filters. Try adjusting your search or clearing filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
