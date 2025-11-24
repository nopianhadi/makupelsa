import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import PaymentStatusIndicator from '../../../components/ui/PaymentStatusIndicator';

const AppointmentModal = ({ isOpen, onClose, appointment, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: appointment?.clientName || '',
    serviceType: appointment?.serviceType || '',
    date: appointment?.date || '',
    time: appointment?.time || '',
    location: appointment?.location || '',
    notes: appointment?.notes || '',
    amount: appointment?.amount || '',
    paymentStatus: appointment?.paymentStatus || 'pending'
  });

  const serviceTypeOptions = [
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' }
  ];

  const paymentStatusOptions = [
    { value: 'paid', label: 'Lunas' },
    { value: 'partial', label: 'DP Dibayar' },
    { value: 'pending', label: 'Menunggu' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border elevation-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-heading font-bold text-foreground">
            {appointment ? 'Edit Jadwal' : 'Buat Jadwal Baru'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center
              text-muted-foreground hover:text-foreground hover:bg-muted
              transition-smooth"
            aria-label="Tutup"
          >
            <Icon name="X" size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nama Klien"
            type="text"
            placeholder="Masukkan nama klien"
            value={formData?.clientName}
            onChange={(e) => handleChange('clientName', e?.target?.value)}
            required
          />

          <Select
            label="Jenis Layanan"
            options={serviceTypeOptions}
            value={formData?.serviceType}
            onChange={(value) => handleChange('serviceType', value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal"
              type="date"
              value={formData?.date}
              onChange={(e) => handleChange('date', e?.target?.value)}
              required
            />

            <Input
              label="Waktu"
              type="time"
              value={formData?.time}
              onChange={(e) => handleChange('time', e?.target?.value)}
              required
            />
          </div>

          <Input
            label="Lokasi"
            type="text"
            placeholder="Masukkan lokasi acara"
            value={formData?.location}
            onChange={(e) => handleChange('location', e?.target?.value)}
            required
          />

          <Input
            label="Catatan"
            type="text"
            placeholder="Tambahkan catatan (opsional)"
            value={formData?.notes}
            onChange={(e) => handleChange('notes', e?.target?.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Pembayaran (IDR)"
              type="number"
              placeholder="0"
              value={formData?.amount}
              onChange={(e) => handleChange('amount', e?.target?.value)}
              required
            />

            <Select
              label="Status Pembayaran"
              options={paymentStatusOptions}
              value={formData?.paymentStatus}
              onChange={(value) => handleChange('paymentStatus', value)}
              required
            />
          </div>

          {formData?.paymentStatus && formData?.amount && (
            <div className="pt-2">
              <PaymentStatusIndicator
                status={formData?.paymentStatus}
                amount={parseFloat(formData?.amount)}
                type="card"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Check"
              iconPosition="left"
              fullWidth
            >
              {appointment ? 'Simpan Perubahan' : 'Buat Jadwal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;