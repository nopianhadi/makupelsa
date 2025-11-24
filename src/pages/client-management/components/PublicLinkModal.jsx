import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { dataStore } from '../../../utils/dataStore';

const PublicLinkModal = ({ isOpen, onClose, client }) => {
  const [publicLink, setPublicLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      // Check if link already exists
      const links = dataStore.getPublicClientLinks();
      const existingLink = links.find(l => l.clientId === client.id);
      
      if (existingLink) {
        setPublicLink(`${window.location.origin}/client/public/${existingLink.publicId}`);
      } else {
        // Generate new link
        const publicId = dataStore.generatePublicClientLink(client.id);
        setPublicLink(`${window.location.origin}/client/public/${publicId}`);
      }
    }
  }, [isOpen, client]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = `Halo ${client.name},\n\nBerikut link untuk melihat detail acara dan status pembayaran Anda:\n${publicLink}\n\nTerima kasih! 🙏`;
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-lg w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Link Portal Klien</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex gap-2 mb-2">
              <Icon name="Info" size={20} color="var(--color-primary)" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Link Portal Publik
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Klien dapat mengakses link ini tanpa login untuk melihat detail acara dan status pembayaran mereka.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Link untuk {client?.name}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicLink}
                readOnly
                className="flex-1 px-3 py-2 bg-muted border border-input rounded-md text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium flex items-center gap-2"
              >
                <Icon name={copied ? "Check" : "Copy"} size={16} />
                {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center justify-center gap-2"
            >
              <Icon name="MessageCircle" size={18} />
              Kirim via WhatsApp
            </button>
            <button
              onClick={() => {
                window.open(publicLink, '_blank');
              }}
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-md font-medium flex items-center justify-center gap-2"
            >
              <Icon name="ExternalLink" size={18} />
              Buka Link
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">Informasi yang Dapat Dilihat Klien:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} color="var(--color-success)" />
                Detail acara (tanggal, waktu, lokasi)
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} color="var(--color-success)" />
                Status pembayaran real-time
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} color="var(--color-success)" />
                Riwayat pembayaran lengkap
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Check" size={14} color="var(--color-success)" />
                Progress bar pembayaran visual
              </li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-muted text-foreground rounded-md font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicLinkModal;
