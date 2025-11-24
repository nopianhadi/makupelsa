import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { dataStore } from '../../../utils/dataStore';
import { updateClientPaymentStatus } from '../../../utils/paymentSync';
import { nanoid } from 'nanoid';

const RecordPaymentClientModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'Transfer Bank BCA',
    description: 'Pembayaran',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payment = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      description: formData.description,
      method: formData.method
    };

    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const invoiceNumber = `INV-${Date.now()}-${nanoid(4)}`;
    
    const invoiceData = {
      invoiceNumber,
      date: formData.date,
      dueDate: formData.date,
      client: client?.name,
      clientId: client?.id,
      items: [{
        description: formData.description || 'Layanan Makeup',
        quantity: 1,
        amount: parseFloat(formData.amount),
        serviceType: client.events?.[0]?.serviceType || 'other'
      }],
      subtotal: parseFloat(formData.amount),
      tax: 0,
      discount: 0,
      grandTotal: parseFloat(formData.amount),
      notes: '',
      status: 'paid',
      paymentMethod: formData.method,
      logoUrl: profile?.logoUrl || '',
      signatureUrl: profile?.signatureUrl || '',
      businessName: profile?.name || '',
      businessContact: profile?.contact || '',
      businessEmail: profile?.email || '',
      businessAddress: profile?.address || '',
      bankName: profile?.bankName || '',
      bankAccount: profile?.bankAccount || '',
      bankAccountName: profile?.bankAccountName || '',
      createdAt: formData.date
    };

    const savedInvoice = dataStore.addInvoice(invoiceData);

    if (client?.id) {
      const clients = dataStore.getClients();
      const existingClient = clients.find(c => c.id === client.id);
      
      if (existingClient) {
        const newPayment = {
          date: formData.date,
          amount: parseFloat(formData.amount),
          description: formData.description,
          method: formData.method,
          invoiceNumber: invoiceNumber,
          invoiceId: savedInvoice.id
        };
        
        const updatedPaymentHistory = [
          ...(existingClient.paymentHistory || []),
          newPayment
        ];
        
        dataStore.updateClient(client.id, {
          paymentHistory: updatedPaymentHistory
        });
        
        updateClientPaymentStatus(client.id);
      }
    }

    window.dispatchEvent(new CustomEvent('paymentRecorded', { 
      detail: { 
        clientId: client?.id, 
        amount: parseFloat(formData.amount),
        invoiceNumber: invoiceNumber 
      } 
    }));
    
    onSave(payment);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-md p-3 sm:p-4 lg:p-6 elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Catat Pembayaran
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Dari {client?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Jumlah Pembayaran (Rp)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tanggal
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Metode Pembayaran
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Transfer Bank BCA">Transfer Bank BCA</option>
              <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
              <option value="Transfer Bank BNI">Transfer Bank BNI</option>
              <option value="Transfer Bank BRI">Transfer Bank BRI</option>
              <option value="Cash">Cash</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Keterangan
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Contoh: DP Pembayaran"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentClientModal;
