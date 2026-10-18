import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Discount, Order } from '../types';
import { KitchenState } from '../utils/kitchenStatus';
import { RESTAURANT_INFO } from '../data/initialData';
import { UpiPaytmCard } from './UpiPaytmCard';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  AlertCircle,
  Check,
  ArrowRight,
  ShieldAlert,
  MessageCircle,
  Receipt,
  Phone,
  Clock,
} from 'lucide-react';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (menuItemId: string, newQty: number) => void;
  onClearCart: () => void;
  kitchenStatus: KitchenState;
  discounts: Discount[];
  customQrImageUrl?: string;
  onOrderPlaced: (order: Order) => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  kitchenStatus,
  discounts,
  customQrImageUrl,
  onOrderPlaced,
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<
    'Room Delivery' | 'Table Dine-in' | 'Takeaway' | 'Local Delivery'
  >('Room Delivery');
  const [locationDetails, setLocationDetails] = useState('');
  const [notes, setNotes] = useState('');

  // Discount code
  const [couponInput, setCouponInput] = useState('');
  const [appliedManualDiscount, setAppliedManualDiscount] = useState<Discount | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI'>('Cash on Delivery');
  const [showUpiScreen, setShowUpiScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cartItems]);

  // Determine applicable discount (manual or auto)
  const todayStr = new Date().toISOString().split('T')[0];

  const applicableDiscount = useMemo(() => {
    // 1. If manual discount is applied and valid
    if (appliedManualDiscount) {
      if (
        appliedManualDiscount.isActive &&
        appliedManualDiscount.startDate <= todayStr &&
        appliedManualDiscount.endDate >= todayStr &&
        (!appliedManualDiscount.minOrderAmount || subtotal >= appliedManualDiscount.minOrderAmount)
      ) {
        const amount =
          appliedManualDiscount.type === 'percentage'
            ? (subtotal * appliedManualDiscount.value) / 100
            : appliedManualDiscount.value;
        return {
          discount: appliedManualDiscount,
          amount: Math.min(amount, subtotal),
          isManual: true,
        };
      }
    }

    // 2. Otherwise find automatic discounts (code is empty or undefined)
    const validAutoDiscounts = discounts.filter(
      (d) =>
        d.isActive &&
        (!d.code || d.code.trim() === '') &&
        d.startDate <= todayStr &&
        d.endDate >= todayStr &&
        (!d.minOrderAmount || subtotal >= d.minOrderAmount)
    );

    if (validAutoDiscounts.length > 0) {
      // Pick the discount giving maximum savings
      let bestDiscount = validAutoDiscounts[0];
      let maxAmount = 0;

      for (const d of validAutoDiscounts) {
        const amt = d.type === 'percentage' ? (subtotal * d.value) / 100 : d.value;
        if (amt > maxAmount) {
          maxAmount = amt;
          bestDiscount = d;
        }
      }

      return {
        discount: bestDiscount,
        amount: Math.min(maxAmount, subtotal),
        isManual: false,
      };
    }

    return null;
  }, [appliedManualDiscount, discounts, subtotal, todayStr]);

  const discountAmount = applicableDiscount ? applicableDiscount.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Apply manual coupon code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const found = discounts.find(
      (d) => d.code && d.code.trim().toUpperCase() === trimmed
    );

    if (!found) {
      setCouponError('Invalid coupon code. Please try another.');
      return;
    }

    if (!found.isActive) {
      setCouponError('This coupon is currently inactive.');
      return;
    }

    if (found.startDate > todayStr || found.endDate < todayStr) {
      setCouponError('This coupon has expired or is not yet active.');
      return;
    }

    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      setCouponError(`Minimum order amount of ₹${found.minOrderAmount} required for this coupon.`);
      return;
    }

    setAppliedManualDiscount(found);
    setCouponSuccess(`Applied: ${found.name} (${found.type === 'percentage' ? `${found.value}% off` : `₹${found.value} off`})`);
  };

  const handleRemoveCoupon = () => {
    setAppliedManualDiscount(null);
    setCouponInput('');
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Place order logic
  const executePlaceOrder = (chosenPaymentMethod: 'Cash on Delivery' | 'UPI') => {
    if (!customerName || !customerPhone || !locationDetails) {
      alert('Please fill in your name, contact phone, and delivery/room details.');
      return;
    }

    if (!kitchenStatus.isOpenForOrders) {
      alert(kitchenStatus.statusMessage);
      return;
    }

    setIsSubmitting(true);

    const paymentStatus: 'COD – Pending' | 'UPI – Paid (verify)' =
      chosenPaymentMethod === 'Cash on Delivery' ? 'COD – Pending' : 'UPI – Paid (verify)';

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customerName,
      customerPhone,
      deliveryType,
      locationDetails,
      items: cartItems.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        isVeg: item.menuItem.isVeg,
      })),
      subtotal,
      discountApplied: applicableDiscount
        ? {
            id: applicableDiscount.discount.id,
            name: applicableDiscount.discount.name,
            code: applicableDiscount.discount.code,
            amount: discountAmount,
          }
        : undefined,
      total: finalTotal,
      paymentMethod: chosenPaymentMethod,
      paymentStatus,
      status: 'New',
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    onOrderPlaced(newOrder);
    setPlacedOrder(newOrder);
    setIsSubmitting(false);

    // Send WhatsApp alert to 7396858269
    sendWhatsAppAlert(newOrder);
  };

  const sendWhatsAppAlert = (order: Order) => {
    const itemsText = order.items
      .map((i) => `• ${i.name} × ${i.quantity} = ₹${i.price * i.quantity}`)
      .join('\n');

    const discountText = order.discountApplied
      ? `\nDiscount Applied: ${order.discountApplied.name} (-₹${order.discountApplied.amount})`
      : '';

    const waText =
      `*🔔 New Order Placed - The Kitchen24 By FIT BISTRO*\n\n` +
      `*Order ID:* ${order.id}\n` +
      `*Customer:* ${order.customerName} (${order.customerPhone})\n` +
      `*Delivery Type:* ${order.deliveryType} (${order.locationDetails})\n` +
      `*Items:*\n${itemsText}\n` +
      `*Subtotal:* ₹${order.subtotal}` +
      `${discountText}\n` +
      `*Grand Total:* ₹${order.total}\n` +
      `*Payment Method:* ${order.paymentMethod}\n` +
      `*Payment Status:* ${order.paymentStatus}\n` +
      (order.notes ? `*Special Notes:* ${order.notes}\n` : '') +
      `*Location:* ${RESTAURANT_INFO.location}\n` +
      `*Time:* ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const waUrl = `https://wa.me/917396858269?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handlePlaceOrderClick = () => {
    if (!kitchenStatus.isOpenForOrders) {
      return;
    }
    if (!customerName || !customerPhone || !locationDetails) {
      alert('Please fill all required customer details (Name, Phone, and Delivery Location / Room).');
      return;
    }

    if (paymentMethod === 'Cash on Delivery') {
      executePlaceOrder('Cash on Delivery');
    } else {
      // Show UPI QR screen
      setShowUpiScreen(true);
    }
  };

  const handleUpiPaidConfirm = () => {
    executePlaceOrder('UPI');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#1c1917] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] text-[#ea580c] font-black uppercase tracking-wider block">
              The Kitchen24 By FIT BISTRO
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              {placedOrder
                ? 'Order Confirmation'
                : showUpiScreen
                ? 'UPI Payment via Paytm Standee'
                : 'Your Cart & Checkout'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {placedOrder ? (
            /* Order Placed Success View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Order Successfully Received
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-2 font-mono">
                  {placedOrder.id}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Thank you, <strong>{placedOrder.customerName}</strong>! Our kitchen has received your order.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="font-bold text-stone-800">
                    {placedOrder.deliveryType} ({placedOrder.locationDetails})
                  </span>
                  <span className="text-stone-500 font-mono">
                    {new Date(placedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-stone-700">
                      <span>
                        {item.name} <strong className="font-mono">× {item.quantity}</strong>
                      </span>
                      <span className="font-mono font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-1">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{placedOrder.subtotal}</span>
                  </div>

                  {placedOrder.discountApplied && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({placedOrder.discountApplied.name}):</span>
                      <span className="font-mono">-₹{placedOrder.discountApplied.amount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1 border-t border-stone-200">
                    <span>Final Total:</span>
                    <span className="font-mono">₹{placedOrder.total}</span>
                  </div>
                </div>

                {/* Payment status badge */}
                <div className="pt-2 flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Payment Method</span>
                    <strong className="text-stone-900">{placedOrder.paymentMethod}</strong>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      placedOrder.paymentStatus === 'COD – Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {placedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Alert Notification Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>
                  WhatsApp notification sent to Kitchen desk at <strong className="font-mono">7396858269</strong>.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Close & Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={() => sendWhatsAppAlert(placedOrder)}
                  className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Resend WhatsApp Notification</span>
                </button>
              </div>
            </div>
          ) : showUpiScreen ? (
            /* UPI Payment QR Screen (Replicating exact user screenshot) */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowUpiScreen(false)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  ← Back to Order Summary
                </button>
                <span className="text-xs font-mono font-bold text-stone-500">
                  Step 2 of 2
                </span>
              </div>

              {/* Paytm Standee Card */}
              <UpiPaytmCard
                amount={finalTotal}
                customQrImageUrl={customQrImageUrl}
                merchantName="FIT BISTRO"
                upiId={RESTAURANT_INFO.upiId}
                onPaidClick={handleUpiPaidConfirm}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            /* Standard Cart & Checkout Form */
            <>
              {/* Kitchen Timing / Offline Alerts */}
              {!kitchenStatus.isOpenForOrders && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    <strong className="font-extrabold text-xs sm:text-sm">
                      {kitchenStatus.statusMessage}
                    </strong>
                  </div>
                  <p className="text-xs text-red-700 pl-7 leading-relaxed">
                    Operating timings are <strong>9:00 AM to 12:00 AM midnight</strong>. You may continue to adjust items in your cart, but ordering is disabled right now.
                  </p>
                </div>
              )}

              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-stone-500">
                    Selected Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                  </h4>
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-xs text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200">
                    <p className="text-xs text-stone-500">Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {cartItems.map(({ menuItem, quantity }) => (
                      <div
                        key={menuItem.id}
                        className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs shrink-0 ${
                              menuItem.isVeg ? 'border-emerald-600' : 'border-red-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                menuItem.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                              }`}
                            />
                          </span>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-stone-900 truncate">
                              {menuItem.name}
                            </h5>
                            <span className="text-[11px] text-stone-500 font-mono">
                              ₹{menuItem.price} each
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
                              className="p-1 hover:bg-stone-100 rounded text-stone-600 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold font-mono px-1 min-w-[1rem] text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
                              className="p-1 hover:bg-stone-100 rounded text-stone-600 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-extrabold text-stone-900 font-mono min-w-[3rem] text-right">
                            ₹{menuItem.price * quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount Code Section */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Apply Coupon or Discount</span>
                  </span>
                  {applicableDiscount?.isManual && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove Code
                    </button>
                  )}
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. WELCOME24, FLAT50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none uppercase font-mono font-bold text-stone-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1c1917] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}

                {applicableDiscount && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong>{applicableDiscount.discount.name}</strong>
                        {applicableDiscount.discount.code && (
                          <span className="ml-1 text-[11px] font-mono font-bold text-emerald-700">
                            [{applicableDiscount.discount.code}]
                          </span>
                        )}
                        {!applicableDiscount.isManual && (
                          <span className="ml-1.5 text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded text-emerald-800">
                            Auto Applied
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-extrabold font-mono">
                      -₹{applicableDiscount.amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-stone-500">
                  Customer & Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Varma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9848012345"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Delivery / Dining Preference
                    </label>
                    <select
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    >
                      <option value="Room Delivery">Room Delivery (at Super Town House)</option>
                      <option value="Table Dine-in">Table Dine-in (Restaurant)</option>
                      <option value="Takeaway">Takeaway / Self Pickup</option>
                      <option value="Local Delivery">Local Delivery in Gachibowli</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      {deliveryType === 'Room Delivery'
                        ? 'Room Number (e.g. Room 204) *'
                        : deliveryType === 'Table Dine-in'
                        ? 'Table Number (e.g. Table 4) *'
                        : 'Delivery Address / Pickup Note *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        deliveryType === 'Room Delivery'
                          ? 'e.g. Room 204'
                          : deliveryType === 'Table Dine-in'
                          ? 'e.g. Table 6'
                          : 'Flat / Building, Gachibowli'
                      }
                      value={locationDetails}
                      onChange={(e) => setLocationDetails(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Special Cooking Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Less spicy, extra onions, disposable cutlery"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#ea580c]/40 outline-none"
                  />
                </div>
              </div>

              {/* Payment Option Selection (Cash on Delivery or UPI) */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                  Select Payment Option *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#ea580c] bg-amber-50/50'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">
                        Cash on Delivery
                      </h5>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Order is placed straight away. Pay cash on receipt.
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'border-[#ea580c] bg-[#ea580c]'
                          : 'border-stone-300'
                      }`}
                    >
                      {paymentMethod === 'Cash on Delivery' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'UPI'
                        ? 'border-[#00baf2] bg-cyan-50/40'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-stone-900">
                          Instant UPI QR
                        </h5>
                        <span className="text-[9px] bg-[#002e6e] text-white px-1.5 py-0.2 rounded font-black">
                          Paytm Standee
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Scan Paytm QR, tap "I have paid" to confirm.
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'UPI'
                          ? 'border-[#00baf2] bg-[#00baf2]'
                          : 'border-stone-300'
                      }`}
                    >
                      {paymentMethod === 'UPI' && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Calculation Bill */}
              <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal:</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Savings:</span>
                    <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-300">
                  <span>Total Payable:</span>
                  <span className="font-mono text-base text-[#ea580c]">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!kitchenStatus.isOpenForOrders || cartItems.length === 0}
                  onClick={handlePlaceOrderClick}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    !kitchenStatus.isOpenForOrders || cartItems.length === 0
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
                      : paymentMethod === 'UPI'
                      ? 'bg-[#002e6e] hover:bg-[#002050] text-white'
                      : 'bg-[#ea580c] hover:bg-[#c2410c] text-white active:scale-[0.99]'
                  }`}
                >
                  {paymentMethod === 'UPI' ? (
                    <>
                      <span>Proceed to UPI QR Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4" />
                      <span>Place Order (Cash on Delivery)</span>
                    </>
                  )}
                </button>

                {!kitchenStatus.isOpenForOrders && (
                  <p className="text-center text-xs text-red-600 font-bold mt-2">
                    {kitchenStatus.statusMessage}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
