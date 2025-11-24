import React, { useState } from 'react';

const ManagementTipsPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tips = [
    {
      icon: '📅',
      title: 'Review Harian',
      description: 'Cek klien selesai hari ini dan follow up pembayaran pending',
      action: 'Gunakan filter "Hari Ini"'
    },
    {
      icon: '⭐',
      title: 'Minta Testimoni',
      description: 'Waktu terbaik: 1-7 hari setelah event selesai',
      action: 'Lihat Quick Insight Card'
    },
    {
      icon: '📦',
      title: 'Arsip Berkala',
      description: 'Arsipkan klien >6 bulan untuk menjaga performa',
      action: 'Klik "Kelola Arsip"'
    },
    {
      icon: '💰',
      title: 'Follow-up Pembayaran',
      description: 'Prioritas klien dengan status overdue',
      action: 'Filter by Payment Status'
    },
    {
      icon: '🎯',
      title: 'Repeat Customer',
      description: 'Kirim promo ke klien yang selesai 1-3 bulan lalu',
      action: 'Gunakan filter custom'
    },
    {
      icon: '📊',
      title: 'Analisis Bulanan',
      description: 'Export data dan review performa setiap bulan',
      action: 'Klik "Export CSV" atau "Laporan"'
    }
  ];

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-900 hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              Tips Manajemen Klien Selesai
            </h3>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {isExpanded ? 'Klik untuk tutup' : 'Klik untuk lihat tips & best practices'}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tip.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {tip.action}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-900 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Workflow Rekomendasi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Harian</p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
                      <li>• Cek klien hari ini</li>
                      <li>• Follow up payment</li>
                      <li>• Kirim terima kasih</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Mingguan</p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
                      <li>• Review minggu ini</li>
                      <li>• Minta testimoni</li>
                      <li>• Update portfolio</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Bulanan</p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
                      <li>• Analisis statistik</li>
                      <li>• Evaluasi performa</li>
                      <li>• Planning promo</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Triwulanan</p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-0.5">
                      <li>• Arsipkan klien lama</li>
                      <li>• Backup data</li>
                      <li>• Strategic planning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementTipsPanel;
