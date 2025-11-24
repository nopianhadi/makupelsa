import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { dataStore } from '../../../utils/dataStore';

const InvoiceListModal = ({ client, onClose, onCreateInvoice }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const allInvoices = dataStore.getInvoices() || [];
    const clientInvoices = allInvoices.filter(inv => inv.clientId === client.id);
    setInvoices(clientInvoices);
  }, [client.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'sent':
        return 'bg-warning/10 text-warning';
      case 'overdue':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Lunas';
      case 'sent':
        return 'Terkirim';
      case 'overdue':
        return 'Jatuh Tempo';
      default:
        return 'Draft';
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePrintInvoice = (invoice) => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Invoice - {client.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Riwayat invoice untuk klien ini
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateInvoice}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth flex items-center gap-2"
            >
              <Icon name="Plus" size={18} />
              <span className="text-sm font-medium">Buat Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">
                Belum Ada Invoice
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Buat invoice pertama untuk klien ini
              </p>
              <button
                onClick={onCreateInvoice}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth inline-flex items-center gap-2"
              >
                <Icon name="Plus" size={18} />
                <span className="text-sm font-medium">Buat Invoice</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-border rounded-xl p-4 hover:bg-muted/40 transition-smooth"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-bold text-foreground">
                          {invoice.invoiceNumber}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tanggal:</span>
                          <span className="ml-2 text-foreground">{invoice.date}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jatuh Tempo:</span>
                          <span className="ml-2 text-foreground">{invoice.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(invoice.grandTotal || 0)}
                      </p>
                    </div>
                  </div>

                  {invoice.items && invoice.items.length > 0 && (
                    <div className="mb-3 p-3 bg-muted/40 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Item:</p>
                      <div className="space-y-1">
                        {invoice.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.description} x{item.quantity}
                            </span>
                            <span className="text-foreground font-medium">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                              }).format(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-smooth flex items-center justify-center gap-2"
                    >
                      <Icon name="Eye" size={16} />
                      Lihat Detail
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(invoice)}
                      className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-smooth flex items-center justify-center gap-2"
                    >
                      <Icon name="Printer" size={16} />
                      Cetak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Detail Invoice
                </h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Invoice Number</p>
                      <p className="text-lg font-mono font-bold text-foreground">
                        {selectedInvoice.invoiceNumber}
                      </p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusLabel(selectedInvoice.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Invoice</p>
                      <p className="text-base font-medium text-foreground">{selectedInvoice.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                      <p className="text-base font-medium text-foreground">{selectedInvoice.dueDate}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-3">Item Invoice</p>
                    <div className="space-y-2">
                      {selectedInvoice.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between p-3 bg-muted/40 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.description}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0
                            }).format(item.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <span className="text-sm font-medium text-foreground">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(selectedInvoice.subtotal || 0)}
                      </span>
                    </div>
                    {selectedInvoice.tax > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Pajak</span>
                        <span className="text-sm font-medium text-foreground">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(selectedInvoice.tax)}
                        </span>
                      </div>
                    )}
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Diskon</span>
                        <span className="text-sm font-medium text-success">
                          -{new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(selectedInvoice.discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-base font-bold text-foreground">Total</span>
                      <span className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(selectedInvoice.grandTotal || 0)}
                      </span>
                    </div>
                  </div>

                  {selectedInvoice.notes && (
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Catatan</p>
                      <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceListModal;
