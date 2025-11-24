import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = () => {
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
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-[100]"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-screen-xl mx-auto overflow-x-auto">
        {navigationItems?.map((item) => {
          const active = isActive(item?.path);

          return (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md
                transition-smooth min-w-[60px] relative
                ${active
                  ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              aria-label={item?.tooltip}
              aria-current={active ? 'page' : undefined}
              title={item?.tooltip}
            >
              <Icon
                name={item?.icon}
                size={20}
                strokeWidth={active ? 2.5 : 2}
                className="transition-smooth"
              />
              <span className={`
                text-[10px] font-caption font-medium leading-tight text-center
                ${active ? 'font-semibold' : ''}
              `}>
                {item?.label}
              </span>
              {active && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
