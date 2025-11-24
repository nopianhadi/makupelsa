import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/app/client-management', label: 'Klien', icon: 'Users' },
    { path: '/app/client-kpi', label: 'KPI Bisnis', icon: 'BarChart3' },
    { path: '/app/project-management', label: 'Proyek', icon: 'Briefcase' },
    { path: '/app/calendar-scheduling', label: 'Kalender', icon: 'Calendar' },
    { path: '/app/financial-tracking', label: 'Keuangan', icon: 'TrendingUp' },
    { path: '/app/payment-tracking', label: 'Pembayaran', icon: 'CreditCard' },
    { path: '/app/service-packages', label: 'Paket Layanan', icon: 'Package' },
    { path: '/app/pricelist', label: 'Pricelist', icon: 'DollarSign' },
    { path: '/app/promotions', label: 'Promo', icon: 'Tag' },
    { path: '/app/leads', label: 'Prospek', icon: 'UserPlus' },
    { path: '/app/booking', label: 'Booking', icon: 'CalendarCheck' },
    { path: '/app/testimonials', label: 'Testimoni', icon: 'MessageSquare' },
    { path: '/app/team', label: 'Tim', icon: 'Users' },
    { path: '/app/settings', label: 'Pengaturan', icon: 'Settings' },
    { path: '/app/profile', label: 'Profil', icon: 'User' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Sparkles" size={24} color="var(--color-primary)" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-heading font-bold text-foreground">
              MUA Finance
            </span>
            <span className="text-xs text-muted-foreground">
              Manager
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-smooth text-left
                    ${active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Sparkles" size={20} color="var(--color-primary)" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-heading font-bold text-foreground">
              MUA Finance
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg">
            <nav className="p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-smooth text-left
                        ${active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon
                        name={item.icon}
                        size={20}
                        strokeWidth={active ? 2.5 : 2}
                      />
                      <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
