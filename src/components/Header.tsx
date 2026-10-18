import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Phone, MessageCircle, MapPin, ShoppingBag, Clock, ShieldCheck, Calendar, Hotel, UtensilsCrossed } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/initialData';
import { KitchenState } from '../utils/kitchenStatus';
import { ForkIcon } from './BrandLogo';

interface HeaderProps {
  activeTab: 'menu' | 'rooms' | 'banquet' | 'about' | 'admin';
  setActiveTab: (tab: 'menu' | 'rooms' | 'banquet' | 'about' | 'admin') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  kitchenStatus: KitchenState;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
  kitchenStatus,
}) => {
  return (
    <header className="w-full bg-[#fcfaf6] border-b border-amber-900/10">
      {/* 1. Top Utility Notification & Contact Strip */}
      <div className="bg-[#1c1917] text-stone-200 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Location details */}
          <div className="flex items-center gap-1.5 text-stone-300 text-center md:text-left">
            <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
            <span className="leading-tight">
              <strong className="text-white font-semibold">Location:</strong> {RESTAURANT_INFO.location}
            </span>
          </div>

          {/* Quick Contact & WhatsApp */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="inline-flex items-center gap-1.5 text-stone-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Call: <strong className="font-semibold text-white">{RESTAURANT_INFO.phone}</strong></span>
            </a>
            <span className="text-stone-600">|</span>
            <a
              href={RESTAURANT_INFO.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo: The Kitchen24 By FIT BISTRO */}
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className="cursor-pointer text-left focus:outline-none"
        >
          <BrandLogo size="md" />
        </button>

        {/* Operating status banner */}
        <div className="flex items-center gap-2 bg-[#f4ede0] border border-amber-900/15 rounded-lg px-3 py-1.5 text-xs text-stone-800">
          <Clock className="w-4 h-4 text-[#ea580c] shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold text-stone-900">
              Timings: 9:00 AM – 12:00 AM Midnight
            </span>
            <span className="hidden sm:inline text-stone-400">·</span>
            <span
              className={`font-bold ${
                kitchenStatus.isOpenForOrders ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              {kitchenStatus.isOpenForOrders ? 'Open for Orders' : kitchenStatus.statusMessage}
            </span>
          </div>
        </div>

        {/* Action buttons: Cart & Admin */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#ea580c] px-1.5 py-0.2 rounded-full text-xs font-black">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="border-l border-white/30 pl-2 font-mono">
                ₹{cartTotal}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="bg-[#f2ece1] border-t border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center sm:justify-start gap-1 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'menu'
                ? 'border-[#ea580c] text-[#ea580c] bg-white/60'
                : 'border-transparent text-stone-700 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restaurant Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'rooms'
                ? 'border-[#ea580c] text-[#ea580c] bg-white/60'
                : 'border-transparent text-stone-700 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>Rooms (24 Bookable)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banquet')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'banquet'
                ? 'border-[#ea580c] text-[#ea580c] bg-white/60'
                : 'border-transparent text-stone-700 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Banquet Hall (30 Capacity)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'about'
                ? 'border-[#ea580c] text-[#ea580c] bg-white/60'
                : 'border-transparent text-stone-700 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Location & Contact</span>
          </button>
        </div>
      </nav>

      {/* 4. Hero Banner with light cream background (#FAF6F0) and warm gradient */}
      <div className="relative w-full bg-[#FAF6F0] bg-gradient-to-r from-[#FAF6F0] via-[#FAF4EA] to-[#F5EFEB] py-8 sm:py-12 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Orange Tag: Kept exactly as requested */}
          <div className="inline-block bg-[#E8531D] text-white px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider mb-3 shadow-xs">
            SUPER TOWN HOUSE HOTEL · GACHIBOWLI
          </div>

          {/* Hero Main Brand Title: Dark (#1F1F1F) for "The Kitchen", Orange (#E8531D) for "24" */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F1F1F] flex flex-wrap items-center gap-x-2">
            <span>The</span>
            <span className="flex items-center">
              <span>K</span>
              <ForkIcon sizeClass="h-7 sm:h-11 w-3.5 sm:w-5.5" />
              <span>tchen</span>
            </span>
            <span className="text-[#E8531D] font-black">24</span>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-stone-500 uppercase ml-2 sm:ml-4 border-l border-stone-300 pl-3 sm:pl-4 self-center">
              By FIT BISTRO
            </span>
          </h1>

          {/* Description in grey */}
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-2.5 leading-relaxed font-normal">
            Serving gourmet Indian, Hyderabadi Biryani, and Chinese delicacies · 24 Deluxe & Executive Hotel Rooms · 30-Guest Celebration Banquet Hall
          </p>
        </div>
      </div>
    </header>
  );
};
