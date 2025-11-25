import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    loadTestimonials();
    
    // Listen untuk perubahan testimonials
    const handleTestimonialChange = () => {
      loadTestimonials();
    };
    window.addEventListener('testimonialAdded', handleTestimonialChange);
    window.addEventListener('testimonialUpdated', handleTestimonialChange);
    window.addEventListener('testimonialDeleted', handleTestimonialChange);
    
    return () => {
      window.removeEventListener('testimonialAdded', handleTestimonialChange);
      window.removeEventListener('testimonialUpdated', handleTestimonialChange);
      window.removeEventListener('testimonialDeleted', handleTestimonialChange);
    };
  }, []);

  const loadTestimonials = () => {
    const stored = dataStore.getTestimonials();
    setTestimonials(stored);
  };

  const handleApprove = (id) => {
    dataStore.updateTestimonial(id, { status: 'approved', approvedAt: new Date().toISOString() });
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: 'approved', approvedAt: new Date().toISOString() } : t
    ));
  };

  const handleReject = (id) => {
    dataStore.updateTestimonial(id, { status: 'rejected' });
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: 'rejected' } : t
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus testimoni ini?')) {
      dataStore.deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const filteredTestimonials = (filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.status === filter)).filter(t => {
      if (searchQuery) {
        return t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.message?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-destructive/10 text-destructive'
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            name={i < rating ? "Star" : "Star"} 
            size={16} 
            color={i < rating ? "var(--color-warning)" : "var(--color-muted)"}
            fill={i < rating ? "var(--color-warning)" : "none"}
          />
        ))}
      </div>
    );
  };

  const handleCopyLink = () => {
    const publicFormUrl = `${window.location.origin}/testimonial/public`;
    navigator.clipboard.writeText(publicFormUrl).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Gagal menyalin link');
    });
  };

  return (
    <>
      <Helmet>
        <title>Testimoni - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className={cn("w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg: py-4 sm:py-6", mobileClasses.card)}>
          <div className={cn("mb-4 sm:", mobileClasses.marginBottom)}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h1 className={cn("text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-heading font-bold text-foreground mb-2", mobileClasses.heading1)}>
                  Testimoni Klien
                </h1>
                <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                  Kelola testimoni dari klien Anda
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                  title="Salin link form testimoni publik"
                >
                  <Icon name="Link" size={18} />
                  <span className="hidden sm:inline">Copy Link Form</span>
                  <span className="sm:hidden">Copy Link</span>
                </button>
                {showCopySuccess && (
                  <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-success text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
                    ✓ Link berhasil disalin!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-2 sm:gap-3 lg:ga mb-3 sm:mb-4 sm:mb-4 sm:mb-6", mobileClasses.cardCompact)}>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
              <div className={cn(" font-bold text-foreground", mobileClasses.heading2)}>{testimonials.length}</div>
              <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Total Testimoni</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
              <div className={cn(" font-bold text-warning", mobileClasses.heading2)}>
                {testimonials.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Menunggu Review</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
              <div className={cn(" font-bold text-success", mobileClasses.heading2)}>
                {testimonials.filter(t => t.status === 'approved').length}
              </div>
              <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Disetujui</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden ", mobileClasses.cardCompact)}>
              <div className={cn(" font-bold text-foreground", mobileClasses.heading2)}>
                {testimonials.length > 0 
                  ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Rating Rata-rata</div>
            </div>
          </div>

          {/* Filter */}
          <div className={cn("flex gap-2 mb-4 sm: overflow-x-auto", mobileClasses.marginBottom)}>
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                {status === 'all' ? 'Semua' : 
                 status === 'pending' ? 'Menunggu' :
                 status === 'approved' ? 'Disetujui' : 'Ditolak'}
              </button>
            ))}
          </div>

          {/* Testimonials List */}
          <div className="space-y-4">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:", mobileClasses.card)}>
                <div className={cn("flex items-start justify-between ", mobileClasses.marginBottomSmall)}>
                  <div className="flex-1">
                    <div className={cn("flex items-center  mb-2", mobileClasses.gapSmall)}>
                      <h3 className="font-semibold text-foreground truncate">{testimonial.name}</h3>
                      {getStatusBadge(testimonial.status)}
                    </div>
                    <div className={cn("flex items-center ga text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground", mobileClasses.cardCompact)}>
                      <span>{testimonial.email}</span>
                      <span>•</span>
                      <span>{new Date(testimonial.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(testimonial.id)}
                          className="p-2 hover:bg-success/10 rounded-lg transition-colors"
                          title="Setujui"
                        >
                          <Icon name="Check" size={20} sm:size={20} color="var(--color-success)" />
                        </button>
                        <button
                          onClick={() => handleReject(testimonial.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Tolak"
                        >
                          <Icon name="X" size={20} sm:size={20} color="var(--color-destructive)" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Icon name="Trash2" size={20} sm:size={20} color="var(--color-destructive)" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-foreground mb-3">{testimonial.message}</p>

                {testimonial.service && (
                  <div className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                    Layanan: <span className="font-medium">{testimonial.service}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-12">
              <Icon name="MessageSquare" size={48} color="var(--color-muted-foreground)" className={cn("mx-auto ", mobileClasses.marginBottomSmall)} />
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'Belum ada testimoni' 
                  : `Tidak ada testimoni dengan status ${filter}`}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Testimonials;
