import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SendReminderModal = ({ lead, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    method: 'whatsapp',
    templateId: '',
    message: '',
    customMessage: false
  });

  const [templates, setTemplates] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('whatsapp_templates');
    const allTemplates = saved ? JSON.parse(saved) : [];
    setTemplates(allTemplates);
  }, []);

  const reminderMethodOptions = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' }
  ];

  const templateOptions = [
    { value: '', label: 'Pilih Template' },
    ...templates.map(t => ({
      value: t.id.toString(),
      label: `${t.name} ${t.category === 'payment' ? '💰' : t.category === 'followup' ? '📞' : '💬'}`
    })),
    { value: 'custom', label: '✏️ Tulis Pesan Manual' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'templateId') {
      if (value === 'custom') {
        setFormData(prev => ({ ...prev, customMessage: true, message: '' }));
      } else if (value) {
        const template = templates.find(t => t.id.toString() === value);
        if (template) {
          let message = template.content
            .replace(/\[Nama\]/g, lead?.name || '')
            .replace(/\[Tanggal\]/g, new Date().toLocaleDateString('id-ID'))
            .replace(/\[Jumlah\]/g, '0');
          setFormData(prev => ({ ...prev, customMessage: false, message }));
        }
      } else {
        setFormData(prev => ({ ...prev, customMessage: false, message: '' }));
      }
    }
    
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.method) {
      newErrors.method = 'Pilih metode pengingat';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Pesan tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        leadId: lead?.id
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="
          w-full max-w-lg bg-card border border-border rounded-2xl
          elevation-12 max-h-[90vh] overflow-y-auto
        "
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-lg font-heading font-bold text-foreground">
              Kirim Pengingat
            </h2>
            <button
              onClick={onClose}
              className="
                w-8 h-8 rounded-lg flex items-center justify-center
                text-muted-foreground hover:text-foreground hover:bg-muted
                transition-smooth
              "
              aria-label="Tutup"
            >
              <Icon name="X" size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Lead Info */}
          <div className="p-3 rounded-lg bg-surface border border-border">
            <p className="text-sm font-caption text-muted-foreground mb-1">
              Kepada
            </p>
            <p className="text-base font-heading font-semibold text-foreground mb-2">
              {lead?.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Icon name="Phone" size={14} />
              <span>{lead?.phone}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-caption text-muted-foreground">
                Status
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                lead?.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                lead?.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                lead?.status === 'Interested' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' :
                'bg-gray-100 text-gray-700'
              }`}>
                {lead?.status === 'New' ? 'Baru' :
                 lead?.status === 'Contacted' ? 'Dihubungi' :
                 lead?.status === 'Interested' ? 'Tertarik' : lead?.status}
              </span>
            </div>
          </div>

          {/* Method Selection */}
          <Select
            label="Metode Pengingat"
            options={reminderMethodOptions}
            value={formData?.method}
            onChange={(value) => handleInputChange('method', value)}
            error={errors?.method}
            required
          />

          {/* Template Selection */}
          <Select
            label="Template Pesan"
            options={templateOptions}
            value={formData?.templateId}
            onChange={(value) => handleInputChange('templateId', value)}
          />

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pesan {formData.customMessage && <span className="text-error">*</span>}
            </label>
            <textarea
              value={formData?.message}
              onChange={(e) => handleInputChange('message', e?.target?.value)}
              placeholder={formData.customMessage ? "Tulis pesan Anda..." : "Pilih template untuk melihat pesan"}
              rows={8}
              disabled={!formData.customMessage && !formData.templateId}
              className={`
                w-full px-3 py-2 rounded-lg
                bg-surface border ${errors?.message ? 'border-error' : 'border-border'}
                text-sm text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                transition-smooth resize-none
                ${(!formData.customMessage && !formData.templateId) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            {errors?.message && (
              <p className="text-xs text-error mt-1">{errors?.message}</p>
            )}
            {formData.templateId && !formData.customMessage && (
              <p className="text-xs text-muted-foreground mt-1">
                💡 Anda bisa edit pesan sebelum mengirim
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
              className="flex-1"
            >
              Kirim Pengingat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendReminderModal;
