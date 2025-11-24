import React from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import StatusManagement from './StatusManagement';
import CategoryManagement from './CategoryManagement';
import IncomeCategoryManagement from './IncomeCategoryManagement';
import ServiceTypeManagement from './ServiceTypeManagement';
import PaymentMethodManagement from './PaymentMethodManagement';

const Settings = () => {
    return (
        <>
            <Helmet>
                <title>Pengaturan - MUA Finance Manager</title>
            </Helmet>
            <div className="min-h-screen bg-background">
                <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon name="Settings" size={24} color="var(--color-primary)" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                                    Pengaturan
                                </h1>
                                <p className="text-sm text-muted-foreground">
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

                        <div className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="Palette" size={20} color="var(--color-primary)" />
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
                                        className="w-12 h-6 bg-muted rounded-full relative transition-colors hover:bg-muted/80"
                                        aria-label="Toggle dark mode"
                                    >
                                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="Bell" size={20} color="var(--color-primary)" />
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
                                        className="w-12 h-6 bg-primary rounded-full relative transition-colors hover:bg-primary/90"
                                        aria-label="Toggle email notifications"
                                    >
                                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm" />
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
                                        className="w-12 h-6 bg-primary rounded-full relative transition-colors hover:bg-primary/90"
                                        aria-label="Toggle WhatsApp notifications"
                                    >
                                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="Database" size={20} color="var(--color-primary)" />
                                <h3 className="font-bold text-lg">Data & Penyimpanan</h3>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-smooth">
                                    <div className="flex items-center gap-3">
                                        <Icon name="Download" size={18} color="var(--color-foreground)" />
                                        <div className="text-left">
                                            <p className="font-medium text-foreground">Ekspor Data</p>
                                            <p className="text-xs text-muted-foreground">Download semua data ke file JSON</p>
                                        </div>
                                    </div>
                                    <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border hover:bg-muted/70 transition-smooth">
                                    <div className="flex items-center gap-3">
                                        <Icon name="Upload" size={18} color="var(--color-foreground)" />
                                        <div className="text-left">
                                            <p className="font-medium text-foreground">Impor Data</p>
                                            <p className="text-xs text-muted-foreground">Restore data dari file backup</p>
                                        </div>
                                    </div>
                                    <Icon name="ChevronRight" size={18} color="var(--color-muted-foreground)" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-destructive/10 rounded-xl border border-destructive/20 hover:bg-destructive/20 transition-smooth">
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
