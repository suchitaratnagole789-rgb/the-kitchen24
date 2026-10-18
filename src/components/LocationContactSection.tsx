import React from 'react';
import { RESTAURANT_INFO } from '../data/initialData';
import { BrandLogo } from './BrandLogo';
import { MapPin, Phone, MessageCircle, Clock, Navigation, CheckCircle, Info } from 'lucide-react';

export const LocationContactSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Brand & Location Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <BrandLogo size="lg" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Location, Directions & Contact
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Located right in the heart of Gachibowli, Hyderabad's IT and sports corridor. Whether you are dining with us, staying in our boutique rooms, or hosting a celebration in our banquet hall, we look forward to serving you.
            </p>

            {/* Address callout */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Official Location Address
                  </h3>
                  <p className="text-xs text-stone-800 font-medium mt-0.5">
                    {RESTAURANT_INFO.location}
                  </p>
                  <div className="mt-2 text-[11px] text-stone-600 bg-white/70 p-2 rounded-lg border border-amber-200/60 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#ea580c] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-stone-900">Important Note:</strong> Super Town House is the physical hotel location only. The official business and brand name is <strong className="text-stone-900">The Kitchen24 By FIT BISTRO</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating hours & phone numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-[#ea580c]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Kitchen Timings</span>
                </div>
                <div className="text-sm font-black text-stone-900">
                  9:00 AM to 12:00 AM Midnight
                </div>
                <p className="text-[11px] text-stone-500">
                  Open every day for breakfast, lunch, dinner, and late-night cravings.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-[#ea580c]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Direct Hotline</span>
                </div>
                <div className="text-sm font-black text-stone-900 font-mono">
                  {RESTAURANT_INFO.phone}
                </div>
                <p className="text-[11px] text-stone-500">
                  Table bookings, room inquiries, and catering orders.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="py-3 px-5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call {RESTAURANT_INFO.phone}</span>
              </a>

              <a
                href={RESTAURANT_INFO.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="https://maps.google.com/?q=Gopichand+Badminton+Academy+Gachibowli+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 border border-stone-300"
              >
                <Navigation className="w-4 h-4 text-[#ea580c]" />
                <span>Get Directions (Google Maps)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Key Landmarks & Connectivity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1c1917] text-white p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Landmarks & Accessibility
              </h3>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                  <span>
                    <strong>Pullela Gopichand Badminton Academy:</strong> 150 metres walking distance.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                  <span>
                    <strong>Gachibowli Stadium & ORR Junction:</strong> 3 minutes driving time.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                  <span>
                    <strong>Hitec City & Financial District:</strong> 10–12 minutes.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                  <span>
                    <strong>Hyderabad International Airport (RGIA):</strong> 25 minutes via Outer Ring Road (ORR).
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400">
                Ample secure parking available on premises for dining guests and hotel residents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
