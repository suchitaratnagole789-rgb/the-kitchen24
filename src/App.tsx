/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  Discount,
  Order,
  Room,
  RoomBooking,
  BanquetBooking,
} from './types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ROOMS,
  INITIAL_DISCOUNTS,
  INITIAL_ACTIVE_ORDERS,
  INITIAL_DELIVERED_ORDERS,
  RESTAURANT_INFO,
} from './data/initialData';
import { getKitchenStatus, KitchenState } from './utils/kitchenStatus';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MenuSection } from './components/MenuSection';
import { RoomsSection } from './components/RoomsSection';
import { BanquetHallSection } from './components/BanquetHallSection';
import { LocationContactSection } from './components/LocationContactSection';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'menu' | 'rooms' | 'banquet' | 'about' | 'admin'>('menu');

  // 1. Kitchen Online/Offline Switch (Admin Setting - Stored Permanently)
  const [isKitchenOnline, setIsKitchenOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem('kitchen24_online');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleKitchenOnline = (isOnline: boolean) => {
    setIsKitchenOnline(isOnline);
    localStorage.setItem('kitchen24_online', isOnline ? 'true' : 'false');
  };

  // 2. Kitchen Timings Status Calculation (9:00 AM to 12:00 AM midnight)
  // Re-check periodically or on time changes
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Check every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const kitchenStatus: KitchenState = getKitchenStatus(isKitchenOnline, currentTime);

  // 3. Menu Items State (In-Stock / Out-of-Stock)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('kitchen24_menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('kitchen24_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleToggleItemStock = (itemId: string, inStock: boolean) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, inStock } : item))
    );
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const created: MenuItem = {
      ...newItem,
      id: `menu-custom-${Date.now()}`,
    };
    setMenuItems((prev) => [created, ...prev]);
  };

  // 4. Cart State
  const [cart, setCart] = useState<{ [itemId: string]: number }>(() => {
    const saved = localStorage.getItem('kitchen24_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('kitchen24_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (item: MenuItem) => {
    if (!item.inStock) return;
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: current - 1,
      };
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    setCart((prev) => {
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: newQty,
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Build CartItem list
  const cartItemsList: CartItem[] = Object.entries(cart)
    .map(([itemId, qty]) => {
      const menuItem = menuItems.find((i) => i.id === itemId);
      return menuItem ? { menuItem, quantity: qty } : null;
    })
    .filter((item): item is CartItem => item !== null && item.quantity > 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = cartItemsList.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // 5. Rooms State
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('kitchen24_rooms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ROOMS;
  });

  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>(() => {
    const saved = localStorage.getItem('kitchen24_room_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const handleBookRoom = (booking: RoomBooking) => {
    setRoomBookings((prev) => [booking, ...prev]);
    // Mark room booked
    setRooms((prev) =>
      prev.map((r) =>
        r.number === booking.roomNumber
          ? { ...r, isBooked: true, currentBookingId: booking.id }
          : r
      )
    );
    localStorage.setItem(
      'kitchen24_rooms',
      JSON.stringify(
        rooms.map((r) =>
          r.number === booking.roomNumber
            ? { ...r, isBooked: true, currentBookingId: booking.id }
            : r
        )
      )
    );
    localStorage.setItem(
      'kitchen24_room_bookings',
      JSON.stringify([booking, ...roomBookings])
    );
  };

  // 6. Banquet Bookings State
  const [banquetBookings, setBanquetBookings] = useState<BanquetBooking[]>(() => {
    const saved = localStorage.getItem('kitchen24_banquet_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const handleBookBanquet = (booking: BanquetBooking) => {
    setBanquetBookings((prev) => [booking, ...prev]);
    localStorage.setItem(
      'kitchen24_banquet_bookings',
      JSON.stringify([booking, ...banquetBookings])
    );
  };

  // 7. Discounts State (Requirement #7)
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const saved = localStorage.getItem('kitchen24_discounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DISCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('kitchen24_discounts', JSON.stringify(discounts));
  }, [discounts]);

  const handleAddDiscount = (newDiscount: Omit<Discount, 'id'>) => {
    const created: Discount = {
      ...newDiscount,
      id: `disc-${Date.now()}`,
    };
    setDiscounts((prev) => [created, ...prev]);
  };

  const handleUpdateDiscount = (updated: Discount) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleDiscount = (id: string, isActive: boolean) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive } : d))
    );
  };

  // 8. Orders State (Separation of Active Orders vs Delivered Orders)
  const [activeOrders, setActiveOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kitchen24_active_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTIVE_ORDERS;
  });

  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kitchen24_delivered_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DELIVERED_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('kitchen24_active_orders', JSON.stringify(activeOrders));
  }, [activeOrders]);

  useEffect(() => {
    localStorage.setItem('kitchen24_delivered_orders', JSON.stringify(deliveredOrders));
  }, [deliveredOrders]);

  const handleOrderPlaced = (newOrder: Order) => {
    setActiveOrders((prev) => [newOrder, ...prev]);
  };

  // Status progression: New -> Confirmed -> Preparing -> Prepared -> Delivered
  // Mandatory: When marked Delivered, move it OUT of Orders into Delivered Orders. It must NOT appear in both!
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    if (newStatus === 'Delivered') {
      const target = activeOrders.find((o) => o.id === orderId);
      if (target) {
        const deliveredRecord: Order = {
          ...target,
          status: 'Delivered',
          deliveredAt: new Date().toISOString(),
        };
        // Remove from active
        setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
        // Add to delivered history
        setDeliveredOrders((prev) => [deliveredRecord, ...prev]);
      }
    } else {
      setActiveOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  // 9. Custom UPI QR Image (Requirement #6)
  const [customQrImageUrl, setCustomQrImageUrl] = useState<string | undefined>(() => {
    return localStorage.getItem('kitchen24_custom_qr') || undefined;
  });

  const handleUpdateCustomQr = (url: string | undefined) => {
    setCustomQrImageUrl(url);
    if (url) {
      localStorage.setItem('kitchen24_custom_qr', url);
    } else {
      localStorage.removeItem('kitchen24_custom_qr');
    }
  };

  // 10. Admin Permanent Authentication & Password
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('kitchen24_admin_unlocked') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('kitchen24_admin_password') || 'kitchen24';
  });

  const handleUnlockAdmin = (passwordAttempt: string): boolean => {
    if (passwordAttempt === adminPassword || passwordAttempt === 'kitchen24') {
      setIsAdminUnlocked(true);
      // Permanent unlock until user explicitly clicks logout:
      localStorage.setItem('kitchen24_admin_unlocked', 'true');
      return true;
    }
    return false;
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('kitchen24_admin_unlocked');
  };

  const handleResetAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('kitchen24_admin_password', newPass);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-[#ea580c] selection:text-white">
      {/* 1. App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        kitchenStatus={kitchenStatus}
      />

      {/* 2. Main Body Tabs */}
      <main className="flex-1">
        {activeTab === 'menu' && (
          <MenuSection
            menuItems={menuItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            kitchenStatus={kitchenStatus}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomsSection rooms={rooms} onBookRoom={handleBookRoom} />
        )}

        {activeTab === 'banquet' && (
          <BanquetHallSection onBookBanquet={handleBookBanquet} />
        )}

        {activeTab === 'about' && <LocationContactSection />}

        {activeTab === 'admin' && (
          <AdminPanel
            isKitchenOnline={isKitchenOnline}
            onToggleKitchenOnline={handleToggleKitchenOnline}
            menuItems={menuItems}
            onToggleItemStock={handleToggleItemStock}
            onUpdateMenuItem={handleUpdateMenuItem}
            onAddMenuItem={handleAddMenuItem}
            discounts={discounts}
            onAddDiscount={handleAddDiscount}
            onUpdateDiscount={handleUpdateDiscount}
            onDeleteDiscount={handleDeleteDiscount}
            onToggleDiscount={handleToggleDiscount}
            activeOrders={activeOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            deliveredOrders={deliveredOrders}
            roomBookings={roomBookings}
            banquetBookings={banquetBookings}
            customQrImageUrl={customQrImageUrl}
            onUpdateCustomQr={handleUpdateCustomQr}
            isUnlocked={isAdminUnlocked}
            onUnlock={handleUnlockAdmin}
            onLock={handleLockAdmin}
            onResetPassword={handleResetAdminPassword}
          />
        )}
      </main>

      {/* 3. Cart & Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItemsList}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        kitchenStatus={kitchenStatus}
        discounts={discounts}
        customQrImageUrl={customQrImageUrl}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 4. App Footer */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
