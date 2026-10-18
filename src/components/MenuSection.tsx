import React, { useState } from 'react';
import { MenuItem, MenuCategory } from '../types';
import { KitchenState } from '../utils/kitchenStatus';
import { Plus, Minus, Search, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MenuSectionProps {
  menuItems: MenuItem[];
  cart: { [itemId: string]: number };
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  kitchenStatus: KitchenState;
  onOpenCart: () => void;
}

const CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: 'veg curries', label: 'Veg Curries' },
  { id: 'non-veg curries', label: 'Non-Veg Curries' },
  { id: 'Chinese', label: 'Chinese' },
  { id: 'biryani', label: 'Biryani' },
  { id: 'rice', label: 'Rice' },
  { id: 'rotis', label: 'Rotis & Breads' },
  { id: 'salad', label: 'Salads & Raita' },
  { id: 'desserts', label: 'Desserts' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  kitchenStatus,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet =
      dietFilter === 'all' ||
      (dietFilter === 'veg' && item.isVeg) ||
      (dietFilter === 'non-veg' && !item.isVeg);

    return matchesCategory && matchesSearch && matchesDiet;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Operating Timings Notice Card (Mandatory Requirement) */}
      <div
        className={`mb-8 p-4 rounded-2xl border transition-all ${
          kitchenStatus.isOpenForOrders
            ? 'bg-amber-50/70 border-amber-200 text-stone-800'
            : 'bg-red-50/90 border-red-200 text-red-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                kitchenStatus.isOpenForOrders ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">
                  Kitchen Timings: 9:00 AM to 12:00 AM midnight
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    kitchenStatus.isOpenForOrders
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-200 text-red-900'
                  }`}
                >
                  {kitchenStatus.isOpenForOrders ? 'Open for Orders' : 'Orders Paused'}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {kitchenStatus.isOpenForOrders
                  ? 'Orders placed now are freshly cooked and delivered directly to your room or table.'
                  : `${kitchenStatus.statusMessage} (You can still add items to your cart, but ordering is disabled outside 9 AM – 12 AM).`}
              </p>
            </div>
          </div>

          {!kitchenStatus.isOpenForOrders && (
            <div className="shrink-0 text-xs bg-white/80 border border-red-200 text-red-800 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>Ordering opens at 9:00 AM</span>
            </div>
          )}
        </div>
      </div>

      {/* Header and Search Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#ea580c] block">
            Crafted with passion
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            Restaurant Menu
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Authentic spices, slow-cooked gravies, and fragrant biryanis.
          </p>
        </div>

        {/* Search & Veg/Non-Veg controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search curries, biryani, rotis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50 text-stone-800"
            />
          </div>

          {/* Diet filters */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dietFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => setDietFilter('veg')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dietFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block border border-white" />
              Veg Only
            </button>
            <button
              type="button"
              onClick={() => setDietFilter('non-veg')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dietFilter === 'non-veg'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block border border-white" />
              Non-Veg
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
            selectedCategory === 'all'
              ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-sm'
              : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
          }`}
        >
          All Categories ({menuItems.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = menuItems.filter((i) => i.category === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid - STRICT RULE: "Do not show pictures for food items or rooms." */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-stone-500 text-sm">No items found matching your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setDietFilter('all');
            }}
            className="mt-3 text-xs font-bold text-[#ea580c] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const qty = cart[item.id] || 0;
            const isOutOfStock = !item.inStock;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isOutOfStock
                    ? 'border-stone-200 bg-stone-50/60 opacity-80'
                    : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Veg / Non-Veg Indicator & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Standard Indian Veg/Non-Veg Symbol */}
                      <span
                        className={`w-4 h-4 border flex items-center justify-center rounded-xs shrink-0 ${
                          item.isVeg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                        title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                      </span>

                      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                        {item.category}
                      </span>
                    </div>

                    {/* Stock badge or Spicy badge */}
                    {isOutOfStock ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        Out of Stock
                      </span>
                    ) : item.portion ? (
                      <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded">
                        {item.portion}
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row: Price and Add to Cart action */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-stone-500">₹</span>
                    <span className="text-lg font-extrabold text-stone-900 font-mono tabular-nums">
                      {item.price}
                    </span>
                  </div>

                  {/* Add to Cart Stepper or Button */}
                  {isOutOfStock ? (
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1.5 text-xs font-bold text-stone-400 bg-stone-100 rounded-lg cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  ) : qty > 0 ? (
                    <div className="flex items-center gap-2 bg-[#ea580c] text-white rounded-xl p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1 hover:bg-black/15 rounded-lg transition-colors cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold font-mono px-1 min-w-[1.2rem] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className="p-1 hover:bg-black/15 rounded-lg transition-colors cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="inline-flex items-center gap-1.5 bg-[#faf6ee] hover:bg-[#ea580c] text-stone-900 hover:text-white border border-stone-300 hover:border-[#ea580c] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#ea580c] group-hover:text-white" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating cart prompt if items in cart */}
      {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-md w-[92%] bg-stone-900 text-white p-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ea580c] flex items-center justify-center font-bold text-sm">
              {Object.values(cart).reduce((a, b) => a + b, 0)}
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Items in your cart</span>
              <span className="text-[11px] text-stone-400">
                {kitchenStatus.isOpenForOrders ? 'Ready to place order' : 'Orders open at 9:00 AM'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            View Cart & Checkout
          </button>
        </div>
      )}
    </section>
  );
};
