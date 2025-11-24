 
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
    const { user, signOut } = useAuth();
    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('user_profile');
        return saved ? JSON.parse(saved) : {
            name: '',
            email: '',
            contact: '',
            address: '',
            city: '',
            website: '',
            instagram: '',
            logoUrl: '',
            signatureUrl: '',
            bankName: '',
            bankAccount: '',
            bankAccountName: ''
        };
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedData, setSavedData] = useState(null);

    useEffect(() => {
        localStorage.setItem('user_profile', JSON.stringify(profileData));
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsEditing(false);
            setIsSaving(false);
        }, 500);
    };

    const handleEdit = () => {
        setSavedData({ ...profileData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (savedData) {
            setProfileData(savedData);
        }
        setSavedData(null);
        setIsEditing(false);
    };

    return (
        <>
            <Helmet>
                <title>Profil - MUA Finance Manager</title>
            </Helmet>
            <div className="min-h-screen bg-background">
                <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon name="User" size={24} color="var(--color-primary)" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                                    Profil Saya
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Kelola informasi akun dan bisnis Anda
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden border-2 border-primary/20">
                                    {profileData.logoUrl ? (
                                        <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon name="User" size={32} color="var(--color-primary)" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-heading font-bold text-foreground mb-1">
                                        {profileData.name || user?.email || 'Nama Bisnis'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">Makeup Artist Professional</p>
                                    {profileData.email && (
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <Icon name="Mail" size={12} />
                                            {profileData.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="default"
                                            onClick={handleCancel}
                                            className="flex-1 sm:flex-none"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="default"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-none"
                                        >
                                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="default"
                                        size="default"
                                        iconName="Edit"
                                        iconPosition="left"
                                        onClick={handleEdit}
                                        className="w-full sm:w-auto"
                                    >
                                        Edit Profil
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Icon name="User" size={18} color="var(--color-primary)" />
                                    Informasi Pribadi
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Email Akun
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                <Icon name="Mail" size={18} color="var(--color-muted-foreground)" />
                                            </div>
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-muted text-muted-foreground"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Nama Lengkap / Bisnis *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                }`}
                                                placeholder="Nama Bisnis MUA Anda"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Email Bisnis
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                }`}
                                                placeholder="email@bisnis.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Kontak WhatsApp *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Icon name="Phone" size={18} color="var(--color-muted-foreground)" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="contact"
                                                    value={profileData.contact || ''}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                        !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                    }`}
                                                    placeholder="08xxxxxxxxxx"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Kota
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Icon name="MapPin" size={18} color="var(--color-muted-foreground)" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={profileData.city || ''}
                                                    onChange={handleChange}
                                                    readOnly={!isEditing}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                        !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                    }`}
                                                    placeholder="Jakarta"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Alamat Lengkap
                                        </label>
                                        <textarea
                                            name="address"
                                            value={profileData.address || ''}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            rows={3}
                                            className={`w-full px-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                                                !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                            }`}
                                            placeholder="Alamat studio atau kantor"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-base font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Icon name="Globe" size={18} color="var(--color-primary)" />
                                    Media Sosial & Website
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Website / Portfolio
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                <Icon name="Globe" size={18} color="var(--color-muted-foreground)" />
                                            </div>
                                            <input
                                                type="url"
                                                name="website"
                                                value={profileData.website || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                }`}
                                                placeholder="https://website-anda.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Instagram
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                <Icon name="Instagram" size={18} color="var(--color-muted-foreground)" />
                                            </div>
                                            <input
                                                type="text"
                                                name="instagram"
                                                value={profileData.instagram || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                }`}
                                                placeholder="@username_instagram"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-base font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Icon name="Image" size={18} color="var(--color-primary)" />
                                    Branding
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <ImageUpload
                                            label="Logo Bisnis"
                                            value={profileData.logoUrl || ''}
                                            onChange={(base64) => setProfileData({ ...profileData, logoUrl: base64 })}
                                            disabled={!isEditing}
                                            maxSize={2}
                                            showPreview={true}
                                        />
                                    </div>
                                    <div>
                                        <ImageUpload
                                            label="Tanda Tangan"
                                            value={profileData.signatureUrl || ''}
                                            onChange={(base64) => setProfileData({ ...profileData, signatureUrl: base64 })}
                                            disabled={!isEditing}
                                            maxSize={1}
                                            showPreview={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-base font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Icon name="CreditCard" size={18} color="var(--color-primary)" />
                                    Informasi Bank
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Nama Bank
                                            </label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={profileData.bankName || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                }`}
                                                placeholder="BCA, Mandiri, BNI, dll"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Nomor Rekening
                                            </label>
                                            <input
                                                type="text"
                                                name="bankAccount"
                                                value={profileData.bankAccount || ''}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                                }`}
                                                placeholder="1234567890"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Nama Pemilik Rekening
                                        </label>
                                        <input
                                            type="text"
                                            name="bankAccountName"
                                            value={profileData.bankAccountName || ''}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            className={`w-full px-4 py-3 rounded-xl border border-input transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                                                !isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background text-foreground'
                                            }`}
                                            placeholder="Nama sesuai rekening bank"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-base font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Icon name="Link" size={18} color="var(--color-primary)" />
                                    Link Publik untuk Klien
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Bagikan link ini kepada klien agar mereka bisa melihat paket layanan dan melakukan booking secara langsung.
                                    </p>
                                    
                                    {/* Link Paket Layanan */}
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-2">
                                            Link Paket Layanan
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={`${window.location.origin}/packages/public`}
                                                    readOnly
                                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-input bg-muted text-foreground font-mono text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/packages/public`);
                                                        alert('Link paket layanan berhasil disalin!');
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-lg transition-smooth"
                                                    title="Salin link"
                                                >
                                                    <Icon name="Copy" size={18} color="var(--color-primary)" />
                                                </button>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="default"
                                                iconName="ExternalLink"
                                                iconPosition="left"
                                                onClick={() => window.open('/packages/public', '_blank')}
                                            >
                                                Buka
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Link Form Booking */}
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-2">
                                            Link Form Booking Langsung
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={`${window.location.origin}/booking/public`}
                                                    readOnly
                                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-input bg-muted text-foreground font-mono text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/booking/public`);
                                                        alert('Link booking berhasil disalin!');
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-lg transition-smooth"
                                                    title="Salin link"
                                                >
                                                    <Icon name="Copy" size={18} color="var(--color-primary)" />
                                                </button>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="default"
                                                iconName="ExternalLink"
                                                iconPosition="left"
                                                onClick={() => window.open('/booking/public', '_blank')}
                                            >
                                                Buka
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                                        <div className="flex items-start gap-3">
                                            <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium text-foreground mb-1">Tips Penggunaan:</p>
                                                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                                                    <li><strong>Link Paket Layanan:</strong> Klien bisa melihat semua paket dan langsung booking</li>
                                                    <li><strong>Link Form Booking:</strong> Klien langsung ke form booking tanpa melihat paket</li>
                                                    <li>Bagikan via WhatsApp, Instagram, atau media sosial lainnya</li>
                                                    <li>Pastikan paket layanan sudah diatur di menu Service Packages</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="destructive"
                                        size="lg"
                                        onClick={() => {
                                            if (window.confirm('Apakah Anda yakin ingin keluar?')) {
                                                signOut();
                                            }
                                        }}
                                        className="w-full"
                                    >
                                        <Icon name="LogOut" size={20} className="mr-2" />
                                        Keluar dari Akun
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Profile;
