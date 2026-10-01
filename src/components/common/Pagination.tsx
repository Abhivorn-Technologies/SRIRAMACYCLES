'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'items',
  className = '',
}: IPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    if (totalItems > 0) {
      return (
        <div className={`flex items-center justify-between px-4 py-3 text-xs text-slate-500 font-medium ${className}`}>
          <span>
            Showing <strong className="font-bold text-slate-800">1</strong> to{' '}
            <strong className="font-bold text-slate-800">{totalItems}</strong> of{' '}
            <strong className="font-bold text-slate-800">{totalItems}</strong> {itemLabel}
          </span>
        </div>
      );
    }
    return null;
  }

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 bg-white border-t border-slate-200/80 rounded-b-2xl select-none ${className}`}
    >
      {/* Items Range Counter */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <strong className="font-bold text-slate-900">{startItem}</strong> to{' '}
        <strong className="font-bold text-slate-900">{endItem}</strong> of{' '}
        <strong className="font-bold text-slate-900">{totalItems}</strong> {itemLabel}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-colors shadow-2xs"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400"
                >
                  •••
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs font-black'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-brand-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-colors shadow-2xs"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
