import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PublicBookingForm = () => {
  const location = useLocation();
  const selectedPackageFromState = location.state?.selectedPackage;
  const serviceTypeFromState = location.state?.serviceType;

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceType: serviceTypeFromState || 'akad',
    eventDate: '',
    eventTime: '',
    venue: '',
    packageId: selectedPackageFromState?.id || '',
    packageName: selectedPackageFromState?.name || '',
    totalAmount: selectedPackageFromState?.basePrice || '',
    downPayment: '',
    notes: '',
    paymentProof: null,
    paymentProofUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
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
    
    // If no packages in localStorage, use mock data and save it
    if (loadedPackages.length === 0) {
      loadedPackages = [
        {
          id: 'pkg_001',
          name: 'Paket Akad Nikah Premium',
          serviceType: 'akad',
          description: 'Paket makeup akad nikah lengkap dengan hairdo dan paes adat',
          duration: '3-4 jam',
          basePrice: 2500000,
          originalPrice: 3000000,
          includedServices: [
            'Makeup pengantin natural & elegan',
            'Hairdo pengantin dengan aksesoris',
            'Paes adat Jawa/Sunda',
            'Touch up makeup 2x',
            'Konsultasi makeup pre-wedding',
            'Trial makeup 1x'
          ],
          addOns: [
            { name: 'Makeup keluarga per orang', price: 300000 },
            { name: 'Hairdo tambahan', price: 200000 }
          ],
          isActive: true
        },
        {
          id: 'pkg_002',
          name: 'Paket Resepsi Glamour',
          serviceType: 'resepsi',
          description: 'Paket makeup resepsi dengan tampilan glamour dan mewah',
          duration: '5-6 jam',
          basePrice: 4000000,
          originalPrice: 4500000,
          includedServices: [
            'Makeup pengantin glamour',
            'Hairdo kompleks dengan sanggul modern',
            'Ganti makeup 1x',
            'Touch up unlimited',
            'Trial makeup 2x'
          ],
          addOns: [
            { name: 'Ganti makeup tambahan', price: 500000 },
            { name: 'Makeup bridesmaid per orang', price: 400000 }
          ],
          isActive: true
        },
        {
          id: 'pkg_003',
          name: 'Paket Wisuda Fresh & Natural',
          serviceType: 'wisuda',
          description: 'Paket makeup wisuda dengan tampilan fresh dan natural',
          duration: '1.5-2 jam',
          basePrice: 600000,
          originalPrice: 750000,
          includedServices: [
            'Makeup wisuda natural & fresh',
            'Hairdo simple & rapi',
            'Touch up 1x',
            'False lashes natural'
          ],
          addOns: [
            { name: 'Hairdo kompleks', price: 150000 }
          ],
          isActive: true
        },
        {
          id: 'pkg_004',
          name: 'Paket Akad Simple',
          serviceType: 'akad',
          description: 'Paket makeup akad nikah dengan layanan standar',
          duration: '2-3 jam',
          basePrice: 1500000,
          includedServices: [
            'Makeup pengantin natural',
            'Hairdo sederhana',
            'Paes adat basic',
            'Touch up 1x'
          ],
          isActive: true
        },
        {
          id: 'pkg_006',
          name: 'Paket Wisuda Premium',
          serviceType: 'wisuda',
          description: 'Paket makeup wisuda premium dengan tampilan flawless',
          duration: '2-3 jam',
          basePrice: 900000,
          originalPrice: 1100000,
          includedServices: [
            'Makeup wisuda premium',
            'Hairdo kompleks',
            'Touch up 2x',
            'False lashes premium'
          ],
          isActive: true
        }
      ];
      // Save mock data to localStorage
      localStorage.setItem('service_packages', JSON.stringify(loadedPackages));
    }
    
    setPackages(loadedPackages);
  }, []);

  useEffect(() => {
    const filtered = packages.filter(pkg => 
      pkg.serviceType === formData.serviceType && pkg.isActive
    );
    setFilteredPackages(filtered);
  }, [formData.serviceType, packages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const bookingData = {
        ...formData,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, this would be sent to backend)
      const existingBookings = JSON.parse(localStorage.getItem('public_bookings') || '[]');
      localStorage.setItem('public_bookings', JSON.stringify([...existingBookings, bookingData]));

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'serviceType') {
      setFormData({ 
        ...formData, 
        [name]: value,
        packageId: '',
        packageName: '',
        totalAmount: ''
      });
    } else if (name === 'packageId') {
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      // Create preview
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

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Booking Berhasil - MUA Finance Manager</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center elevation-12">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle2" size={40} color="var(--color-success)" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Booking Berhasil!
            </h2>
            <p className="text-muted-foreground mb-6">
              Terima kasih telah melakukan booking. Kami akan segera menghubungi Anda untuk konfirmasi.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  clientName: '',
                  clientPhone: '',
                  clientEmail: '',
                  serviceType: 'akad',
                  eventDate: '',
                  eventTime: '',
                  venue: '',
                  packageId: '',
                  packageName: '',
                  totalAmount: '',
                  downPayment: '',
                  notes: '',
                  paymentProof: null,
                  paymentProofUrl: ''
                });
                setPreviewUrl('');
              }}
            >
              Booking Lagi
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Form Booking - MUA Finance Manager</title>
        <meta name="description" content="Form booking layanan makeup artist" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 elevation-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <Icon name="Calendar" size={32} color="white" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Form Booking
              </h1>
              <p className="text-muted-foreground">
                Isi form di bawah untuk melakukan booking layanan makeup
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                  <Icon name="User" size={20} color="var(--color-primary)" />
                  Informasi Pribadi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nama Anda"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
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
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Calendar" size={20} color="var(--color-primary)" />
                  Detail Acara
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Jenis Layanan *
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="akad">Akad</option>
                      <option value="resepsi">Resepsi</option>
                      <option value="wisuda">Wisuda</option>
                      <option value="lamaran">Lamaran</option>
                      <option value="engagement">Engagement</option>
                      <option value="photoshoot">Photoshoot</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pilih Paket
                    </label>
                    <select
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Pilih paket yang tersedia</option>
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
                    {formData.packageId && formData.totalAmount && (
                      <div className="mt-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-foreground">
                            Harga Paket:
                          </p>
                          <p className="text-xl font-bold text-primary">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR',
                              minimumFractionDigits: 0 
                            }).format(formData.totalAmount)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Anda dapat membayar DP terlebih dahulu
                        </p>
                      </div>
                    )}
                  </div>

                  {formData.totalAmount && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Jumlah DP (Opsional)
                      </label>
                      <input
                        type="number"
                        name="downPayment"
                        value={formData.downPayment}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Masukkan jumlah DP jika ingin bayar sebagian"
                        max={formData.totalAmount}
                      />
                      {formData.downPayment && parseFloat(formData.downPayment) > 0 && (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Total Harga:</span>
                            <span className="font-medium text-foreground">
                              {new Intl.NumberFormat('id-ID', { 
                                style: 'currency', 
                                currency: 'IDR',
                                minimumFractionDigits: 0 
                              }).format(formData.totalAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">DP Dibayar:</span>
                            <span className="font-medium text-success">
                              {new Intl.NumberFormat('id-ID', { 
                                style: 'currency', 
                                currency: 'IDR',
                                minimumFractionDigits: 0 
                              }).format(formData.downPayment)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-border">
                            <span className="font-medium text-foreground">Sisa Pembayaran:</span>
                            <span className="font-bold text-primary">
                              {new Intl.NumberFormat('id-ID', { 
                                style: 'currency', 
                                currency: 'IDR',
                                minimumFractionDigits: 0 
                              }).format(formData.totalAmount - formData.downPayment)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Alamat lengkap venue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Catatan Tambahan
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Permintaan khusus atau catatan lainnya..."
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Upload" size={20} color="var(--color-primary)" />
                  Bukti Transfer (Opsional)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload bukti transfer DP jika sudah melakukan pembayaran
                </p>

                <div>
                  {!previewUrl ? (
                    <label className="block">
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-smooth">
                        <Icon name="Upload" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
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
                    <div className="relative border border-border rounded-xl p-4">
                      <img
                        src={previewUrl}
                        alt="Preview bukti transfer"
                        className="w-full h-64 object-contain rounded-lg bg-muted"
                      />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-6 right-6 p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-smooth"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={20} className="mr-2" />
                      Kirim Booking
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Powered by MUA Finance Manager</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicBookingForm;
