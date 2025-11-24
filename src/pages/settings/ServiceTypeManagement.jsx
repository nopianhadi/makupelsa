import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { dispatchStorageEvent, STORAGE_EVENTS } from '../../utils/storageEvents';

const ServiceTypeManagement = () => {
  const [serviceTypes, setServiceTypes] = useState(() => {
    const saved = localStorage.getItem('service_types');
    return saved ? JSON.parse(saved) : [
      { id: 'akad', name: 'Akad', icon: 'Heart' },
      { id: 'resepsi', name: 'Resepsi', icon: 'Sparkles' },
      { id: 'wisuda', name: 'Wisuda', icon: 'GraduationCap' }
    ];
  });

  const [newServiceType, setNewServiceType] = useState({ name: '', icon: 'Star' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', icon: '' });

  const iconOptions = [
    'Heart', 'Sparkles', 'GraduationCap', 'Star', 'Crown', 
    'Gift', 'Award', 'Gem', 'Palette', 'Camera', 'Music',
    'PartyPopper', 'Cake', 'Flower', 'Ring'
  ];

  useEffect(() => {
    localStorage.setItem('service_types', JSON.stringify(serviceTypes));
    dispatchStorageEvent(STORAGE_EVENTS.SERVICE_TYPES_UPDATED, serviceTypes);
  }, [serviceTypes]);

  const handleAddServiceType = (e) => {
    e.preventDefault();
    if (newServiceType.name.trim()) {
      const id = newServiceType.name.toLowerCase().replace(/\s+/g, '_');
      if (!serviceTypes.find(st => st.id === id)) {
        setServiceTypes([...serviceTypes, { 
          id, 
          name: newServiceType.name.trim(),
          icon: newServiceType.icon 
        }]);
        setNewServiceType({ name: '', icon: 'Star' });
      }
    }
  };

  const handleDeleteServiceType = (id) => {
    if (window.confirm(`Hapus jenis layanan ini?`)) {
      setServiceTypes(serviceTypes.filter(st => st.id !== id));
    }
  };

  const handleEditStart = (serviceType) => {
    setEditingId(serviceType.id);
    setEditData({ name: serviceType.name, icon: serviceType.icon });
  };

  const handleEditSave = (id) => {
    if (editData.name.trim()) {
      setServiceTypes(serviceTypes.map(st => 
        st.id === id ? { ...st, name: editData.name.trim(), icon: editData.icon } : st
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
        <Icon name="Briefcase" size={20} color="var(--color-primary)" />
        <h3 className="font-bold text-lg text-foreground">Jenis Layanan</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Kelola jenis layanan makeup yang Anda tawarkan
      </p>

      <form onSubmit={handleAddServiceType} className="mb-4">
        <div className="flex gap-2">
          <select
            value={newServiceType.icon}
            onChange={(e) => setNewServiceType({ ...newServiceType, icon: e.target.value })}
            className="px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {iconOptions.map(icon => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
          <input
            type="text"
            value={newServiceType.name}
            onChange={(e) => setNewServiceType({ ...newServiceType, name: e.target.value })}
            className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Jenis layanan baru..."
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
        {serviceTypes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada jenis layanan. Tambahkan jenis layanan pertama Anda.
          </p>
        ) : (
          serviceTypes.map((serviceType) => (
            <div key={serviceType.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
              {editingId === serviceType.id ? (
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
                    onClick={() => handleEditSave(serviceType.id)}
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
                  <Icon name={serviceType.icon} size={18} />
                  <span className="flex-1">{serviceType.name}</span>
                  <button
                    onClick={() => handleEditStart(serviceType)}
                    className="p-1 text-primary hover:bg-primary/10 rounded"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteServiceType(serviceType.id)}
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

export default ServiceTypeManagement;
