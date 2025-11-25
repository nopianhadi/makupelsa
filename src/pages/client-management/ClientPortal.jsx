import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PaymentStatusIndicator from '../../components/ui/PaymentStatusIndicator';
import Image from '../../components/AppImage';
import { dataStore } from '../../utils/dataStore';

const ClientPortal = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data klien dari localStorage berdasarkan clientId
    const loadClient = () => {
      // Try to get client by portalId first (main method)
      const foundClient = dataStore.getClientByPortalId(clientId);
      
      if (foundClient) {
        setClient(foundClient);
        setLoading(false);
        return;
      }
      
      // Fallback: try to get client by publicId (for backward compatibility)
      const clientByPublicId = dataStore.getClientByPublicId(clientId);
      
      if (clientByPublicId) {
        setClient(clientByPublicId);
        setLoading(false);
        return;
      }
      
      // Fallback: try to get client by direct ID
      const clients = dataStore.getClients();
      const clientById = clients.find(c => c.id === clientId);
      
      if (clientById) {
        setClient(clientById);
        setLoading(false);
        return;
      }
      
      // Fallback ke mock data untuk demo
      const mockClients = [
      {
        id: 1,
        portalId: "demo-1",
        name: "Siti Nurhaliza",
        phone: "081234567890",
        email: "siti.nurhaliza@email.com",
        location: "Jakarta Selatan",
        occupation: "Pengusaha",
        company: "PT. Siti Fashion",
        instagram: "sitinurhaliza",
        referralSource: "Instagram",
        profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_196eda338-1763293740662.png",
        totalAmount: 5500000,
        paymentStatus: "partial",
        events: [
          {
            serviceType: "akad",
            eventDate: "2025-12-15",
            eventTime: "09:00",
            venue: "Masjid Istiqlal, Jakarta Pusat",
            packageName: "Paket Premium Akad",
            totalAmount: 2500000,
            paymentStatus: "partial",
            notes: "Klien menginginkan makeup natural dengan hijab syar'i",
            packageDetails: [
              "Makeup pengantin (akad)",
              "Hairdo dengan hijab syar'i",
              "Touchup makeup",
              "Aksesoris hijab premium",
              "Free konsultasi makeup"
            ]
          },
          {
            serviceType: "resepsi",
            eventDate: "2025-12-16",
            eventTime: "18:00",
            venue: "Grand Ballroom Hotel Mulia, Jakarta",
            packageName: "Paket Luxury Resepsi",
            totalAmount: 3000000,
            paymentStatus: "pending",
            notes: "Tema resepsi modern elegant dengan warna gold dan putih",
            packageDetails: [
              "Makeup pengantin (resepsi)",
              "Hairdo glamour",
              "Gaun pengantin premium",
              "Aksesoris lengkap",
              "Makeup keluarga (2 orang)",
              "Touchup unlimited",
              "Dokumentasi makeup process"
            ]
          }
        ],
        paymentHistory: [
          {
            date: "2025-11-01",
            amount: 1500000,
            description: "DP Paket Akad",
            method: "Transfer Bank BCA"
          }
        ],
        communicationLog: [
          {
            type: "outgoing",
            date: "2025-11-15",
            subject: "Konfirmasi Jadwal Fitting",
            message: "Halo Kak Siti, ini reminder untuk fitting makeup besok jam 14:00 di studio ya."
          }
        ]
      }
    ];

      const mockClient = mockClients.find(c => c.id === parseInt(clientId));
      setClient(mockClient);
      setLoading(false);
    };
    
    loadClient();
  }, [clientId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getServiceTypeLabel = (type) => {
    const labels = {
      akad: 'Akad',
      resepsi: 'Resepsi',
      wisuda: 'Wisuda'
    };
    return labels[type] || type;
  };

  const totalPaid = client?.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = (client?.totalAmount || 0) - totalPaid;

  const handleDownloadInvoice = (eventIndex) => {
    const event = client.events[eventIndex];
    
    // Generate invoice HTML
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${event.packageName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .invoice-container { max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #e91e63; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #e91e63; font-size: 32px; margin-bottom: 5px; }
    .header p { color: #666; font-size: 14px; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-box { flex: 1; }
    .info-box h3 { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
    .info-box p { margin: 5px 0; font-size: 14px; }
    .invoice-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .invoice-details h2 { color: #e91e63; margin-bottom: 15px; font-size: 18px; }
    .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { flex: 0 0 200px; font-weight: bold; color: #666; }
    .detail-value { flex: 1; }
    .package-details { margin-bottom: 30px; }
    .package-details h3 { color: #333; margin-bottom: 15px; font-size: 16px; }
    .package-details ul { list-style: none; }
    .package-details li { padding: 8px 0; padding-left: 25px; position: relative; }
    .package-details li:before { content: "✓"; position: absolute; left: 0; color: #4caf50; font-weight: bold; }
    .payment-summary { background: #e91e63; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .payment-row { display: flex; justify-content: space-between; padding: 10px 0; }
    .payment-row.total { border-top: 2px solid rgba(255,255,255,0.3); margin-top: 10px; padding-top: 15px; font-size: 20px; font-weight: bold; }
    .notes { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 30px; }
    .notes h4 { color: #856404; margin-bottom: 10px; }
    .notes p { color: #856404; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; padding-top: 30px; border-top: 2px solid #e0e0e0; color: #666; font-size: 12px; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .status-paid { background: #4caf50; color: white; }
    .status-partial { background: #ff9800; color: white; }
    .status-pending { background: #f44336; color: white; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>🌸 INVOICE</h1>
      <p>MUA Finance Management System</p>
    </div>

    <div class="info-section">
      <div class="info-box">
        <h3>Dari:</h3>
        <p><strong>MUA Studio</strong></p>
        <p>Jakarta, Indonesia</p>
        <p>Email: admin@muafinance.com</p>
        <p>Phone: +62 812-3456-7890</p>
      </div>
      <div class="info-box" style="text-align: right;">
        <h3>Kepada:</h3>
        <p><strong>${client.name}</strong></p>
        <p>${client.location || '-'}</p>
        <p>Email: ${client.email || '-'}</p>
        <p>Phone: ${client.phone || '-'}</p>
      </div>
    </div>

    <div class="invoice-details">
      <h2>Detail Invoice</h2>
      <div class="detail-row">
        <div class="detail-label">Nomor Invoice:</div>
        <div class="detail-value">INV-${Date.now()}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Tanggal:</div>
        <div class="detail-value">${formatDate(new Date().toISOString())}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Jenis Acara:</div>
        <div class="detail-value">${getServiceTypeLabel(event.serviceType)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Tanggal Acara:</div>
        <div class="detail-value">${formatDate(event.eventDate)} - ${event.eventTime}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Lokasi:</div>
        <div class="detail-value">${event.venue}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Status Pembayaran:</div>
        <div class="detail-value">
          <span class="status-badge status-${event.paymentStatus}">
            ${event.paymentStatus === 'paid' ? 'Lunas' : event.paymentStatus === 'partial' ? 'Sebagian' : 'Belum Dibayar'}
          </span>
        </div>
      </div>
    </div>

    <div class="package-details">
      <h3>📦 ${event.packageName}</h3>
      ${event.packageDetails ? `
        <ul>
          ${event.packageDetails.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      ` : '<p>Detail paket tidak tersedia</p>'}
    </div>

    ${event.notes ? `
      <div class="notes">
        <h4>📝 Catatan Khusus:</h4>
        <p>${event.notes}</p>
      </div>
    ` : ''}

    <div class="payment-summary">
      <div class="payment-row">
        <span>Subtotal:</span>
        <span>${formatCurrency(event.totalAmount)}</span>
      </div>
      <div class="payment-row">
        <span>Pajak (0%):</span>
        <span>${formatCurrency(0)}</span>
      </div>
      <div class="payment-row total">
        <span>TOTAL:</span>
        <span>${formatCurrency(event.totalAmount)}</span>
      </div>
    </div>

    <div class="footer">
      <p>Terima kasih atas kepercayaan Anda!</p>
      <p>Invoice ini dibuat secara otomatis oleh sistem MUA Finance</p>
      <p style="margin-top: 10px;">© ${new Date().getFullYear()} MUA Studio. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${client.name.replace(/\s+/g, '-')}-${event.serviceType}-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert(`✅ Invoice berhasil didownload!\n\nFile: ${link.download}\n\nAnda dapat membuka file HTML ini di browser dan mencetak sebagai PDF.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={40} color="var(--color-muted-foreground)" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Data Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            Maaf, data klien tidak ditemukan. Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
          <Button onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Portal Klien - {client.name}</title>
        <meta name="description" content={`Portal klien untuk ${client.name}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                <Image
                  src={client.profileImage}
                  alt={client.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  {client.name}
                </h1>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Informasi Klien */}
          <div className="bg-card border border-border rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nama Lengkap</p>
                <p className="text-base font-medium text-foreground">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-base font-medium text-foreground">{client.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">No. Telepon</p>
                <p className="text-base font-medium text-foreground font-mono">{client.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lokasi</p>
                <p className="text-base font-medium text-foreground">{client.location || '-'}</p>
              </div>
              {client.occupation && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pekerjaan</p>
                  <p className="text-base font-medium text-foreground">{client.occupation}</p>
                </div>
              )}
              {client.company && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Perusahaan</p>
                  <p className="text-base font-medium text-foreground">{client.company}</p>
                </div>
              )}
              {client.instagram && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Instagram</p>
                  <p className="text-base font-medium text-foreground">@{client.instagram}</p>
                </div>
              )}
              {client.referralSource && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sumber Referral</p>
                  <p className="text-base font-medium text-foreground">{client.referralSource}</p>
                </div>
              )}
            </div>
          </div>
          {/* Ringkasan Pembayaran */}
          <div className="bg-card border border-border rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Ringkasan Pembayaran
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Tagihan</p>
                <p className="text-xl font-bold text-foreground font-mono">
                  {formatCurrency(client.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sudah Dibayar</p>
                <p className="text-xl font-bold text-success font-mono">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sisa Pembayaran</p>
                <p className="text-xl font-bold text-warning font-mono">
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <PaymentStatusIndicator 
                status={client.paymentStatus}
                type="badge"
                showIcon={true}
              />
            </div>
          </div>

          {/* Acara */}
          <div className="bg-card border border-border rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Detail Acara & Paket
            </h2>
            <div className="space-y-4">
              {client.events.map((event, index) => (
                <div key={index} className="bg-surface rounded-lg overflow-hidden p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-primary">
                      {getServiceTypeLabel(event.serviceType)}
                    </span>
                    <PaymentStatusIndicator 
                      status={event.paymentStatus}
                      type="badge"
                      showIcon={false}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Calendar" size={16} />
                      <span className="font-medium">{formatDate(event.eventDate)}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-mono">{event.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Package" size={16} />
                      <span>{event.packageName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="DollarSign" size={16} />
                      <span className="font-semibold font-mono">{formatCurrency(event.totalAmount)}</span>
                    </div>
                    
                    {/* Detail Paket */}
                    {event.packageDetails && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm font-semibold text-foreground mb-2">Detail Paket:</p>
                        <ul className="space-y-1">
                          {event.packageDetails.map((detail, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Icon name="Check" size={14} className="mt-0.5 flex-shrink-0" color="var(--color-success)" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {event.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm font-semibold text-foreground mb-1">Catatan:</p>
                        <p className="text-sm text-muted-foreground">{event.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                      onClick={() => handleDownloadInvoice(index)}
                      className="w-full"
                    >
                      Download Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat Pembayaran */}
          <div className="bg-card border border-border rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Riwayat Pembayaran
            </h2>
            {client.paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {client.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg overflow-hidden">
                    <div>
                      <p className="font-medium text-foreground">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.date)} • {payment.method}
                      </p>
                    </div>
                    <p className="font-bold text-success font-mono">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada riwayat pembayaran
              </p>
            )}
          </div>

          {/* Komunikasi */}
          <div className="bg-card border border-border rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Riwayat Komunikasi
            </h2>
            {client.communicationLog.length > 0 ? (
              <div className="space-y-3">
                {client.communicationLog.map((comm, index) => (
                  <div key={index} className="p-3 bg-surface rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon 
                        name={comm.type === 'incoming' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                        size={16}
                        color={comm.type === 'incoming' ? 'var(--color-primary)' : 'var(--color-success)'}
                      />
                      <span className="font-medium text-foreground">{comm.subject}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{comm.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(comm.date)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada riwayat komunikasi
              </p>
            )}
          </div>

          {/* Info Kontak */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <Icon name="Info" size={32} color="var(--color-primary)" className="mx-auto mb-3" />
            <h3 className="font-heading font-bold text-foreground mb-2">
              Butuh Bantuan?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Jangan ragu untuk menghubungi kami jika ada pertanyaan atau perlu bantuan
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                iconName="Phone"
                iconPosition="left"
                onClick={() => window.open('tel:+6281234567890')}
              >
                Telepon
              </Button>
              <Button
                variant="outline"
                iconName="Mail"
                iconPosition="left"
                onClick={() => window.open('mailto:admin@muafinance.com')}
              >
                Email
              </Button>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default ClientPortal;
