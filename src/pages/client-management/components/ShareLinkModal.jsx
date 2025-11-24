import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareLinkModal = ({ client, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate link portal klien menggunakan portalId
  const baseUrl = window.location.origin;
  const clientPortalLink = `${baseUrl}/portal-klien/${client.portalId || client.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(clientPortalLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Halo ${client.name}! 👋\n\nBerikut adalah link portal klien Anda untuk melihat detail acara dan pembayaran:\n\n${clientPortalLink}\n\nTerima kasih! 🌸`;
    const whatsappUrl = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Share Link Portal Klien
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Tutup"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" size={24} color="var(--color-primary)" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 mb-4">
            <label className="text-xs font-caption text-muted-foreground mb-2 block">
              Link Portal Klien
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={clientPortalLink}
                readOnly
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono"
              />
              <Button
                variant={copied ? "default" : "outline"}
                size="sm"
                iconName={copied ? "Check" : "Copy"}
                onClick={handleCopyLink}
                aria-label="Copy link"
              />
            </div>
            {copied && (
              <p className="text-xs text-success mt-2 flex items-center gap-1">
                <Icon name="Check" size={12} />
                Link berhasil disalin!
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
            <div className="flex gap-2">
              <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Portal klien memungkinkan:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-1">
                  <li>Melihat detail acara</li>
                  <li>Tracking pembayaran</li>
                  <li>Riwayat komunikasi</li>
                  <li>Download invoice</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Tutup
          </Button>
          <Button
            variant="default"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={handleShareWhatsApp}
            className="flex-1"
          >
            Share via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkModal;
