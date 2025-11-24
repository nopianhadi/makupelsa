import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const PublicTestimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('testimonials');
    if (stored) {
      const all = JSON.parse(stored);
      const approved = all.filter(t => t.status === 'approved');
      setTestimonials(approved);
    }
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i} 
            name="Star" 
            size={16} 
            color={i < rating ? "var(--color-warning)" : "var(--color-muted)"}
            fill={i < rating ? "var(--color-warning)" : "none"}
          />
        ))}
      </div>
    );
  };

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0';

  return (
    <>
      <Helmet>
        <title>Testimoni Klien - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Icon name="MessageSquare" size={32} color="var(--color-primary)" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
              Testimoni Klien Kami
            </h1>
            <p className="text-muted-foreground mb-6">
              Dengarkan pengalaman klien yang telah menggunakan layanan kami
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{testimonials.length}</div>
                <div className="text-sm text-muted-foreground">Testimoni</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">{averageRating}</div>
                <div className="text-sm text-muted-foreground">Rating Rata-rata</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/testimonial/public')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              <Icon name="Plus" size={20} />
              Berikan Testimoni
            </button>
          </div>

          {/* Testimonials Grid */}
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {testimonial.name}
                      </h3>
                      {testimonial.service && (
                        <p className="text-xs text-muted-foreground">
                          {testimonial.service}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  <p className="text-foreground text-sm leading-relaxed mb-4">
                    "{testimonial.message}"
                  </p>

                  <div className="text-xs text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="MessageSquare" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">
                Belum ada testimoni. Jadilah yang pertama!
              </p>
              <button
                onClick={() => navigate('/testimonial/public')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Plus" size={20} />
                Berikan Testimoni
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicTestimonials;
