import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateInvoiceModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, amount: '' }],
    tax: 0,
    discount: 0,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxAmount = (subtotal * formData.tax) / 100;
    const discountAmount = parseFloat(formData.discount) || 0;
    
    const invoice = {
      ...formData,
      client: client?.name || '',
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      grandTotal: subtotal + taxAmount - discountAmount
    };
    
    onSave(invoice);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, amount: '' }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const taxAmount = (subtotal * formData.tax) / 100;
  const discountAmount = parseFloat(formData.discount) || 0;
  const grandTotal = subtotal + taxAmount - discountAmount;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Buat Invoice
            </h2>
            {client && (
              <p className="text-sm text-muted-foreground mt-1">
                Untuk {client.name}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nomor Invoice *
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal Invoice *
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
                Jatuh Tempo *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Item *
              </label>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={addItem}
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Tambah Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Deskripsi layanan"
                    required
                    className="flex-1 px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    required
                    min="1"
                    className="w-20 px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    placeholder="Jumlah (Rp)"
                    required
                    className="w-40 px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-3 hover:bg-error/10 text-error rounded-xl transition-smooth"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pajak (%)
              </label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Diskon (Rp)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal)}
                </span>
              </div>
              {formData.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak ({formData.tax}%):</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(taxAmount)}
                  </span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diskon:</span>
                  <span className="font-medium text-success">
                    -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total:</span>
                <span className="text-primary">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catatan
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Catatan tambahan untuk invoice..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Buat Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
