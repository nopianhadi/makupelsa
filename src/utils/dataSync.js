/**
 * CENTRALIZED DATA SYNCHRONIZATION SYSTEM
 * Manages real-time data sync across all pages
 * Single source of truth for all events
 */

export const DataSyncEvents = {
  // Client events
  CLIENT_ADDED: 'clientAdded',
  CLIENT_UPDATED: 'clientUpdated',
  CLIENT_DELETED: 'clientDeleted',
  
  // Invoice & Payment events
  INVOICE_ADDED: 'invoiceAdded',
  INVOICE_UPDATED: 'invoiceUpdated',
  PAYMENT_RECORDED: 'paymentRecorded',
  
  // Financial events
  EXPENSE_ADDED: 'expenseAdded',
  EXPENSE_UPDATED: 'expenseUpdated',
  EXPENSE_DELETED: 'expenseDeleted',
  INCOME_ADDED: 'incomeAdded',
  INCOME_UPDATED: 'incomeUpdated',
  
  // Project events
  PROJECT_ADDED: 'projectAdded',
  PROJECT_UPDATED: 'projectUpdated',
  PROJECT_DELETED: 'projectDeleted',
  
  // Team events
  TEAM_MEMBER_ADDED: 'teamMemberAdded',
  TEAM_MEMBER_UPDATED: 'teamMemberUpdated',
  TEAM_MEMBER_DELETED: 'teamMemberDeleted',
  
  // Package & Pricelist events
  PACKAGE_ADDED: 'packageAdded',
  PACKAGE_UPDATED: 'packageUpdated',
  PACKAGE_DELETED: 'packageDeleted',
  PRICELIST_ADDED: 'pricelistAdded',
  PRICELIST_UPDATED: 'pricelistUpdated',
  PRICELIST_DELETED: 'pricelistDeleted',
  
  // Booking & Leads events
  BOOKING_ADDED: 'bookingAdded',
  BOOKING_UPDATED: 'bookingUpdated',
  BOOKING_DELETED: 'bookingDeleted',
  LEAD_ADDED: 'leadAdded',
  LEAD_UPDATED: 'leadUpdated',
  LEAD_DELETED: 'leadDeleted',
  
  
  // Global sync event
  DATA_UPDATED: 'dataUpdated'
};

/**
 * Dispatch data sync event
 * @param {string} eventType - From DataSyncEvents
 * @param {object} data - Event payload
 */
export const dispatchDataSync = (eventType, data = {}) => {
  const event = new CustomEvent(eventType, { detail: data });
  window.dispatchEvent(event);
  
  // Also dispatch global DATA_UPDATED for pages that listen to everything
  if (eventType !== DataSyncEvents.DATA_UPDATED) {
    const globalEvent = new CustomEvent(DataSyncEvents.DATA_UPDATED, { 
      detail: { eventType, data } 
    });
    window.dispatchEvent(globalEvent);
  }
};

/**
 * Hook to listen for data sync events
 * @param {string|string[]} events - Event(s) to listen for
 * @param {function} callback - Called when event fires
 * @returns {function} Cleanup function
 */
export const useDataSync = (events, callback) => {
  const eventList = Array.isArray(events) ? events : [events];
  
  const listeners = {};
  eventList.forEach(event => {
    listeners[event] = () => callback();
    window.addEventListener(event, listeners[event]);
  });
  
  return () => {
    eventList.forEach(event => {
      window.removeEventListener(event, listeners[event]);
    });
  };
};

/**
 * Setup comprehensive data sync listener
 * Listens to ALL critical events
 * @param {function} callback - Called on any data change
 * @returns {function} Cleanup function
 */
export const setupComprehensiveSync = (callback) => {
  const allEvents = Object.values(DataSyncEvents);
  
  const listeners = {};
  allEvents.forEach(event => {
    listeners[event] = callback;
    window.addEventListener(event, listeners[event]);
  });
  
  return () => {
    allEvents.forEach(event => {
      window.removeEventListener(event, listeners[event]);
    });
  };
};
