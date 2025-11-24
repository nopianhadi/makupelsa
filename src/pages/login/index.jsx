import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData?.email, formData?.password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err?.message || 'Gagal masuk. Silakan periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-elevation-12 p-8 border border-border backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-elevation-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-muted-foreground">
              Masuk ke akun MUA Finance Manager Anda
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-error">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                Email
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
                  className="w-full pl-12 pr-4 py-2 sm:py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                Password
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
                  className="w-full pl-12 pr-12 py-2 sm:py-3.5 bg-surface border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  placeholder="Masukkan password"
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/reset-password" 
                className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-smooth font-medium"
              >
                Lupa Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-elevation-3 hover:shadow-elevation-6 hover:scale-interaction transition-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Masuk'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
              Akun Demo untuk Testing
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('demo@muafinance.com', 'demo123')}
                className="w-full text-left px-3 py-2 bg-card hover:bg-surface border border-border rounded-lg transition-smooth text-xs"
              >
                <span className="font-medium text-foreground">Demo MUA:</span>
                <span className="text-muted-foreground ml-2">demo@muafinance.com / demo123</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('test@muafinance.com', 'test123')}
                className="w-full text-left px-3 py-2 bg-card hover:bg-surface border border-border rounded-lg transition-smooth text-xs"
              >
                <span className="font-medium text-foreground">Test MUA:</span>
                <span className="text-muted-foreground ml-2">test@muafinance.com / test123</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 transition-smooth font-semibold"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}