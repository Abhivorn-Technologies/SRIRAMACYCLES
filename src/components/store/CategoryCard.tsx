import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ICategory } from '@/types';

interface ICategoryCardProps {
  category: ICategory;
}

export default function CategoryCard({ category }: ICategoryCardProps) {
  const image =
    category.image ||
    'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80';

  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-slate-200/80 hover:border-brand-400 bg-slate-950 card-hover-lift shadow-sm hover:shadow-xl transition-all duration-300 select-none"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden image-zoom-container">
        <Image
          src={image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent transition-opacity duration-300 group-hover:from-slate-950/90" />

        {/* Floating Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/60 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-full shadow-md group-hover:bg-brand-600 group-hover:border-brand-400 transition-colors duration-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Category</span>
          </span>
        </div>

        {/* Content Box */}
        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white z-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-brand-300 transition-colors duration-300">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-medium group-hover:text-white transition-colors">
                  {category.description}
                </p>
              )}
            </div>

            {/* Glowing Action Arrow */}
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-brand-600 group-hover:border-brand-400 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-lg">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
