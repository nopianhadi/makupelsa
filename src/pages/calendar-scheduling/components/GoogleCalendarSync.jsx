import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { googleCalendarService } from '../../../utils/googleCalendarService';
import { dataStore } from '../../../utils/dataStore';

const GoogleCalendarSync = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    updateConnectionStatus();

    const handleStatusChange = () => {
      updateConnectionStatus();
    };

    window.addEventListener('googleCalendarStatusChanged', handleStatusChange);
    window.addEventListener('googleCalendarSynced', handleStatusChange);

    return () => {
      window.removeEventListener('googleCalendarStatusChanged', handleStatusChange);
      window.removeEventListener('googleCalendarSynced', handleStatusChange);
    };
  }, []);

  const updateConnectionStatus = () => {
    const info = googleCalendarService.getConnectionInfo();
    setIsConnected(info.isConnected);
    setConnectionInfo(info);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      // Get all events from clients
      const clients = dataStore.getClients() || [];
      const events = [];

      clients.forEach(client => {
        if (client.events && Array.isArray(client.events)) {
          client.events.forEach((event, index) => {
            events.push({
              id: `${client.id}-${index}`,
              clientId: client.id,
              clientName: client.name,
              serviceType: event.serviceType || 'other',
              date: event.eventDate,
              time: event.eventTime || '00:00',
              location: event.venue || '',
              notes: event.notes || '',
              amount: event.totalAmount || 0,
              paymentStatus: event.paymentStatus || 'pending'
            });
          });
        }
      });

      // Sync to Google Calendar
      const result = await googleCalendarService.syncToGoogleCalendar(events);

      if (result.success) {
        alert(`✅ Berhasil disync! ${result.count} acara ditambahkan ke Google Calendar`);
        updateConnectionStatus();
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Yakin ingin melepas koneksi Google Calendar?')) {
      googleCalendarService.clearSync();
      updateConnectionStatus();
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Status Koneksi</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isConnected 
              ? 'bg-green-500/10 text-green-600' 
              : 'bg-gray-500/10 text-gray-600'
          }`}>
            {connectionInfo?.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {connectionInfo?.lastSyncText}
        </p>
      </div>

      {/* Information */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Google Calendar Sync</p>
            <p>Sinkronkan semua jadwal makeup Anda ke Google Calendar Anda. Acara akan ditampilkan dengan detail lengkap termasuk klien, lokasi, dan jumlah pembayaran.</p>
          </div>
        </div>
      </div>

      {/* Synced Events Count */}
      {isConnected && (
        <div className="text-center py-3 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Acara Tersync</p>
          <p className="text-2xl font-bold text-foreground">{connectionInfo?.syncedCount || 0}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isConnected ? (
          <>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSyncing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Menghubungkan...
                </>
              ) : (
                <>
                  <Icon name="Link2" size={16} />
                  Hubungkan ke Google Calendar
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Klik tombol di atas untuk menghubungkan akun Google Calendar Anda
            </p>
          </>
        ) : (
          <>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSyncing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Mengsync...
                </>
              ) : (
                <>
                  <Icon name="RefreshCw" size={16} />
                  Sinkronkan Sekarang
                </>
              )}
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors font-medium text-sm"
            >
              <Icon name="Unlink2" size={14} className="inline mr-2" />
              Lepas Koneksi
            </button>
          </>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-sm"
      >
        Tutup
      </button>
    </div>
  );
};

export default GoogleCalendarSync;
