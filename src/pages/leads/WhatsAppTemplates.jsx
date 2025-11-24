import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

const WhatsAppTemplates = () => {
    const [templates, setTemplates] = useState(() => {
        const saved = localStorage.getItem('whatsapp_templates');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Salam Pembuka', category: 'general', content: 'Halo [Nama], terima kasih sudah menghubungi kami. Ada yang bisa kami bantu untuk rencana makeup Anda?' },
            { id: 2, name: 'Follow Up Prospek', category: 'followup', content: 'Halo [Nama], bagaimana kabar Anda? Apakah masih berminat dengan layanan makeup kami?' },
            { id: 3, name: 'Konfirmasi Booking', category: 'general', content: 'Halo [Nama], ini konfirmasi untuk booking makeup pada tanggal [Tanggal]. Mohon segera melakukan DP ya.' },
            { id: 4, name: '💰 Kirim Pengingat DP', category: 'payment', content: '🔔 *PENGINGAT PEMBAYARAN DP*\n\nHalo Kak [Nama],\n\nIni pengingat untuk pembayaran DP sebesar *Rp [Jumlah]* untuk booking tanggal *[Tanggal]*.\n\nMohon segera melakukan pembayaran agar slot tetap terjaga ya kak 🙏\n\nTerima kasih! 💕' },
            { id: 5, name: '💰 Kirim Pengingat Pelunasan', category: 'payment', content: '🔔 *PENGINGAT PELUNASAN*\n\nHalo Kak [Nama],\n\nMengingatkan untuk pelunasan pembayaran sebesar *Rp [Jumlah]* untuk acara tanggal *[Tanggal]*.\n\nMohon dilunasi H-3 sebelum acara ya kak 🙏\n\nTerima kasih! 💕' },
            { id: 6, name: '⚠️ Kirim Pengingat Pembayaran Tertunda', category: 'payment', content: '⚠️ *PENGINGAT PEMBAYARAN TERTUNDA*\n\nHalo Kak [Nama],\n\nKami ingin mengingatkan bahwa pembayaran untuk booking Anda masih tertunda.\n\nMohon segera melakukan pembayaran agar tidak terjadi pembatalan otomatis.\n\nJika ada kendala, silakan hubungi kami ya kak 🙏\n\nTerima kasih!' },
            { id: 7, name: '✅ Kirim Pengingat H-7', category: 'payment', content: '📅 *PENGINGAT H-7*\n\nHalo Kak [Nama],\n\n7 hari lagi menuju acara Anda pada tanggal *[Tanggal]*! 🎉\n\nPastikan pelunasan sudah dilakukan ya kak.\n\nSampai jumpa! 💕' },
            { id: 8, name: '✅ Kirim Pengingat H-1', category: 'payment', content: '⏰ *PENGINGAT H-1*\n\nHalo Kak [Nama],\n\nBesok adalah hari spesial Anda! 🎉\n\nPastikan semua sudah siap ya kak.\nKami akan datang tepat waktu.\n\nSampai jumpa besok! 💕✨' }
        ];
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    useEffect(() => {
        localStorage.setItem('whatsapp_templates', JSON.stringify(templates));
    }, [templates]);

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTemplate = {
            id: currentTemplate ? currentTemplate.id : Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            content: formData.get('content')
        };

        if (currentTemplate) {
            setTemplates(templates.map(t => t.id === currentTemplate.id ? newTemplate : t));
        } else {
            setTemplates([...templates, newTemplate]);
        }
        setIsEditing(false);
        setCurrentTemplate(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus template ini?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const [filterCategory, setFilterCategory] = useState('all');

    const filteredTemplates = templates.filter(t => 
        filterCategory === 'all' || t.category === filterCategory
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold">Template WhatsApp</h2>
                    <p className="text-sm text-muted-foreground">Kelola template pesan untuk prospek dan pembayaran</p>
                </div>
                <button
                    onClick={() => { setCurrentTemplate(null); setIsEditing(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    <Icon name="Plus" size={18} />
                    Tambah Template
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                        filterCategory === 'all' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Semua ({templates.length})
                </button>
                <button
                    onClick={() => setFilterCategory('general')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                        filterCategory === 'general' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Umum ({templates.filter(t => t.category === 'general').length})
                </button>
                <button
                    onClick={() => setFilterCategory('followup')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                        filterCategory === 'followup' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Follow Up ({templates.filter(t => t.category === 'followup').length})
                </button>
                <button
                    onClick={() => setFilterCategory('payment')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                        filterCategory === 'payment' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Pembayaran ({templates.filter(t => t.category === 'payment').length})
                </button>
            </div>

            {isEditing && (
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <h3 className="font-bold mb-4">{currentTemplate ? 'Edit Template' : 'Template Baru'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Template</label>
                            <input
                                name="name"
                                defaultValue={currentTemplate?.name}
                                required
                                className="w-full p-2 rounded border border-input bg-background"
                                placeholder="Contoh: Follow Up Tertarik"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Kategori</label>
                            <select
                                name="category"
                                defaultValue={currentTemplate?.category || 'general'}
                                className="w-full p-2 rounded border border-input bg-background"
                            >
                                <option value="general">Umum</option>
                                <option value="followup">Follow Up</option>
                                <option value="payment">Pembayaran</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Isi Pesan</label>
                            <textarea
                                name="content"
                                defaultValue={currentTemplate?.content}
                                required
                                rows="4"
                                className="w-full p-2 rounded border border-input bg-background"
                                placeholder="Gunakan [Nama] untuk nama otomatis..."
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Variabel tersedia: [Nama], [Tanggal], [Jumlah]
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 rounded border border-input hover:bg-muted"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {filteredTemplates.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                        Tidak ada template dalam kategori ini
                    </div>
                ) : (
                    filteredTemplates.map(template => (
                        <div key={template.id} className="p-4 bg-card border border-border rounded-lg relative group">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setCurrentTemplate(template); setIsEditing(true); }}
                                    className="p-1.5 hover:bg-muted rounded text-blue-500"
                                >
                                    <Icon name="Edit" size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="p-1.5 hover:bg-muted rounded text-red-500"
                                >
                                    <Icon name="Trash" size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold">{template.name}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    template.category === 'payment' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                                    template.category === 'followup' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                    {template.category === 'payment' ? 'Pembayaran' :
                                     template.category === 'followup' ? 'Follow Up' : 'Umum'}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{template.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WhatsAppTemplates;
