'use client';

import React from 'react';
import { Menu, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface IAdminHeaderProps {
  onOpenMobileMenu: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export default function AdminHeader({
  onOpenMobileMenu,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
}: IAdminHeaderProps) {
  const { adminUser } = useAdminAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle — simple arrow icon */}
        {onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs shrink-0"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse shadow-sm shadow-brand-600/50" />
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">
            Store Status: Live & Synced
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 py-1.5 px-3 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {adminUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-brand-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Full Access
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
