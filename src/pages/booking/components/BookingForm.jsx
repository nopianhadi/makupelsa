import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingForm = ({ booking, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: booking?.clientName || '',
    clientPhone: booking?.clientPhone || '',
    clientEmail: booking?.clientEmail || '',
    serviceType: booking?.serviceType || 'akad',
    eventDate: booking?.eventDate || '',
    eventTime: booking?.eventTime || '',
    venue: booking?.venue || '',
    packageId: booking?.packageId || '',
    packageName: booking?.packageName || '',
    totalAmount: booking?.totalAmount || '',
    downPayment: booking?.downPayment || '',
    notes: booking?.notes || '',
    status: booking?.status || 'pending',
    paymentProof: booking?.paymentProof || null,
    paymentProofUrl: booking?.paymentProofUrl || ''
  });

  const [previewUrl, setPreviewUrl] = useState(booking?.paymentProofUrl || '');
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    // Load packages from localStorage or use mock data
    const savedPackages = localStorage.getItem('service_packages');
    let loadedPackages = [];
    
    if (savedPackages) {
      try {
        const parsed = JSON.parse(savedPackages);
        loadedPackages = parsed.filter(pkg => pkg.isActive);
      } catch (e) {
        console.error('Error parsing packages:', e);
      }
    }
    
    // If no packages in localStorage, use mock data
    if (loadedPackages.length === 0) {
      loadedPackages = [
        {
          id: 'pkg_001',
          name: 'Paket Akad Nikah Premium',
          serviceType: 'akad',
          basePrice: 2500000,
          isActive: true
        },
        {
          id: 'pkg_002',
          name: 'Paket Resepsi Glamour',
          serviceType: 'resepsi',
          basePrice: 4000000,
          isActive: true
        },
        {
          id: 'pkg_003',
          name: 'Paket Wisuda Fresh & Natural',
          serviceType: 'wisuda',
          basePrice: 600000,
          isActive: true
        },
        {
          id: 'pkg_004',
          name: 'Paket Akad Simple',
          serviceType: 'akad',
          basePrice: 1500000,
          isActive: true
        },
        {
          id: 'pkg_006',
          name: 'Paket Wisuda Premium',
          serviceType: 'wisuda',
          basePrice: 900000,
          isActive: true
        }
      ];
    }
    
    setPackages(loadedPackages);
  }, []);

  useEffect(() => {
    // Filter packages based on selected service type
    const filtered = packages.filter(pkg => 
      pkg.serviceType === formData.serviceType && pkg.isActive
    );
    setFilteredPackages(filtered);
  }, [formData.serviceType, packages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      downPayment: parseFloat(formData.downPayment) || 0
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'serviceType') {
      // Reset package selection when service type changes
      setFormData({ 
        ...formData, 
        [name]: value,
        packageId: '',
        packageName: '',
        totalAmount: ''
      });
    } else if (name === 'packageId') {
      // Auto-fill package details when package is selected
      const selectedPackage = packages.find(pkg => pkg.id === value);
      if (selectedPackage) {
        setFormData({
          ...formData,
          packageId: value,
          packageName: selectedPackage.name,
          totalAmount: selectedPackage.basePrice
        });
      } else {
        setFormData({
          ...formData,
          packageId: '',
          packageName: '',
          totalAmount: ''
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData({ ...formData, paymentProof: file, paymentProofUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPreviewUrl('');
    setFormData({ ...formData, paymentProof: null, paymentProofUrl: '' });
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {booking ? 'Edit Booking' : 'Booking Baru'}
          </h2>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nama Klien *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nomor Telepon *
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Jenis Layanan *
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Acara *
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
                Waktu Acara *
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
              Lokasi/Venue *
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Package" size={18} color="var(--color-primary)" />
              Paket & Harga
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pilih Paket
                </label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih paket atau isi manual</option>
                  {filteredPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR',
                        minimumFractionDigits: 0 
                      }).format(pkg.basePrice)}
                    </option>
                  ))}
                </select>
                {filteredPackages.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Tidak ada paket tersedia untuk jenis layanan ini
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Paket (Manual)
                </label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Atau ketik nama paket manual"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Harga (Rp) *
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
                  DP/Down Payment (Rp)
                </label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>
            </div>

            {formData.totalAmount && (
              <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total Harga:</span>
                  <span className="font-semibold text-foreground">
                    {new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR',
                      minimumFractionDigits: 0 
                    }).format(formData.totalAmount)}
                  </span>
                </div>
                {formData.downPayment > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">DP Dibayar:</span>
                      <span className="font-semibold text-success">
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(formData.downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-foreground font-medium">Sisa Pembayaran:</span>
                      <span className="font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0 
                        }).format(formData.totalAmount - formData.downPayment)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
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
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bukti Transfer (Opsional)
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload bukti transfer DP jika klien sudah melakukan pembayaran
            </p>

            {!previewUrl ? (
              <label className="block">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/50 transition-smooth">
                  <Icon name="Upload" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Klik untuk upload bukti transfer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG atau JPEG (Max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative border border-border rounded-xl p-4 bg-muted/30">
                <img
                  src={previewUrl}
                  alt="Preview bukti transfer"
                  className="w-full h-48 object-contain rounded-lg bg-background"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-6 right-6 p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-smooth elevation-4"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Simpan Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
