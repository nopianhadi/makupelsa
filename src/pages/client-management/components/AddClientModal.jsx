import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddClientModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    serviceType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    packageId: '',
    totalAmount: '',
    downPayment: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const serviceTypeOptions = [
    { value: '', label: 'Pilih Jenis Layanan' },
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' }
  ];

  const packageOptions = [
    { value: '', label: 'Pilih Paket' },
    { value: 'basic', label: 'Paket Basic - Rp 1.500.000' },
    { value: 'standard', label: 'Paket Standard - Rp 2.500.000' },
    { value: 'premium', label: 'Paket Premium - Rp 4.000.000' },
    { value: 'luxury', label: 'Paket Luxury - Rp 6.000.000' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nama klien wajib diisi';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9]{10,13}$/?.test(formData?.phone?.replace(/\D/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid';
    }

    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!formData?.serviceType) {
      newErrors.serviceType = 'Jenis layanan wajib dipilih';
    }

    if (!formData?.eventDate) {
      newErrors.eventDate = 'Tanggal acara wajib diisi';
    }

    if (!formData?.totalAmount) {
      newErrors.totalAmount = 'Total pembayaran wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-client-title"
    >
      <div 
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="add-client-title" className="text-xl font-heading font-bold text-foreground">
            Tambah Klien Baru
          </h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            aria-label="Tutup"
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div className="bg-surface rounded-lg p-4 border border-border">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="User" size={18} />
                Informasi Klien
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  placeholder="Masukkan nama klien"
                  value={formData?.name}
                  onChange={(e) => handleChange('name', e?.target?.value)}
                  error={errors?.name}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nomor Telepon"
                    type="tel"
                    placeholder="08123456789"
                    value={formData?.phone}
                    onChange={(e) => handleChange('phone', e?.target?.value)}
                    error={errors?.phone}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData?.email}
                    onChange={(e) => handleChange('email', e?.target?.value)}
                    error={errors?.email}
                  />
                </div>

                <Input
                  label="Lokasi"
                  type="text"
                  placeholder="Kota/Kabupaten"
                  value={formData?.location}
                  onChange={(e) => handleChange('location', e?.target?.value)}
                />
              </div>
            </div>

            <div className="bg-surface rounded-lg p-4 border border-border">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Calendar" size={18} />
                Detail Acara
              </h3>
              
              <div className="space-y-4">
                <Select
                  label="Jenis Layanan"
                  options={serviceTypeOptions}
                  value={formData?.serviceType}
                  onChange={(value) => handleChange('serviceType', value)}
                  error={errors?.serviceType}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tanggal Acara"
                    type="date"
                    value={formData?.eventDate}
                    onChange={(e) => handleChange('eventDate', e?.target?.value)}
                    error={errors?.eventDate}
                    required
                  />

                  <Input
                    label="Waktu Acara"
                    type="time"
                    value={formData?.eventTime}
                    onChange={(e) => handleChange('eventTime', e?.target?.value)}
                  />
                </div>

                <Input
                  label="Lokasi Acara"
                  type="text"
                  placeholder="Alamat lengkap venue"
                  value={formData?.venue}
                  onChange={(e) => handleChange('venue', e?.target?.value)}
                />
              </div>
            </div>

            <div className="bg-surface rounded-lg p-4 border border-border">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="CreditCard" size={18} />
                Informasi Pembayaran
              </h3>
              
              <div className="space-y-4">
                <Select
                  label="Paket Layanan"
                  options={packageOptions}
                  value={formData?.packageId}
                  onChange={(value) => handleChange('packageId', value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Total Pembayaran"
                    type="number"
                    placeholder="0"
                    value={formData?.totalAmount}
                    onChange={(e) => handleChange('totalAmount', e?.target?.value)}
                    error={errors?.totalAmount}
                    required
                  />

                  <Input
                    label="DP (Opsional)"
                    type="number"
                    placeholder="0"
                    value={formData?.downPayment}
                    onChange={(e) => handleChange('downPayment', e?.target?.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-4 border border-border">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="FileText" size={18} />
                Catatan Tambahan
              </h3>
              
              <textarea
                placeholder="Tambahkan catatan khusus untuk klien ini..."
                value={formData?.notes}
                onChange={(e) => handleChange('notes', e?.target?.value)}
                rows={4}
                className="
                  w-full px-3 py-2 rounded-md
                  bg-background border border-border
                  text-sm text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  transition-smooth resize-none
                "
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
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
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Simpan Klien
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;