import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MyCards = () => {
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('my_cards');
        return saved ? JSON.parse(saved) : [
            {
                id: 'cash',
                label: 'Tunai',
                balance: 2500000,
                icon: 'Banknote',
                color: 'bg-emerald-500',
                textColor: 'text-white',
                number: '**** **** **** CASH'
            },
            {
                id: 'bank',
                label: 'Bank',
                balance: 15750000,
                icon: 'CreditCard',
                color: 'bg-blue-600',
                textColor: 'text-white',
                number: '**** **** **** 4582'
            }
        ];
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        balance: '0',
        icon: 'CreditCard',
        color: 'bg-blue-600',
        number: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const colorOptions = [
        { value: 'bg-blue-600', label: 'Biru' },
        { value: 'bg-emerald-500', label: 'Hijau' },
        { value: 'bg-purple-600', label: 'Ungu' },
        { value: 'bg-pink-600', label: 'Pink' },
        { value: 'bg-orange-600', label: 'Oranye' },
        { value: 'bg-red-600', label: 'Merah' },
        { value: 'bg-indigo-600', label: 'Indigo' },
        { value: 'bg-teal-600', label: 'Teal' }
    ];

    const iconOptions = [
        'CreditCard', 'Banknote', 'Wallet', 'DollarSign', 
        'Building', 'Landmark', 'PiggyBank'
    ];

    useEffect(() => {
        localStorage.setItem('my_cards', JSON.stringify(cards));
    }, [cards]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const generateUniqueId = () => {
        return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.label.trim()) {
            errors.label = 'Nama kartu tidak boleh kosong';
        }
        
        const balance = parseFloat(formData.balance);
        if (isNaN(balance)) {
            errors.balance = 'Saldo harus berupa angka';
        } else if (balance < 0) {
            errors.balance = 'Saldo tidak boleh negatif';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCard = () => {
        setFormData({
            label: '',
            balance: '0',
            icon: 'CreditCard',
            color: 'bg-blue-600',
            number: ''
        });
        setFormErrors({});
        setShowAddModal(true);
    };

    const handleEditCard = (card) => {
        setEditingCard(card);
        setFormData({
            label: card.label,
            balance: card.balance.toString(),
            icon: card.icon,
            color: card.color,
            number: card.number
        });
        setFormErrors({});
        setShowEditModal(true);
    };

    const handleDeleteCard = (cardId) => {
        if (window.confirm('Hapus kartu ini?')) {
            setCards(cards.filter(c => c.id !== cardId));
        }
    };

    const handleSaveNewCard = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const newCard = {
            id: generateUniqueId(),
            label: formData.label.trim(),
            balance: parseFloat(formData.balance),
            icon: formData.icon,
            color: formData.color,
            textColor: 'text-white',
            number: formData.number.trim()
        };
        setCards([...cards, newCard]);
        setShowAddModal(false);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setCards(cards.map(c => 
            c.id === editingCard.id 
                ? {
                    ...c,
                    label: formData.label.trim(),
                    balance: parseFloat(formData.balance),
                    icon: formData.icon,
                    color: formData.color,
                    number: formData.number.trim()
                }
                : c
        ));
        setShowEditModal(false);
        setEditingCard(null);
    };

    const CardModal = ({ show, onClose, onSave, title }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-md"
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    <form onSubmit={onSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nama Kartu *</label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => {
                                    setFormData({ ...formData, label: e.target.value });
                                    if (formErrors.label) setFormErrors({ ...formErrors, label: '' });
                                }}
                                className={`w-full p-2 rounded border ${formErrors.label ? 'border-red-500' : 'border-input'} bg-background`}
                                placeholder="Contoh: Bank BCA"
                            />
                            {formErrors.label && <p className="text-xs text-red-500 mt-1">{formErrors.label}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Saldo *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.balance}
                                onChange={(e) => {
                                    setFormData({ ...formData, balance: e.target.value });
                                    if (formErrors.balance) setFormErrors({ ...formErrors, balance: '' });
                                }}
                                className={`w-full p-2 rounded border ${formErrors.balance ? 'border-red-500' : 'border-input'} bg-background`}
                                placeholder="0"
                            />
                            {formErrors.balance && <p className="text-xs text-red-500 mt-1">{formErrors.balance}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Nomor Kartu (Opsional)</label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                className="w-full p-2 rounded border border-input bg-background"
                                placeholder="**** **** **** 1234"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Ikon</label>
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full p-2 rounded border border-input bg-background"
                            >
                                {iconOptions.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Warna</label>
                            <select
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full p-2 rounded border border-input bg-background"
                            >
                                {colorOptions.map(color => (
                                    <option key={color.value} value={color.value}>{color.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" variant="default" fullWidth>
                                Simpan
                            </Button>
                            <Button type="button" variant="outline" fullWidth onClick={onClose}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold">Kartu Saya</h2>
                <button
                    onClick={handleAddCard}
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth text-sm"
                >
                    <Icon name="Plus" size={16} />
                    Tambah Kartu
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div key={card.id} className="relative group">
                        <div
                            className={`
                                ${card.color} ${card.textColor}
                                rounded-xl p-6 shadow-lg relative overflow-hidden
                                transition-transform hover:scale-[1.02] duration-300
                            `}
                        >
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />

                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Icon name={card.icon} size={24} className="text-white" />
                                </div>
                                <span className="font-medium tracking-wider opacity-90">{card.label}</span>
                            </div>

                            <div className="relative z-10">
                                <p className="text-sm opacity-80 mb-1">Saldo Tersedia</p>
                                <h3 className="text-2xl font-bold mb-4">{formatCurrency(card.balance)}</h3>
                                <p className="font-mono text-sm opacity-75 tracking-widest">{card.number}</p>
                            </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEditCard(card)}
                                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-md shadow-md"
                            >
                                <Icon name="Edit" size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-md shadow-md"
                            >
                                <Icon name="Trash" size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CardModal
                show={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setFormErrors({});
                }}
                onSave={handleSaveNewCard}
                title="Tambah Kartu Baru"
            />

            <CardModal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingCard(null);
                    setFormErrors({});
                }}
                onSave={handleSaveEdit}
                title="Edit Kartu"
            />
        </div>
    );
};

export default MyCards;
