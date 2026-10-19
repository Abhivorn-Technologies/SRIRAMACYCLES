'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Bike,
  MessageCircle,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { STORE_CONTACT, APP_NAME } from '@/lib/constants';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { validateName, validateEmail, validatePhone, validateRequired } from '@/lib/validations';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [lastSubmitted, setLastSubmitted] = useState<typeof formData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateName(formData.name);
    if (!nameCheck.isValid) { error(nameCheck.errorMessage!); return; }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) { error(emailCheck.errorMessage!); return; }

    if (formData.phone) {
      const phoneCheck = validatePhone(formData.phone);
      if (!phoneCheck.isValid) { error(phoneCheck.errorMessage!); return; }
    }

    const subjectCheck = validateRequired(formData.subject, 'Subject');
    if (!subjectCheck.isValid) { error(subjectCheck.errorMessage!); return; }

    const messageCheck = validateRequired(formData.message, 'Message');
    if (!messageCheck.isValid) { error(messageCheck.errorMessage!); return; }

    const payload = { ...formData };
    setLoading(true);

    const waMessage = `Namaste Sri Rama Cycles!\nI have an enquiry from your website:\n• Name: ${payload.name}\n• Phone: ${payload.phone || 'N/A'}\n• Email: ${payload.email}\n• Subject: ${payload.subject}\n• Message: ${payload.message}`;
    const waUrl = `https://wa.me/message/EEJFSOJ7Y3JCD1?text=${encodeURIComponent(waMessage)}`;

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        success(t('contact.success_title'));
        setLastSubmitted(payload);
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        // Automatically open WhatsApp with the enquiry
        const waWindow = window.open(waUrl, '_blank');
        if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
          window.location.href = waUrl;
        }
      } else {
        error(data.message || 'Failed to submit enquiry');
      }
    } catch (err) {
      error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            {t('contact.badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            {t('contact.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Store Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-950 rounded-3xl p-8 text-white shadow-xl flex flex-col gap-6 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                  <Bike className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{STORE_CONTACT.businessName}</h3>
                  <span className="text-[11px] text-brand-400 font-semibold uppercase">
                    Prop. {STORE_CONTACT.proprietor}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">{t('about.store_location')}:</strong>
                    <p>{STORE_CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">{t('contact.call_us')}:</strong>
                    <p className="font-bold text-white text-sm">{STORE_CONTACT.phone}</p>
                    <a
                      href={STORE_CONTACT.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      <span>{t('contact.whatsapp_btn')}</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">{t('contact.email_us')}:</strong>
                    <p>{STORE_CONTACT.supportEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">{t('contact.hours_label')}:</strong>
                    <p>{STORE_CONTACT.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick response badge */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block font-bold">Fast Guaranteed Response</strong>
                <span>Our cycling experts respond to all enquiries within 2-4 business hours.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {t('contact.form_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {t('contact.subtitle')}
              </p>

              {submitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center flex flex-col items-center gap-3 animate-in zoom-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">{t('contact.success_title')}</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm">
                    {t('contact.success_desc')}
                  </p>

                  {/* WhatsApp Instant Continuation */}
                  {lastSubmitted && (
                    <div className="w-full mt-2 pt-4 border-t border-emerald-200 dark:border-emerald-800/80 flex flex-col items-center gap-2">
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                        {t('contact.whatsapp_speed_reply')}
                      </p>
                      <a
                        href={`https://wa.me/message/EEJFSOJ7Y3JCD1?text=${encodeURIComponent(
                          `Namaste Sri Rama Cycles!\nI just submitted an enquiry on your website:\n• Name: ${lastSubmitted.name}\n• Phone: ${lastSubmitted.phone || 'N/A'}\n• Email: ${lastSubmitted.email}\n• Subject: ${lastSubmitted.subject}\n• Message: ${lastSubmitted.message}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-sm flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{t('contact.whatsapp_continue')}</span>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-colors cursor-pointer"
                  >
                    {t('contact.send_another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('contact.name_label')} *
                      </label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Rajesh Kumar"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('contact.email_label')} *
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rajesh@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('contact.phone_label')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('contact.subject_label')} *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="">Select Topic...</option>
                        <option value="Cycle Sizing & Recommendation">Cycle Sizing & Recommendation</option>
                        <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                        <option value="Warranty & Service Claim">Warranty & Service Claim</option>
                        <option value="Bulk / Corporate Orders">Bulk / Corporate Orders</option>
                        <option value="General Query">General Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t('contact.message_label')} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please share details about your inquiry..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Your details will only be used to respond to your inquiry in line with our{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95 cursor-pointer shrink-0"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <span>{t('contact.send_btn')}</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
