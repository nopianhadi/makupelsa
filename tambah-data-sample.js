// Script untuk menambahkan data sample ke halaman-halaman yang kosong
// Jalankan di browser console atau sebagai script

const sampleData = {
  // Data Testimonials
  testimonials: [
    {
      name: "Siti Nurhaliza",
      email: "siti@email.com",
      phone: "08123456789",
      rating: 5,
      message: "Pelayanan sangat memuaskan! Makeup untuk acara pernikahan saya sempurna. Tim sangat profesional dan ramah. Highly recommended!",
      service: "Paket Akad Nikah Premium",
      status: "approved",
      createdAt: new Date(2025, 10, 1).toISOString(),
      approvedAt: new Date(2025, 10, 2).toISOString()
    },
    {
      name: "Dewi Lestari",
      email: "dewi@email.com",
      phone: "08234567890",
      rating: 5,
      message: "Makeup untuk wisuda saya cantik banget! Tahan lama dan sesuai dengan yang saya mau. Terima kasih banyak!",
      service: "Paket Wisuda",
      status: "approved",
      createdAt: new Date(2025, 10, 5).toISOString(),
      approvedAt: new Date(2025, 10, 5).toISOString()
    },
    {
      name: "Rina Wijaya",
      email: "rina@email.com",
      phone: "08345678901",
      rating: 4,
      message: "Hasilnya bagus, makeup natural dan elegan. Cocok untuk acara resepsi. Pelayanan juga cepat dan tepat waktu.",
      service: "Paket Resepsi",
      status: "approved",
      createdAt: new Date(2025, 10, 10).toISOString(),
      approvedAt: new Date(2025, 10, 10).toISOString()
    },
    {
      name: "Maya Putri",
      email: "maya@email.com",
      phone: "08456789012",
      rating: 5,
      message: "Sangat puas dengan hasilnya! Makeup untuk lamaran saya terlihat fresh dan natural. Semua tamu memuji makeup saya.",
      service: "Paket Lamaran",
      status: "pending",
      createdAt: new Date(2025, 10, 20).toISOString()
    },
    {
      name: "Ayu Ting Ting",
      email: "ayu@email.com",
      phone: "08567890123",
      rating: 5,
      message: "MUA terbaik! Makeup untuk photoshoot saya sempurna. Hasilnya bagus di kamera dan tahan lama.",
      service: "Paket Photoshoot",
      status: "pending",
      createdAt: new Date(2025, 10, 22).toISOString()
    }
  ],

  // Data Service Packages
  servicePackages: [
    {
      name: "Paket Akad Nikah Premium",
      description: "Paket lengkap untuk acara akad nikah dengan makeup flawless dan tahan lama",
      serviceType: "akad",
      basePrice: 3500000,
      originalPrice: 4000000,
      duration: "4-5 jam",
      includedServices: [
        "Makeup pengantin (bride)",
        "Hairdo pengantin",
        "Aksesoris hijab/mahkota",
        "Touch up 2x",
        "Makeup ibu pengantin",
        "Free konsultasi pre-wedding"
      ],
      addOns: [
        { name: "Makeup ayah pengantin", price: 300000 },
        { name: "Makeup saudara kandung", price: 250000 },
        { name: "Paket foto dokumentasi", price: 1500000 }
      ],
      isActive: true,
      totalBookings: 15,
      totalRevenue: 52500000
    },
    {
      name: "Paket Resepsi Elegant",
      description: "Paket makeup untuk resepsi pernikahan dengan tampilan glamour dan mewah",
      serviceType: "resepsi",
      basePrice: 4500000,
      originalPrice: 5000000,
      duration: "6-8 jam",
      includedServices: [
        "Makeup pengantin (bride & groom)",
        "Hairdo pengantin",
        "Aksesoris lengkap",
        "Touch up unlimited",
        "Makeup 2 orang tua",
        "Makeup 2 penerima tamu",
        "Free trial makeup"
      ],
      addOns: [
        { name: "Makeup bridesmaid (per orang)", price: 350000 },
        { name: "Dekorasi pelaminan", price: 2000000 },
        { name: "Paket video cinematic", price: 3000000 }
      ],
      isActive: true,
      totalBookings: 22,
      totalRevenue: 99000000
    },
    {
      name: "Paket Wisuda Fresh",
      description: "Makeup natural dan fresh untuk acara wisuda, tahan lama seharian",
      serviceType: "wisuda",
      basePrice: 500000,
      originalPrice: 650000,
      duration: "2-3 jam",
      includedServices: [
        "Makeup natural/glowing",
        "Hairdo simple",
        "Free eyelash",
        "Touch up 1x"
      ],
      addOns: [
        { name: "Hairdo premium", price: 150000 },
        { name: "Makeup waterproof", price: 100000 }
      ],
      isActive: true,
      totalBookings: 45,
      totalRevenue: 22500000
    },
    {
      name: "Paket Lamaran Romantic",
      description: "Makeup soft dan romantic untuk acara lamaran yang berkesan",
      serviceType: "akad",
      basePrice: 2000000,
      originalPrice: 2500000,
      duration: "3-4 jam",
      includedServices: [
        "Makeup calon pengantin",
        "Hairdo elegant",
        "Aksesoris hijab",
        "Touch up 1x",
        "Makeup ibu"
      ],
      addOns: [
        { name: "Makeup calon mempelai pria", price: 400000 },
        { name: "Dekorasi backdrop", price: 1000000 }
      ],
      isActive: true,
      totalBookings: 18,
      totalRevenue: 36000000
    },
    {
      name: "Paket Photoshoot Professional",
      description: "Makeup khusus untuk photoshoot dengan hasil maksimal di kamera",
      serviceType: "wisuda",
      basePrice: 1500000,
      duration: "3-4 jam",
      includedServices: [
        "Makeup HD",
        "Hairdo sesuai konsep",
        "3x ganti look",
        "Touch up unlimited"
      ],
      addOns: [
        { name: "Styling wardrobe", price: 500000 },
        { name: "Makeup body painting", price: 1000000 }
      ],
      isActive: true,
      totalBookings: 12,
      totalRevenue: 18000000
    }
  ],

  // Data Bookings
  bookings: [
    {
      clientName: "Putri Ayu",
      clientPhone: "08123456789",
      clientEmail: "putri@email.com",
      serviceType: "akad",
      packageName: "Paket Akad Nikah Premium",
      eventDate: "2025-12-15",
      eventTime: "08:00",
      venue: "Gedung Serbaguna Melati, Jakarta Selatan",
      totalAmount: 3500000,
      downPayment: 1500000,
      status: "confirmed",
      notes: "Tema warna pink soft, makeup natural glowing",
      createdAt: new Date(2025, 10, 1).toISOString()
    },
    {
      clientName: "Sari Indah",
      clientPhone: "08234567890",
      clientEmail: "sari@email.com",
      serviceType: "resepsi",
      packageName: "Paket Resepsi Elegant",
      eventDate: "2025-12-20",
      eventTime: "14:00",
      venue: "Hotel Grand Ballroom, Jakarta Pusat",
      totalAmount: 4500000,
      downPayment: 2000000,
      status: "confirmed",
      notes: "Makeup glamour, tema gold & burgundy",
      createdAt: new Date(2025, 10, 5).toISOString()
    },
    {
      clientName: "Dina Mariana",
      clientPhone: "08345678901",
      clientEmail: "dina@email.com",
      serviceType: "wisuda",
      packageName: "Paket Wisuda Fresh",
      eventDate: "2025-11-30",
      eventTime: "06:00",
      venue: "Universitas Indonesia, Depok",
      totalAmount: 500000,
      downPayment: 500000,
      status: "confirmed",
      notes: "Makeup natural, tidak terlalu tebal",
      createdAt: new Date(2025, 10, 15).toISOString()
    },
    {
      clientName: "Rina Susanti",
      clientPhone: "08456789012",
      clientEmail: "rina.s@email.com",
      serviceType: "akad",
      packageName: "Paket Lamaran Romantic",
      eventDate: "2025-12-05",
      eventTime: "10:00",
      venue: "Rumah Mempelai Wanita, Tangerang",
      totalAmount: 2000000,
      downPayment: 1000000,
      status: "pending",
      notes: "Makeup soft pink, hijab syar'i",
      createdAt: new Date(2025, 10, 18).toISOString()
    },
    {
      clientName: "Maya Anggraini",
      clientPhone: "08567890123",
      clientEmail: "maya.a@email.com",
      serviceType: "wisuda",
      packageName: "Paket Photoshoot Professional",
      eventDate: "2025-12-10",
      eventTime: "09:00",
      venue: "Studio Foto Cahaya, Jakarta Barat",
      totalAmount: 1500000,
      downPayment: 750000,
      status: "pending",
      notes: "Konsep vintage, 3 look berbeda",
      createdAt: new Date(2025, 10, 20).toISOString()
    }
  ],

  // Data Leads tambahan
  leads: [
    {
      name: "Lina Marlina",
      phone: "08123456780",
      email: "lina@email.com",
      status: "New",
      source: "Instagram",
      serviceType: "akad",
      budget: "3000000-4000000",
      eventDate: "2026-01-15",
      notes: "Tertarik paket akad nikah, minta info detail",
      createdAt: new Date(2025, 10, 23).toISOString()
    },
    {
      name: "Fitri Handayani",
      phone: "08234567891",
      email: "fitri@email.com",
      status: "Contacted",
      source: "TikTok",
      serviceType: "resepsi",
      budget: "4000000-5000000",
      eventDate: "2026-02-20",
      notes: "Sudah dihubungi via WA, minta jadwal konsultasi",
      createdAt: new Date(2025, 10, 21).toISOString()
    },
    {
      name: "Nadia Putri",
      phone: "08345678902",
      email: "nadia@email.com",
      status: "Interested",
      source: "Referral",
      serviceType: "wisuda",
      budget: "500000-700000",
      eventDate: "2025-12-28",
      notes: "Sangat tertarik, sudah tanya detail paket",
      createdAt: new Date(2025, 10, 19).toISOString()
    }
  ]
};

// Function untuk menambahkan data ke localStorage
function tambahDataSample() {
  console.log("🚀 Memulai penambahan data sample...");
  
  // Tambah Testimonials
  const existingTestimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
  if (existingTestimonials.length === 0) {
    localStorage.setItem('testimonials', JSON.stringify(sampleData.testimonials));
    console.log("✅ Berhasil menambahkan", sampleData.testimonials.length, "testimonials");
  } else {
    console.log("ℹ️ Testimonials sudah ada, skip...");
  }

  // Tambah Service Packages
  const existingPackages = JSON.parse(localStorage.getItem('service_packages') || '[]');
  if (existingPackages.length === 0) {
    localStorage.setItem('service_packages', JSON.stringify(sampleData.servicePackages));
    console.log("✅ Berhasil menambahkan", sampleData.servicePackages.length, "service packages");
  } else {
    console.log("ℹ️ Service packages sudah ada, skip...");
  }

  // Tambah Bookings
  const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  if (existingBookings.length === 0) {
    localStorage.setItem('bookings', JSON.stringify(sampleData.bookings));
    console.log("✅ Berhasil menambahkan", sampleData.bookings.length, "bookings");
  } else {
    console.log("ℹ️ Bookings sudah ada, skip...");
  }

  // Tambah Leads
  const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
  const updatedLeads = [...existingLeads, ...sampleData.leads];
  localStorage.setItem('leads', JSON.stringify(updatedLeads));
  console.log("✅ Berhasil menambahkan", sampleData.leads.length, "leads baru");

  console.log("🎉 Selesai! Refresh halaman untuk melihat data baru.");
  console.log("\n📊 Ringkasan data yang ditambahkan:");
  console.log("- Testimonials:", sampleData.testimonials.length);
  console.log("- Service Packages:", sampleData.servicePackages.length);
  console.log("- Bookings:", sampleData.bookings.length);
  console.log("- Leads:", sampleData.leads.length);
}

// Jalankan function
if (typeof window !== 'undefined') {
  tambahDataSample();
} else {
  console.log("Script ini harus dijalankan di browser console");
}

// Export untuk digunakan di module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleData, tambahDataSample };
}
