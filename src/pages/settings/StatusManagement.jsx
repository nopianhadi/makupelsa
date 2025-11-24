import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

const StatusManagement = () => {
    const [leadStatuses, setLeadStatuses] = useState(() => {
        const saved = localStorage.getItem('lead_statuses');
        return saved ? JSON.parse(saved) : ['New', 'Contacted', 'Interested', 'Booked', 'Lost'];
    });

    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        localStorage.setItem('lead_statuses', JSON.stringify(leadStatuses));
    }, [leadStatuses]);

    const handleAddStatus = (e) => {
        e.preventDefault();
        if (newStatus && !leadStatuses.includes(newStatus)) {
            setLeadStatuses([...leadStatuses, newStatus]);
            setNewStatus('');
        }
    };

    const handleDeleteStatus = (status) => {
        if (window.confirm(`Hapus status "${status}"?`)) {
            setLeadStatuses(leadStatuses.filter(s => s !== status));
        }
    };

    return (
        <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Icon name="ListChecks" size={20} color="var(--color-primary)" />
                <h3 className="font-bold text-lg text-foreground">Manajemen Status Prospek</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                Kelola status untuk tracking prospek dan leads
            </p>

            <form onSubmit={handleAddStatus} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tambah status baru..."
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-smooth flex items-center justify-center"
                >
                    <Icon name="Plus" size={20} />
                </button>
            </form>

            <div className="space-y-2">
                {leadStatuses.map((status) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                        <span className="text-foreground">{status}</span>
                        <button
                            onClick={() => handleDeleteStatus(status)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-smooth"
                            aria-label="Hapus status"
                        >
                            <Icon name="Trash" size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusManagement;
