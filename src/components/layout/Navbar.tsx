'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bike,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  PackageCheck,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { APP_NAME, STORE_CONTACT } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.track_order'), href: '/track-order' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full glass-nav transition-all duration-200 border-b ${
        isScrolled
          ? 'border-slate-200/90 dark:border-slate-800 shadow-subtle'
          : 'border-slate-100 dark:border-slate-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28 md:h-30 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group py-2 pl-2 sm:pl-5 md:pl-8">
            <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/SRI RAMA logo 3.png"
                alt="Sri Rama Cycle Store & Auto Spares"
                width={400}
                height={120}
                priority
                className="h-16 sm:h-20 md:h-24 lg:h-26 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">


            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t('nav.search')}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t('nav.wishlist')}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                    }}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-700 hover:border-brand-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-xs transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-xs">
                      <UserIcon className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />
                    </div>
                    <span className="hidden sm:inline font-bold text-xs">{t('nav.account')}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <Link
                        href="/account/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-slate-400" />
                        {t('nav.my_orders')}
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        {t('nav.account_settings')}
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-slate-100 dark:border-slate-800 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.sign_out')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 dark:hover:bg-brand-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('nav.sign_in')}</span>
                </Link>
              )}
            </div>

            {/* Human Support Icon with WhatsApp Link in Navbar Right Corner */}
            <a
              id="nav-whatsapp-support-btn"
              href={STORE_CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/30 transition-all hover:scale-105 active:scale-95 shadow-2xs group"
              title={`${t('nav.whatsapp_support')} (${STORE_CONTACT.phone})`}
              aria-label="Contact Store Support on WhatsApp"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                {/* Active live green pulse beacon */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white dark:border-slate-900" />
                </span>
              </div>
              <span className="hidden md:inline font-bold text-xs">{t('nav.support')}</span>
              <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Interactive Search Bar Panel */}
        {isSearchOpen && (
          <div className="pb-4 pt-1 animate-in slide-in-from-top-3 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder={t('nav.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-28 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-inner"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors"
              >
                {t('nav.search_btn')}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-5 flex flex-col gap-3 animate-in slide-in-from-top-4">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-slate-100 dark:border-slate-800/80"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <div className="pt-2 flex gap-3">
              <Link
                href="/login"
                className="flex-1 bg-brand-600 text-white text-center py-2.5 rounded-xl font-bold text-sm"
              >
                {t('nav.sign_in')}
              </Link>
              <Link
                href="/register"
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center py-2.5 rounded-xl font-bold text-sm"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Quick WhatsApp Support in Mobile Navigation */}
          <div className="pt-2">
            <a
              id="mobile-nav-whatsapp-support-btn"
              href={STORE_CONTACT.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-white" />
              </div>
              <span>{t('nav.whatsapp_support')}</span>
              <span className="text-[11px] opacity-90">({STORE_CONTACT.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
