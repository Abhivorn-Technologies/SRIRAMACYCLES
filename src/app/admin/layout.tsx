'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AdminLoginPage from './login/page';

const ADMIN_SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 Hour Strict Timeout

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, loading, isAdmin, adminLogout, fetchAdminUser } = useAdminAuth();
  const { error: toastError } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());

  // Load saved sidebar state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('src_admin_sidebar_collapsed');
      if (saved !== null) {
        setIsSidebarCollapsed(saved === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('src_admin_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Handle session timeout & auto-logout
  const handleSessionExpire = useCallback(async () => {
    toastError('Admin session expired (1 Hour timeout). Please sign in again to continue.');
    await adminLogout();
  }, [adminLogout, toastError]);

  // Track user activity and check timeout
  useEffect(() => {
    if (!adminUser || !isAdmin || pathname === '/admin/login') return;

    const recordActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    // Periodic watchdog timer: check every 30 seconds against /api/admin/auth/me
    const interval = setInterval(async () => {
      const now = Date.now();
      if (now - lastActivityRef.current >= ADMIN_SESSION_TIMEOUT_MS) {
        handleSessionExpire();
      } else {
        try {
          const res = await fetch('/api/admin/auth/me');
          if (!res.ok) {
            handleSessionExpire();
          }
        } catch {
          // ignore network hiccups
        }
      }
    }, 30000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
      clearInterval(interval);
    };
  }, [adminUser, isAdmin, pathname, handleSessionExpire]);

  // If already on the dedicated login route
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If unauthenticated or not admin, show AdminLoginPage directly
  if (!adminUser || !isAdmin) {
    return <AdminLoginPage onSuccess={fetchAdminUser} />;
  }

  // Authenticated Admin Console View
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={toggleSidebarCollapse}
        />
        <main className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminContent>{children}</AdminContent>
    </AdminAuthProvider>
  );
}

