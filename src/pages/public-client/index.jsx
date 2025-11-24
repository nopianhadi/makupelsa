import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';
import { getClientPaymentSummary } from '../../utils/paymentSync';

const PublicClient = () => {
  const { publicId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientData = () => {
      const client = dataStore.getClientByPublicId(publicId);
      
      if (client) {
        // Gunakan utility untuk data yang akurat
        const summary = getClientPaymentSummary(client.id);
        
        if (summary) {
          setClientData({
            ...client,
            totalAmount: summary.totalAmount,
            paidAmount: summary.totalPaid,
            remainingAmount: summary.remainingAmount,
            paymentStatus: summary.paymentStatus,
            events: client.events?.map(event => ({
              ...event,
              totalAmount: event.totalAmount || summary.totalAmount,
              paidAmount: summary.totalPaid,
              remainingAmount: summary.remainingAmount
            }))
          });
        } else {
          // Fallback jika utility gagal
          const totalAmount = client.totalAmount || 0;
          const paidAmount = client.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;
          const remainingAmount = totalAmount - paidAmount;

          setClientData({
            ...client,
            events: client.events?.map(event => ({
              ...event,
              totalAmount: event.totalAmount || totalAmount,
              paidAmount,
              remainingAmount
            }))
          });
        }
      }
      
      setLoading(false);
    };

    setTimeout(loadClientData, 500);
  }, [publicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} color="var(--color-error)" />
          <h2 className="text-xl font-semibold text-foreground mt-4">Data tidak ditemukan</h2>
          <p className="text-muted-foreground mt-2">Link yang Anda akses tidak valid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" size={32} color="var(--color-primary)" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{clientData.name}</h1>
              <p className="text-muted-foreground">{clientData.email}</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
            Detail Acara
          </h2>
          {clientData.events.map((event, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jenis Layanan:</span>
                <span className="font-medium text-foreground capitalize">{event.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal & Waktu:</span>
                <span className="font-medium text-foreground">
                  {new Date(event.eventDate).toLocaleDateString('id-ID')} - {event.eventTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lokasi:</span>
                <span className="font-medium text-foreground">{event.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paket:</span>
                <span className="font-medium text-foreground">{event.packageName}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Status */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Wallet" size={20} color="var(--color-success)" />
            Status Pembayaran
          </h2>
          {clientData.events.map((event, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Biaya:</span>
                <span className="font-semibold text-foreground">
                  Rp {event.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sudah Dibayar:</span>
                <span className="font-semibold text-success">
                  Rp {event.paidAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sisa Pembayaran:</span>
                <span className="font-semibold text-error">
                  Rp {event.remainingAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-4">
                <div 
                  className="bg-success h-2 rounded-full"
                  style={{ width: `${(event.paidAmount / event.totalAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Payment History */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Receipt" size={20} color="var(--color-accent)" />
            Riwayat Pembayaran
          </h2>
          <div className="space-y-3">
            {clientData.paymentHistory.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{payment.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString('id-ID')} • {payment.method}
                  </div>
                </div>
                <div className="font-semibold text-success">
                  Rp {payment.amount.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicClient;
