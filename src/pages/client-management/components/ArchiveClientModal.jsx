import React, { useState } from 'react';

const ArchiveClientModal = ({ clients, onClose, onArchive }) => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [archiveReason, setArchiveReason] = useState('');

  // Filter klien yang sudah lama selesai (lebih dari 6 bulan)
  const getSuggestedClients = () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return clients.filter(client => {
      if (!client.events || client.events.length === 0) return false;
      const lastEventDate = new Date(Math.max(...client.events.map(e => new Date(e.eventDate))));
      return lastEventDate < sixMonthsAgo;
    });
  };

  const suggestedClients = getSuggestedClients();

  const handleToggleClient = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === suggestedClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(suggestedClients.map(c => c.id));
    }
  };

  const handleArchive = () => {
    if (selectedClients.length === 0) return;
    onArchive(selectedClients, archiveReason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">
                Arsipkan Klien Lama
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pindahkan klien lama ke arsip untuk menjaga performa aplikasi
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {suggestedClients.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-3 block">📦</span>
              <p className="text-muted-foreground">
                Tidak ada klien yang disarankan untuk diarsipkan
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Klien yang sudah selesai lebih dari 6 bulan akan muncul di sini
              </p>
            </div>
          ) : (
            <>
              {/* Info Box */}
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                <div className="flex gap-2">
                  <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                      Saran: {suggestedClients.length} klien sudah selesai lebih dari 6 bulan
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Arsipkan klien lama untuk menjaga database tetap ringan dan terorganisir
                    </p>
                  </div>
                </div>
              </div>

              {/* Select All */}
              <div className="mb-4 flex items-center justify-between p-3 bg-muted rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedClients.length === suggestedClients.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    Pilih Semua ({suggestedClients.length})
                  </span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {selectedClients.length} dipilih
                </span>
              </div>

              {/* Client List */}
              <div className="space-y-2 mb-4">
                {suggestedClients.map(client => {
                  const lastEventDate = new Date(Math.max(...client.events.map(e => new Date(e.eventDate))));
                  const monthsAgo = Math.floor((new Date() - lastEventDate) / (1000 * 60 * 60 * 24 * 30));
                  
                  return (
                    <label
                      key={client.id}
                      className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleToggleClient(client.id)}
                        className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {client.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Selesai {monthsAgo} bulan lalu • {client.events?.length || 0} event
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">
                          Rp {(client.totalAmount || 0).toLocaleString('id-ID')}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          client.paymentStatus === 'paid' 
                            ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}>
                          {client.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Archive Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Catatan Arsip (Opsional)
                </label>
                <textarea
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="Contoh: Arsip rutin klien 2024, Data backup tahunan, dll"
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {suggestedClients.length > 0 && (
          <div className="p-6 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleArchive}
              disabled={selectedClients.length === 0}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Arsipkan {selectedClients.length > 0 && `(${selectedClients.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveClientModal;
