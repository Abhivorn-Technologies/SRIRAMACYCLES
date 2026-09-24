'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { validateEmail, validateRequired } from '@/lib/validations';

interface IAdminLoginPageProps {
  onSuccess?: () => Promise<void> | void;
}

export default function AdminLoginPage({ onSuccess }: IAdminLoginPageProps = {}) {
  const router = useRouter();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) { error(emailCheck.errorMessage!); return; }
    const pwCheck = validateRequired(password, 'Password');
    if (!pwCheck.isValid) { error(pwCheck.errorMessage!); return; }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole: 'admin' }),
      });

      const data = await res.json();

      if (data.success) {
        success('Admin authorization granted! Welcome to the console.');
        if (onSuccess) {
          await onSuccess();
        }
        window.location.href = '/admin';
      } else {
        error(data.message || 'Access denied: Invalid administrator credentials');
      }
    } catch (err) {
      error('An error occurred during admin authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      
      {/* Background Soft Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-xl">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-3.5 text-white shadow-md shadow-emerald-600/20">
            <Bike className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
            SRI RAMA <span className="text-emerald-600">CYCLES</span>
          </h1>
          <p className="text-[11px] tracking-widest text-slate-500 uppercase font-bold mt-0.5">
            Admin Management Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 focus:border-brand-600 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all placeholder:text-slate-400 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Admin Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security password"
                className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 focus:border-brand-600 focus:bg-white rounded-2xl py-3 pl-11 pr-11 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all placeholder:text-slate-400 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              
              {/* Eye Show / Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 p-0.5 rounded-lg transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
