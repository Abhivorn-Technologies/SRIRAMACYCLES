'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  LogOut,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Home,
  Building,
  Check,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { IUserAddress } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function AccountPage() {
  const { user, loading, logout, fetchUser } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'addresses'>('overview');
  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);

  // Address Modal / Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressType: 'Home',
    street: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    isDefault: false,
  });
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Load user addresses
  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await fetch('/api/user/addresses');
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  // Handle PIN code lookup
  const handlePincodeChange = async (code: string) => {
    const cleanCode = code.replace(/\D/g, '').slice(0, 6);
    setAddressForm((p) => ({ ...p, pincode: cleanCode }));

    if (cleanCode.length === 6) {
      try {
        setPincodeLoading(true);
        const res = await fetch(`/api/pincode/${cleanCode}`);
        const data = await res.json();
        if (data.success && data.data) {
          setAddressForm((p) => ({
            ...p,
            city: data.data.city || p.city,
            state: data.data.state || p.state,
          }));
          success(`Auto-detected: ${data.data.city}, ${data.data.state}`);
        }
      } catch (err) {
        // ignore
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  // Open Create / Edit Modal
  const openCreateModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      name: user?.name || '',
      phone: user?.phone || '',
      addressType: 'Home',
      street: '',
      landmark: '',
      pincode: '',
      city: '',
      state: '',
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const openEditModal = (addr: IUserAddress) => {
    setEditingAddressId(addr._id || null);
    setAddressForm({
      name: addr.name || user?.name || '',
      phone: addr.phone || user?.phone || '',
      addressType: addr.addressType || 'Home',
      street: addr.street || '',
      landmark: addr.landmark || '',
      pincode: addr.pincode || '',
      city: addr.city || '',
      state: addr.state || '',
      isDefault: Boolean(addr.isDefault),
    });
    setIsAddressModalOpen(true);
  };

  // Save / Update Address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressForm.street.trim()) {
      error('Please enter flat/street address');
      return;
    }
    if (!addressForm.pincode || addressForm.pincode.length < 6) {
      error('Please enter a valid 6-digit PIN code');
      return;
    }
    if (!addressForm.city.trim() || !addressForm.state.trim()) {
      error('Please enter city and state');
      return;
    }

    setSubmittingAddress(true);

    try {
      const url = editingAddressId
        ? `/api/user/addresses/${editingAddressId}`
        : '/api/user/addresses';
      const method = editingAddressId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();

      if (data.success) {
        success(editingAddressId ? 'Address updated successfully' : 'New address saved to your account!');
        setAddresses(data.addresses || []);
        setIsAddressModalOpen(false);
        await fetchUser();
      } else {
        error(data.message || 'Failed to save address');
      }
    } catch (err) {
      error('An error occurred while saving address');
    } finally {
      setSubmittingAddress(false);
    }
  };

  // Set Default Address
  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });

      const data = await res.json();
      if (data.success) {
        success('Default delivery address updated');
        setAddresses(data.addresses || []);
      } else {
        error(data.message || 'Failed to update default address');
      }
    } catch (err) {
      error('Error updating default address');
    }
  };

  // Delete Address
  const handleDeleteAddress = (addressId: string) => {
    setDeleteAddressId(addressId);
  };

  const confirmDeleteAddress = async () => {
    if (!deleteAddressId) return;
    const addressId = deleteAddressId;
    setDeleteAddressId(null);

    try {
      const res = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        success('Address removed from your account');
        setAddresses(data.addresses || []);
      } else {
        error(data.message || 'Failed to delete address');
      }
    } catch (err) {
      error('Error deleting address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Sign in to view your profile, order history, and saved addresses.
        </p>
        <Link href="/login" className="bg-brand-600 text-white font-bold text-xs py-3 px-6 rounded-xl">
          Sign In
        </Link>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-2xl mb-4 shadow-xs">
          🛡️
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Administrator Account</h2>
        <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
          You are currently signed in with store administrator credentials. The customer dashboard is meant for regular shoppers. Please head over to the Admin Console to manage orders, inventory, and customers.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Go to Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={logout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Dashboard Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Welcome, {user.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-black text-lg flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    activeTab === 'overview'
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Profile Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span>Saved Delivery Addresses</span>
                  </div>
                  {addresses.length > 0 && (
                    <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {addresses.length}
                    </span>
                  )}
                </button>

                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  <PackageCheck className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Wishlist</span>
                </Link>

                <Link
                  href="/track-order"
                  className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Track Order</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-left mt-2 border-t border-slate-100 pt-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Personal Info */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5 font-medium">Full Name</span>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5 font-medium">Email Address</span>
                      <span className="font-bold text-slate-900">{user.email}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5 font-medium">Contact Phone</span>
                      <span className="font-bold text-slate-900">{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block mb-0.5 font-medium">Account Role</span>
                      <span className="font-bold text-brand-600 uppercase">{user.role}</span>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses Summary Widget */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Saved Delivery Addresses
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage your home, office & alternate addresses for 1-click checkout
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      View All ({addresses.length})
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center flex flex-col items-center">
                      <MapPin className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs text-slate-600 font-semibold">No saved addresses yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                        Save your delivery address for instant auto-fill during checkout
                      </p>
                      <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Address</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.slice(0, 2).map((addr) => (
                        <div
                          key={addr._id}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-3 relative"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                                {addr.addressType || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-xs text-slate-900">{addr.name || user.name}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                              {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">Phone: {addr.phone || user.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/account/orders"
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 card-hover-lift flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Order History</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Check status & invoices</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-600" />
                  </Link>

                  <Link
                    href="/track-order"
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 card-hover-lift flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Track Shipment</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Live courier timeline</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-600" />
                  </Link>
                </div>
              </>
            )}

            {/* TAB 2: SAVED ADDRESSES MANAGEMENT */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Save multiple addresses for home, work, or family delivery
                    </p>
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xs transition-all hover:scale-[1.01]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-12 flex justify-center">
                    <LoadingSpinner size="md" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mb-3">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">No Saved Addresses Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
                      Add your home or workplace delivery address. Every address you use during checkout will also be saved here automatically!
                    </p>
                    <button
                      onClick={openCreateModal}
                      className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-3 px-5 rounded-2xl shadow-xs transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Delivery Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                          addr.isDefault
                            ? 'border-brand-500 bg-brand-50/20 shadow-xs'
                            : 'border-slate-200/90 bg-slate-50/50 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* Card Top Header */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                                {addr.addressType || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Default
                                </span>
                              )}
                            </div>

                            {/* Set Default Action */}
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefault(addr._id!)}
                                className="text-[11px] font-bold text-brand-700 hover:underline"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>

                          {/* Recipient info */}
                          <h4 className="font-black text-sm text-slate-900">
                            {addr.name || user.name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {addr.street}
                            {addr.landmark ? `, ${addr.landmark}` : ''}
                            <br />
                            {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{addr.phone || user.phone || 'Phone not specified'}</span>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold">
                          <button
                            onClick={() => openEditModal(addr)}
                            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-brand-700 py-1 px-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAddress(addr._id!)}
                            className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter delivery destination details for shipping
                </p>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4 overflow-y-auto pr-1">
              
              {/* Address Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Work', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressForm((p) => ({ ...p, addressType: type }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        addressForm.addressType === type
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Recipient name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-medium focus:border-brand-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    10-Digit Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))
                    }
                    placeholder="Mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-medium focus:border-brand-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Flat, House No., Building, Street Name *
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressForm.street}
                  onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))}
                  placeholder="e.g. Flat 302, Green Meadows Apartment, MG Road"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-medium focus:border-brand-600 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm((p) => ({ ...p, landmark: e.target.value }))}
                  placeholder="e.g. Near Bus Stand / Opposite SBI"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-medium focus:border-brand-600 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Pincode, City, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    PIN Code *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addressForm.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="6 Digits"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-bold text-brand-900 focus:border-brand-600 focus:bg-white focus:outline-none"
                    />
                    {pincodeLoading && (
                      <div className="absolute right-2.5 top-3">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="City"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-medium focus:border-brand-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                    placeholder="State"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-medium focus:border-brand-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Make Default Checkbox */}
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Set this as my default delivery address</span>
              </label>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAddress}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-75 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  {submittingAddress ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteAddressId}
        title="Delete Saved Address"
        message="Are you sure you want to delete this saved delivery address?"
        confirmText="Delete Address"
        type="danger"
        onConfirm={confirmDeleteAddress}
        onClose={() => setDeleteAddressId(null)}
      />
    </div>
  );
}
