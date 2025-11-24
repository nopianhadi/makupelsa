import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';

const PublicLeadForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            id: Date.now(),
            name: formData.get('name'),
            phone: formData.get('phone'),
            source: 'Website Form',
            status: 'New',
            notes: formData.get('notes'),
            date: new Date().toISOString()
        };

        // Save to localStorage (simulation of backend)
        const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
        localStorage.setItem('leads', JSON.stringify([...existingLeads, data]));

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Check" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Terima Kasih!</h2>
                    <p className="text-muted-foreground mb-6">
                        Data Anda telah kami terima. Kami akan segera menghubungi Anda.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary hover:underline"
                    >
                        Isi form lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Hubungi Kami - MUA Service</title>
            </Helmet>
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card p-6 rounded-xl shadow-lg border border-border">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Hubungi Kami</h1>
                        <p className="text-muted-foreground">
                            Silakan isi form di bawah ini untuk konsultasi layanan makeup.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full p-3 rounded-lg border border-input bg-background"
                                placeholder="Nama Anda"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full p-3 rounded-lg border border-input bg-background"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Pesan / Pertanyaan</label>
                            <textarea
                                name="notes"
                                rows="3"
                                className="w-full p-3 rounded-lg border border-input bg-background"
                                placeholder="Ceritakan kebutuhan makeup Anda..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
                        >
                            Kirim Pesan
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PublicLeadForm;
