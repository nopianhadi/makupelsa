import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ImageUpload from '../../../components/ui/ImageUpload';

const AddTeamMemberModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Senior MUA',
    email: '',
    phone: '',
    specialties: [],
    avatar: ''
  });

  const [errors, setErrors] = useState({});

  const roleOptions = ['Lead MUA', 'Senior MUA', 'Junior MUA', 'Assistant'];
  const specialtyOptions = ['Bridal', 'Traditional', 'Modern', 'Party', 'Editorial', 'Natural'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => {
      const specialties = prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      role: 'Senior MUA',
      email: '',
      phone: '',
      specialties: [],
      avatar: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Tambah Anggota Tim</h2>
          <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="Sarah Wijaya"
            />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role/Posisi *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="sarah@example.com"
            />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nomor Telepon *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md"
              placeholder="081234567890"
            />
            {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
          </div>

          <ImageUpload
            label="Foto Profil (opsional)"
            value={formData.avatar}
            onChange={(base64) => setFormData({ ...formData, avatar: base64 })}
            maxSize={2}
            showPreview={true}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Spesialisasi
            </label>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map(specialty => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.specialties.includes(specialty)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Tambah Anggota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
