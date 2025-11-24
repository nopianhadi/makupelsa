import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SendReminderModal = ({ client, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    method: '',
    message: `Halo ${client?.name},\n\nIni adalah pengingat pembayaran untuk layanan ${client?.serviceType} pada tanggal ${new Date(client.eventDate)?.toLocaleDateString('id-ID')}.\n\nSisa pembayaran: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })?.format(client?.remainingAmount)}\n\nTerima kasih.`,
    includeInvoice: false,
    scheduleDate: ''
  });

  const [errors, setErrors] = useState({});

  const reminderMethodOptions = [
    { value: '', label: 'Pilih Metode Pengingat' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.method) {
      newErrors.method = 'Pilih metode pengingat';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Pesan pengingat tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        clientId: client?.id
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="
          w-full max-w-lg bg-card border border-border rounded-2xl
          elevation-12 max-h-[90vh] overflow-y-auto
        "
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-lg font-heading font-bold text-foreground">
              Kirim Pengingat Pembayaran
            </h2>
            <button
              onClick={onClose}
              className="
                w-8 h-8 rounded-lg flex items-center justify-center
                text-muted-foreground hover:text-foreground hover:bg-muted
                transition-smooth
              "
              aria-label="Tutup"
            >
              <Icon name="X" size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="p-3 rounded-lg bg-surface border border-border">
            <p className="text-sm font-caption text-muted-foreground mb-1">
              Kepada
            </p>
            <p className="text-base font-heading font-semibold text-foreground mb-2">
              {client?.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Phone" size={14} />
              <span>{client?.phone}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
              <span className="text-sm font-caption text-muted-foreground">
                Sisa Pembayaran
              </span>
              <span className="text-base font-mono font-bold text-error">
                {formatCurrency(client?.remainingAmount)}
              </span>
            </div>
          </div>

          <Select
            label="Metode Pengingat"
            options={reminderMethodOptions}
            value={formData?.method}
            onChange={(value) => handleInputChange('method', value)}
            error={errors?.method}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pesan Pengingat <span className="text-error">*</span>
            </label>
            <textarea
              value={formData?.message}
              onChange={(e) => handleInputChange('message', e?.target?.value)}
              placeholder="Tulis pesan pengingat"
              rows={6}
              className={`
                w-full px-3 py-2 rounded-lg
                bg-surface border ${errors?.message ? 'border-error' : 'border-border'}
                text-sm text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                transition-smooth resize-none
              `}
            />
            {errors?.message && (
              <p className="text-xs text-error mt-1">{errors?.message}</p>
            )}
          </div>

          <Checkbox
            label="Sertakan invoice pembayaran"
            description="Invoice akan dilampirkan dalam pengingat"
            checked={formData?.includeInvoice}
            onChange={(e) => handleInputChange('includeInvoice', e?.target?.checked)}
          />

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
              className="flex-1"
            >
              Kirim Pengingat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendReminderModal;