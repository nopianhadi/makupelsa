import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AddServiceModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    serviceType: 'akad',
    eventDate: '',
    eventTime: '',
    venue: '',
    packageName: '',
    totalAmount: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      paymentStatus: 'pending'
    };
    onSave(newEvent);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              Tambah Layanan Acara
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Untuk {client?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Jenis Layanan
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="akad">Akad</option>
              <option value="resepsi">Resepsi</option>
              <option value="wisuda">Wisuda</option>
              <option value="lamaran">Lamaran</option>
              <option value="engagement">Engagement</option>
              <option value="photoshoot">Photoshoot</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Acara
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Waktu Acara
              </label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Lokasi/Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Grand Ballroom Hotel Mulia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nama Paket
            </label>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Paket Premium Resepsi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Total Harga (Rp)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catatan
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Catatan khusus tentang acara..."
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
              Tambah Layanan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
