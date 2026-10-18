import React, { useState } from 'react';
import { BanquetBooking } from '../types';
import { RESTAURANT_INFO } from '../data/initialData';
import { Sparkles, Users, Calendar, Clock, Check, MessageCircle, Phone, Music, Cake, Utensils, Award } from 'lucide-react';

interface BanquetHallSectionProps {
  onBookBanquet: (booking: BanquetBooking) => void;
}

export const BanquetHallSection: React.FC<BanquetHallSectionProps> = ({ onBookBanquet }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState(() => {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  });
  const [slot, setSlot] = useState('Dinner Slot (7:30 PM – 11:30 PM)');
  const [occasion, setOccasion] = useState('Birthday Party');
  const [guestsCount, setGuestsCount] = useState(25);
  const [cateringRequired, setCateringRequired] = useState(true);
  const [notes, setNotes] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState<BanquetBooking | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !date) return;

    const newBooking: BanquetBooking = {
      id: `BNQ-${Date.now().toString().slice(-5)}`,
      customerName,
      customerPhone,
      date,
      slot,
      occasion,
      guestsCount,
      cateringRequired,
      notes: notes.trim() || undefined,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    onBookBanquet(newBooking);
    setSubmittedBooking(newBooking);

    // Prepare WhatsApp alert to 7396858269
    const waText = `*Banquet Hall Booking Inquiry - The Kitchen24*\n` +
      `Occasion: *${occasion}*\n` +
      `Date: ${date}\n` +
      `Time Slot: ${slot}\n` +
      `Guests: ${guestsCount} Members (Capacity: 30 max)\n` +
      `Client: ${customerName} (${customerPhone})\n` +
      `Catering Required: ${cateringRequired ? 'Yes (The Kitchen24 Menu)' : 'No'}\n` +
      (notes ? `Notes: ${notes}\n` : '') +
      `Location: ${RESTAURANT_INFO.location}\n` +
      `Booking Ref: ${newBooking.id}`;

    const waLink = `https://wa.me/917396858269?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Strip */}
      <div className="bg-[#1c1917] text-white rounded-3xl p-6 sm:p-10 mb-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#ea580c]/20 text-[#ea580c] border border-[#ea580c]/40 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intimate Event Space · 30-Member Capacity</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Banquet Hall for Celebrations & Birthday Parties
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Host memorable birthdays, family celebrations, anniversaries, kitty parties, and corporate get-togethers. Includes ambient party lighting, sound system, and delicious bespoke catering prepared live by The Kitchen24.
          </p>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-stone-800">
          <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">Maximum Capacity</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">30 Guests</span>
          </div>
          <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">Occasions</span>
            <span className="text-sm sm:text-base font-bold text-white">Birthdays & Parties</span>
          </div>
          <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">In-House Catering</span>
            <span className="text-sm sm:text-base font-bold text-[#ea580c]">The Kitchen24</span>
          </div>
          <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">Direct Booking</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">7396858269</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Features & Direct Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Banquet Features & Inclusions (NO photos, strict compliance) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-stone-900">
              Hall Highlights & Amenities
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-[#ea580c] shrink-0 border border-amber-200">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Cake Cutting & Party Stage</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Dedicated cake cutting zone with warm spotlighting, balloon setup support, and celebration backdrop.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-[#ea580c] shrink-0 border border-amber-200">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Live Kitchen Buffet & Starters</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Choose from authentic Hyderabadi Dum Biryani, mouth-watering starters, paneer specialties, and desserts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-[#ea580c] shrink-0 border border-amber-200">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Audio System & Wireless Mic</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Bluetooth-enabled sound system for celebration music, announcements, and karaoke sessions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-[#ea580c] shrink-0 border border-amber-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Dedicated Service Staff</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Courteous hospitality staff and managers ensuring smooth service from start to finish.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Need instant custom package?</span>
              <a
                href={RESTAURANT_INFO.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Booking Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            {submittedBooking ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black text-stone-900">
                  Banquet Hall Reservation Received!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you, <strong>{submittedBooking.customerName}</strong>. Your celebration request for <strong>{submittedBooking.occasion}</strong> on <strong>{submittedBooking.date}</strong> has been forwarded to our event coordinator.
                </p>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left text-xs max-w-md mx-auto space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Occasion:</span>
                    <span className="font-bold">{submittedBooking.occasion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Time Slot:</span>
                    <span className="font-bold">{submittedBooking.slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Guest Count:</span>
                    <span className="font-bold">{submittedBooking.guestsCount} members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Event Hotline:</span>
                    <span className="font-bold text-stone-900 font-mono">{RESTAURANT_INFO.phone}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedBooking(null)}
                    className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href={`https://wa.me/917396858269?text=${encodeURIComponent(
                      `Hi Kitchen24, confirming my banquet hall booking (${submittedBooking.occasion} on ${submittedBooking.date}) for ${submittedBooking.guestsCount} guests.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Event Manager</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider block">
                    Instant Reservation
                  </span>
                  <h3 className="text-xl font-black text-stone-900 mt-0.5">
                    Book the 30-Member Banquet Hall
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Fill the details below to lock your date and notify the manager.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7396858269"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    >
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Family Celebration">Family Celebration</option>
                      <option value="Anniversary Party">Anniversary Party</option>
                      <option value="Corporate Meet / Dinner">Corporate Meet / Dinner</option>
                      <option value="Kitty Party">Kitty Party</option>
                      <option value="Get Together">Get Together</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Members (Max 30)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={30}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Math.min(30, Math.max(5, Number(e.target.value))))}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'Morning (11:00 AM – 3:00 PM)',
                      'Evening (4:00 PM – 7:30 PM)',
                      'Dinner Slot (7:30 PM – 11:30 PM)',
                    ].map((timeSlot) => (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => setSlot(timeSlot)}
                        className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          slot === timeSlot
                            ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    id="cateringCheck"
                    checked={cateringRequired}
                    onChange={(e) => setCateringRequired(e.target.checked)}
                    className="w-4 h-4 text-[#ea580c] rounded focus:ring-[#ea580c]"
                  />
                  <label htmlFor="cateringCheck" className="text-xs text-stone-800 font-medium cursor-pointer">
                    Include The Kitchen24 food & beverage catering package
                  </label>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Specific Requests or Theme (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Balloon decor requirement, veg/non-veg buffet ratio, audio mic setup"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve Banquet Hall & Alert Manager on WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
