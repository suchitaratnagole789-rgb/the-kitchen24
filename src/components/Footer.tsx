import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/initialData';

interface FooterProps {
  onNavigateTab: (tab: 'menu' | 'rooms' | 'banquet' | 'about' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="w-full bg-[#1c1917] text-stone-300 border-t border-stone-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-stone-400 leading-relaxed mt-3">
              Premium multi-cuisine dining, luxury boutique accommodation with 24 rooms, and celebration banquet facility.
            </p>
            <div className="text-[11px] text-stone-500 pt-1">
              <span className="text-[#ea580c] font-semibold">Super Town House</span> is our location partner only; our official brand name is <strong className="text-stone-300">The Kitchen24 By FIT BISTRO</strong>.
            </div>
          </div>

          {/* Col 2: Location & Address */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-amber-400">
              Address & Location
            </h4>
            <div className="flex items-start gap-2 text-xs text-stone-300 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
              <span>{RESTAURANT_INFO.location}</span>
            </div>
            <div className="pt-2 text-xs text-stone-400">
              <span className="font-semibold text-stone-200">Landmark:</span> Near Pullela Gopichand Badminton Academy, Gachibowli, Hyderabad, Telangana 500032.
            </div>
          </div>

          {/* Col 3: Contact & Timings */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-amber-400">
              Kitchen Timings & Contact
            </h4>
            <div className="flex items-start gap-2 text-xs text-stone-300">
              <Clock className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Operating Hours:</span>
                <span>9:00 AM to 12:00 AM midnight</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex items-center gap-2 text-xs text-stone-200 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#ea580c]" />
                <span>Call Now: <strong className="font-mono text-white">{RESTAURANT_INFO.phone}</strong></span>
              </a>

              <a
                href={RESTAURANT_INFO.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: <strong className="font-mono">{RESTAURANT_INFO.phone}</strong></span>
              </a>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-black text-amber-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Restaurant Menu (8 Categories)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('rooms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Rooms (101–406)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('banquet')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Banquet Hall (30 Capacity)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Map Directions
                </button>
              </li>
              <li className="pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => onNavigateTab('admin')}
                  className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Admin Panel Login</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="bg-[#121110] py-4 px-4 sm:px-6 border-t border-stone-800 text-[11px] text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} The Kitchen24 By FIT BISTRO. All rights reserved.
          </span>
          <div className="flex items-center gap-1">
            <span>Crafted for authentic hospitality & dining in Gachibowli</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
