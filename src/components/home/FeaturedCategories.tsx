import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ICategory } from '@/types';
import CategoryCard from '../store/CategoryCard';

interface IFeaturedCategoriesProps {
  categories: ICategory[];
}

export default function FeaturedCategories({ categories }: IFeaturedCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  // Curate strictly to top 6 flagship categories for a clean, premium home layout
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mt-2">
              Explore By Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered cycles for daily city commutes, mountain trails, and family rides.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>View All in Store</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Clean 6-Card Curated Grid (2 rows x 3 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
