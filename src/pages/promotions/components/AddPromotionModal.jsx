import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AddPromotionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    maxUsage: '',
    minPurchase: '',
    applicableServices: []
  });

  const [errors, setErrors] = useState({});

  const serviceOptions = [
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' },
    { value: 'all', label: 'Semua Layanan' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const services = prev.applicableServices.includes(service)
        ? prev.applicableServices.filter(s => s !== service)
        : [...prev.applicableServices, service];
      return { ...prev, applicableServices: services };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul promo wajib diisi';
    if (!formData.code.trim()) newErrors.code = 'Kode promo wajib diisi';
    if (!formData.discountValue) newErrors.discountValue = 'Nilai diskon wajib diisi';
    if (!formData.startDate) newErrors.startDate = 'Tanggal mulai wajib diisi';
    if (!formData.endDate) newErrors.endDate = 'Tanggal berakhir wajib diisi';
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Tanggal berakhir harus setelah tanggal mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        maxUsage: parseInt(formData.maxUsage) || 999,
        minPurchase: parseFloat(formData.minPurchase) || 0,
        isActive: true
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      maxUsage: '',
      minPurchase: '',
      applicableServices: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Buat Promo Baru</h2>
          <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Judul Promo *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="Contoh: Diskon 20% Paket Akad"
            />
            {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="Jelaskan detail promo..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kode Promo *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md uppercase"
                placeholder="AKAD20"
              />
              {errors.code && <p className="text-xs text-error mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Jenis Diskon *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nominal (Rp)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nilai Diskon *
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder={formData.discountType === 'percentage' ? '20' : '500000'}
            />
            {errors.discountValue && <p className="text-xs text-error mt-1">{errors.discountValue}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Mulai *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              />
              {errors.startDate && <p className="text-xs text-error mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Berakhir *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              />
              {errors.endDate && <p className="text-xs text-error mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Maksimal Penggunaan
              </label>
              <input
                type="number"
                name="maxUsage"
                value={formData.maxUsage}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimal Pembelian (Rp)
              </label>
              <input
                type="number"
                name="minPurchase"
                value={formData.minPurchase}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                placeholder="2000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Berlaku Untuk Layanan
            </label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleServiceToggle(option.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.applicableServices.includes(option.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Simpan Promo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPromotionModal;
