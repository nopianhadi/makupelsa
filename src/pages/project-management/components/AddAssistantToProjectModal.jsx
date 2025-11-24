import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { dataStore } from '../../../utils/dataStore';
import { addAssistantToProject } from '../../../utils/paymentSync';

const AddAssistantToProjectModal = ({ project, onClose, onSave }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const members = dataStore.getTeamMembers().filter(m => m.status === 'active');
    setTeamMembers(members);
  }, []);

  const availableAssistants = teamMembers.filter(member => {
    const currentAssistants = project.assistants || [];
    const currentTeam = project.team || [];
    return !currentAssistants.some(a => a.id === member.id) && 
           !currentTeam.includes(member.name);
  });

  const assistantOptions = [
    { value: '', label: 'Pilih Asisten' },
    ...availableAssistants.map(member => ({
      value: member.id,
      label: `${member.name} - ${member.role}`
    }))
  ];

  const statusOptions = [
    { value: 'pending', label: 'Belum Dibayar' },
    { value: 'paid', label: 'Sudah Dibayar' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedAssistant) {
      setError('Pilih asisten terlebih dahulu');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Masukkan jumlah pembayaran yang valid');
      return;
    }

    const assistant = teamMembers.find(m => m.id === selectedAssistant);
    
    const currentAssistants = project.assistants || [];
    const updatedAssistants = [
      ...currentAssistants,
      {
        id: assistant.id,
        name: assistant.name,
        role: assistant.role,
        addedAt: new Date().toISOString(),
        paymentAmount: parseFloat(paymentAmount),
        paymentStatus: paymentStatus,
        notes: notes
      }
    ];
    
    dataStore.updateProject(project.id, { assistants: updatedAssistants });
    
    const currentTeam = project.team || [];
    if (!currentTeam.includes(assistant.name)) {
      dataStore.updateProject(project.id, { 
        team: [...currentTeam, assistant.name] 
      });
    }

    const payment = {
      projectId: project.id,
      projectTitle: project.title,
      assistantId: assistant.id,
      assistantName: assistant.name,
      amount: parseFloat(paymentAmount),
      status: paymentStatus,
      type: 'assistant_payment',
      date: new Date().toISOString(),
      description: `Pembayaran asisten untuk proyek: ${project.title}`,
      notes: notes
    };
    
    dataStore.addPayment(payment);

    window.dispatchEvent(new CustomEvent('assistantAdded', { 
      detail: { 
        projectId: project.id,
        assistantId: assistant.id,
        paymentAmount: parseFloat(paymentAmount)
      } 
    }));

    if (onSave) {
      onSave({ assistant, payment });
    }
    
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 elevation-12 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Tambah Asisten ke Proyek
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {project?.title}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {availableAssistants.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="AlertCircle" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <p className="text-muted-foreground">
              Tidak ada asisten yang tersedia. Semua anggota tim sudah ditambahkan ke proyek ini.
            </p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Tutup
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <Select
              label="Pilih Asisten"
              options={assistantOptions}
              value={selectedAssistant}
              onChange={(value) => {
                setSelectedAssistant(value);
                setError('');
              }}
              required
            />

            {selectedAssistant && (
              <div className="p-3 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {teamMembers.find(m => m.id === selectedAssistant)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {teamMembers.find(m => m.id === selectedAssistant)?.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Jumlah Pembayaran"
              type="number"
              placeholder="Masukkan jumlah pembayaran"
              value={paymentAmount}
              onChange={(e) => {
                setPaymentAmount(e.target.value);
                setError('');
              }}
              required
            />

            <Select
              label="Status Pembayaran"
              options={statusOptions}
              value={paymentStatus}
              onChange={setPaymentStatus}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
              />
            </div>

            {paymentAmount && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Total Pembayaran:
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(parseFloat(paymentAmount) || 0)}
                  </span>
                </div>
              </div>
            )}

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
                iconName="UserPlus"
                iconPosition="left"
              >
                Tambah Asisten
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAssistantToProjectModal;
