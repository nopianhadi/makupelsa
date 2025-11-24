import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const HorizontalNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Ringkasan bisnis dan operasi harian'
    },
    {
      label: 'Klien',
      path: '/client-management',
      icon: 'Users',
      tooltip: 'Manajemen hubungan klien'
    },
    {
      label: 'Kalender',
      path: '/calendar-scheduling',
      icon: 'Calendar',
      tooltip: 'Penjadwalan dan ketersediaan'
    },
    {
      label: 'Keuangan',
      path: '/financial-tracking',
      icon: 'Wallet',
      tooltip: 'Pelacakan keuangan lengkap'
    },
    {
      label: 'Pembayaran',
      path: '/payment-tracking',
      icon: 'CreditCard',
      tooltip: 'Pemantauan status pembayaran'
    },
    {
      label: 'Paket Layanan',
      path: '/service-packages',
      icon: 'Package',
      tooltip: 'Definisi paket layanan'
    },
    {
      label: 'Prospek',
      path: '/leads',
      icon: 'UserPlus',
      tooltip: 'Kelola calon klien potensial'
    },
    {
      label: 'Pengaturan',
      path: '/settings',
      icon: 'Settings',
      tooltip: 'Pengaturan aplikasi'
    },
    {
      label: 'Profil',
      path: '/profile',
      icon: 'User',
      tooltip: 'Profil pengguna'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <nav
      className="hidden lg:block sticky top-0 bg-card border-b border-border z-[100]"
      role="navigation"
      aria-label="Primary Navigation"
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center gap-2 py-4">
          <div className="flex items-center gap-2 mr-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Sparkles" size={24} color="var(--color-primary)" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-heading font-bold text-foreground leading-tight">
                MUA Finance
              </span>
              <span className="text-[10px] font-caption text-muted-foreground leading-tight">
                Manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-1">
            {navigationItems?.map((item) => {
              const active = isActive(item?.path);

              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-md
                    transition-smooth relative
                    ${active
                      ? 'text-primary bg-primary/10 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  aria-label={item?.tooltip}
                  aria-current={active ? 'page' : undefined}
                  title={item?.tooltip}
                >
                  <Icon
                    name={item?.icon}
                    size={18}
                    strokeWidth={active ? 2.5 : 2}
                    className="transition-smooth"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item?.label}
                  </span>
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavigation;
