import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PackageFormModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPackage = null,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    description: '',
    duration: '',
    basePrice: '',
    originalPrice: '',
    includedServices: [],
    addOns: [],
    travelFee: '',
    groupDiscount: '',
    locationPricing: false,
    isActive: true
  });

  const [newService, setNewService] = useState('');
  const [newAddOn, setNewAddOn] = useState({ name: '', price: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        ...editingPackage,
        basePrice: editingPackage?.basePrice?.toString(),
        originalPrice: editingPackage?.originalPrice?.toString() || '',
        travelFee: editingPackage?.travelFee?.toString() || '',
        groupDiscount: editingPackage?.groupDiscount?.toString() || ''
      });
    } else {
      resetForm();
    }
  }, [editingPackage, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      serviceType: '',
      description: '',
      duration: '',
      basePrice: '',
      originalPrice: '',
      includedServices: [],
      addOns: [],
      travelFee: '',
      groupDiscount: '',
      locationPricing: false,
      isActive: true
    });
    setErrors({});
  };

  const serviceTypeOptions = [
    { value: 'akad', label: 'Akad' },
    { value: 'resepsi', label: 'Resepsi' },
    { value: 'wisuda', label: 'Wisuda' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nama paket wajib diisi';
    }

    if (!formData?.serviceType) {
      newErrors.serviceType = 'Jenis layanan wajib dipilih';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Deskripsi wajib diisi';
    }

    if (!formData?.duration?.trim()) {
      newErrors.duration = 'Durasi layanan wajib diisi';
    }

    if (!formData?.basePrice || parseFloat(formData?.basePrice) <= 0) {
      newErrors.basePrice = 'Harga dasar harus lebih dari 0';
    }

    if (formData?.includedServices?.length === 0) {
      newErrors.includedServices = 'Minimal satu layanan harus ditambahkan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    const packageData = {
      ...formData,
      basePrice: parseFloat(formData?.basePrice),
      originalPrice: formData?.originalPrice ? parseFloat(formData?.originalPrice) : null,
      travelFee: formData?.travelFee ? parseFloat(formData?.travelFee) : null,
      groupDiscount: formData?.groupDiscount ? parseFloat(formData?.groupDiscount) : null,
      id: editingPackage?.id || `pkg_${Date.now()}`,
      totalBookings: editingPackage?.totalBookings || 0,
      totalRevenue: editingPackage?.totalRevenue || 0
    };

    onSave(packageData);
    onClose();
    resetForm();
  };

  const handleAddService = () => {
    if (newService?.trim()) {
      setFormData(prev => ({
        ...prev,
        includedServices: [...prev?.includedServices, newService?.trim()]
      }));
      setNewService('');
      if (errors?.includedServices) {
        setErrors(prev => ({ ...prev, includedServices: undefined }));
      }
    }
  };

  const handleRemoveService = (index) => {
    setFormData(prev => ({
      ...prev,
      includedServices: prev?.includedServices?.filter((_, i) => i !== index)
    }));
  };

  const handleAddAddOn = () => {
    if (newAddOn?.name?.trim() && newAddOn?.price) {
      setFormData(prev => ({
        ...prev,
        addOns: [...prev?.addOns, {
          name: newAddOn?.name?.trim(),
          price: parseFloat(newAddOn?.price)
        }]
      }));
      setNewAddOn({ name: '', price: '' });
    }
  };

  const handleRemoveAddOn = (index) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev?.addOns?.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden elevation-12"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {mode === 'edit' ? 'Edit Paket Layanan' : 'Buat Paket Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Tutup"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Informasi Dasar
              </h3>

              <Input
                label="Nama Paket"
                type="text"
                placeholder="Contoh: Paket Akad Premium"
                value={formData?.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                error={errors?.name}
                required
              />

              <Select
                label="Jenis Layanan"
                options={serviceTypeOptions}
                value={formData?.serviceType}
                onChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
                error={errors?.serviceType}
                required
              />

              <Input
                label="Deskripsi"
                type="text"
                placeholder="Jelaskan paket layanan ini"
                value={formData?.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                error={errors?.description}
                required
              />

              <Input
                label="Durasi Layanan"
                type="text"
                placeholder="Contoh: 3-4 jam"
                value={formData?.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e?.target?.value }))}
                error={errors?.duration}
                required
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Harga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Harga Dasar"
                  type="number"
                  placeholder="0"
                  value={formData?.basePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e?.target?.value }))}
                  error={errors?.basePrice}
                  required
                />

                <Input
                  label="Harga Asli (Opsional)"
                  type="number"
                  placeholder="0"
                  description="Untuk menampilkan diskon"
                  value={formData?.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e?.target?.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Biaya Perjalanan (Opsional)"
                  type="number"
                  placeholder="0"
                  value={formData?.travelFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, travelFee: e?.target?.value }))}
                />

                <Input
                  label="Diskon Grup % (Opsional)"
                  type="number"
                  placeholder="0"
                  value={formData?.groupDiscount}
                  onChange={(e) => setFormData(prev => ({ ...prev, groupDiscount: e?.target?.value }))}
                />
              </div>
            </div>

            {/* Included Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Layanan Termasuk
              </h3>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Tambah layanan..."
                  value={newService}
                  onChange={(e) => setNewService(e?.target?.value)}
                  onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), handleAddService())}
                  error={errors?.includedServices}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  iconName="Plus"
                  onClick={handleAddService}
                  className="flex-shrink-0"
                >
                  Tambah
                </Button>
              </div>

              {formData?.includedServices?.length > 0 && (
                <div className="space-y-2">
                  {formData?.includedServices?.map((service, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md bg-surface"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                        <span className="text-sm text-foreground">{service}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="text-error hover:text-error/80 transition-smooth"
                        aria-label="Hapus layanan"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add-ons */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Add-on (Opsional)
              </h3>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Nama add-on"
                  value={newAddOn?.name}
                  onChange={(e) => setNewAddOn(prev => ({ ...prev, name: e?.target?.value }))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Harga"
                  value={newAddOn?.price}
                  onChange={(e) => setNewAddOn(prev => ({ ...prev, price: e?.target?.value }))}
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="outline"
                  iconName="Plus"
                  onClick={handleAddAddOn}
                  className="flex-shrink-0"
                >
                  Tambah
                </Button>
              </div>

              {formData?.addOns?.length > 0 && (
                <div className="space-y-2">
                  {formData?.addOns?.map((addOn, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md bg-surface"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="Plus" size={16} color="var(--color-muted-foreground)" />
                        <span className="text-sm text-foreground">{addOn?.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          +{new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          })?.format(addOn?.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddOn(index)}
                        className="text-error hover:text-error/80 transition-smooth"
                        aria-label="Hapus add-on"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Checkbox
                label="Harga Berbeda Berdasarkan Lokasi"
                description="Aktifkan jika harga bervariasi per wilayah"
                checked={formData?.locationPricing}
                onChange={(e) => setFormData(prev => ({ ...prev, locationPricing: e?.target?.checked }))}
              />

              <Checkbox
                label="Paket Aktif"
                description="Paket dapat dipesan oleh klien"
                checked={formData?.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e?.target?.checked }))}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Save"
              iconPosition="left"
            >
              {mode === 'edit' ? 'Simpan Perubahan' : 'Buat Paket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageFormModal;