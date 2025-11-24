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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

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
            notes: "Klien menginginkan makeup natural dengan hijab syar'i"
          },
          {
            serviceType: "resepsi",
            eventDate: "2025-12-16",
            eventTime: "18:00",
            venue: "Grand Ballroom Hotel Mulia, Jakarta",
            packageName: "Paket Luxury Resepsi",
            totalAmount: 3000000,
            paymentStatus: "pending",
            notes: "Tema resepsi modern elegant dengan warna gold dan putih"
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

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'client',
      message: chatMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');
    
    // Simulasi auto-reply dari admin
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        sender: 'admin',
        message: 'Terima kasih atas pesannya! Admin kami akan segera merespons.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleDownloadInvoice = (eventIndex) => {
    // Simulasi download invoice
    alert(`Download invoice untuk ${client.events[eventIndex].packageName}`);
  };

  const handleContactWhatsApp = () => {
    const phone = '6281234567890'; // Nomor admin
    const message = `Halo, saya ${client.name}. Saya ingin bertanya tentang acara saya.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleContactWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 flex items-center gap-3 transition-colors"
            >
              <Icon name="MessageCircle" size={24} />
              <div className="text-left">
                <p className="font-semibold">Hubungi Admin</p>
                <p className="text-xs opacity-90">via WhatsApp</p>
              </div>
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-lg p-4 flex items-center gap-3 transition-colors"
            >
              <Icon name="MessageSquare" size={24} />
              <div className="text-left">
                <p className="font-semibold">Chat Admin</p>
                <p className="text-xs opacity-90">Kirim pesan</p>
              </div>
            </button>
            <button
              onClick={() => window.print()}
              className="bg-secondary hover:bg-secondary/90 text-white rounded-lg p-4 flex items-center gap-3 transition-colors"
            >
              <Icon name="Printer" size={24} />
              <div className="text-left">
                <p className="font-semibold">Cetak</p>
                <p className="text-xs opacity-90">Print halaman ini</p>
              </div>
            </button>
          </div>
          {/* Ringkasan Pembayaran */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Ringkasan Pembayaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Detail Acara
            </h2>
            <div className="space-y-4">
              {client.events.map((event, index) => (
                <div key={index} className="bg-surface rounded-lg p-4">
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
                    {event.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
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
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Riwayat Pembayaran
            </h2>
            {client.paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {client.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
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
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-heading font-bold text-foreground mb-4">
              Riwayat Komunikasi
            </h2>
            {client.communicationLog.length > 0 ? (
              <div className="space-y-3">
                {client.communicationLog.map((comm, index) => (
                  <div key={index} className="p-3 bg-surface rounded-lg">
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

        {/* Floating Chat Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
            aria-label="Buka chat"
          >
            <Icon name="MessageCircle" size={24} />
            {chatHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {chatHistory.filter(m => m.sender === 'admin').length}
              </span>
            )}
          </button>
        )}

        {/* Chat Box */}
        {isChatOpen && (
          <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-card border border-border rounded-lg shadow-2xl z-50 flex flex-col max-h-[600px]">
            {/* Chat Header */}
            <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="Headphones" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Admin Support</p>
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="MessageSquare" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    Mulai percakapan dengan admin
                  </p>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'client'
                          ? 'bg-primary text-white'
                          : 'bg-card border border-border text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'client' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-card rounded-b-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
                >
                  <Icon name="Send" size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientPortal;
