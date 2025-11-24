import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

const LeadsForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        source: 'Instagram',
        status: 'New',
        notes: '',
        followUpDate: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                    {initialData ? 'Edit Prospek' : 'Tambah Prospek Baru'}
                </h2>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-muted rounded-full"
                >
                    <Icon name="X" size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded border border-input bg-background"
                        placeholder="Contoh: Sarah Amalia"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded border border-input bg-background"
                        placeholder="Contoh: 081234567890"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Sumber</label>
                        <select
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            className="w-full p-2 rounded border border-input bg-background"
                        >
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Referral">Referral</option>
                            <option value="Website">Website</option>
                            <option value="Other">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 rounded border border-input bg-background"
                        >
                            <option value="New">Baru</option>
                            <option value="Contacted">Dihubungi</option>
                            <option value="Interested">Tertarik</option>
                            <option value="Converted">Jadi Klien</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tanggal Follow Up (Opsional)</label>
                    <input
                        type="date"
                        name="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        className="w-full p-2 rounded border border-input bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Atur tanggal untuk mengingatkan follow up
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Catatan</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-2 rounded border border-input bg-background"
                        placeholder="Catatan tambahan tentang prospek..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md border border-input hover:bg-muted transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Simpan Prospek
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeadsForm;
