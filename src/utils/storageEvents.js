export const STORAGE_EVENTS = {
  EXPENSE_CATEGORIES_UPDATED: 'expense_categories_updated',
  INCOME_CATEGORIES_UPDATED: 'income_categories_updated',
  SERVICE_TYPES_UPDATED: 'service_types_updated',
  PAYMENT_METHODS_UPDATED: 'payment_methods_updated',
  CARDS_UPDATED: 'cards_updated',
  EXPENSES_UPDATED: 'expenses_updated'
};

export const dispatchStorageEvent = (eventName, data) => {
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
};

export const subscribeToStorageEvent = (eventName, callback) => {
  window.addEventListener(eventName, callback);
  return () => window.removeEventListener(eventName, callback);
};
