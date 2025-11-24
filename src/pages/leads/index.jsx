 
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';
import LeadsForm from './LeadsForm';
import WhatsAppTemplates from './WhatsAppTemplates';
import SendReminderModal from './components/SendReminderModal';

const LeadSection = ({ title, description, icon, iconBg, iconColor, badgeBg, badgeColor, leads, isCollapsed, onToggle, onFollowUp, onConvert, onEdit, onDelete }) => {
    const [showAll, setShowAll] = useState(false);
    const displayLimit = 5;
    const displayedLeads = showAll ? leads : leads.slice(0, displayLimit);
    const hasMore = leads.length > displayLimit;

    return (
        <div className="mb-6">
            <div 
                className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onToggle}
            >
                <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                    <Icon name={icon} size={20} className={iconColor} />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-foreground">{title}</h2>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full ${badgeBg} ${badgeColor} text-sm font-bold`}>
                    {leads.length}
                </span>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Icon 
                        name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
                        size={20} 
                        className="text-muted-foreground"
                    />
                </button>
            </div>
            
            {!isCollapsed && (
                <div className="space-y-3">
                    {leads.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-card border border-border rounded-lg">
                            Tidak ada data
                        </div>
                    ) : (
                        <>
                            {displayedLeads.map((lead) => (
                                <LeadCard 
                                    key={lead.id} 
                                    lead={lead} 
                                    onFollowUp={onFollowUp} 
                                    onConvert={onConvert} 
                                    onEdit={onEdit} 
                                    onDelete={onDelete} 
                                />
                            ))}
                            {hasMore && (
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="w-full py-3 text-sm font-medium text-primary hover:bg-muted rounded-lg border border-border transition-colors"
                                >
                                    {showAll ? (
                                        <>
                                            <Icon name="ChevronUp" size={16} className="inline mr-1" />
                                            Tampilkan Lebih Sedikit
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="ChevronDown" size={16} className="inline mr-1" />
                                            Tampilkan {leads.length - displayLimit} Lainnya
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const LeadCard = ({ lead, onFollowUp, onConvert, onEdit, onDelete }) => {
    return (
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-bold text-base">{lead.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                        lead.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                        lead.status === 'Interested' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' :
                        lead.status === 'Converted' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                        lead.status === 'Lost' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {lead.status === 'New' ? 'Baru' :
                         lead.status === 'Contacted' ? 'Dihubungi' :
                         lead.status === 'Interested' ? 'Tertarik' :
                         lead.status === 'Converted' ? 'Jadi Klien' :
                         lead.status === 'Lost' ? 'Lost' : lead.status}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Icon name="Phone" size={14} />
                        <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Icon name="Tag" size={14} />
                        <span>{lead.source}</span>
                    </div>
                </div>
                {lead.notes && (
                    <p className="text-muted-foreground text-xs mt-2 italic line-clamp-2">
                        {lead.notes}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <button
                    onClick={() => onFollowUp(lead)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                    <Icon name="Send" size={16} />
                    <span className="hidden sm:inline">Kirim</span>
                </button>
                {lead.status !== 'Converted' && lead.status !== 'Lost' && (
                    <button
                        onClick={() => onConvert(lead)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                    >
                        <Icon name="UserCheck" size={16} />
                        <span className="hidden sm:inline">Jadi Klien</span>
                    </button>
                )}
                <button
                    onClick={() => onEdit(lead)}
                    className="p-2 hover:bg-muted rounded-lg text-blue-500 transition-colors"
                    title="Edit"
                >
                    <Icon name="Edit" size={18} />
                </button>
                <button
                    onClick={() => onDelete(lead.id)}
                    className="p-2 hover:bg-muted rounded-lg text-red-500 transition-colors"
                    title="Hapus"
                >
                    <Icon name="Trash" size={18} />
                </button>
            </div>
        </div>
    );
};

const Leads = () => {
    const [activeTab, setActiveTab] = useState('list'); // list, form, templates
    const [leads, setLeads] = useState(() => {
        const saved = localStorage.getItem('leads');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Budi Santoso', phone: '08123456789', status: 'New', source: 'Instagram', notes: '', followUpDate: null, createdAt: new Date().toISOString() },
            { id: 2, name: 'Ani Wijaya', phone: '08987654321', status: 'Contacted', source: 'Referral', notes: '', followUpDate: null, createdAt: new Date().toISOString() },
        ];
    });
    const [editingLead, setEditingLead] = useState(null);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSource, setFilterSource] = useState('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [quickDateFilter, setQuickDateFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({
        new: false,
        followup: false,
        converted: false,
        lost: true
    });

    useEffect(() => {
        localStorage.setItem('leads', JSON.stringify(leads));
    }, [leads]);

    const handleSaveLead = (leadData) => {
        if (editingLead) {
            setLeads(leads.map(l => l.id === editingLead.id ? { ...leadData, id: editingLead.id, createdAt: l.createdAt } : l));
        } else {
            setLeads([...leads, { ...leadData, id: Date.now(), createdAt: new Date().toISOString() }]);
        }
        setActiveTab('list');
        setEditingLead(null);
    };

    const handleDeleteLead = (id) => {
        if (window.confirm('Yakin ingin menghapus prospek ini?')) {
            setLeads(leads.filter(l => l.id !== id));
        }
    };

    const handleEditLead = (lead) => {
        setEditingLead(lead);
        setActiveTab('form');
    };

    const handleFollowUp = (lead) => {
        setSelectedLeadForFollowUp(lead);
        setShowFollowUpModal(true);
    };

    const handleSubmitReminder = (reminderData) => {
        if (!selectedLeadForFollowUp) return;

        if (reminderData?.method === 'whatsapp' && selectedLeadForFollowUp?.phone) {
            const phone = selectedLeadForFollowUp.phone.replace(/^0/, '62').replace(/\D/g, '');
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(reminderData.message)}`;
            window.open(url, '_blank');
        }

        // Update status to Contacted if it was New
        if (selectedLeadForFollowUp.status === 'New') {
            setLeads(leads.map(l => l.id === selectedLeadForFollowUp.id ? { ...l, status: 'Contacted' } : l));
        }

        setShowFollowUpModal(false);
        setSelectedLeadForFollowUp(null);
    };

    const copyPublicLink = () => {
        const url = `${window.location.origin}/public-lead-form`;
        navigator.clipboard.writeText(url);
        alert('Link formulir publik berhasil disalin!');
    };

    const handleConvertToClient = (lead) => {
        if (window.confirm(`Konversi ${lead.name} menjadi klien?`)) {
            // Save to clients
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const newClient = {
                id: Date.now(),
                name: lead.name,
                phone: lead.phone,
                email: '',
                address: '',
                notes: lead.notes,
                createdAt: new Date().toISOString(),
                source: lead.source
            };
            localStorage.setItem('clients', JSON.stringify([...clients, newClient]));
            
            // Update lead status
            setLeads(leads.map(l => l.id === lead.id ? { ...l, status: 'Converted' } : l));
            alert('Prospek berhasil dikonversi menjadi klien!');
        }
    };

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleQuickDateFilter = (filter) => {
        setQuickDateFilter(filter);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filter === 'today') {
            const todayStr = today.toISOString().split('T')[0];
            setFilterDateFrom(todayStr);
            setFilterDateTo(todayStr);
        } else if (filter === 'week') {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
            setFilterDateFrom(weekStart.toISOString().split('T')[0]);
            setFilterDateTo(weekEnd.toISOString().split('T')[0]);
        } else if (filter === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setFilterDateFrom(monthStart.toISOString().split('T')[0]);
            setFilterDateTo(monthEnd.toISOString().split('T')[0]);
        } else {
            setFilterDateFrom('');
            setFilterDateTo('');
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lead.phone.includes(searchQuery);
        const matchesSource = filterSource === 'all' || lead.source === filterSource;
        
        let matchesDate = true;
        if (filterDateFrom || filterDateTo) {
            const leadDate = lead.createdAt ? new Date(lead.createdAt) : new Date();
            if (filterDateFrom) {
                matchesDate = matchesDate && leadDate >= new Date(filterDateFrom);
            }
            if (filterDateTo) {
                matchesDate = matchesDate && leadDate <= new Date(filterDateTo + 'T23:59:59');
            }
        }
        
        return matchesSearch && matchesSource && matchesDate;
    });

    const getFilteredByStatus = (status) => {
        if (Array.isArray(status)) {
            return filteredLeads.filter(l => status.includes(l.status));
        }
        return filteredLeads.filter(l => l.status === status);
    };

    const sources = ['Instagram', 'TikTok', 'Facebook', 'Referral', 'Website', 'Other'];
    const activeFiltersCount = [filterSource !== 'all', filterDateFrom, filterDateTo, quickDateFilter !== 'all'].filter(Boolean).length;

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        interested: leads.filter(l => l.status === 'Interested').length,
        converted: leads.filter(l => l.status === 'Converted').length,
        lost: leads.filter(l => l.status === 'Lost').length
    };

    return (
        <>
            <Helmet>
                <title>Prospek - MUA Finance Manager</title>
            </Helmet>
            <div className="min-h-screen bg-background">
                <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Icon name="Users" size={24} color="var(--color-primary)" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                                        Prospek
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Kelola calon klien potensial Anda
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyPublicLink}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm"
                                >
                                    <Icon name="Link" size={18} />
                                    Link Publik
                                </button>
                                <QuickActionButton
                                    label="Tambah Prospek"
                                    icon="Plus"
                                    variant="primary"
                                    onClick={() => { setEditingLead(null); setActiveTab('form'); }}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-border mb-6 overflow-x-auto">
                            <button
                                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'list' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                                onClick={() => setActiveTab('list')}
                            >
                                Daftar Prospek
                            </button>
                            <button
                                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'templates' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                                onClick={() => setActiveTab('templates')}
                            >
                                Template Chat
                            </button>
                        </div>
                    </div>

                    {activeTab === 'list' && (
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                                <div className="p-4 bg-card border border-border rounded-lg">
                                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.new}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400">Baru</div>
                                </div>
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.contacted}</div>
                                    <div className="text-xs text-yellow-600 dark:text-yellow-400">Dihubungi</div>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.interested}</div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400">Tertarik</div>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.converted}</div>
                                    <div className="text-xs text-green-600 dark:text-green-400">Jadi Klien</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.lost}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Lost</div>
                                </div>
                            </div>

                            {/* Search and Filter */}
                            <div className="mb-6 space-y-3">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Cari nama atau nomor..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                            showFilters || activeFiltersCount > 0
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background border-input hover:bg-muted'
                                        }`}
                                    >
                                        <Icon name="Filter" size={18} />
                                        <span className="hidden sm:inline">Filter</span>
                                        {activeFiltersCount > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Quick Date Filters */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <button
                                        onClick={() => handleQuickDateFilter('all')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                            quickDateFilter === 'all'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}
                                    >
                                        Semua Waktu
                                    </button>
                                    <button
                                        onClick={() => handleQuickDateFilter('today')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                            quickDateFilter === 'today'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}
                                    >
                                        📅 Hari Ini
                                    </button>
                                    <button
                                        onClick={() => handleQuickDateFilter('week')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                            quickDateFilter === 'week'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}
                                    >
                                        📆 Minggu Ini
                                    </button>
                                    <button
                                        onClick={() => handleQuickDateFilter('month')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                            quickDateFilter === 'month'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}
                                    >
                                        🗓️ Bulan Ini
                                    </button>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <div className="p-4 bg-card border border-border rounded-lg space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                    Sumber
                                                </label>
                                                <select
                                                    value={filterSource}
                                                    onChange={(e) => setFilterSource(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                                >
                                                    <option value="all">Semua Sumber</option>
                                                    {sources.map(source => (
                                                        <option key={source} value={source}>{source}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                    Dari Tanggal
                                                </label>
                                                <input
                                                    type="date"
                                                    value={filterDateFrom}
                                                    onChange={(e) => {
                                                        setFilterDateFrom(e.target.value);
                                                        setQuickDateFilter('all');
                                                    }}
                                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                    Sampai Tanggal
                                                </label>
                                                <input
                                                    type="date"
                                                    value={filterDateTo}
                                                    onChange={(e) => {
                                                        setFilterDateTo(e.target.value);
                                                        setQuickDateFilter('all');
                                                    }}
                                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setFilterSource('all');
                                                    setFilterDateFrom('');
                                                    setFilterDateTo('');
                                                    setQuickDateFilter('all');
                                                }}
                                                className="px-3 py-1.5 text-sm rounded-lg border border-input hover:bg-muted"
                                            >
                                                Reset Filter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Leads Baru Section */}
                            <LeadSection
                                title="Prospek Baru"
                                description="Prospek yang belum dihubungi"
                                icon="UserPlus"
                                iconBg="bg-blue-100 dark:bg-blue-900"
                                iconColor="text-blue-600 dark:text-blue-300"
                                badgeBg="bg-blue-100 dark:bg-blue-900"
                                badgeColor="text-blue-700 dark:text-blue-300"
                                leads={getFilteredByStatus('New')}
                                isCollapsed={collapsedSections.new}
                                onToggle={() => toggleSection('new')}
                                onFollowUp={handleFollowUp}
                                onConvert={handleConvertToClient}
                                onEdit={handleEditLead}
                                onDelete={handleDeleteLead}
                            />

                            {/* Leads Follow-up Section */}
                            <LeadSection
                                title="Follow-up"
                                description="Prospek yang sedang diproses"
                                icon="MessageCircle"
                                iconBg="bg-yellow-100 dark:bg-yellow-900"
                                iconColor="text-yellow-600 dark:text-yellow-300"
                                badgeBg="bg-yellow-100 dark:bg-yellow-900"
                                badgeColor="text-yellow-700 dark:text-yellow-300"
                                leads={getFilteredByStatus(['Contacted', 'Interested'])}
                                isCollapsed={collapsedSections.followup}
                                onToggle={() => toggleSection('followup')}
                                onFollowUp={handleFollowUp}
                                onConvert={handleConvertToClient}
                                onEdit={handleEditLead}
                                onDelete={handleDeleteLead}
                            />

                            {/* Konversi Jadi Klien Section */}
                            <LeadSection
                                title="Jadi Klien"
                                description="Prospek yang berhasil dikonversi"
                                icon="CheckCircle2"
                                iconBg="bg-green-100 dark:bg-green-900"
                                iconColor="text-green-600 dark:text-green-300"
                                badgeBg="bg-green-100 dark:bg-green-900"
                                badgeColor="text-green-700 dark:text-green-300"
                                leads={getFilteredByStatus('Converted')}
                                isCollapsed={collapsedSections.converted}
                                onToggle={() => toggleSection('converted')}
                                onFollowUp={handleFollowUp}
                                onConvert={handleConvertToClient}
                                onEdit={handleEditLead}
                                onDelete={handleDeleteLead}
                            />

                            {/* Lost Section */}
                            {getFilteredByStatus('Lost').length > 0 && (
                                <LeadSection
                                    title="Lost"
                                    description="Prospek yang tidak jadi"
                                    icon="XCircle"
                                    iconBg="bg-gray-100 dark:bg-gray-800"
                                    iconColor="text-gray-600 dark:text-gray-400"
                                    badgeBg="bg-gray-100 dark:bg-gray-800"
                                    badgeColor="text-gray-700 dark:text-gray-300"
                                    leads={getFilteredByStatus('Lost')}
                                    isCollapsed={collapsedSections.lost}
                                    onToggle={() => toggleSection('lost')}
                                    onFollowUp={handleFollowUp}
                                    onConvert={handleConvertToClient}
                                    onEdit={handleEditLead}
                                    onDelete={handleDeleteLead}
                                />
                            )}
                        </>
                    )}

                    {activeTab === 'form' && (
                        <LeadsForm
                            onSave={handleSaveLead}
                            onCancel={() => setActiveTab('list')}
                            initialData={editingLead}
                        />
                    )}

                    {activeTab === 'templates' && (
                        <WhatsAppTemplates />
                    )}
                </main>

                {/* Send Reminder Modal */}
                {showFollowUpModal && selectedLeadForFollowUp && (
                    <SendReminderModal
                        lead={selectedLeadForFollowUp}
                        onClose={() => {
                            setShowFollowUpModal(false);
                            setSelectedLeadForFollowUp(null);
                        }}
                        onSubmit={handleSubmitReminder}
                    />
                )}
            </div>
        </>
    );
};

export default Leads;
