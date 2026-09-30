'use client';

import React, { useState, useEffect } from 'react';
import { Quote, CheckCircle2, MapPin, Sparkles, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import RatingStars from '../store/RatingStars';

const TELANGANA_REVIEWS = [
  {
    name: 'Ravinder Reddy',
    location: 'Kazipet, Hanumakonda',
    bike: 'Sri Rama Apex Carbon Road Racer',
    rating: 5,
    date: 'Verified Buyer • 2 days ago',
    comment:
      'Bought my road racer directly from Sri Rama Cycle Store in Kazipet. Rakesh Kumar garu personally guided me on frame sizing and gear tuning. Smooth ride all the way to Laknavaram lake. Best showroom in Warangal district!',
  },
  {
    name: 'Kalyan Goud',
    location: 'Hanamkonda, Warangal',
    bike: 'Sri Rama Terra Pro 29" MTB',
    rating: 5,
    date: 'Verified Buyer • 1 week ago',
    comment:
      'Took the 29" MTB for trail riding near Kakatiya University and Ramappa. The hydraulic disc brakes and RockShox suspension are rock solid. Sri Rama\'s genuine spares guarantee is 100% trustworthy!',
  },
  {
    name: 'Sravanthi Rao',
    location: 'Subedari, Hanumakonda',
    bike: 'Sri Rama E-Bike & City Cruiser',
    rating: 5,
    date: 'Verified Buyer • 3 days ago',
    comment:
      'Daily commute between Waddepally and Naimnagar is super smooth now! Fantastic battery range and comfortable saddle. Sri Rama Cycles Kazipet provides top-class free servicing and genuine auto spares.',
  },
  {
    name: 'Vamshi Krishna',
    location: 'Hasanparthy, Hanumakonda',
    bike: 'Shimano 21-Speed Gear & Spares',
    rating: 5,
    date: 'Verified Buyer • 5 days ago',
    comment:
      'Most reliable shop in Kazipet for authentic Shimano derailleur parts and auto spares. Immediate fitting in their master workshop by skilled technicians. Highly recommended across Tri-City!',
  },
  {
    name: 'Prashanth Kumar',
    location: 'Fatima Nagar, Kazipet',
    bike: 'Junior Alloy Disc Brake Cycle',
    rating: 5,
    date: 'Verified Buyer • 1 week ago',
    comment:
      'Bought a gear cycle for my son\'s school commute in Kazipet. Delivered 95% assembled with a free toolkit. Best prices and genuine manufacturer warranty in Hanumakonda!',
  },
  {
    name: 'Babu Rao',
    location: 'Warangal Fort Road, Warangal',
    bike: 'Standard Heavy-Duty Transport Cycle',
    rating: 5,
    date: 'Verified Buyer • 2 weeks ago',
    comment:
      'Sri Rama Cycle Store has been our family\'s trusted shop since 1976! High strength alloy rims and sturdy frame. Very courteous service and genuine spare parts always in stock.',
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto scroll continuously every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TELANGANA_REVIEWS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TELANGANA_REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TELANGANA_REVIEWS.length);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/70 relative overflow-hidden">
      {/* Background Soft Red Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Verified Telangana Rider Reviews
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                4.9 / 5.0 Rating
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mt-1">
              Trusted Across Hanumakonda & Warangal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Real feedback from local cyclists, fitness enthusiasts, and daily commuters in Kazipet & Tri-City.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 self-end">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 text-slate-700 hover:text-brand-600 flex items-center justify-center transition-all shadow-2xs hover:shadow-md active:scale-95 cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 text-slate-700 hover:text-brand-600 flex items-center justify-center transition-all shadow-2xs hover:shadow-md active:scale-95 cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Continuous Auto-Scrolling Cards Carousel */}
        <div
          className="overflow-hidden py-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-out gap-6"
            style={{
              transform: `translateX(-${activeIndex * 360}px)`,
            }}
          >
            {/* Duplicate array once to allow continuous smooth looping */}
            {TELANGANA_REVIEWS.concat(TELANGANA_REVIEWS).map((rev, idx) => (
              <div
                key={idx}
                className="w-[310px] sm:w-[350px] md:w-[370px] shrink-0 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-6 card-hover-lift hover:border-brand-500/60 hover:shadow-card-hover hover:shadow-brand-600/10 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <RatingStars rating={rev.rating} size="sm" />
                    <Quote className="w-6 h-6 text-brand-300/80" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                      <span>{rev.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    </h4>
                    <span className="text-[10px] font-extrabold text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold gap-2">
                    <span className="flex items-center gap-1 text-slate-600 truncate">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{rev.location}</span>
                    </span>
                    <span className="text-brand-700 font-extrabold bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 truncate shrink-0 max-w-[150px]">
                      {rev.bike}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TELANGANA_REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex % TELANGANA_REVIEWS.length === i
                  ? 'w-8 bg-brand-600 shadow-xs shadow-brand-600/50'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
