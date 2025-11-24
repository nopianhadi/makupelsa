import React from 'react';

const QuickInsightCard = ({ clients }) => {
  // Analisis klien yang perlu follow-up
  const needsFollowUp = clients.filter(client => {
    // Klien dengan pembayaran belum lunas
    if (client.paymentStatus !== 'paid') return true;
    
    // Klien yang baru selesai dalam 3 hari (belum ada komunikasi follow-up)
    const lastEventDate = new Date(Math.max(...(client.events?.map(e => new Date(e.eventDate)) || [new Date()])));
    const daysSinceEvent = Math.floor((new Date() - lastEventDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceEvent <= 3) {
      const hasFollowUp = client.communicationLog?.some(log => {
        const logDate = new Date(log.date);
        return logDate > lastEventDate;
      });
      return !hasFollowUp;
    }
    
    return false;
  });

  // Klien dengan pembayaran overdue
  const overduePayments = clients.filter(c => c.paymentStatus === 'overdue');
  
  // Klien yang bisa diminta testimoni
  const testimonialCandidates = clients.filter(client => {
    if (client.paymentStatus !== 'paid') return false;
    
    const lastEventDate = new Date(Math.max(...(client.events?.map(e => new Date(e.eventDate)) || [new Date()])));
    const daysSinceEvent = Math.floor((new Date() - lastEventDate) / (1000 * 60 * 60 * 24));
    
    // 1-7 hari setelah event, waktu terbaik minta testimoni
    return daysSinceEvent >= 1 && daysSinceEvent <= 7;
  });

  // Potential repeat customers (klien yang puas dan sudah lama selesai)
  const repeatCustomerPotential = clients.filter(client => {
    if (client.paymentStatus !== 'paid') return false;
    
    const lastEventDate = new Date(Math.max(...(client.events?.map(e => new Date(e.eventDate)) || [new Date()])));
    const monthsSinceEvent = Math.floor((new Date() - lastEventDate) / (1000 * 60 * 60 * 24 * 30));
    
    // 1-3 bulan setelah event, waktu bagus untuk promo repeat customer
    return monthsSinceEvent >= 1 && monthsSinceEvent <= 3;
  });

  if (clients.length === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Perlu Follow-up */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">⚠️</span>
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {needsFollowUp.length}
          </span>
        </div>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Perlu Follow-up
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
          Pembayaran atau komunikasi
        </p>
      </div>

      {/* Pembayaran Overdue */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">💳</span>
          <span className="text-2xl font-bold text-red-700 dark:text-red-300">
            {overduePayments.length}
          </span>
        </div>
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          Pembayaran Overdue
        </p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Segera follow up
        </p>
      </div>

      {/* Minta Testimoni */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">⭐</span>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {testimonialCandidates.length}
          </span>
        </div>
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Minta Testimoni
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Waktu terbaik sekarang
        </p>
      </div>

      {/* Repeat Customer Potential */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">🎯</span>
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {repeatCustomerPotential.length}
          </span>
        </div>
        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
          Potensi Repeat
        </p>
        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
          Kirim promo spesial
        </p>
      </div>
    </div>
  );
};

export default QuickInsightCard;
