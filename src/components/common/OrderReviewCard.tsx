'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2, Sparkles, Send, HeartHandshake } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface IOrderReviewCardProps {
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  productName?: string;
  context?: 'order_placed' | 'order_received';
  onReviewed?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Disappointing',
  2: 'Fair',
  3: 'Good Experience',
  4: 'Very Good & Recommended',
  5: 'Outstanding / Loved It! ⭐',
};

const QUICK_TAGS = [
  '⚡ Smooth Booking',
  '🚴 Premium Cycle Quality',
  '🛠️ Perfect Tuning',
  '📦 Safe Packaging',
  '📞 Great Customer Support',
  '💰 Best Price & Value',
];

export default function OrderReviewCard({
  orderNumber,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  productName = '',
  context = 'order_placed',
  onReviewed,
}: IOrderReviewCardProps) {
  const { success, error } = useToast();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState(customerName);
  const [email, setEmail] = useState(customerEmail);
  const [phone, setPhone] = useState(customerPhone);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Check if customer already submitted review for this order
  useEffect(() => {
    async function checkReview() {
      if (!orderNumber) {
        setCheckingExisting(false);
        return;
      }
      try {
        const res = await fetch(`/api/reviews?orderNumber=${encodeURIComponent(orderNumber)}`);
        const data = await res.json();
        if (data.success && data.hasReviewed) {
          setSubmitted(true);
          if (data.review) {
            setRating(data.review.rating || 5);
            setComment(data.review.comment || '');
            setName(data.review.name || customerName);
          }
        }
      } catch (err) {
        // Non-blocking
      } finally {
        setCheckingExisting(false);
      }
    }
    checkReview();
  }, [orderNumber, customerName]);

  // Update prefilled name if props update
  useEffect(() => {
    if (customerName && !name) setName(customerName);
    if (customerEmail && !email) setEmail(customerEmail);
    if (customerPhone && !phone) setPhone(customerPhone);
  }, [customerName, customerEmail, customerPhone, name, email, phone]);

  const handleTagClick = (tag: string) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!comment.trim() || comment.trim().length < 3) {
      error('Please write a brief feedback message (at least 3 characters)');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          name: name.trim() || customerName || 'Valued Customer',
          email: email.trim() || customerEmail,
          phone: phone.trim() || customerPhone,
          rating,
          comment: comment.trim(),
          reviewContext: context,
          productName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        success('Thank you! Your review has been recorded.');
        setSubmitted(true);
        if (onReviewed) onReviewed();
      } else {
        error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      error('An error occurred while submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExisting) {
    return null;
  }

  // Already submitted state
  if (submitted) {
    return (
      <div className="w-full bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center gap-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          ))}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Thank You For Reviewing Sri Rama Cycles!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-1">
            Your review is now stored and shared with our team. We continuously refine our cycles &amp; service based on your feedback.
          </p>
        </div>
        {comment && (
          <div className="mt-2 bg-white/80 border border-emerald-200/80 rounded-2xl px-5 py-3 text-xs text-slate-700 italic max-w-lg">
            &ldquo;{comment}&rdquo;
          </div>
        )}
      </div>
    );
  }

  const activeRating = hoverRating || rating;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col gap-6 text-left relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Customer Experience Review</span>
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1.5">
            {context === 'order_received'
              ? 'How is your new cycle & delivery?'
              : 'How was your ordering experience today?'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Order #{orderNumber} {productName ? `• ${productName}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
          <HeartHandshake className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Direct Feedback to Admin</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Star Rating Section */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <label className="text-xs font-bold text-slate-700">
            Select Your Star Rating *
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      star <= activeRating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-slate-200 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-800 ml-2 py-1 px-3 rounded-full bg-slate-100">
              {RATING_LABELS[activeRating] || `${activeRating} Stars`}
            </span>
          </div>
        </div>

        {/* Quick Review Tag Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-2">
            Quick Feedback Highlights (Click to add):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                  comment.includes(tag)
                    ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Review Message */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Your Review / Feedback Message *
          </label>
          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked about the booking, cycle specifications, tuning, or customer care..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Customer Details Row (Auto-prefilled from Order) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Reddy"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Reviews appear verified with your order in Sri Rama Cycles Admin.
          </span>

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-extrabold text-xs py-3 px-6 rounded-2xl flex items-center gap-2 shadow-md shadow-brand-600/20 transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Customer Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
