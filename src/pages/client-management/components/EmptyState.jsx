import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onAddClient }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Icon name="Users" size={48} color="var(--color-primary)" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-heading font-bold text-foreground mb-2 text-center">
        Belum Ada Klien
      </h3>
      
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        Mulai tambahkan klien pertama Anda untuk mengelola layanan makeup dan pembayaran dengan lebih mudah
      </p>
      
      <Button
        variant="default"
        size="lg"
        iconName="Plus"
        iconPosition="left"
        onClick={onAddClient}
      >
        Tambah Klien Pertama
      </Button>
    </div>
  );
};

export default EmptyState;