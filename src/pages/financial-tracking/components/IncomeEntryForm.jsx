import React, { useState, useEffect } from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { subscribeToStorageEvent, STORAGE_EVENTS } from '../../../utils/storageEvents';

const IncomeEntryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    serviceType: '',
    paymentType: '',
    amount: '',
    paymentMethod: '',
    transactionDate: new Date()?.toISOString()?.split('T')?.[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [serviceTypeOptions, setServiceTypeOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);

  const paymentTypeOptions = [
    { value: '', label: 'Pilih Tipe Pembayaran' },
    { value: 'dp', label: 'DP (Down Payment)' },
    { value: 'full', label: 'Pelunasan' },
    { value: 'cash', label: 'Tunai Penuh' }
  ];

  const loadServiceTypes = () => {
    const savedServiceTypes = localStorage.getItem('service_types');
    const serviceTypes = savedServiceTypes ? JSON.parse(savedServiceTypes) : [
      { id: 'akad', name: 'Akad' },
      { id: 'resepsi', name: 'Resepsi' },
      { id: 'wisuda', name: 'Wisuda' }
    ];
    setServiceTypeOptions([
      { value: '', label: 'Pilih Jenis Layanan' },
      ...serviceTypes.map(st => ({ value: st.id, label: st.name }))
    ]);
  };

  const loadPaymentMethods = () => {
    const savedMethods = localStorage.getItem('payment_methods');
    const methods = savedMethods ? JSON.parse(savedMethods) : [
      { id: 'transfer', name: 'Transfer Bank' },
      { id: 'cash', name: 'Tunai' },
      { id: 'ewallet', name: 'E-Wallet' }
    ];
    setPaymentMethodOptions([
      { value: '', label: 'Pilih Metode Pembayaran' },
      ...methods.map(method => ({ value: method.id, label: method.name }))
    ]);
  };

  useEffect(() => {
    loadServiceTypes();
    loadPaymentMethods();

    const unsubscribeServiceTypes = subscribeToStorageEvent(
      STORAGE_EVENTS.SERVICE_TYPES_UPDATED,
      loadServiceTypes
    );
    const unsubscribeMethods = subscribeToStorageEvent(
      STORAGE_EVENTS.PAYMENT_METHODS_UPDATED,
      loadPaymentMethods
    );

    return () => {
      unsubscribeServiceTypes();
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
    
    if (!formData?.clientName?.trim()) newErrors.clientName = 'Nama klien wajib diisi';
    
    if (serviceTypeOptions.length <= 1) {
      newErrors.serviceType = 'Belum ada jenis layanan. Tambahkan jenis layanan di Pengaturan terlebih dahulu.';
    } else if (!formData?.serviceType) {
      newErrors.serviceType = 'Jenis layanan wajib dipilih';
    }
    
    if (!formData?.paymentType) newErrors.paymentType = 'Tipe pembayaran wajib dipilih';
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Jumlah pembayaran harus lebih dari 0';
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
      <Input
        label="Nama Klien"
        type="text"
        placeholder="Masukkan nama klien"
        value={formData?.clientName}
        onChange={(e) => handleChange('clientName', e?.target?.value)}
        error={errors?.clientName}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Jenis Layanan"
          options={serviceTypeOptions}
          value={formData?.serviceType}
          onChange={(value) => handleChange('serviceType', value)}
          error={errors?.serviceType}
          required
          disabled={serviceTypeOptions.length <= 1}
        />

        <Select
          label="Tipe Pembayaran"
          options={paymentTypeOptions}
          value={formData?.paymentType}
          onChange={(value) => handleChange('paymentType', value)}
          error={errors?.paymentType}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Jumlah Pembayaran (IDR)"
          type="number"
          placeholder="0"
          value={formData?.amount}
          onChange={(e) => handleChange('amount', e?.target?.value)}
          error={errors?.amount}
          required
        />

        <Select
          label="Metode Pembayaran"
          options={paymentMethodOptions}
          value={formData?.paymentMethod}
          onChange={(value) => handleChange('paymentMethod', value)}
          error={errors?.paymentMethod}
          required
          disabled={paymentMethodOptions.length <= 1}
        />
      </div>
      <Input
        label="Tanggal Transaksi"
        type="date"
        value={formData?.transactionDate}
        onChange={(e) => handleChange('transactionDate', e?.target?.value)}
        error={errors?.transactionDate}
        required
      />
      <Input
        label="Catatan (Opsional)"
        type="text"
        placeholder="Tambahkan catatan transaksi"
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
          disabled={serviceTypeOptions.length <= 1 || paymentMethodOptions.length <= 1}
        >
          Simpan Pemasukan
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

export default IncomeEntryForm;
