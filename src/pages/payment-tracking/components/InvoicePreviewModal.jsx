import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoicePreviewModal = ({ invoice, onClose, onDownload }) => {
  if (!invoice) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Preview Invoice
          </h2>
          <div className="flex items-center gap-2">
            {onDownload && (
              <Button
                variant="outline"
                size="default"
                iconName="Download"
                onClick={onDownload}
              >
                Download PDF
              </Button>
            )}
            <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
          </div>
        </div>

        <div className="p-8" id="invoice-content">
          {/* Header dengan Logo */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              {/* Logo */}
              {invoice.logoUrl && (
                <div className="flex-shrink-0">
                  <img 
                    src={invoice.logoUrl} 
                    alt="Logo" 
                    className="h-16 w-16 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Info Bisnis */}
              <div>
                {invoice.businessName && (
                  <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                    {invoice.businessName}
                  </h1>
                )}
                {invoice.businessAddress && (
                  <p className="text-sm text-muted-foreground mb-1">{invoice.businessAddress}</p>
                )}
                {invoice.businessContact && (
                  <p className="text-sm text-muted-foreground mb-1">
                    <Icon name="Phone" size={14} className="inline mr-1" />
                    {invoice.businessContact}
                  </p>
                )}
                {invoice.businessEmail && (
                  <p className="text-sm text-muted-foreground">
                    <Icon name="Mail" size={14} className="inline mr-1" />
                    {invoice.businessEmail}
                  </p>
                )}
              </div>
            </div>
            
            {/* Invoice Info */}
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-heading font-bold text-primary mb-2">INVOICE</div>
              <div className="text-sm text-muted-foreground">
                <p className="font-mono font-bold text-foreground">{invoice.invoiceNumber}</p>
                <p>Tanggal: {formatDate(invoice.date)}</p>
                {invoice.dueDate && <p>Jatuh Tempo: {formatDate(invoice.dueDate)}</p>}
              </div>
            </div>
          </div>

          {/* Info Klien */}
          <div className="mb-8 p-4 bg-muted/30 rounded-xl">
            <p className="text-xs font-medium text-muted-foreground mb-2">KEPADA:</p>
            <p className="text-lg font-heading font-bold text-foreground">{invoice.client}</p>
          </div>

          {/* Tabel Item */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-foreground">Deskripsi</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-foreground w-20">Qty</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-foreground w-32">Harga</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-foreground w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-2 text-sm text-foreground">{item.description}</td>
                    <td className="py-3 px-2 text-sm text-center text-foreground">{item.quantity}</td>
                    <td className="py-3 px-2 text-sm text-right text-foreground font-mono">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-foreground font-mono font-semibold">
                      {formatCurrency(item.amount * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono text-foreground">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Pajak:</span>
                  <span className="font-mono text-foreground">{formatCurrency(invoice.tax)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Diskon:</span>
                  <span className="font-mono text-success">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-border">
                <span className="font-bold text-foreground">TOTAL:</span>
                <span className="font-mono font-bold text-xl text-primary">
                  {formatCurrency(invoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Pembayaran */}
          {(invoice.bankName || invoice.paymentMethod) && (
            <div className="mb-8 p-4 bg-muted/30 rounded-xl">
              <p className="text-xs font-medium text-muted-foreground mb-3">INFORMASI PEMBAYARAN:</p>
              {invoice.paymentMethod && (
                <div className="mb-2">
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">Metode: </span>
                    {invoice.paymentMethod === 'cash' ? 'Tunai' :
                     invoice.paymentMethod === 'transfer' ? 'Transfer Bank' :
                     invoice.paymentMethod === 'qris' ? 'QRIS' :
                     invoice.paymentMethod === 'ewallet' ? 'E-Wallet' : invoice.paymentMethod}
                  </span>
                </div>
              )}
              {invoice.paymentReference && (
                <div className="mb-2">
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">Referensi: </span>
                    {invoice.paymentReference}
                  </span>
                </div>
              )}
              {invoice.bankName && (
                <>
                  <div className="mb-2">
                    <span className="text-sm text-foreground">
                      <span className="font-semibold">Bank: </span>
                      {invoice.bankName}
                    </span>
                  </div>
                  {invoice.bankAccount && (
                    <div className="mb-2">
                      <span className="text-sm text-foreground">
                        <span className="font-semibold">No. Rekening: </span>
                        <span className="font-mono">{invoice.bankAccount}</span>
                      </span>
                    </div>
                  )}
                  {invoice.bankAccountName && (
                    <div>
                      <span className="text-sm text-foreground">
                        <span className="font-semibold">Atas Nama: </span>
                        {invoice.bankAccountName}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Status Pembayaran */}
          {invoice.status === 'paid' && (
            <div className="mb-8 p-4 bg-success/10 border border-success/20 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 text-success">
                <Icon name="CheckCircle2" size={20} />
                <span className="font-bold">LUNAS</span>
              </div>
              <p className="text-xs text-success/80 mt-1">
                Pembayaran telah diterima pada {formatDate(invoice.date)}
              </p>
            </div>
          )}

          {/* Catatan */}
          {invoice.notes && (
            <div className="mb-8">
              <p className="text-xs font-medium text-muted-foreground mb-2">CATATAN:</p>
              <p className="text-sm text-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Tanda Tangan */}
          <div className="flex justify-end mt-12">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Hormat kami,</p>
              {invoice.signatureUrl ? (
                <div className="mb-4">
                  <img 
                    src={invoice.signatureUrl} 
                    alt="Tanda Tangan" 
                    className="h-20 object-contain mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div style={{ display: 'none' }} className="h-20 flex items-center justify-center text-muted-foreground text-xs">
                    [Tanda Tangan]
                  </div>
                </div>
              ) : (
                <div className="h-20 mb-4 flex items-center justify-center text-muted-foreground text-xs">
                  [Tanda Tangan]
                </div>
              )}
              <div className="border-t border-border pt-2">
                <p className="text-sm font-semibold text-foreground">{invoice.businessName || 'Nama Bisnis'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
