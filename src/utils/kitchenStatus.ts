export interface KitchenState {
  isOpenForOrders: boolean;
  isKitchenOnline: boolean; // From admin ON/OFF switch
  isWithinOperatingHours: boolean; // 9:00 AM to 12:00 AM midnight
  statusMessage: string;
  subMessage?: string;
}

/**
 * Operating hours: 9:00 AM (09:00) to 12:00 AM midnight (24:00)
 * Note: 9:00 AM to 12:00 AM midnight means hours 9 through 23:59.
 * Outside hours (12:00 AM to 8:59 AM) are hours 0 through 8.
 */
export function checkIsWithinKitchenHours(date: Date = new Date()): boolean {
  const hours = date.getHours(); // 0 to 23
  // 9 AM is hour 9, midnight is hour 0.
  // 9:00 AM through 23:59:59 is OPEN.
  // From 00:00 to 08:59:59 it is CLOSED.
  return hours >= 9;
}

export function getKitchenStatus(isOnlineSetting: boolean, simulatedTime?: Date): KitchenState {
  if (!isOnlineSetting) {
    return {
      isOpenForOrders: false,
      isKitchenOnline: false,
      isWithinOperatingHours: checkIsWithinKitchenHours(simulatedTime),
      statusMessage: 'Kitchen is temporarily offline',
      subMessage: 'The kitchen has paused taking new orders. You may still browse and add items to your cart.',
    };
  }

  const withinHours = checkIsWithinKitchenHours(simulatedTime);

  if (!withinHours) {
    return {
      isOpenForOrders: false,
      isKitchenOnline: true,
      isWithinOperatingHours: false,
      statusMessage: 'Kitchen is closed. Orders open at 9:00 AM.',
      subMessage: 'Operating hours are 9:00 AM to 12:00 AM midnight. You can prepare your cart now.',
    };
  }

  return {
    isOpenForOrders: true,
    isKitchenOnline: true,
    isWithinOperatingHours: true,
    statusMessage: 'Kitchen is Open (9:00 AM – 12:00 AM Midnight)',
    subMessage: 'Freshly prepared and delivered straight to your room or table.',
  };
}
