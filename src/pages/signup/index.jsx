import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Sparkles, Lock, Mail, User, Briefcase, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    businessName: '',
    phoneNumber: '',
    location: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData?.password?.length < 6) {
      setError('Password harus minimal 6 karakter');
      return false;
    }
    if (formData?.password !== formData?.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }
    if (!formData?.fullName?.trim()) {
      setError('Nama lengkap wajib diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(formData?.email, formData?.password, {
        fullName: formData?.fullName,
        businessName: formData?.businessName,
        phoneNumber: formData?.phoneNumber,
        location: formData?.location
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err?.message || 'Gagal membuat akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-elevation-12 p-8 border border-border max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-muted-foreground mb-4">
            Akun Anda telah berhasil dibuat. Silakan cek email Anda untuk konfirmasi.
          </p>
          <p className="text-sm text-muted-foreground">
            Anda akan diarahkan ke halaman login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      {/* Signup Card */}
      <div className="relative w-full max-w-2xl">
        <div className="bg-card rounded-3xl shadow-elevation-12 p-8 border border-border backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl mb-4 shadow-elevation-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Bergabung dengan Kami
            </h1>
            <p className="text-muted-foreground">
              Buat akun MUA Finance Manager untuk mengelola bisnis makeup Anda
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                  Nama Lengkap <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData?.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    placeholder="Nama lengkap Anda"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-foreground mb-2">
                  Nama Bisnis
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData?.businessName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    placeholder="Nama studio/bisnis MUA"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Two Column Layout for Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData?.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                  Lokasi
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData?.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                    placeholder="Kota/daerah"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData?.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Konfirmasi Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData?.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-semibold shadow-elevation-3 hover:shadow-elevation-6 hover:scale-interaction transition-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Email Confirmation Notice */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-sm text-primary text-center">
              Setelah mendaftar, silakan cek email Anda untuk link konfirmasi
            </p>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 transition-smooth font-semibold"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}