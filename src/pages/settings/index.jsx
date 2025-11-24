import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import StatusManagement from './StatusManagement';
import CategoryManagement from './CategoryManagement';
import IncomeCategoryManagement from './IncomeCategoryManagement';
import ServiceTypeManagement from './ServiceTypeManagement';
import PaymentMethodManagement from './PaymentMethodManagement';
import { dataStore } from '../../utils/dataStore';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    const [emailNotifications, setEmailNotifications] = useState(() => {
        return localStorage.getItem('emailNotifications') !== 'false';
    });
    const [whatsappNotifications, setWhatsappNotifications] = useState(() => {
        return localStorage.getItem('whatsappNotifications') !== 'false';
    });

    // Aplikasi dark mode
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleToggleEmailNotifications = () => {
        const newValue = !emailNotifications;
        setEmailNotifications(newValue);
        localStorage.setItem('emailNotifications', newValue);
        alert(newValue ? 'Email notifikasi diaktifkan' : 'Email notifikasi dinonaktifkan');
    };

    const handleToggleWhatsappNotifications = () => {
        const newValue = !whatsappNotifications;
        setWhatsappNotifications(newValue);
        localStorage.setItem('whatsappNotifications', newValue);
        alert(newValue ? 'Notifikasi WhatsApp diaktifkan' : 'Notifikasi WhatsApp dinonaktifkan');
    };

    const handleExportData = () => {
        try {
            const allData = {
                clients: dataStore.getClients(),
                invoices: dataStore.getInvoices(),
                projects: dataStore.getProjects(),
                expenses: dataStore.getExpenses(),
                bookings: dataStore.getBookings(),
                leads: dataStore.getLeads(),
                exportDate: new Date().toISOString(),
                appVersion: '1.0.0'
            };

            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mua-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('✅ Data berhasil diexpor!');
        } catch (error) {
            console.error('Export error:', error);
            alert('❌ Gagal mengexpor data: ' + error.message);
        }
    };

    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    if (window.confirm('Ini akan MENGGANTIKAN semua data Anda. Lanjutkan?')) {
                        // Restore semua data
                        if (importedData.clients) localStorage.setItem('clients', JSON.stringify(importedData.clients));
                        if (importedData.invoices) localStorage.setItem('invoices', JSON.stringify(importedData.invoices));
                        if (importedData.projects) localStorage.setItem('projects', JSON.stringify(importedData.projects));
                        if (importedData.expenses) localStorage.setItem('expenses', JSON.stringify(importedData.expenses));
                        if (importedData.bookings) localStorage.setItem('bookings', JSON.stringify(importedData.bookings));
                        if (importedData.leads) localStorage.setItem('leads', JSON.stringify(importedData.leads));
                        
                        alert('✅ Data berhasil diimpor! Halaman akan direload.');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    alert('❌ Format file tidak valid: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handleDeleteAllData = () => {
        if (window.confirm('⚠️ Ini akan MENGHAPUS SEMUA data Anda. Yakin?')) {
            if (window.confirm('Konfirmasi terakhir: Ketik "HAPUS" untuk melanjutkan')) {
                try {
                    // Hapus semua localStorage
                    localStorage.clear();
                    alert('✅ Semua data berhasil dihapus! Halaman akan direload.');
                    window.location.reload();
                } catch (error) {
                    console.error('Delete error:', error);
                    alert('❌ Gagal menghapus data: ' + error.message);
                }
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Pengaturan - MUA Finance Manager</title>
            </Helmet>
            <div className="min-h-screen bg-background">
                <main className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 lg:pb-6">
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon name="Settings" size={18} sm:size={18} sm:size={24} color="var(--color-primary)" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground">
                                    Pengaturan
                                </h1>
                                <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                                    Sesuaikan preferensi aplikasi Anda
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ServiceTypeManagement />
                        
                        <IncomeCategoryManagement />
                        
                        <CategoryManagement />
                        
                        <PaymentMethodManagement />
                        
                        <StatusManagement />

                        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="Palette" size={16} sm:size={16} sm:size={16} sm:size={20} color="var(--color-primary)" />
                                <h3 className="font-bold text-lg">Tampilan</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                                    <div className="flex items-center gap-3">
                                        <Icon name="Moon" size={18} color="var(--color-foreground)" />
                                        <div>
                                            <p className="font-medium text-foreground">Mode Gelap</p>
                                            <p className="text-xs text-muted-foreground">Aktifkan tema gelap</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleToggleDarkMode}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-primary' : 'bg-muted'}`}
                                        aria-label="Toggle dark mode"
                                    >
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${darkMode ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="Bell" size={16} sm:size={16} sm:size={16} sm:size={20} color="var(--color-primary)" />
                                <h3 className="font-bold text-lg">Notifikasi</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                                    <div className="flex items-center gap-3">
                                        <Icon name="Mail" size={18} color="var(--color-foreground)" />
                                        <div>
                                            <p className="font-medium text-foreground">Email Notifikasi</p>
                                            <p className="text-xs text-muted-foreground">Terima notifikasi via email</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleToggleEmailNotifications}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${emailNotifications ? 'bg-primary' : 'bg-muted'}`}
                                        aria-label="Toggle email notifications"
                                    >
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${emailNotifications ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                                    <div className="flex items-center gap-3">
                                        <Icon name="MessageSquare" size={18} color="var(--color-foreground)" />
                                        <div>
                                            <p className="font-medium text-foreground">Notifikasi WhatsApp</p>
                                            <p className="text-xs text-muted-foreground">Pengingat pembayaran via WA</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleToggleWhatsappNotifications}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${whatsappNotifications ? 'bg-primary' : 'bg-muted'}`}
                                        aria-label="Toggle WhatsApp notifications"
                                    >
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${whatsappNotifications ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="Database" size={16} sm:size={16} sm:size={16} sm:size={20} color="var(--color-primary)" />
                                <h3 className="font-bold text-lg">Data & Penyimpanan</h3>
                            </div>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleExportData}
                                    className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-smooth"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon name="Download" size={18} color="var(--color-foreground)" />
                                        <div className="text-left">
                                            <p className="font-medium text-foreground">Ekspor Data</p>
                                            <p className="text-xs text-muted-foreground">Download semua data ke file JSON</p>
                                        </div>
                                    </div>
                                    <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" />
                                </button>
                                <button 
                                    onClick={handleImportData}
                                    className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-smooth"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon name="Upload" size={18} color="var(--color-foreground)" />
                                        <div className="text-left">
                                            <p className="font-medium text-foreground">Impor Data</p>
                                            <p className="text-xs text-muted-foreground">Restore data dari file backup</p>
                                        </div>
                                    </div>
                                    <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" />
                                </button>
                                <button 
                                    onClick={handleDeleteAllData}
                                    className="w-full flex items-center justify-between p-3 bg-destructive/10 rounded-xl border border-destructive/20 hover:bg-destructive/20 transition-smooth"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon name="Trash2" size={18} color="var(--color-destructive)" />
                                        <div className="text-left">
                                            <p className="font-medium text-destructive">Hapus Semua Data</p>
                                            <p className="text-xs text-destructive/70">Reset aplikasi ke pengaturan awal</p>
                                        </div>
                                    </div>
                                    <Icon name="ChevronRight" size={18} color="var(--color-destructive)" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Settings;
