'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bike, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useLanguage } from '@/context/LanguageContext';

function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { fetchUser } = useAuth();
  const { success, error } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password) {
      error('Please enter your email/mobile number and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier.trim(), password }),
      });

      const data = await res.json();

      if (data.success) {
        success('Signed in successfully! Welcome back.');
        await fetchUser();
        if (data.user.role === 'admin' && redirectUrl === '/account') {
          router.push('/admin');
        } else {
          router.push(redirectUrl);
        }
      } else {
        error(data.message || 'Invalid login credentials. Please try again.');
      }
    } catch (err) {
      error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/60 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl">
        {/* Header Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <Image
              src="/SRI RAMA logo 3.png"
              alt="Sri Rama Cycle Store & Auto Spares"
              width={200}
              height={60}
              priority
              className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {t('auth.login_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('auth.login_subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.email_or_phone')}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email address or 10-digit mobile"
                className="w-full bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{t('auth.password')}</label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline"
              >
                {t('auth.forgot_password')}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <span>{t('auth.sign_in_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('auth.no_account')}{' '}
          <Link href="/register" className="font-bold text-brand-700 dark:text-brand-400 hover:underline">
            {t('auth.create_account')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
