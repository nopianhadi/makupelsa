import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const PublicTestimonialForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    rating: 5,
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const testimonial = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('testimonials') || '[]');
    existing.push(testimonial);
    localStorage.setItem('testimonials', JSON.stringify(existing));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        rating: 5,
        message: ''
      });
      setIsSuccess(false);
    }, 3000);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="transition-transform hover:scale-110"
          >
            <Icon 
              name="Star" 
              size={32} 
              color={star <= formData.rating ? "var(--color-warning)" : "var(--color-muted)"}
              fill={star <= formData.rating ? "var(--color-warning)" : "none"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Berikan Testimoni - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Icon name="MessageSquare" size={32} color="var(--color-primary)" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
              Berikan Testimoni Anda
            </h1>
            <p className="text-muted-foreground">
              Bagikan pengalaman Anda menggunakan layanan kami
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" />
              <div>
                <div className="font-semibold text-success">Terima kasih!</div>
                <div className="text-sm text-success/80">
                  Testimoni Anda telah dikirim dan akan ditinjau oleh tim kami.
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="nama@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="08xx xxxx xxxx"
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Layanan yang Digunakan
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Pilih layanan</option>
                  <option value="Makeup Akad">Makeup Akad</option>
                  <option value="Makeup Resepsi">Makeup Resepsi</option>
                  <option value="Makeup Wisuda">Makeup Wisuda</option>
                  <option value="Makeup Prewedding">Makeup Prewedding</option>
                  <option value="Makeup Lamaran">Makeup Lamaran</option>
                  <option value="Paket Lengkap">Paket Lengkap</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Rating <span className="text-destructive">*</span>
                </label>
                {renderStars()}
                <p className="text-sm text-muted-foreground mt-2">
                  {formData.rating === 5 ? 'Sangat Puas' :
                   formData.rating === 4 ? 'Puas' :
                   formData.rating === 3 ? 'Cukup' :
                   formData.rating === 2 ? 'Kurang' : 'Sangat Kurang'}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Testimoni <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimal 20 karakter
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || formData.message.length < 20}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={20} />
                    Kirim Testimoni
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Testimoni Anda akan membantu calon klien lain dalam membuat keputusan
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicTestimonialForm;
