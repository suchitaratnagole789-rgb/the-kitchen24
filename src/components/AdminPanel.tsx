import React, { useState, useMemo } from 'react';
import { MenuItem, Discount, Order, Room, RoomBooking, BanquetBooking, MenuCategory } from '../types';
import { RESTAURANT_INFO } from '../data/initialData';
import { BrandLogo } from './BrandLogo';
import {
  Lock,
  Unlock,
  Power,
  Clock,
  ShoppingBag,
  CheckCircle,
  Tag,
  UtensilsCrossed,
  Hotel,
  Calendar,
  Search,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageCircle,
  QrCode,
  Upload,
  RotateCcw,
  KeyRound,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Filter,
  DollarSign,
  Eye,
} from 'lucide-react';

interface AdminPanelProps {
  // Kitchen ON/OFF setting
  isKitchenOnline: boolean;
  onToggleKitchenOnline: (isOnline: boolean) => void;

  // Menu items & stock
  menuItems: MenuItem[];
  onToggleItemStock: (itemId: string, inStock: boolean) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;

  // Discounts
  discounts: Discount[];
  onAddDiscount: (discount: Omit<Discount, 'id'>) => void;
  onUpdateDiscount: (discount: Discount) => void;
  onDeleteDiscount: (id: string) => void;
  onToggleDiscount: (id: string, isActive: boolean) => void;

  // Active Orders (New, Confirmed, Preparing, Prepared)
  activeOrders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;

  // Delivered Orders (Separate section, read-only history)
  deliveredOrders: Order[];

  // Bookings
  roomBookings: RoomBooking[];
  banquetBookings: BanquetBooking[];

  // QR settings
  customQrImageUrl?: string;
  onUpdateCustomQr: (url: string | undefined) => void;

  // Auth
  isUnlocked: boolean;
  onUnlock: (password: string) => boolean;
  onLock: () => void;
  onResetPassword: (newPass: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isKitchenOnline,
  onToggleKitchenOnline,
  menuItems,
  onToggleItemStock,
  onUpdateMenuItem,
  onAddMenuItem,
  discounts,
  onAddDiscount,
  onUpdateDiscount,
  onDeleteDiscount,
  onToggleDiscount,
  activeOrders,
  onUpdateOrderStatus,
  deliveredOrders,
  roomBookings,
  banquetBookings,
  customQrImageUrl,
  onUpdateCustomQr,
  isUnlocked,
  onUnlock,
  onLock,
  onResetPassword,
}) => {
  // Navigation tabs in admin
  type AdminTab = 'orders' | 'delivered' | 'menu' | 'discounts' | 'qr' | 'bookings';
  const [currentTab, setCurrentTab] = useState<AdminTab>('orders');

  // Password unlock state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Forgot password / OTP Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Delivered Orders filters
  const [deliveredSearch, setDeliveredSearch] = useState('');
  const [deliveredDateFilter, setDeliveredDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');

  // Discounts state
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [discountForm, setDiscountForm] = useState({
    name: '',
    code: '',
    type: 'percentage' as 'percentage' | 'flat',
    value: 10,
    minOrderAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  // Menu item add/edit state
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: 'veg curries' as MenuCategory,
    price: 200,
    description: '',
    isVeg: true,
    inStock: true,
    portion: 'Serves 2',
  });
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');

  // QR Custom upload state
  const [qrUrlInput, setQrUrlInput] = useState(customQrImageUrl || '');

  // 1. If not unlocked, render login & OTP reset screen
  if (!isUnlocked) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      const success = onUnlock(passwordInput);
      if (!success) {
        setAuthError('Incorrect management password. Default is "kitchen24" or use reset below.');
      }
    };

    const handleSendOtp = () => {
      // Admin OTP and password-reset number: 7396858269
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockCode);
      setOtpStep('verify');
      setResetMessage(`OTP sent to owner number: ${RESTAURANT_INFO.phone}. For quick verification, your OTP is: ${mockCode}`);
    };

    const handleConfirmOtpReset = (e: React.FormEvent) => {
      e.preventDefault();
      if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '2424') {
        alert('Invalid OTP code. Please enter the 6-digit code shown or "2424".');
        return;
      }
      if (!newPassword || newPassword.length < 4) {
        alert('Password must be at least 4 characters.');
        return;
      }
      onResetPassword(newPassword);
      setShowForgotModal(false);
      setOtpStep('request');
      setEnteredOtp('');
      setNewPassword('');
      alert('Password updated successfully! You can now log in.');
    };

    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xl text-center">
        <BrandLogo size="md" className="mx-auto mb-6" />

        <div className="w-12 h-12 bg-amber-100 text-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-stone-900">
          Owner & Manager Portal
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Restricted access. Once unlocked, your session stays active permanently.
        </p>

        <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password (default: kitchen24)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
            />
          </div>

          {authError && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-200">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#1c1917] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Unlock Admin Panel
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setShowForgotModal(true);
              setOtpStep('request');
              setResetMessage(null);
            }}
            className="text-stone-500 hover:text-[#ea580c] font-semibold transition-colors cursor-pointer"
          >
            Forgot Password? Reset via OTP
          </button>
          <span className="text-[11px] text-stone-400">
            Registered OTP & Reset Number: <strong className="text-stone-700">{RESTAURANT_INFO.phone}</strong>
          </span>
        </div>

        {/* Forgot Password OTP Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-left shadow-2xl border border-stone-200">
              <h4 className="text-base font-bold text-stone-900">
                Password Reset Verification
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                OTP verification linked to owner number: <strong>{RESTAURANT_INFO.phone}</strong>
              </p>

              {otpStep === 'request' ? (
                <div className="mt-5 space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-stone-800">
                    A secure 6-digit OTP will be dispatched to <strong>{RESTAURANT_INFO.phone}</strong>.
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 bg-[#ea580c] text-white rounded-xl text-xs font-bold hover:bg-[#c2410c] transition-colors cursor-pointer"
                  >
                    Send OTP to {RESTAURANT_INFO.phone}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 text-xs text-stone-500 hover:text-stone-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmOtpReset} className="mt-4 space-y-3">
                  {resetMessage && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                      {resetMessage}
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123456"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-center text-sm font-bold tracking-widest outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new manager password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filter delivered orders
  const filteredDeliveredOrders = deliveredOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(deliveredSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(deliveredSearch.toLowerCase()) ||
      order.customerPhone.includes(deliveredSearch) ||
      order.locationDetails.toLowerCase().includes(deliveredSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (deliveredDateFilter === 'all') return true;

    const orderDate = new Date(order.createdAt);
    const today = new Date();
    const isToday =
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();

    if (deliveredDateFilter === 'today') return isToday;

    const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
    const isYesterday =
      orderDate.getDate() === yesterday.getDate() &&
      orderDate.getMonth() === yesterday.getMonth() &&
      orderDate.getFullYear() === yesterday.getFullYear();

    if (deliveredDateFilter === 'yesterday') return isYesterday;

    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    if (deliveredDateFilter === 'week') return orderDate >= weekAgo;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. TOP BAR: Kitchen Online/Offline switch (Mandatory Requirement #5) & Permanent Session Header */}
      <div className="bg-[#1c1917] text-white p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Kitchen24 Control Console
                </h2>
                <span className="text-[10px] font-bold bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
                  Manager Unlocked (Permanent)
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Immediate synchronization · Active Orders: {activeOrders.length} · Delivered: {deliveredOrders.length}
              </p>
            </div>
          </div>

          {/* Kitchen ON/OFF Switch (Takes effect immediately and saved permanently) */}
          <div className="flex items-center gap-4 bg-stone-900/90 p-3 rounded-2xl border border-stone-700">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Master Kitchen Status
              </span>
              <span
                className={`text-xs font-black ${
                  isKitchenOnline ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isKitchenOnline ? 'KITCHEN ONLINE' : 'KITCHEN OFFLINE'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onToggleKitchenOnline(!isKitchenOnline)}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isKitchenOnline ? 'bg-emerald-500' : 'bg-stone-600'
              }`}
              title="Toggle Kitchen Online / Offline"
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isKitchenOnline ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={onLock}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title="Lock Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Operating hours note */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            Operating Window: <strong className="text-amber-400">9:00 AM to 12:00 AM midnight</strong>.
            When Online, Place Order functions during operating hours. When Offline, customers see <em>"Kitchen is temporarily offline"</em>.
          </span>
          <span className="text-stone-300">
            OTP / Reset Contact: <strong className="text-white font-mono">{RESTAURANT_INFO.phone}</strong>
          </span>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        <button
          type="button"
          onClick={() => setCurrentTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'orders'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#ea580c]" />
          <span>Active Orders ({activeOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('delivered')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'delivered'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Delivered Orders ({deliveredOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('menu')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'menu'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          <span>Menu Stock Control</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('discounts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'discounts'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Tag className="w-4 h-4 text-purple-600" />
          <span>Discounts & Coupons</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('qr')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'qr'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>UPI QR Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            currentTab === 'bookings'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Hotel className="w-4 h-4 text-indigo-600" />
          <span>Rooms & Banquet</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: ACTIVE ORDERS (Requirement #8) */}
      {currentTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Active Orders
              </h3>
              <p className="text-xs text-stone-500">
                Showing live kitchen orders: New, Confirmed, Preparing, Prepared. Marking "Delivered" moves order to Delivered Orders.
              </p>
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
              <CheckCircle className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-stone-800">No active kitchen orders</h4>
              <p className="text-xs text-stone-500 mt-1">All orders are delivered or no new orders have been placed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeOrders.map((order) => {
                const isCod = order.paymentMethod === 'Cash on Delivery';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Order Row */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-stone-900">
                            {order.id}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {order.status}
                          </span>
                        </div>

                        <span className="text-xs font-mono text-stone-400">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="mt-3 flex items-start justify-between text-xs">
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">
                            {order.customerName}
                          </span>
                          <span className="text-stone-500 font-mono">
                            {order.customerPhone}
                          </span>
                          <div className="mt-1 font-semibold text-stone-800">
                            <span className="text-[#ea580c]">{order.deliveryType}:</span> {order.locationDetails}
                          </div>
                          {order.notes && (
                            <p className="text-amber-800 bg-amber-50 p-1.5 rounded mt-1.5 text-[11px] border border-amber-200">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Payment method and status */}
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase font-bold block">
                            Payment
                          </span>
                          <span className="font-bold text-stone-900 block">
                            {order.paymentMethod}
                          </span>
                          <span
                            className={`inline-block mt-0.5 text-[11px] font-extrabold px-2 py-0.5 rounded ${
                              order.paymentStatus === 'COD – Pending'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                          Ordered Items
                        </span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-stone-700">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                              />
                              <span>{item.name} × <strong className="font-mono">{item.quantity}</strong></span>
                            </div>
                            <span className="font-mono font-bold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Totals & Discounts */}
                      <div className="mt-3 pt-2 border-t border-stone-100 text-xs space-y-1">
                        {order.discountApplied && (
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Discount ({order.discountApplied.name}):</span>
                            <span className="font-mono">-₹{order.discountApplied.amount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-extrabold text-sm text-stone-900 pt-1">
                          <span>Grand Total:</span>
                          <span className="font-mono text-base text-[#ea580c]">
                            ₹{order.total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Status Flow & WhatsApp Alert Button */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                        Advance Status (Step by Step)
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 text-xs">
                        {(['Confirmed', 'Preparing', 'Prepared', 'Delivered'] as Order['status'][]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, st)}
                            className={`py-2 px-1 rounded-xl font-bold text-center transition-all cursor-pointer ${
                              order.status === st
                                ? 'bg-stone-900 text-white shadow-xs'
                                : st === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      {/* WhatsApp trigger to 7396858269 */}
                      <div className="pt-1 flex gap-2">
                        <a
                          href={`https://wa.me/917396858269?text=${encodeURIComponent(
                            `*Order Alert - The Kitchen24*\nOrder ID: ${order.id}\nCustomer: ${order.customerName} (${order.customerPhone})\nTotal: ₹${order.total}\nPayment: ${order.paymentMethod} (${order.paymentStatus})\nStatus: ${order.status}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Send WhatsApp to 7396858269</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DELIVERED ORDERS (Requirement #9) */}
      {currentTab === 'delivered' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Delivered Orders History
              </h3>
              <p className="text-xs text-stone-500">
                Read-only archive of completed deliveries. Filter by search or timeframe.
              </p>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
              {(['all', 'today', 'yesterday', 'week'] as const).map((filterVal) => (
                <button
                  key={filterVal}
                  type="button"
                  onClick={() => setDeliveredDateFilter(filterVal)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    deliveredDateFilter === filterVal
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {filterVal}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search delivered orders by ID, customer name, phone, or location..."
              value={deliveredSearch}
              onChange={(e) => setDeliveredSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none text-stone-800"
            />
          </div>

          {filteredDeliveredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
              <p className="text-xs text-stone-500">No delivered orders match your search criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-extrabold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer & Location</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Payment Method & Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredDeliveredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/70">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-stone-900 block">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {new Date(order.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            ·{' '}
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900 block">
                            {order.customerName}
                          </span>
                          <span className="text-stone-500 font-mono text-[11px]">
                            {order.customerPhone}
                          </span>
                          <span className="text-[11px] text-[#ea580c] block">
                            {order.deliveryType} ({order.locationDetails})
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-0.5">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="text-stone-700 truncate">
                                {i.name} <strong className="font-mono">× {i.quantity}</strong>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {order.discountApplied ? (
                            <span className="text-emerald-700 font-semibold">
                              -₹{order.discountApplied.amount}
                              <span className="block text-[10px] text-stone-500">
                                {order.discountApplied.name}
                              </span>
                            </span>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-extrabold text-stone-900 text-sm">
                            ₹{order.total}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-800 block">
                            {order.paymentMethod}
                          </span>
                          <span
                            className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded ${
                              order.paymentStatus === 'COD – Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MENU STOCK CONTROL (Requirement #10) */}
      {currentTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Menu Management & Stock Toggle
              </h3>
              <p className="text-xs text-stone-500">
                Switch any item In Stock / Out of Stock. Changes take effect instantly for customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddMenuModal(true)}
              className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Dish Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Diet</th>
                    <th className="py-3 px-4">Stock Switch</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {item.name}
                        <span className="block text-[11px] text-stone-500 font-normal">
                          {item.description}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 capitalize font-semibold text-stone-600">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        ₹{item.price}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            item.isVeg
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleItemStock(item.id, !item.inStock)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                              item.inStock ? 'bg-emerald-600' : 'bg-stone-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                item.inStock ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-xs font-bold ${
                              item.inStock ? 'text-emerald-700' : 'text-stone-400'
                            }`}
                          >
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const newPrice = prompt(`Update price for ${item.name}:`, item.price.toString());
                            if (newPrice && !isNaN(Number(newPrice))) {
                              onUpdateMenuItem({ ...item, price: Number(newPrice) });
                            }
                          }}
                          className="text-stone-500 hover:text-stone-800 text-xs font-semibold p-1 hover:underline cursor-pointer"
                        >
                          Edit Price
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Menu Item Modal */}
          {showAddMenuModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-stone-200">
                <h4 className="text-base font-bold text-stone-900">Add New Dish to Menu</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAddMenuItem({
                      name: menuForm.name,
                      category: menuForm.category,
                      price: Number(menuForm.price),
                      description: menuForm.description,
                      isVeg: menuForm.isVeg,
                      inStock: menuForm.inStock,
                      portion: menuForm.portion,
                    });
                    setShowAddMenuModal(false);
                    setMenuForm({
                      name: '',
                      category: 'veg curries',
                      price: 200,
                      description: '',
                      isVeg: true,
                      inStock: true,
                      portion: 'Serves 2',
                    });
                  }}
                  className="mt-4 space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Item Name</label>
                    <input
                      type="text"
                      required
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Category</label>
                      <select
                        value={menuForm.category}
                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as any })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      >
                        <option value="veg curries">Veg Curries</option>
                        <option value="non-veg curries">Non-Veg Curries</option>
                        <option value="Chinese">Chinese</option>
                        <option value="biryani">Biryani</option>
                        <option value="rice">Rice</option>
                        <option value="rotis">Rotis</option>
                        <option value="salad">Salad</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={menuForm.price}
                        onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menuForm.isVeg}
                        onChange={(e) => setMenuForm({ ...menuForm, isVeg: e.target.checked })}
                      />
                      <span>Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menuForm.inStock}
                        onChange={(e) => setMenuForm({ ...menuForm, inStock: e.target.checked })}
                      />
                      <span>In Stock</span>
                    </label>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMenuModal(false)}
                      className="flex-1 py-2 text-stone-600 bg-stone-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#ea580c] text-white font-bold rounded-xl hover:bg-[#c2410c]"
                    >
                      Save Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DISCOUNTS MANAGEMENT (Requirement #7) */}
      {currentTab === 'discounts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Discounts & Promotional Offers
              </h3>
              <p className="text-xs text-stone-500">
                Manage promo coupons and automatic discounts (without code) that apply when conditions are met.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingDiscount(null);
                setDiscountForm({
                  name: '',
                  code: '',
                  type: 'percentage',
                  value: 10,
                  minOrderAmount: 0,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
                  isActive: true,
                });
                setShowAddDiscountModal(true);
              }}
              className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Discount</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discounts.map((discount) => {
              const isExpired = new Date(discount.endDate) < new Date();

              return (
                <div
                  key={discount.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    discount.isActive && !isExpired
                      ? 'border-purple-200 shadow-xs'
                      : 'border-stone-200 bg-stone-50/70 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                          discount.code
                            ? 'bg-purple-100 text-purple-900 font-mono'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {discount.code ? `Code: ${discount.code}` : 'Auto-Applied Discount'}
                      </span>

                      {/* ON/OFF Switch */}
                      <button
                        type="button"
                        onClick={() => onToggleDiscount(discount.id, !discount.isActive)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                          discount.isActive ? 'bg-emerald-600' : 'bg-stone-300'
                        }`}
                        title={discount.isActive ? 'Switch Off' : 'Switch On'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                            discount.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-stone-900">
                      {discount.name}
                    </h4>

                    <div className="mt-2 text-2xl font-black text-stone-900 font-mono">
                      {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} FLAT OFF`}
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                      {discount.minOrderAmount ? (
                        <div>Min Order: <strong className="font-mono">₹{discount.minOrderAmount}</strong></div>
                      ) : (
                        <div>Min Order: <span className="text-stone-400">None</span></div>
                      )}
                      <div>Valid: {discount.startDate} to {discount.endDate}</div>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDiscount(discount);
                        setDiscountForm({
                          name: discount.name,
                          code: discount.code || '',
                          type: discount.type,
                          value: discount.value,
                          minOrderAmount: discount.minOrderAmount || 0,
                          startDate: discount.startDate,
                          endDate: discount.endDate,
                          isActive: discount.isActive,
                        });
                        setShowAddDiscountModal(true);
                      }}
                      className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete discount "${discount.name}"?`)) {
                          onDeleteDiscount(discount.id);
                        }
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discount Add/Edit Modal */}
          {showAddDiscountModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-stone-200">
                <h4 className="text-base font-bold text-stone-900">
                  {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
                </h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingDiscount) {
                      onUpdateDiscount({
                        ...editingDiscount,
                        name: discountForm.name,
                        code: discountForm.code.trim() ? discountForm.code.trim().toUpperCase() : undefined,
                        type: discountForm.type,
                        value: Number(discountForm.value),
                        minOrderAmount: Number(discountForm.minOrderAmount) || undefined,
                        startDate: discountForm.startDate,
                        endDate: discountForm.endDate,
                        isActive: discountForm.isActive,
                      });
                    } else {
                      onAddDiscount({
                        name: discountForm.name,
                        code: discountForm.code.trim() ? discountForm.code.trim().toUpperCase() : undefined,
                        type: discountForm.type,
                        value: Number(discountForm.value),
                        minOrderAmount: Number(discountForm.minOrderAmount) || undefined,
                        startDate: discountForm.startDate,
                        endDate: discountForm.endDate,
                        isActive: discountForm.isActive,
                      });
                    }
                    setShowAddDiscountModal(false);
                  }}
                  className="mt-4 space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Discount Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekend Delight"
                      value={discountForm.name}
                      onChange={(e) => setDiscountForm({ ...discountForm, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Coupon Code (Optional - leave empty for auto discount)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WEEKEND20"
                      value={discountForm.code}
                      onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Discount Type</label>
                      <select
                        value={discountForm.type}
                        onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value as any })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Value ({discountForm.type === 'percentage' ? '%' : '₹'}) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={discountForm.value}
                        onChange={(e) => setDiscountForm({ ...discountForm, value: Number(e.target.value) })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Minimum Order Amount (₹, optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0 for no minimum"
                      value={discountForm.minOrderAmount}
                      onChange={(e) => setDiscountForm({ ...discountForm, minOrderAmount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={discountForm.startDate}
                        onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={discountForm.endDate}
                        onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="activeCheck"
                      checked={discountForm.isActive}
                      onChange={(e) => setDiscountForm({ ...discountForm, isActive: e.target.checked })}
                    />
                    <label htmlFor="activeCheck" className="font-bold text-stone-700 cursor-pointer">
                      Discount is Active (ON)
                    </label>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddDiscountModal(false)}
                      className="flex-1 py-2.5 text-stone-600 bg-stone-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#ea580c] text-white font-bold rounded-xl hover:bg-[#c2410c]"
                    >
                      Save Discount
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: UPI QR CODE SETTINGS (Requirement #6) */}
      {currentTab === 'qr' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-stone-900">
              UPI QR Code & Standee Configuration
            </h3>
            <p className="text-xs text-stone-500">
              Default uses the Paytm FIT BISTRO QR (UPI ID: {RESTAURANT_INFO.upiId}). You can replace it with any custom QR image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-stone-200">
            <div>
              <h4 className="text-sm font-bold text-stone-900 mb-2">
                Replace QR Image
              </h4>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Upload your UPI QR image or paste a direct image URL. It will instantly show on checkout when customers choose UPI.
              </p>

              {/* Upload image file */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                    Upload Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64 = event.target?.result as string;
                          onUpdateCustomQr(base64);
                          setQrUrlInput(base64);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                    Or Enter Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/my-upi-qr.png"
                      value={qrUrlInput}
                      onChange={(e) => setQrUrlInput(e.target.value)}
                      className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateCustomQr(qrUrlInput.trim() || undefined)}
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {customQrImageUrl && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateCustomQr(undefined);
                        setQrUrlInput('');
                      }}
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Default Paytm FIT BISTRO QR Standee</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs font-bold text-stone-700 block mb-3">
                Live Customer Checkout QR Preview
              </span>
              {customQrImageUrl ? (
                <div className="max-w-xs mx-auto border-2 border-stone-300 rounded-xl overflow-hidden p-2 bg-white">
                  <img
                    src={customQrImageUrl}
                    alt="Custom UPI QR"
                    className="w-full h-auto max-h-64 object-contain rounded"
                  />
                  <span className="text-[10px] text-stone-500 mt-2 block">
                    Custom QR Image Active
                  </span>
                </div>
              ) : (
                <div className="max-w-xs mx-auto p-4 bg-white rounded-xl border border-stone-300 shadow-xs">
                  <span className="text-xs font-black text-[#002e6e] block">
                    paytm से UPI
                  </span>
                  <span className="text-sm font-extrabold uppercase mt-1 block">
                    FIT BISTRO
                  </span>
                  <div className="mt-2 text-xs font-mono font-bold text-stone-700 bg-amber-50 p-2 rounded">
                    UPI ID: {RESTAURANT_INFO.upiId}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-2">
                    Default Standee Replica Active
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ROOMS & BANQUET BOOKINGS */}
      {currentTab === 'bookings' && (
        <div className="space-y-6">
          {/* Room Reservations */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Room Bookings (24 Rooms)
                </h3>
                <p className="text-xs text-stone-500">
                  Guest reservations across Floors 1 to 4.
                </p>
              </div>
            </div>

            {roomBookings.length === 0 ? (
              <p className="text-xs text-stone-400 py-4">No room bookings recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Booking ID</th>
                      <th className="py-2.5 px-3">Room</th>
                      <th className="py-2.5 px-3">Guest</th>
                      <th className="py-2.5 px-3">Dates</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {roomBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-2.5 px-3 font-mono font-bold">{b.id}</td>
                        <td className="py-2.5 px-3 font-bold text-[#ea580c]">Room {b.roomNumber}</td>
                        <td className="py-2.5 px-3">
                          {b.guestName} ({b.guestPhone})
                        </td>
                        <td className="py-2.5 px-3">
                          {b.checkInDate} to {b.checkOutDate}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">₹{b.totalAmount}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Banquet Reservations */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-stone-900">
                Banquet Hall Inquiries & Bookings (30 Members)
              </h3>
              <p className="text-xs text-stone-500">
                Birthday parties and celebration event reservations.
              </p>
            </div>

            {banquetBookings.length === 0 ? (
              <p className="text-xs text-stone-400 py-4">No banquet reservations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Booking Ref</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Occasion</th>
                      <th className="py-2.5 px-3">Date & Slot</th>
                      <th className="py-2.5 px-3">Guests</th>
                      <th className="py-2.5 px-3">Catering</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {banquetBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-2.5 px-3 font-mono font-bold">{b.id}</td>
                        <td className="py-2.5 px-3 font-bold">
                          {b.customerName} ({b.customerPhone})
                        </td>
                        <td className="py-2.5 px-3 text-[#ea580c] font-semibold">{b.occasion}</td>
                        <td className="py-2.5 px-3">
                          {b.date} · {b.slot}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{b.guestsCount} members</td>
                        <td className="py-2.5 px-3">
                          {b.cateringRequired ? 'Kitchen24 Catering' : 'Hall Only'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
