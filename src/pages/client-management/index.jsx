import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ClientSearchFilter from '../../components/ui/ClientSearchFilter';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ClientCard from './components/ClientCard';
import ClientDetailModal from './components/ClientDetailModal';
import AddClientModal from './components/AddClientModal';
import EmptyState from './components/EmptyState';
import EditClientModal from './components/EditClientModal';
import AddServiceModal from './components/AddServiceModal';
import RecordPaymentClientModal from './components/RecordPaymentClientModal';
import SendCommunicationModal from './components/SendCommunicationModal';
import ShareLinkModal from './components/ShareLinkModal';
import { dataStore } from '../../utils/dataStore';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    serviceType: '',
    paymentStatus: '',
    dateRange: ''
  });
  const [editModalClient, setEditModalClient] = useState(null);
  const [addServiceClient, setAddServiceClient] = useState(null);
  const [recordPaymentClient, setRecordPaymentClient] = useState(null);
  const [communicationClient, setCommunicationClient] = useState(null);
  const [shareLinkClient, setShareLinkClient] = useState(null);

  useEffect(() => {
    // Load klien dari localStorage
    const savedClients = dataStore.getClients();
    
    if (savedClients.length > 0) {
      setClients(savedClients);
      setFilteredClients(savedClients);
      return;
    }
    
    // Fallback ke mock data jika belum ada data
    const mockClients = [
    {
      id: 1,
      name: "Siti Nurhaliza",
      phone: "081234567890",
      email: "siti.nurhaliza@email.com",
      location: "Jakarta Selatan",
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_196eda338-1763293740662.png",
      profileImageAlt: "Professional headshot of Indonesian woman with long black hair wearing elegant white hijab and soft makeup",
      isActive: true,
      totalEvents: 2,
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
        notes: "Klien menginginkan makeup natural dengan hijab syar\'i"
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
      }],

      paymentHistory: [
      {
        date: "2025-11-01",
        amount: 1500000,
        description: "DP Paket Akad",
        method: "Transfer Bank BCA"
      }],

      communicationLog: [
      {
        type: "outgoing",
        date: "2025-11-15",
        subject: "Konfirmasi Jadwal Fitting",
        message: "Halo Kak Siti, ini reminder untuk fitting makeup besok jam 14:00 di studio ya. Mohon konfirmasi kehadirannya."
      },
      {
        type: "incoming",
        date: "2025-11-10",
        subject: "Pertanyaan Paket",
        message: "Kak, untuk paket resepsi bisa include makeup untuk ibu dan adik juga ga?"
      }]

    },
    {
      id: 2,
      name: "Dewi Lestari",
      phone: "082345678901",
      email: "dewi.lestari@email.com",
      location: "Bandung",
      profileImage: "https://images.unsplash.com/photo-1634707532461-9b3e863742a5",
      profileImageAlt: "Smiling Indonesian woman with shoulder-length wavy hair wearing modern hijab in soft pink color",
      isActive: true,
      totalEvents: 1,
      totalAmount: 4000000,
      paymentStatus: "paid",
      events: [
      {
        serviceType: "resepsi",
        eventDate: "2025-11-28",
        eventTime: "17:00",
        venue: "Gedung Sasana Budaya Ganesha, Bandung",
        packageName: "Paket Premium Resepsi",
        totalAmount: 4000000,
        paymentStatus: "paid",
        notes: "Makeup tema tradisional Sunda dengan sentuhan modern"
      }],

      paymentHistory: [
      {
        date: "2025-10-15",
        amount: 2000000,
        description: "DP Paket Resepsi",
        method: "Transfer Bank Mandiri"
      },
      {
        date: "2025-11-10",
        amount: 2000000,
        description: "Pelunasan Paket Resepsi",
        method: "Transfer Bank Mandiri"
      }],

      communicationLog: [
      {
        type: "outgoing",
        date: "2025-11-18",
        subject: "Pengingat Acara",
        message: "Halo Kak Dewi, tinggal 10 hari lagi ya untuk acara resepsinya. Sudah siap semua?"
      }]

    },
    {
      id: 3,
      name: "Rina Wijaya",
      phone: "083456789012",
      location: "Surabaya",
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_180de54c0-1763299047583.png",
      profileImageAlt: "Young Indonesian woman with straight black hair and natural makeup wearing casual white blouse",
      isActive: false,
      totalEvents: 1,
      totalAmount: 1500000,
      paymentStatus: "pending",
      events: [
      {
        serviceType: "wisuda",
        eventDate: "2025-12-20",
        eventTime: "07:00",
        venue: "Universitas Airlangga, Surabaya",
        packageName: "Paket Basic Wisuda",
        totalAmount: 1500000,
        paymentStatus: "pending",
        notes: "Makeup fresh dan tahan lama untuk acara outdoor"
      }],

      paymentHistory: [],
      communicationLog: [
      {
        type: "incoming",
        date: "2025-11-05",
        subject: "Booking Wisuda",
        message: "Kak, mau booking untuk makeup wisuda tanggal 20 Desember. Masih available?"
      }]

    },
    {
      id: 4,
      name: "Ayu Kartika",
      phone: "084567890123",
      email: "ayu.kartika@email.com",
      location: "Yogyakarta",
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_196eda338-1763293740662.png",
      profileImageAlt: "Indonesian woman with long black hair in elegant bun wearing traditional kebaya with intricate embroidery",
      isActive: true,
      totalEvents: 1,
      totalAmount: 6000000,
      paymentStatus: "partial",
      events: [
      {
        serviceType: "resepsi",
        eventDate: "2026-01-10",
        eventTime: "19:00",
        venue: "The Royal Ambarrukmo Hotel, Yogyakarta",
        packageName: "Paket Luxury Resepsi",
        totalAmount: 6000000,
        paymentStatus: "partial",
        notes: "Makeup tema Jawa klasik dengan paes ageng lengkap"
      }],

      paymentHistory: [
      {
        date: "2025-11-20",
        amount: 3000000,
        description: "DP 50% Paket Luxury",
        method: "Transfer Bank BNI"
      }],

      communicationLog: [
      {
        type: "outgoing",
        date: "2025-11-20",
        subject: "Konfirmasi Pembayaran DP",
        message: "Terima kasih Kak Ayu atas pembayaran DP-nya. Booking sudah dikonfirmasi untuk tanggal 10 Januari 2026."
      }]

    },
    {
      id: 5,
      name: "Maya Anggraini",
      phone: "085678901234",
      location: "Semarang",
      profileImage: "https://images.unsplash.com/photo-1661744142577-a08e356a3a08",
      profileImageAlt: "Indonesian woman with medium-length wavy hair wearing modern hijab in pastel blue with delicate makeup",
      isActive: false,
      totalEvents: 1,
      totalAmount: 2500000,
      paymentStatus: "overdue",
      events: [
      {
        serviceType: "akad",
        eventDate: "2025-11-25",
        eventTime: "08:00",
        venue: "Masjid Agung Jawa Tengah, Semarang",
        packageName: "Paket Standard Akad",
        totalAmount: 2500000,
        paymentStatus: "overdue",
        notes: "Makeup hijab syar\'i dengan warna soft pink"
      }],

      paymentHistory: [
      {
        date: "2025-10-20",
        amount: 1000000,
        description: "DP Paket Akad",
        method: "Transfer Bank BRI"
      }],

      communicationLog: [
      {
        type: "outgoing",
        date: "2025-11-21",
        subject: "Pengingat Pembayaran",
        message: "Halo Kak Maya, ini reminder untuk pelunasan pembayaran ya. Acara sudah dekat nih."
      }]

    },
    {
      id: 6,
      name: "Putri Maharani",
      phone: "086789012345",
      email: "putri.maharani@email.com",
      location: "Malang",
      profileImage: "https://images.unsplash.com/photo-1622329295873-6c20a7d0bf8d",
      profileImageAlt: "Young Indonesian woman with short bob haircut wearing graduation gown with bright smile and natural makeup",
      isActive: true,
      totalEvents: 1,
      totalAmount: 1500000,
      paymentStatus: "paid",
      events: [
      {
        serviceType: "wisuda",
        eventDate: "2025-12-05",
        eventTime: "06:30",
        venue: "Universitas Brawijaya, Malang",
        packageName: "Paket Basic Wisuda",
        totalAmount: 1500000,
        paymentStatus: "paid",
        notes: "Makeup natural untuk foto wisuda outdoor dan indoor"
      }],

      paymentHistory: [
      {
        date: "2025-11-15",
        amount: 1500000,
        description: "Pembayaran Lunas Paket Wisuda",
        method: "Transfer Bank BCA"
      }],

      communicationLog: [
      {
        type: "incoming",
        date: "2025-11-12",
        subject: "Booking Wisuda",
        message: "Kak, mau booking makeup wisuda untuk tanggal 5 Desember. Bisa?"
      }]

    }];

    // Simpan mock data ke localStorage jika belum ada
    const clientsWithPortalId = mockClients.map(client => ({
      ...client,
      portalId: client.portalId || `demo-${client.id}` // Generate demo portalId
    }));
    
    dataStore.setClients(clientsWithPortalId);
    
    setClients(clientsWithPortalId);
    setFilteredClients(clientsWithPortalId);
  }, []);

  useEffect(() => {
    let filtered = [...clients];

    if (searchQuery) {
      filtered = filtered?.filter((client) =>
      client?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      client?.phone?.includes(searchQuery) ||
      client?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    if (activeFilters?.serviceType) {
      filtered = filtered?.filter((client) =>
      client?.events?.some((event) => event?.serviceType === activeFilters?.serviceType)
      );
    }

    if (activeFilters?.paymentStatus) {
      filtered = filtered?.filter((client) =>
      client?.paymentStatus === activeFilters?.paymentStatus
      );
    }

    if (activeFilters?.dateRange) {
      const today = new Date();
      filtered = filtered?.filter((client) => {
        const eventDate = new Date(client.events[0]?.eventDate);

        switch (activeFilters?.dateRange) {
          case 'today':
            return eventDate?.toDateString() === today?.toDateString();
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return eventDate >= today && eventDate <= weekFromNow;
          case 'month':
            return eventDate?.getMonth() === today?.getMonth() &&
            eventDate?.getFullYear() === today?.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredClients(filtered);
  }, [searchQuery, activeFilters, clients]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditModalClient(client);
  };

  const handleAddService = (client) => {
    setAddServiceClient(client);
  };

  const handleSendReminder = (client) => {
    setCommunicationClient(client);
  };

  const handleSaveClient = (clientData) => {
    const clientToSave = {
      ...clientData,
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_16febe95c-1763295744648.png",
      profileImageAlt: "Professional headshot of Indonesian woman with elegant makeup and modern hijab",
      isActive: true,
      totalEvents: 1,
      totalAmount: parseFloat(clientData?.totalAmount),
      paymentStatus: clientData?.downPayment ? 'partial' : 'pending',
      events: [
      {
        serviceType: clientData?.serviceType,
        eventDate: clientData?.eventDate,
        eventTime: clientData?.eventTime,
        venue: clientData?.venue,
        packageName: clientData?.packageId,
        totalAmount: parseFloat(clientData?.totalAmount),
        paymentStatus: clientData?.downPayment ? 'partial' : 'pending',
        notes: clientData?.notes
      }],
      paymentHistory: clientData?.downPayment ? [
      {
        date: new Date()?.toISOString()?.split('T')?.[0],
        amount: parseFloat(clientData?.downPayment),
        description: "DP Pembayaran",
        method: "Transfer Bank"
      }] :
      [],
      communicationLog: []
    };

    // Simpan ke dataStore (otomatis generate portalId)
    const newClient = dataStore.addClient(clientToSave);
    
    // Update state lokal
    setClients((prev) => [newClient, ...prev]);
    
    // Tampilkan notifikasi dengan link portal
    const portalLink = `${window.location.origin}/portal-klien/${newClient.portalId}`;
    console.log('✅ Portal klien berhasil dibuat:', portalLink);
    
    // Optional: Show alert with portal link
    alert(`Klien berhasil ditambahkan!\n\nLink Portal Klien:\n${portalLink}\n\nSalin link ini untuk dibagikan ke klien.`);
  };

  const handleSaveEditClient = (updatedClient) => {
    // Update di dataStore
    dataStore.updateClient(updatedClient.id, updatedClient);
    
    // Update state lokal
    setClients((prev) => prev.map((client) => client.id === updatedClient.id ? updatedClient : client));
    setEditModalClient(null);
  };

  const handleSaveAddService = (newEvent) => {
    const updatedClient = {
      ...addServiceClient,
      events: [...(addServiceClient.events || []), newEvent],
      totalEvents: (addServiceClient.events?.length || 0) + 1,
      totalAmount: (addServiceClient.totalAmount || 0) + newEvent.totalAmount
    };
    
    // Update di dataStore
    dataStore.updateClient(addServiceClient.id, updatedClient);
    
    // Update state lokal
    setClients((prev) => prev.map((client) => 
      client.id === addServiceClient.id ? updatedClient : client
    ));
    setAddServiceClient(null);
  };

  const handleSaveRecordPayment = (payment) => {
    const newPaymentHistory = [...(recordPaymentClient.paymentHistory || []), payment];
    const totalPaid = newPaymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const totalAmount = recordPaymentClient.totalAmount || 0;
    
    let newPaymentStatus = 'pending';
    if (totalPaid >= totalAmount) {
      newPaymentStatus = 'paid';
    } else if (totalPaid > 0) {
      newPaymentStatus = 'partial';
    }
    
    const updatedClient = {
      ...recordPaymentClient,
      paymentHistory: newPaymentHistory,
      paymentStatus: newPaymentStatus
    };
    
    // Update di dataStore
    dataStore.updateClient(recordPaymentClient.id, updatedClient);
    
    // Update state lokal
    setClients((prev) => prev.map((client) => 
      client.id === recordPaymentClient.id ? updatedClient : client
    ));
    setRecordPaymentClient(null);
  };

  const handleSaveCommunication = (communication) => {
    setClients((prev) => prev.map((client) => {
      if (client.id === communicationClient.id) {
        return {
          ...client,
          communicationLog: [...(client.communicationLog || []), communication]
        };
      }
      return client;
    }));
    setCommunicationClient(null);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus klien ini? Data tidak dapat dikembalikan.')) {
      // Hapus dari dataStore
      dataStore.deleteClient(clientId);
      
      // Update state lokal
      setClients((prev) => prev.filter((client) => client.id !== clientId));
    }
  };

  const handleViewInvoices = (client) => {
    // TODO: Implementasi lihat invoice
    console.log('View invoices for client:', client.name);
  };

  const handleShareLink = (client) => {
    setShareLinkClient(client);
  };

  return (
    <>
      <Helmet>
        <title>Manajemen Klien - MUA Finance Manager</title>
        <meta name="description" content="Kelola database klien makeup artist dengan tracking layanan dan pembayaran lengkap" />
      </Helmet>
      <div className="min-h-screen bg-background">

        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Manajemen Klien
              </h1>
              <QuickActionButton
                label="Tambah Klien"
                icon="Plus"
                variant="primary"
                size="default"
                onClick={() => setIsAddModalOpen(true)}
                className="hidden sm:inline-flex" />

            </div>
            <p className="text-sm text-muted-foreground">
              Kelola database klien dan tracking layanan makeup
            </p>
          </div>

          <div className="mb-6">
            <ClientSearchFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              placeholder="Cari nama, nomor telepon, atau lokasi..."
              showFilters={true} />

          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredClients?.length} dari {clients?.length} klien
            </p>
            <QuickActionButton
              label="Tambah"
              icon="Plus"
              variant="primary"
              size="small"
              onClick={() => setIsAddModalOpen(true)}
              className="sm:hidden" />

          </div>

          {filteredClients?.length === 0 ?
          clients?.length === 0 ?
          <EmptyState onAddClient={() => setIsAddModalOpen(true)} /> :

          <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  Tidak Ada Hasil
                </h3>
                <p className="text-sm text-muted-foreground">
                  Coba ubah kata kunci pencarian atau filter
                </p>
              </div> :


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients?.map((client) =>
            <ClientCard
              key={client?.id}
              client={client}
              onEdit={handleEditClient}
              onAddService={handleAddService}
              onSendReminder={handleSendReminder}
              onViewInvoices={handleViewInvoices}
              onShareLink={handleShareLink}
              onDelete={handleDeleteClient}
              onClick={() => handleClientClick(client)} />

            )}
            </div>
          }
        </main>


        {isDetailModalOpen &&
        <ClientDetailModal
          client={selectedClient}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedClient(null);
          }} />

        }

        {isAddModalOpen &&
        <AddClientModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveClient} />

        }

        {editModalClient &&
        <EditClientModal
          client={editModalClient}
          onClose={() => setEditModalClient(null)}
          onSave={handleSaveEditClient} />

        }

        {addServiceClient &&
        <AddServiceModal
          client={addServiceClient}
          onClose={() => setAddServiceClient(null)}
          onSave={handleSaveAddService} />

        }

        {recordPaymentClient &&
        <RecordPaymentClientModal
          client={recordPaymentClient}
          onClose={() => setRecordPaymentClient(null)}
          onSave={handleSaveRecordPayment} />

        }

        {communicationClient &&
        <SendCommunicationModal
          client={communicationClient}
          onClose={() => setCommunicationClient(null)}
          onSave={handleSaveCommunication} />

        }

        {shareLinkClient &&
        <ShareLinkModal
          client={shareLinkClient}
          onClose={() => setShareLinkClient(null)} />

        }
      </div>
    </>);

};

export default ClientManagement;