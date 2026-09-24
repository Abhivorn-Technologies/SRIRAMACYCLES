import React from 'react';
import { Quote, CheckCircle } from 'lucide-react';
import RatingStars from '../store/RatingStars';

const REVIEWS = [
  {
    name: 'Rajesh Sharma',
    city: 'Bangalore',
    bike: 'Srirama Apex Carbon Road Racer',
    rating: 5,
    comment:
      'The aerodynamics and responsiveness of this road bike are unbelievable. It arrived in pristine condition, and assembling the pedals and handlebar took under 10 minutes. Completed my first 100km brevet smoothly!',
  },
  {
    name: 'Pooja Deshmukh',
    city: 'Pune',
    bike: 'Srirama Terra Pro 29" Mountain Bike',
    rating: 5,
    comment:
      'Took the Terra Pro to the Sinhagad ghat trails last weekend. The hydraulic disc brakes and suspension lockout are rock solid. Premium quality finish and customer support is top tier!',
  },
  {
    name: 'Vikram Menon',
    city: 'Hyderabad',
    bike: 'Srirama Volt-X Electric Hybrid',
    rating: 5,
    comment:
      'My daily 18km office commute is now zero sweat and 100% fun! The pedal assist is silky smooth and the battery easily lasts 3 days per charge. Srirama Cycles is the real deal.',
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Verified Rider Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-2">
            Loved by 25,000+ Cyclists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real feedback from professional riders, weekend adventurers, and daily city commuters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between gap-6 card-hover-lift"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <RatingStars rating={rev.rating} size="sm" />
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {rev.city} • <span className="text-brand-600 font-medium">{rev.bike}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
