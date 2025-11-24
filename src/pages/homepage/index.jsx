import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Users',
      title: 'Manajemen Klien',
      description: 'Kelola database klien dan tracking layanan makeup dengan mudah'
    },
    {
      icon: 'Calendar',
      title: 'Jadwal & Kalender',
      description: 'Atur jadwal acara dan appointment klien dalam satu tempat'
    },
    {
      icon: 'Wallet',
      title: 'Pelacakan Keuangan',
      description: 'Pantau pendapatan, pengeluaran, dan pembayaran klien secara real-time'
    },
    {
      icon: 'Receipt',
      title: 'Invoice & Pembayaran',
      description: 'Generate invoice otomatis dan track status pembayaran'
    },
    {
      icon: 'Package',
      title: 'Paket Layanan',
      description: 'Buat dan kelola paket layanan makeup untuk klien'
    },
    {
      icon: 'Image',
      title: 'Portfolio Gallery',
      description: 'Showcase hasil kerja makeup dalam gallery portfolio profesional'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border elevation-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Sparkles" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  MUA Finance Manager
                </h1>
                <p className="text-xs text-muted-foreground">Finance & Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity elevation-2"
              >
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-2 sm:px-4 lg:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-6">
            <Icon name="Sparkles" size={16} />
            <span>Sistem Manajemen Bisnis Makeup Artist</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Kelola Bisnis Makeup<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Lebih Mudah & Profesional
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Platform lengkap untuk manajemen klien, keuangan, jadwal, invoice, dan portfolio. 
            Semua yang Anda butuhkan untuk mengembangkan bisnis makeup artist dalam satu aplikasi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-2 sm:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity elevation-3"
            >
              Mulai Gratis Sekarang
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-2 sm:py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors elevation-1"
            >
              Masuk ke Akun
            </button>
          </div>

          {/* Demo Accounts Info */}
          <div className="mt-8 p-4 bg-card border border-border rounded-lg max-w-md mx-auto text-left">
            <p className="text-xs sm:text-sm font-medium text-foreground mb-2">Akun Demo untuk Testing:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>📧 demo@muafinance.com / demo123</p>
              <p>📧 test@muafinance.com / test123</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-2 sm:px-4 lg:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
              Fitur Lengkap untuk Bisnis Makeup Anda
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua tools yang Anda butuhkan untuk mengelola bisnis makeup artist secara profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:p-4 lg:p-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 lg:p-6 bg-card border border-border rounded-lg hover:elevation-3 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name={feature.icon} size={24} color="var(--color-primary)" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-2 sm:px-4 lg:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
            Siap Mengembangkan Bisnis Makeup Anda?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Bergabung dengan ratusan makeup artist profesional yang telah meningkatkan produktivitas bisnis mereka
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-2 sm:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity elevation-3"
          >
            Daftar Gratis Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-2 sm:px-4 lg:px-6 lg:px-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2025 MUA Finance Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
