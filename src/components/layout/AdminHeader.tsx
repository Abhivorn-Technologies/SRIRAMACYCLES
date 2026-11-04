'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Store,
  LogOut,
  ExternalLink,
} from 'lucide-react';
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
  const { adminUser, adminLogout } = useAdminAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

        {/* Desktop Sidebar Toggle */}
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

      {/* Admin Profile with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-2.5 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 py-1.5 px-2.5 sm:px-3 rounded-xl transition-all cursor-pointer select-none group"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
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
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
              isDropdownOpen ? 'rotate-180 text-slate-700' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50">
            {/* Account Details Header */}
            <div className="px-4 py-2 border-b border-slate-100 flex flex-col gap-0.5">
              <p className="text-xs font-bold text-slate-800 truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {adminUser?.email || 'admin@sriramacycles.com'}
              </p>
            </div>

            {/* Menu Links */}
            <div className="py-1">
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-brand-700 hover:bg-brand-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>View Public Store</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Logout Action */}
            <div className="border-t border-slate-100 pt-1 mt-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  adminLogout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
