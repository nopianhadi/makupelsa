import React, { useState, useEffect } from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { subscribeToStorageEvent, STORAGE_EVENTS } from '../../../utils/storageEvents';

const ExpenseEntryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    vendor: '',
    paymentMethod: '',
    transactionDate: new Date()?.toISOString()?.split('T')?.[0],
    receiptUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);

  const loadCategories = () => {
    const savedCategories = localStorage.getItem('expense_categories');
    const categories = savedCategories ? JSON.parse(savedCategories) : [
      { id: 'cosmetics', name: 'Pembelian Kosmetik' },
      { id: 'salary', name: 'Gaji Asisten' },
      { id: 'transport', name: 'Biaya Transportasi' },
      { id: 'equipment', name: 'Peralatan Makeup' },
      { id: 'marketing', name: 'Marketing & Promosi' },
      { id: 'other', name: 'Lainnya' }
    ];
    setCategoryOptions([
      { value: '', label: 'Pilih Kategori Pengeluaran' },
      ...categories.map(cat => ({ value: cat.id, label: cat.name }))
    ]);
  };

  const loadPaymentMethods = () => {
    const savedMethods = localStorage.getItem('payment_methods');
    const methods = savedMethods ? JSON.parse(savedMethods) : [
      { id: 'transfer', name: 'Transfer Bank' },
      { id: 'cash', name: 'Tunai' },
      { id: 'ewallet', name: 'E-Wallet' },
      { id: 'debit', name: 'Kartu Debit' }
    ];
    setPaymentMethodOptions([
      { value: '', label: 'Pilih Metode Pembayaran' },
      ...methods.map(method => ({ value: method.id, label: method.name }))
    ]);
  };

  useEffect(() => {
    loadCategories();
    loadPaymentMethods();

    const unsubscribeCategories = subscribeToStorageEvent(
      STORAGE_EVENTS.EXPENSE_CATEGORIES_UPDATED,
      loadCategories
    );
    const unsubscribeMethods = subscribeToStorageEvent(
      STORAGE_EVENTS.PAYMENT_METHODS_UPDATED,
      loadPaymentMethods
    );

    return () => {
      unsubscribeCategories();
      unsubscribeMethods();
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (categoryOptions.length <= 1) {
      newErrors.category = 'Belum ada kategori pengeluaran. Tambahkan kategori di Pengaturan terlebih dahulu.';
    } else if (!formData?.category) {
      newErrors.category = 'Kategori pengeluaran wajib dipilih';
    }
    
    if (!formData?.description?.trim()) newErrors.description = 'Deskripsi wajib diisi';
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Jumlah pengeluaran harus lebih dari 0';
    }
    
    if (paymentMethodOptions.length <= 1) {
      newErrors.paymentMethod = 'Belum ada metode pembayaran. Tambahkan metode di Pengaturan terlebih dahulu.';
    } else if (!formData?.paymentMethod) {
      newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';
    }
    
    if (!formData?.transactionDate) newErrors.transactionDate = 'Tanggal transaksi wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData?.amount)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Kategori Pengeluaran"
        options={categoryOptions}
        value={formData?.category}
        onChange={(value) => handleChange('category', value)}
        error={errors?.category}
        required
        disabled={categoryOptions.length <= 1}
      />
      <Input
        label="Deskripsi Pengeluaran"
        type="text"
        placeholder="Contoh: Pembelian lipstik MAC Ruby Woo"
        value={formData?.description}
        onChange={(e) => handleChange('description', e?.target?.value)}
        error={errors?.description}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Jumlah Pengeluaran (IDR)"
          type="number"
          placeholder="0"
          value={formData?.amount}
          onChange={(e) => handleChange('amount', e?.target?.value)}
          error={errors?.amount}
          required
        />

        <Input
          label="Vendor/Toko (Opsional)"
          type="text"
          placeholder="Nama toko atau vendor"
          value={formData?.vendor}
          onChange={(e) => handleChange('vendor', e?.target?.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Metode Pembayaran"
          options={paymentMethodOptions}
          value={formData?.paymentMethod}
          onChange={(value) => handleChange('paymentMethod', value)}
          error={errors?.paymentMethod}
          required
          disabled={paymentMethodOptions.length <= 1}
        />

        <Input
          label="Tanggal Transaksi"
          type="date"
          value={formData?.transactionDate}
          onChange={(e) => handleChange('transactionDate', e?.target?.value)}
          error={errors?.transactionDate}
          required
        />
      </div>
      <Input
        label="URL Bukti Pembayaran (Opsional)"
        type="url"
        placeholder="https://example.com/receipt.jpg"
        value={formData?.receiptUrl}
        onChange={(e) => handleChange('receiptUrl', e?.target?.value)}
        description="Link ke foto atau scan bukti pembayaran"
      />
      <Input
        label="Catatan Tambahan (Opsional)"
        type="text"
        placeholder="Catatan tambahan untuk pengeluaran ini"
        value={formData?.notes}
        onChange={(e) => handleChange('notes', e?.target?.value)}
      />
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="default"
          iconName="Save"
          iconPosition="left"
          fullWidth
          disabled={categoryOptions.length <= 1 || paymentMethodOptions.length <= 1}
        >
          Simpan Pengeluaran
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          fullWidth
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default ExpenseEntryForm;
