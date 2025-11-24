import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { dispatchStorageEvent, STORAGE_EVENTS } from '../../utils/storageEvents';

const PaymentMethodManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('payment_methods');
    return saved ? JSON.parse(saved) : [
      { id: 'transfer', name: 'Transfer Bank', icon: 'Building' },
      { id: 'cash', name: 'Tunai', icon: 'Banknote' },
      { id: 'ewallet', name: 'E-Wallet', icon: 'Smartphone' },
      { id: 'debit', name: 'Kartu Debit', icon: 'CreditCard' }
    ];
  });

  const [newMethod, setNewMethod] = useState({ name: '', icon: 'CreditCard' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', icon: '' });

  const iconOptions = [
    'CreditCard', 'Banknote', 'Building', 'Smartphone', 
    'Wallet', 'DollarSign', 'QrCode', 'Coins'
  ];

  useEffect(() => {
    localStorage.setItem('payment_methods', JSON.stringify(paymentMethods));
    dispatchStorageEvent(STORAGE_EVENTS.PAYMENT_METHODS_UPDATED, paymentMethods);
  }, [paymentMethods]);

  const handleAddMethod = (e) => {
    e.preventDefault();
    if (newMethod.name.trim()) {
      const id = newMethod.name.toLowerCase().replace(/\s+/g, '_');
      if (!paymentMethods.find(pm => pm.id === id)) {
        setPaymentMethods([...paymentMethods, { 
          id, 
          name: newMethod.name.trim(),
          icon: newMethod.icon 
        }]);
        setNewMethod({ name: '', icon: 'CreditCard' });
      }
    }
  };

  const handleDeleteMethod = (id) => {
    if (window.confirm(`Hapus metode pembayaran ini?`)) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    }
  };

  const handleEditStart = (method) => {
    setEditingId(method.id);
    setEditData({ name: method.name, icon: method.icon });
  };

  const handleEditSave = (id) => {
    if (editData.name.trim()) {
      setPaymentMethods(paymentMethods.map(pm => 
        pm.id === id ? { ...pm, name: editData.name.trim(), icon: editData.icon } : pm
      ));
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({ name: '', icon: '' });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CreditCard" size={20} color="var(--color-primary)" />
        <h3 className="font-bold text-lg text-foreground">Metode Pembayaran</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Kelola metode pembayaran yang tersedia untuk klien
      </p>

      <form onSubmit={handleAddMethod} className="mb-4">
        <div className="flex gap-2">
          <select
            value={newMethod.icon}
            onChange={(e) => setNewMethod({ ...newMethod, icon: e.target.value })}
            className="px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {iconOptions.map(icon => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
          <input
            type="text"
            value={newMethod.name}
            onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
            className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Metode pembayaran baru..."
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-smooth flex items-center justify-center"
          >
            <Icon name="Plus" size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {paymentMethods.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada metode pembayaran. Tambahkan metode pembayaran pertama Anda.
          </p>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
              {editingId === method.id ? (
                <>
                  <select
                    value={editData.icon}
                    onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                    className="p-2 rounded border border-input bg-background"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="flex-1 p-2 rounded border border-input bg-background"
                    required
                  />
                  <button
                    onClick={() => handleEditSave(method.id)}
                    className="p-2 text-success hover:bg-success/10 rounded"
                  >
                    <Icon name="Check" size={18} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="p-2 text-muted-foreground hover:bg-muted rounded"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Icon name={method.icon} size={18} />
                  <span className="flex-1">{method.name}</span>
                  <button
                    onClick={() => handleEditStart(method)}
                    className="p-1 text-primary hover:bg-primary/10 rounded"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded"
                  >
                    <Icon name="Trash" size={16} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodManagement;
