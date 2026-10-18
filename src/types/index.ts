export type MenuCategory =
  | 'veg curries'
  | 'non-veg curries'
  | 'Chinese'
  | 'biryani'
  | 'rice'
  | 'rotis'
  | 'salad'
  | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  isVeg: boolean;
  inStock: boolean;
  portion?: string;
  spicyLevel?: 1 | 2 | 3;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Room {
  number: number;
  floor: 1 | 2 | 3 | 4;
  type: string;
  pricePerNight: number;
  capacity: string;
  amenities: string[];
  isBooked: boolean;
  currentBookingId?: string;
}

export interface RoomBooking {
  id: string;
  roomNumber: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalAmount: number;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
  createdAt: string;
  specialRequests?: string;
}

export interface BanquetBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  slot: string;
  occasion: string;
  guestsCount: number;
  cateringRequired: boolean;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Discount {
  id: string;
  name: string;
  code?: string; // optional: if empty, applies automatically
  type: 'percentage' | 'flat';
  value: number; // percentage (e.g. 15 for 15%) or flat amount (e.g. 100 for ₹100)
  minOrderAmount?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Preparing' | 'Prepared' | 'Delivered';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'Room Delivery' | 'Table Dine-in' | 'Takeaway' | 'Local Delivery';
  locationDetails: string; // room number or address
  items: OrderItem[];
  subtotal: number;
  discountApplied?: {
    id: string;
    name: string;
    code?: string;
    amount: number;
  };
  total: number;
  paymentMethod: 'Cash on Delivery' | 'UPI';
  paymentStatus: 'COD – Pending' | 'UPI – Paid (verify)';
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
  notes?: string;
}

export interface KitchenSettings {
  isOnline: boolean; // Admin ON/OFF switch
  customQrImageUrl?: string;
  upiId: string;
  merchantName: string;
  contactPhone: string;
  adminPasswordHash?: string;
}
