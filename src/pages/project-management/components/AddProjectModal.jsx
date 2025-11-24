import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AddProjectModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    type: 'Pernikahan',
    status: 'upcoming',
    date: '',
    location: '',
    description: '',
    budget: '',
    paid: '',
    team: '',
    services: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      paid: parseFloat(formData.paid) || 0,
      team: formData.team.split(',').map(t => t.trim()).filter(Boolean),
      services: formData.services.split(',').map(s => s.trim()).filter(Boolean)
    };

    onSave(projectData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Tambah Proyek Baru
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Judul Proyek *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Contoh: Pernikahan Siti & Ahmad"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nama Klien *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                placeholder="Nama klien"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipe Proyek *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Pernikahan">Pernikahan</option>
                <option value="Photoshoot">Photoshoot</option>
                <option value="Wisuda">Wisuda</option>
                <option value="Prewedding">Prewedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Fashion Show">Fashion Show</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="upcoming">Akan Datang</option>
                <option value="in-progress">Sedang Berjalan</option>
                <option value="completed">Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tanggal *
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Lokasi *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Lokasi acara"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Deskripsi proyek..."
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Total Budget (Rp) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0"
                placeholder="5000000"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sudah Dibayar (Rp)
              </label>
              <input
                type="number"
                name="paid"
                value={formData.paid}
                onChange={handleChange}
                min="0"
                placeholder="1500000"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tim (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="MUA Utama, Asisten 1, Asisten 2"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Layanan (pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                placeholder="Makeup Pengantin, Hair Styling, Makeup Keluarga"
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Catatan
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Catatan khusus untuk proyek ini..."
                className="w-full px-4 py-3 bg-surface border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              <Icon name="Plus" size={20} />
              <span className="ml-2">Tambah Proyek</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
