'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Bike,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Tag,
  Store,
  LogOut,
  X,
  Receipt,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME } from '@/lib/constants';

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
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'In-Store Billing', href: '/admin/pos', icon: Receipt, badge: 'Counter' },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Banners & Hero', href: '/admin/banners', icon: ImageIcon },
    { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  ];

  const content = (
    <div
      className={`flex flex-col h-full justify-between bg-white text-slate-700 ${
        isCollapsed ? 'p-2 items-center' : 'px-3.5 py-2.5'
      }`}
    >
      <div className="flex flex-col gap-1 w-full">
        {/* Admin Logo */}
        <div
          className={`flex items-center w-full ${
            isCollapsed ? 'justify-center py-1' : 'justify-center p-0 mb-1'
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

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 w-full">
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
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-2xs">
                    {item.badge}
                  </span>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className={`pt-4 border-t border-slate-200/80 flex flex-col gap-1.5 w-full`}>
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? 'View Public Store' : undefined}
          className={`flex items-center rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors ${
            isCollapsed ? 'justify-center p-3' : 'gap-2.5 px-3.5 py-2.5'
          }`}
        >
          <Store className="w-4 h-4 text-brand-600 shrink-0" />
          {!isCollapsed && <span>View Store</span>}
        </Link>
        <button
          onClick={logout}
          title={isCollapsed ? 'Admin Logout' : undefined}
          className={`w-full flex items-center rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors ${
            isCollapsed ? 'justify-center p-3' : 'gap-2.5 px-3.5 py-2.5 text-left'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 border-r border-slate-200/80 bg-white shadow-xs transition-all duration-300 ${
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
          <div className="relative w-64 h-full shadow-2xl z-10 bg-white">{content}</div>
        </div>
      )}
    </>
  );
}
