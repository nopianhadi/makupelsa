/**
 * REMINDER SERVICE
 * Manages event reminders and notifications
 */

import { dataStore } from './dataStore';

export const ReminderTypes = {
  BEFORE_1_HOUR: 'before_1h',
  BEFORE_24_HOURS: 'before_24h',
  BEFORE_7_DAYS: 'before_7d',
  CUSTOM: 'custom'
};

export const reminderService = {
  /**
   * Get all reminders for an event
   */
  getReminders(eventId) {
    const reminders = localStorage.getItem('event_reminders') ? JSON.parse(localStorage.getItem('event_reminders')) : {};
    return reminders[eventId] || [];
  },

  /**
   * Add reminder to event
   */
  addReminder(eventId, reminderType, customMinutes = null) {
    const reminders = localStorage.getItem('event_reminders') ? JSON.parse(localStorage.getItem('event_reminders')) : {};
    
    if (!reminders[eventId]) {
      reminders[eventId] = [];
    }

    reminders[eventId].push({
      id: `reminder_${Date.now()}`,
      type: reminderType,
      customMinutes: customMinutes,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem('event_reminders', JSON.stringify(reminders));
    
    // Dispatch event for sync
    window.dispatchEvent(new CustomEvent('reminderAdded', { detail: { eventId } }));
  },

  /**
   * Remove reminder
   */
  removeReminder(eventId, reminderId) {
    const reminders = localStorage.getItem('event_reminders') ? JSON.parse(localStorage.getItem('event_reminders')) : {};
    
    if (reminders[eventId]) {
      reminders[eventId] = reminders[eventId].filter(r => r.id !== reminderId);
      localStorage.setItem('event_reminders', JSON.stringify(reminders));
      
      window.dispatchEvent(new CustomEvent('reminderRemoved', { detail: { eventId, reminderId } }));
    }
  },

  /**
   * Check reminders and send notifications
   */
  checkAndNotifyReminders() {
    const reminders = localStorage.getItem('event_reminders') ? JSON.parse(localStorage.getItem('event_reminders')) : {};
    const clients = dataStore.getClients() || [];
    
    clients.forEach(client => {
      if (client.events && Array.isArray(client.events)) {
        client.events.forEach((event, index) => {
          const eventId = `${client.id}-${index}`;
          const eventReminders = reminders[eventId] || [];
          
          eventReminders.forEach(reminder => {
            const eventDate = new Date(event.eventDate);
            const eventTime = event.eventTime || '00:00';
            const [hours, minutes] = eventTime.split(':');
            eventDate.setHours(parseInt(hours), parseInt(minutes), 0);
            
            const minutesUntilEvent = Math.floor((eventDate - new Date()) / 1000 / 60);
            
            let reminderMinutes = 0;
            switch (reminder.type) {
              case ReminderTypes.BEFORE_1_HOUR:
                reminderMinutes = 60;
                break;
              case ReminderTypes.BEFORE_24_HOURS:
                reminderMinutes = 24 * 60;
                break;
              case ReminderTypes.BEFORE_7_DAYS:
                reminderMinutes = 7 * 24 * 60;
                break;
              case ReminderTypes.CUSTOM:
                reminderMinutes = reminder.customMinutes;
                break;
              default:
                return;
            }
            
            // Check if we should notify (within 2 minute window)
            if (minutesUntilEvent <= reminderMinutes && minutesUntilEvent > reminderMinutes - 2) {
              reminderService.sendNotification(
                `Pengingat: ${event.serviceType.toUpperCase()}`,
                `${client.name} - ${event.venue || 'Lokasi tidak ditentukan'}`
              );
            }
          });
        });
      }
    });
  },

  /**
   * Send browser notification
   */
  sendNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '🔔',
        tag: 'event-reminder'
      });
    }
  },

  /**
   * Request notification permission
   */
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  },

  /**
   * Format reminder text
   */
  formatReminderText(reminderType, customMinutes = null) {
    switch (reminderType) {
      case ReminderTypes.BEFORE_1_HOUR:
        return '1 jam sebelum';
      case ReminderTypes.BEFORE_24_HOURS:
        return '24 jam sebelum';
      case ReminderTypes.BEFORE_7_DAYS:
        return '7 hari sebelum';
      case ReminderTypes.CUSTOM:
        return `${customMinutes} menit sebelum`;
      default:
        return 'Pengingat';
    }
  }
};

// Start checking reminders every minute
if (typeof window !== 'undefined') {
  reminderService.requestNotificationPermission();
  setInterval(() => reminderService.checkAndNotifyReminders(), 60000);
}
