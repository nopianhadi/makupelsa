import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SendCommunicationModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'outgoing',
    subject: '',
    message: ''
  });

  const templates = [
    {
      name: 'Konfirmasi Booking',
      subject: 'Konfirmasi Booking',
      message: `Halo Kak ${client?.name}, terima kasih sudah booking layanan kami. Kami konfirmasi untuk tanggal yang sudah disepakati ya.`
    },
    {
      name: 'Reminder Acara',
      subject: 'Reminder Acara',
      message: `Halo Kak ${client?.name}, ini reminder untuk acara yang akan berlangsung. Jangan lupa ya!`
    },
    {
      name: 'Follow Up Payment',
      subject: 'Pengingat Pembayaran',
      message: `Halo Kak ${client?.name}, ini reminder untuk pelunasan pembayaran ya. Terima kasih!`
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const communication = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    onSave(communication);
    
    if (formData.type === 'whatsapp' && client?.phone) {
      const url = `https://wa.me/${client.phone.replace(/^0/, '62')}?text=${encodeURIComponent(formData.message)}`;
      window.open(url, '_blank');
    }
    
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyTemplate = (template) => {
    setFormData({
      ...formData,
      subject: template.subject,
      message: template.message
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Kirim Komunikasi
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ke {client?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Template Cepat:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {templates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyTemplate(template)}
                className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-smooth text-left"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipe Komunikasi
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="outgoing">Keluar (Anda ke Klien)</option>
              <option value="incoming">Masuk (Klien ke Anda)</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subjek
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Judul komunikasi..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pesan
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Tulis pesan Anda..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {formData.type === 'whatsapp' ? 'Kirim via WhatsApp' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendCommunicationModal;
