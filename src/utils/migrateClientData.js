// Script untuk migrasi data klien dari mock ke dataStore
import { dataStore } from './dataStore';

/**
 * Migrasi data mock klien ke dataStore
 */
export const migrateClientMockData = () => {
  const existingClients = dataStore.getClients();
  
  // Jika sudah ada data, jangan overwrite
  if (existingClients.length > 0) {
    console.log('✅ Data klien sudah ada di dataStore:', existingClients.length, 'klien');
    return { success: true, count: existingClients.length, message: 'Data sudah ada' };
  }

  // Data mock untuk migrasi
  const mockClients = [
    {
      id: 'client-1',
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
          message: "Halo Kak Siti, ini reminder untuk fitting makeup besok jam 14:00 di studio ya. Mohon konfirmasi kehadirannya."
        }
      ]
    },
    {
      id: 'client-2',
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
        }
      ],
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
        }
      ],
      communicationLog: [
        {
          type: "outgoing",
          date: "2025-11-18",
          subject: "Pengingat Acara",
          message: "Halo Kak Dewi, tinggal 10 hari lagi ya untuk acara resepsinya. Sudah siap semua?"
        }
      ]
    },
    {
      id: 'client-3',
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
        }
      ],
      paymentHistory: [],
      communicationLog: [
        {
          type: "incoming",
          date: "2025-11-05",
          subject: "Booking Wisuda",
          message: "Kak, mau booking untuk makeup wisuda tanggal 20 Desember. Masih available?"
        }
      ]
    }
  ];

  // Simpan ke dataStore
  try {
    mockClients.forEach(client => {
      dataStore.setClients([...dataStore.getClients(), client]);
    });

    console.log('✅ Berhasil migrasi', mockClients.length, 'klien ke dataStore');
    return { 
      success: true, 
      count: mockClients.length, 
      message: `Berhasil migrasi ${mockClients.length} klien` 
    };
  } catch (error) {
    console.error('❌ Gagal migrasi data:', error);
    return { 
      success: false, 
      count: 0, 
      message: error.message 
    };
  }
};

/**
 * Load data klien dengan fallback ke mock data
 */
export const loadClientsWithFallback = () => {
  let clients = dataStore.getClients();
  
  // Jika tidak ada data, gunakan mock data
  if (clients.length === 0) {
    console.log('⚠️ Tidak ada data di dataStore, menggunakan mock data');
    const result = migrateClientMockData();
    if (result.success) {
      clients = dataStore.getClients();
    }
  }
  
  return clients;
};

/**
 * Reset data klien (untuk testing)
 */
export const resetClientData = () => {
  if (window.confirm('⚠️ Apakah Anda yakin ingin reset semua data klien? Ini tidak bisa dibatalkan!')) {
    dataStore.setClients([]);
    console.log('✅ Data klien berhasil di-reset');
    return true;
  }
  return false;
};

/**
 * Export data klien untuk backup
 */
export const backupClientData = () => {
  const clients = dataStore.getClients();
  const backup = {
    timestamp: new Date().toISOString(),
    count: clients.length,
    data: clients
  };
  
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `client-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  console.log('✅ Backup berhasil di-download');
  return backup;
};

/**
 * Import data klien dari backup
 */
export const importClientData = (backupData) => {
  try {
    if (!backupData.data || !Array.isArray(backupData.data)) {
      throw new Error('Format backup tidak valid');
    }
    
    if (window.confirm(`Import ${backupData.count} klien dari backup tanggal ${new Date(backupData.timestamp).toLocaleDateString('id-ID')}?`)) {
      dataStore.setClients(backupData.data);
      console.log('✅ Berhasil import', backupData.count, 'klien');
      return { success: true, count: backupData.count };
    }
    
    return { success: false, message: 'Import dibatalkan' };
  } catch (error) {
    console.error('❌ Gagal import data:', error);
    return { success: false, message: error.message };
  }
};

// Export untuk digunakan di console browser
if (typeof window !== 'undefined') {
  window.clientDataMigration = {
    migrate: migrateClientMockData,
    load: loadClientsWithFallback,
    reset: resetClientData,
    backup: backupClientData,
    import: importClientData
  };
  
  console.log('💡 Client data migration tools available at: window.clientDataMigration');
}
