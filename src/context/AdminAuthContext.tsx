'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser } from '@/types';

interface IAdminAuthContext {
  adminUser: IUser | null;
  loading: boolean;
  isAdmin: boolean;
  fetchAdminUser: () => Promise<void>;
  adminLogout: () => Promise<void>;
}

const AdminAuthContext = createContext<IAdminAuthContext | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user && data.user.role === 'admin') {
          setAdminUser(data.user);
          return;
        }
      }
      setAdminUser(null);
    } catch {
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setAdminUser(null);
    window.location.href = '/admin/login';
  }, []);

  useEffect(() => {
    fetchAdminUser();
  }, [fetchAdminUser]);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        isAdmin: !!adminUser && adminUser.role === 'admin',
        fetchAdminUser,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
