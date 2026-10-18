import React, { useState } from 'react';
import { Room, RoomBooking } from '../types';
import { RESTAURANT_INFO } from '../data/initialData';
import { Hotel, Wifi, Tv, Coffee, Wind, Sparkles, Check, Phone, MessageCircle, Calendar, Users, X } from 'lucide-react';

interface RoomsSectionProps {
  rooms: Room[];
  onBookRoom: (booking: RoomBooking) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ rooms, onBookRoom }) => {
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Booking Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<RoomBooking | null>(null);

  const filteredRooms = rooms.filter(
    (room) => floorFilter === 'all' || room.floor === floorFilter
  );

  const calculateNights = () => {
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };

  const handleOpenBooking = (room: Room) => {
    setSelectedRoom(room);
    setBookingSuccess(null);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !guestName || !guestPhone) return;

    const nights = calculateNights();
    const totalAmount = nights * selectedRoom.pricePerNight;

    const newBooking: RoomBooking = {
      id: `BK-RM${selectedRoom.number}-${Date.now().toString().slice(-4)}`,
      roomNumber: selectedRoom.number,
      guestName,
      guestPhone,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalAmount,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      specialRequests: specialRequests.trim() || undefined,
    };

    onBookRoom(newBooking);
    setBookingSuccess(newBooking);

    // Prepare WhatsApp alert to 7396858269
    const waText = `*New Room Booking - The Kitchen24 By FIT BISTRO*\n` +
      `Room: *Room ${selectedRoom.number}* (${selectedRoom.type})\n` +
      `Guest: ${guestName} (${guestPhone})\n` +
      `Dates: ${checkInDate} to ${checkOutDate} (${nights} night${nights > 1 ? 's' : ''})\n` +
      `Guests: ${guestsCount}\n` +
      `Total: ₹${totalAmount}\n` +
      `Location: ${RESTAURANT_INFO.location}\n` +
      (specialRequests ? `Special Requests: ${specialRequests}\n` : '') +
      `Booking ID: ${newBooking.id}`;

    const waLink = `https://wa.me/917396858269?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Overview Banner */}
      <div className="bg-[#1c1917] text-white rounded-3xl p-6 sm:p-8 mb-8 border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c] bg-stone-800 px-3 py-1 rounded-md">
              <Hotel className="w-3.5 h-3.5" />
              <span>Premium Accommodation · Super Town House Hotel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              24 Bookable Rooms
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Quiet, air-conditioned executive and deluxe rooms across 4 floors (Rooms 101–106, 201–206, 301–306, 401–406). Enjoy 24/7 in-room dining from The Kitchen24.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-stone-800/80 p-4 rounded-2xl border border-stone-700 shrink-0">
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                Direct Desk Assistance
              </span>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="text-base font-bold text-white hover:text-[#ea580c] transition-colors flex items-center gap-1.5 mt-0.5"
              >
                <Phone className="w-4 h-4 text-[#ea580c]" />
                <span>{RESTAURANT_INFO.phone}</span>
              </a>
            </div>
            <a
              href={RESTAURANT_INFO.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Reception</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floor Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2">
          Filter by Floor:
        </span>
        <button
          type="button"
          onClick={() => setFloorFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
            floorFilter === 'all'
              ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
          }`}
        >
          All 24 Rooms
        </button>
        {[1, 2, 3, 4].map((floor) => (
          <button
            key={floor}
            type="button"
            onClick={() => setFloorFilter(floor)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              floorFilter === floor
                ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            Floor {floor} ({floor}01–{floor}06)
          </button>
        ))}
      </div>

      {/* STRICT RULE: "Do not show pictures for food items or rooms." */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.number}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                room.isBooked
                  ? 'border-stone-200 bg-stone-50/70'
                  : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Room Number & Floor Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-black font-mono tracking-tight text-stone-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                      Room {room.number}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      Floor {room.floor}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      room.isBooked
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {room.isBooked ? 'Booked' : 'Available'}
                  </span>
                </div>

                {/* Type & Capacity */}
                <h3 className="text-base font-bold text-stone-900">
                  {room.type}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>Capacity: {room.capacity}</span>
                </div>

                {/* Amenities Badges (Clean text/icons, NO pictures of room) */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Key Inclusions & Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-stone-500">₹</span>
                    <span className="text-lg font-black font-mono text-stone-900">
                      {room.pricePerNight}
                    </span>
                    <span className="text-[11px] text-stone-500">/ night</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(room)}
                  disabled={room.isBooked}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    room.isBooked
                      ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      : 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs active:scale-95'
                  }`}
                >
                  {room.isBooked ? 'Occupied' : 'Book Room'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#1c1917] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#ea580c] font-black uppercase tracking-wider">
                  Direct Hotel Reservation
                </span>
                <h3 className="text-lg font-extrabold">
                  Book Room {selectedRoom.number} ({selectedRoom.type})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-900">
                    Room Booking Confirmed!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Booking ID: <strong className="font-mono">{bookingSuccess.id}</strong>
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Room:</span>
                    <span className="font-bold">Room {selectedRoom.number} (Floor {selectedRoom.floor})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Guest:</span>
                    <span className="font-bold">{bookingSuccess.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dates:</span>
                    <span className="font-bold">{bookingSuccess.checkInDate} to {bookingSuccess.checkOutDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Amount:</span>
                    <span className="font-extrabold text-stone-900 font-mono">₹{bookingSuccess.totalAmount}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-500">
                  A WhatsApp message has been generated for reception at <strong className="text-stone-800">{RESTAURANT_INFO.phone}</strong>.
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(null)}
                    className="flex-1 py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                  <a
                    href={`https://wa.me/917396858269?text=${encodeURIComponent(
                      `Hi Kitchen24 Team, I have booked Room ${selectedRoom.number} under name ${guestName}. Booking ID: ${bookingSuccess.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9848012345"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>Family (2 Adults + 2 Children)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Late check-in after 10 PM, extra towel, quiet floor"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                  />
                </div>

                {/* Price summary */}
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-600 block">
                      ₹{selectedRoom.pricePerNight} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                    </span>
                    <span className="font-extrabold text-stone-900 text-sm">
                      Estimated Total: ₹{calculateNights() * selectedRoom.pricePerNight}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-900 bg-amber-100 font-bold px-2 py-1 rounded">
                    Pay at Hotel or UPI
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(null)}
                    className="py-3 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                  >
                    Confirm & Send WhatsApp Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
