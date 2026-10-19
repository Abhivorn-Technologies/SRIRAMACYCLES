'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bike, Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { validateName, validateEmail, validatePhone, validatePassword } from '@/lib/validations';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { fetchUser } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateName(formData.name);
    if (!nameCheck.isValid) { error(nameCheck.errorMessage!); return; }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) { error(emailCheck.errorMessage!); return; }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    const phoneCheck = validatePhone(cleanPhone);
    if (!phoneCheck.isValid) { error(phoneCheck.errorMessage!); return; }

    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.isValid) { error(passwordCheck.errorMessage!); return; }

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: cleanPhone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        success('Account created successfully! Welcome to Sri Rama Cycles.');
        await fetchUser();
        router.push('/account');
      } else {
        error(data.message || 'Registration failed');
      }
    } catch (err) {
      error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/60 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Bike className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {t('auth.register_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('auth.register_subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.full_name')} *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.email')} *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.mobile_number')} *
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                <span>🇮🇳</span>
                <span>+91</span>
                <span className="text-slate-300 dark:text-slate-600 ml-1">|</span>
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3 pl-20 pr-4 text-xs sm:text-sm font-semibold tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.password')} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.confirm_password')} *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-brand-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-3 pl-11 pr-11 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Privacy & Terms Consent Notice */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed px-1 text-center">
            By creating an account, you agree to our{' '}
            <Link href="/terms-and-conditions" className="text-brand-600 dark:text-brand-400 font-bold hover:underline" target="_blank">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-brand-600 dark:text-brand-400 font-bold hover:underline" target="_blank">
              Privacy Policy
            </Link>.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <span>{t('auth.register_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('auth.have_account')}{' '}
          <Link href="/login" className="font-bold text-brand-700 dark:text-brand-400 hover:underline">
            {t('auth.sign_in_btn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
