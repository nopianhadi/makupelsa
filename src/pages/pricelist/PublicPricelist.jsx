import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';

const PublicPricelist = () => {
  const { publicId } = useParams();
  const [pricelist, setPricelist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = dataStore.getPricelistByPublicId(publicId);
    setPricelist(data);
    setLoading(false);
  }, [publicId]);

  const images = pricelist?.images || (pricelist?.image ? [pricelist.image] : []);
  const whatsappNumber = pricelist?.whatsappNumber || '6281234567890';
  const whatsappMessage = encodeURIComponent(`Halo, saya tertarik dengan ${pricelist?.title}. Bisa info lebih lanjut?`);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat pricelist...</p>
        </div>
      </div>
    );
  }

  if (!pricelist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={40} color="var(--color-muted-foreground)" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pricelist Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground">
            Link yang Anda akses tidak valid atau pricelist telah dihapus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pricelist.title} - Pricelist</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {pricelist.title}
            </h1>
            {pricelist.description && (
              <p className="text-muted-foreground">
                {pricelist.description}
              </p>
            )}
          </div>
        </div>

        {/* Images Section - Full Width */}
        <div className="w-full">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="w-full">
                <img
                  src={image}
                  alt={`${pricelist.title} - ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))
          ) : (
            <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
              <Icon name="DollarSign" size={64} color="var(--color-muted-foreground)" />
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Tertarik dengan Layanan Kami?
              </h2>
              <p className="text-muted-foreground">
                Hubungi kami sekarang untuk booking atau konsultasi gratis
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold rounded-xl transition-smooth shadow-lg"
              >
                <Icon name="MessageCircle" size={20} />
                <span>Chat WhatsApp</span>
              </a>

              <a
                href="/booking/public"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-smooth shadow-lg"
              >
                <Icon name="CalendarCheck" size={20} />
                <span>Booking Sekarang</span>
              </a>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Phone" size={20} color="var(--color-primary)" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Butuh Bantuan?</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tim kami siap membantu Anda 24/7
                  </p>
                  <div className="flex flex-col gap-2 text-sm">
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Icon name="MessageCircle" size={16} />
                      <span>+{whatsappNumber.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')} (WhatsApp)</span>
                    </a>
                    <a
                      href={`tel:+${whatsappNumber}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Icon name="Phone" size={16} />
                      <span>+{whatsappNumber.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')} (Telepon)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="Calendar" size={14} />
                <span>Dibuat: {new Date(pricelist.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <p>© 2025 MUA Finance Manager. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicPricelist;
