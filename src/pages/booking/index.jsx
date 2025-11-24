import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';
import BookingForm from './components/BookingForm';
import BookingCard from './components/BookingCard';
import { dataStore } from '../../utils/dataStore';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

const Booking = () => {
  const [bookings, setBookings] = useState(() => {
    return dataStore.getBookings();
  });

  const [publicBookings, setPublicBookings] = useState(() => {
    const saved = localStorage.getItem('public_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showPublicBookings, setShowPublicBookings] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    confirmed: true,
    completed: false,
    cancelled: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    // Load bookings from dataStore whenever component mounts
    setBookings(dataStore.getBookings());
    
    // Listen untuk perubahan booking via dataStore
    const handleBookingChange = () => {
      setBookings(dataStore.getBookings());
    };
    window.addEventListener('storage', handleBookingChange);
    window.addEventListener('bookingAdded', handleBookingChange);
    window.addEventListener('bookingUpdated', handleBookingChange);
    window.addEventListener('bookingDeleted', handleBookingChange);
    window.addEventListener('dataUpdated', handleBookingChange);
    
    return () => {
      window.removeEventListener('storage', handleBookingChange);
      window.removeEventListener('bookingAdded', handleBookingChange);
      window.removeEventListener('bookingUpdated', handleBookingChange);
      window.removeEventListener('bookingDeleted', handleBookingChange);
      window.removeEventListener('dataUpdated', handleBookingChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('public_bookings');
      if (saved) {
        setPublicBookings(JSON.parse(saved));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveBooking = (bookingData) => {
    if (editingBooking) {
      dataStore.updateBooking(editingBooking.id, bookingData);
      setBookings(bookings.map(b => 
        b.id === editingBooking.id ? { ...b, ...bookingData } : b
      ));
    } else {
      const newBooking = dataStore.addBooking({ ...bookingData, status: 'pending' });
      setBookings([...bookings, newBooking]);
    }
    setShowForm(false);
    setEditingBooking(null);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Yakin ingin menghapus booking ini?')) {
      dataStore.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dataStore.updateBooking(id, { status: newStatus });
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <>
      <Helmet>
        <title>Booking - MUA Finance Manager</title>
        <meta name="description" content="Kelola booking dan jadwal layanan makeup" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        
        <main className={cn("w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg: py-4 sm:py-6 pb-24 lg:pb-6", mobileClasses.card)}>
          <div className={cn("mb-4 sm:", mobileClasses.marginBottom)}>
            <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 lg:ga mb-3 sm:mb-4", mobileClasses.cardCompact)}>
              <div className={cn("flex items-center ", mobileClasses.gapSmall)}>
                <div className={cn(" rounded-lg bg-primary/10 flex items-center justify-center", mobileClasses.iconLarge)}>
                  <Icon name="Calendar" size={20} sm:size={24} color="var(--color-primary)" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className={cn("text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-heading font-bold text-foreground", mobileClasses.heading1)}>
                    Booking
                  </h1>
                  <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                    Kelola semua booking layanan Anda
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {publicBookings.length > 0 && (
                  <QuickActionButton
                    label={`Booking Publik (${publicBookings.length})`}
                    icon="Inbox"
                    variant="outline"
                    onClick={() => setShowPublicBookings(true)}
                    className="hidden sm:inline-flex"
                  />
                )}
                <QuickActionButton
                  label="Link Booking"
                  icon="Link"
                  variant="outline"
                  onClick={() => {
                    const link = `${window.location.origin}/booking/public`;
                    navigator.clipboard.writeText(link);
                    alert('Link booking publik berhasil disalin!\n\n' + link);
                  }}
                  className="hidden sm:inline-flex"
                />
                <QuickActionButton
                  label="Tambah Booking"
                  icon="Plus"
                  variant="primary"
                  onClick={() => { setEditingBooking(null); setShowForm(true); }}
                />
              </div>
            </div>

            <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5  mb-4 sm:mb-6", mobileClasses.gapSmall)}>
              <button
                onClick={() => setFilter('all')}
                className={`p-4 rounded-xl border transition-smooth ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <div className={cn(" font-bold", mobileClasses.heading2)}>{stats.total}</div>
                <div className="text-xs mt-1">Semua</div>
              </button>
              
              <button
                onClick={() => setFilter('pending')}
                className={`p-4 rounded-xl border transition-smooth ${
                  filter === 'pending'
                    ? 'bg-warning text-warning-foreground border-warning'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <div className={cn(" font-bold", mobileClasses.heading2)}>{stats.pending}</div>
                <div className="text-xs mt-1">Pending</div>
              </button>
              
              <button
                onClick={() => setFilter('confirmed')}
                className={`p-4 rounded-xl border transition-smooth ${
                  filter === 'confirmed'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <div className={cn(" font-bold", mobileClasses.heading2)}>{stats.confirmed}</div>
                <div className="text-xs mt-1">Confirmed</div>
              </button>
              
              <button
                onClick={() => setFilter('completed')}
                className={`p-4 rounded-xl border transition-smooth ${
                  filter === 'completed'
                    ? 'bg-success text-success-foreground border-success'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <div className={cn(" font-bold", mobileClasses.heading2)}>{stats.completed}</div>
                <div className="text-xs mt-1">Selesai</div>
              </button>
              
              <button
                onClick={() => setFilter('cancelled')}
                className={`p-4 rounded-xl border transition-smooth ${
                  filter === 'cancelled'
                    ? 'bg-error text-error-foreground border-error'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <div className={cn(" font-bold", mobileClasses.heading2)}>{stats.cancelled}</div>
                <div className="text-xs mt-1">Batal</div>
              </button>
            </div>
          </div>

          {/* Desktop: Grid View */}
          <div className={cn("hidden sm:grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ga", mobileClasses.cardCompact)}>
            {filteredBookings.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className={cn("w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto ", mobileClasses.marginBottomSmall)}>
                  <Icon name="Calendar" size={20} sm:size={32} color="var(--color-muted-foreground)" />
                </div>
                <h3 className={cn(" font-heading font-semibold text-foreground mb-2", mobileClasses.heading4)}>
                  Belum Ada Booking
                </h3>
                <p className={cn("text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground ", mobileClasses.marginBottomSmall)}>
                  Tambahkan booking pertama Anda
                </p>
                <QuickActionButton
                  label="Tambah Booking"
                  icon="Plus"
                  variant="primary"
                  onClick={() => setShowForm(true)}
                />
              </div>
            ) : (
              filteredBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onEdit={handleEditBooking}
                  onDelete={handleDeleteBooking}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>

          {/* Mobile: Accordion View by Status */}
          <div className="sm:hidden space-y-2">
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="Calendar" size={32} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-base font-heading font-semibold text-foreground mb-2">
                  Belum Ada Booking
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tambahkan booking pertama Anda
                </p>
                <QuickActionButton
                  label="Tambah Booking"
                  icon="Plus"
                  variant="primary"
                  onClick={() => setShowForm(true)}
                />
              </div>
            ) : (
              <>
                {/* Pending Bookings */}
                {stats.pending > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('pending')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={18} color="var(--color-warning)" />
                        <span className="text-sm font-medium text-foreground">Pending</span>
                        <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold">
                          {stats.pending}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.pending ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.pending && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {bookings.filter(b => b.status === 'pending').map(booking => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            onEdit={handleEditBooking}
                            onDelete={handleDeleteBooking}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Confirmed Bookings */}
                {stats.confirmed > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('confirmed')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle" size={18} color="var(--color-primary)" />
                        <span className="text-sm font-medium text-foreground">Confirmed</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {stats.confirmed}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.confirmed ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.confirmed && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {bookings.filter(b => b.status === 'confirmed').map(booking => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            onEdit={handleEditBooking}
                            onDelete={handleDeleteBooking}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Completed Bookings */}
                {stats.completed > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('completed')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={18} color="var(--color-success)" />
                        <span className="text-sm font-medium text-foreground">Selesai</span>
                        <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold">
                          {stats.completed}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.completed ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.completed && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {bookings.filter(b => b.status === 'completed').map(booking => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            onEdit={handleEditBooking}
                            onDelete={handleDeleteBooking}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cancelled Bookings */}
                {stats.cancelled > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggleSection('cancelled')}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface/50 transition-smooth"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="XCircle" size={18} color="var(--color-error)" />
                        <span className="text-sm font-medium text-foreground">Batal</span>
                        <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-bold">
                          {stats.cancelled}
                        </span>
                      </div>
                      <Icon 
                        name="ChevronDown" 
                        size={18} 
                        className={`transition-transform duration-200 ${expandedSections.cancelled ? 'rotate-180' : ''}`}
                        color="var(--color-muted-foreground)"
                      />
                    </button>
                    {expandedSections.cancelled && (
                      <div className="p-4 pt-0 border-t border-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {bookings.filter(b => b.status === 'cancelled').map(booking => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            onEdit={handleEditBooking}
                            onDelete={handleDeleteBooking}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>


        {showForm && (
          <BookingForm
            booking={editingBooking}
            onClose={() => { setShowForm(false); setEditingBooking(null); }}
            onSave={handleSaveBooking}
          />
        )}

        {showPublicBookings && (
          <div 
            className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center ", mobileClasses.cardCompact)}
            onClick={() => setShowPublicBookings(false)}
          >
            <div 
              className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden elevation-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("flex items-center justify-between p-3 sm:p-4 lg:p-3 sm:p-4 lg: border-b border-border", mobileClasses.card)}>
                <div>
                  <h2 className={cn(" font-heading font-bold text-foreground", mobileClasses.heading3)}>
                    Booking Publik Masuk
                  </h2>
                  <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground mt-1">
                    {publicBookings.length} booking dari form publik
                  </p>
                </div>
                <button
                  onClick={() => setShowPublicBookings(false)}
                  className={cn(" rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth", mobileClasses.iconMedium)}
                >
                  <Icon name="X" size={20} sm:size={20} />
                </button>
              </div>

              <div className={cn("p-3 sm:p-4 lg: overflow-y-auto max-h-[calc(90vh-120px)]", mobileClasses.card)}>
                <div className="space-y-4">
                  {publicBookings.map((booking, index) => (
                    <div key={index} className={cn("border border-border rounded-xl  bg-muted/30", mobileClasses.cardCompact)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">{booking.clientName}</h3>
                          <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">{booking.clientPhone}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                          Baru
                        </span>
                      </div>

                      <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2  text-xs sm:text-sm mb-3", mobileClasses.gapSmall)}>
                        <div>
                          <span className="text-muted-foreground">Layanan:</span>
                          <span className="ml-2 text-foreground capitalize">{booking.serviceType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tanggal:</span>
                          <span className="ml-2 text-foreground">{booking.eventDate}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Venue:</span>
                          <span className="ml-2 text-foreground">{booking.venue}</span>
                        </div>
                      </div>

                      {booking.paymentProofUrl && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-2">Bukti Transfer:</p>
                          <img 
                            src={booking.paymentProofUrl} 
                            alt="Bukti transfer" 
                            className="w-full h-32 object-contain rounded-lg bg-background border border-border"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newBooking = {
                              ...booking,
                              id: Date.now(),
                              status: 'pending'
                            };
                            setBookings([...bookings, newBooking]);
                            setPublicBookings(publicBookings.filter((_, i) => i !== index));
                            localStorage.setItem('public_bookings', JSON.stringify(publicBookings.filter((_, i) => i !== index)));
                            alert('Booking berhasil ditambahkan ke daftar booking!');
                          }}
                          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-smooth text-xs sm:text-sm font-medium"
                        >
                          Terima Booking
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus booking ini?')) {
                              setPublicBookings(publicBookings.filter((_, i) => i !== index));
                              localStorage.setItem('public_bookings', JSON.stringify(publicBookings.filter((_, i) => i !== index)));
                            }
                          }}
                          className="px-4 py-2 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-smooth text-xs sm:text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Booking;
