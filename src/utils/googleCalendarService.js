/**
 * GOOGLE CALENDAR SYNC SERVICE
 * Manages synchronization with Google Calendar
 */

export const googleCalendarService = {
  /**
   * Get Google Calendar connection status
   */
  isConnected() {
    return localStorage.getItem('google_calendar_connected') === 'true';
  },

  /**
   * Set Google Calendar connection status
   */
  setConnectionStatus(connected) {
    if (connected) {
      localStorage.setItem('google_calendar_connected', 'true');
      localStorage.setItem('google_calendar_synced_at', new Date().toISOString());
    } else {
      localStorage.removeItem('google_calendar_connected');
      localStorage.removeItem('google_calendar_synced_at');
    }
    window.dispatchEvent(new CustomEvent('googleCalendarStatusChanged', { detail: { connected } }));
  },

  /**
   * Get last sync timestamp
   */
  getLastSyncTime() {
    const syncedAt = localStorage.getItem('google_calendar_synced_at');
    return syncedAt ? new Date(syncedAt) : null;
  },

  /**
   * Format event for Google Calendar
   */
  formatEventForGoogleCalendar(event) {
    const eventDate = new Date(event.date);
    const [hours, minutes] = (event.time || '00:00').split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0);

    return {
      summary: `${event.serviceType.toUpperCase()} - ${event.clientName}`,
      description: `Klien: ${event.clientName}\nLokasi: ${event.location}\nNotes: ${event.notes}\nJumlah: Rp ${event.amount?.toLocaleString('id-ID') || 0}`,
      location: event.location,
      start: {
        dateTime: eventDate.toISOString(),
        timeZone: 'Asia/Jakarta'
      },
      end: {
        dateTime: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        timeZone: 'Asia/Jakarta'
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'notification',
            minutes: 60
          },
          {
            method: 'popup',
            minutes: 15
          }
        ]
      }
    };
  },

  /**
   * Mock sync to Google Calendar
   * In real implementation, this would call Google Calendar API
   */
  async syncToGoogleCalendar(events) {
    try {
      // Store synced events locally
      const syncedEvents = events.map(event => ({
        ...event,
        googleCalendarId: `gc_${event.id}_${Date.now()}`,
        syncedAt: new Date().toISOString()
      }));

      localStorage.setItem('google_calendar_events', JSON.stringify(syncedEvents));
      this.setConnectionStatus(true);

      // Dispatch sync complete event
      window.dispatchEvent(new CustomEvent('googleCalendarSynced', { 
        detail: { 
          count: events.length,
          syncedAt: new Date().toISOString()
        } 
      }));

      return { success: true, count: events.length };
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get synced Google Calendar events
   */
  getSyncedEvents() {
    const synced = localStorage.getItem('google_calendar_events');
    return synced ? JSON.parse(synced) : [];
  },

  /**
   * Clear Google Calendar sync
   */
  clearSync() {
    localStorage.removeItem('google_calendar_events');
    localStorage.removeItem('google_calendar_synced_at');
    localStorage.removeItem('google_calendar_connected');
    
    window.dispatchEvent(new CustomEvent('googleCalendarCleared', {}));
  },

  /**
   * Get connection info for display
   */
  getConnectionInfo() {
    const lastSync = this.getLastSyncTime();
    const isConnected = this.isConnected();
    const syncedCount = this.getSyncedEvents().length;

    return {
      isConnected,
      lastSync,
      syncedCount,
      status: isConnected ? '✅ Terhubung' : '❌ Tidak terhubung',
      lastSyncText: lastSync ? `Terakhir disync: ${lastSync.toLocaleDateString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}` : 'Belum pernah disync'
    };
  }
};
