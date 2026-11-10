'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Award,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Tag,
  X,
  Receipt,
  Star,
  History,
} from 'lucide-react';

interface IAdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: IAdminSidebarProps) {
  const pathname = usePathname();

  const [counts, setCounts] = useState<{
    pendingOrders?: number;
    unreadEnquiries?: number;
    pendingReviews?: number;
    lowStock?: number;
  }>({});

  useEffect(() => {
    let isMounted = true;
    async function loadBadgeCounts() {
      try {
        const res = await fetch('/api/admin/stats?period=today');
        const data = await res.json();
        if (isMounted && data.success && data.stats) {
          setCounts({
            pendingOrders: data.stats.pendingOrders || 0,
            unreadEnquiries: data.stats.unreadEnquiries || 0,
            pendingReviews: data.stats.pendingReviews || 0,
            lowStock: data.lowStockProducts?.length || 0,
          });
        }
      } catch {
        // silent fail
      }
    }
    loadBadgeCounts();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const menuItems = useMemo(
    () => [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'In-Store Billing', href: '/admin/pos', icon: Receipt },
      {
        label: 'Products',
        href: '/admin/products',
        icon: Package,
        badge: counts.lowStock && counts.lowStock > 0 ? `${counts.lowStock} low` : undefined,
        badgeColor: 'bg-amber-500 text-white',
      },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Brands', href: '/admin/brands', icon: Award },
      {
        label: 'Orders',
        href: '/admin/orders',
        icon: ShoppingBag,
        badge: counts.pendingOrders && counts.pendingOrders > 0 ? `${counts.pendingOrders} new` : undefined,
        badgeColor: 'bg-emerald-600 text-white',
      },
      { label: 'Offline Records', href: '/admin/offline-sales', icon: History },
      {
        label: 'Customer Reviews',
        href: '/admin/reviews',
        icon: Star,
        badge: counts.pendingReviews && counts.pendingReviews > 0 ? `${counts.pendingReviews} new` : undefined,
        badgeColor: 'bg-purple-600 text-white',
      },
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Coupons', href: '/admin/coupons', icon: Tag },
      { label: 'Banners & Hero', href: '/admin/banners', icon: ImageIcon },
      {
        label: 'Enquiries',
        href: '/admin/enquiries',
        icon: MessageSquare,
        badge: counts.unreadEnquiries && counts.unreadEnquiries > 0 ? `${counts.unreadEnquiries} new` : undefined,
        badgeColor: 'bg-rose-500 text-white animate-pulse',
      },
    ],
    [counts]
  );

  const content = (
    <div
      className={`flex flex-col h-full bg-white text-slate-700 overflow-hidden ${
        isCollapsed ? 'p-2 items-center' : 'px-3.5 py-3'
      }`}
    >
      {/* Admin Logo */}
      <div
        className={`shrink-0 flex items-center w-full ${
          isCollapsed ? 'justify-center py-1 mb-2' : 'justify-center p-0 mb-3'
        }`}
      >
        <Link
          href="/admin"
          className="flex items-center justify-center w-full group p-0 m-0"
          title="Sri Rama Admin Console"
        >
          <div className="relative overflow-hidden flex items-center justify-center w-full p-0 m-0">
            <Image
              src="/SRI RAMA logo 3.png"
              alt="Sri Rama Admin Console"
              width={280}
              height={85}
              priority
              className={`${
                isCollapsed ? 'h-9 sm:h-10 w-auto' : 'h-12 sm:h-14 md:h-16 w-full object-contain'
              } drop-shadow-sm group-hover:scale-105 transition-transform duration-300`}
            />
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items (Smooth Scrollable) */}
      <nav className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-1 w-full pr-1 pb-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center rounded-xl text-xs font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3 relative group' : 'gap-3 px-3.5 py-2.5'
              } ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
              }`}
            >
              <div
                className={`flex items-center ${
                  isCollapsed ? 'justify-center' : 'gap-3 flex-1 min-w-0'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-brand-700' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs ${item.badgeColor || 'bg-brand-600 text-white'}`}>
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge && (
                <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white ${item.badgeColor?.includes('rose') ? 'bg-rose-500' : item.badgeColor?.includes('amber') ? 'bg-amber-500' : 'bg-brand-600'}`}></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 border-r border-slate-200/80 bg-white shadow-xs transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 h-full shadow-2xl z-10 bg-white overflow-hidden">{content}</div>
        </div>
      )}
    </>
  );
}
