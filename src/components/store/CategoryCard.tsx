import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
      className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 card-hover-lift"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-brand-300 transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-xs text-slate-200/90 line-clamp-1 mt-0.5 max-w-[240px]">
                  {category.description}
                </p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
