import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { dataStore } from '../../utils/dataStore';
import AddProjectModal from './components/AddProjectModal';
import EditProjectModal from './components/EditProjectModal';
import CalendarView from './components/CalendarView';
import ArchiveProjectModal from './components/ArchiveProjectModal';
import CompletedProjectStats from './components/CompletedProjectStats';
import { exportCompletedProjects, exportProjectReport } from '../../utils/projectExport';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'budget', 'status'
  const [filterBudgetRange, setFilterBudgetRange] = useState({ min: 0, max: 999999999 });
  const [filterClient, setFilterClient] = useState('all');
  
  // State untuk tab dan filter proyek selesai
  const [activeTab, setActiveTab] = useState('active'); // 'active' atau 'completed'
  const [completedFilter, setCompletedFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archivedProjects, setArchivedProjects] = useState([]);

  const getClientName = (project) => {
    if (project.clientId) {
      const client = clients.find(c => c.id === project.clientId);
      return client ? client.name : 'Client Not Found';
    }
    return project.client || 'Unknown Client';
  };

  useEffect(() => {
    setClients(dataStore.getClients());
    setProjects(dataStore.getProjects());

    const handleClientUpdate = () => {
      setClients(dataStore.getClients());
    };

    const handleProjectUpdate = () => {
      setProjects(dataStore.getProjects());
    };

    window.addEventListener('clientAdded', handleClientUpdate);
    window.addEventListener('clientUpdated', handleClientUpdate);
    window.addEventListener('clientDeleted', handleClientUpdate);
    window.addEventListener('projectAdded', handleProjectUpdate);
    window.addEventListener('projectUpdated', handleProjectUpdate);
    window.addEventListener('projectDeleted', handleProjectUpdate);

    return () => {
      window.removeEventListener('clientAdded', handleClientUpdate);
      window.removeEventListener('clientUpdated', handleClientUpdate);
      window.removeEventListener('clientDeleted', handleClientUpdate);
      window.removeEventListener('projectAdded', handleProjectUpdate);
      window.removeEventListener('projectUpdated', handleProjectUpdate);
      window.removeEventListener('projectDeleted', handleProjectUpdate);
    };
  }, []);

  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    dataStore.setProjects(updatedProjects);
  };

  const handleAddProject = (projectData) => {
    dataStore.addProject({
      ...projectData,
      images: []
    });
    setIsAddModalOpen(false);
  };

  const handleEditProject = (updatedProject) => {
    dataStore.updateProject(updatedProject.id, updatedProject);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      dataStore.deleteProject(projectId);
      setSelectedProject(null);
    }
  };

  // Helper function untuk filter berdasarkan status
  const getFilteredByStatus = () => {
    if (activeTab === 'active') {
      return projects.filter(p => p.status !== 'completed');
    } else {
      return projects.filter(p => p.status === 'completed');
    }
  };

  // Filter dengan periode untuk proyek selesai
  const getFilteredCompleted = () => {
    let filtered = projects.filter(p => p.status === 'completed');
    
    if (completedFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(project => {
        const completedDate = new Date(project.completedAt || project.date);
        completedDate.setHours(0, 0, 0, 0);

        switch (completedFilter) {
          case 'today':
            return completedDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return completedDate >= weekAgo && completedDate <= today;
          case 'month':
            return completedDate.getMonth() === today.getMonth() &&
                   completedDate.getFullYear() === today.getFullYear();
          case 'custom':
            if (customDateRange.start && customDateRange.end) {
              const startDate = new Date(customDateRange.start);
              const endDate = new Date(customDateRange.end);
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(23, 59, 59, 999);
              return completedDate >= startDate && completedDate <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const filteredProjects = (() => {
    let filtered = activeTab === 'completed' ? getFilteredCompleted() : getFilteredByStatus();
    
    // Apply existing filters
    if (filter !== 'all' && activeTab === 'active') {
      filtered = filtered.filter(project => project.status === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getClientName(project).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply budget range filter
    filtered = filtered.filter(project => 
      project.budget >= filterBudgetRange.min && project.budget <= filterBudgetRange.max
    );

    // Apply client filter
    if (filterClient !== 'all') {
      filtered = filtered.filter(project => project.clientId === filterClient);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'budget':
          return b.budget - a.budget;
        case 'status':
          const statusOrder = { 'upcoming': 0, 'in-progress': 1, 'completed': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'date':
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });
    
    return sorted;
  })();

  // Get unique clients for filter
  const uniqueClients = [...new Set(projects.map(p => p.clientId))].filter(Boolean);

  const getStatusBadge = (status) => {
    const badges = {
      'upcoming': { label: 'Akan Datang', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
      'in-progress': { label: 'Sedang Berjalan', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
      'completed': { label: 'Selesai', color: 'bg-green-500/10 text-green-600 border-green-200' }
    };
    const badge = badges[status] || badges.upcoming;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const calculateProgress = (paid, budget) => {
    return Math.round((paid / budget) * 100);
  };

  const handleArchiveProjects = (projectIds, reason) => {
    const projectsToArchive = projects.filter(p => projectIds.includes(p.id));
    const archived = projectsToArchive.map(p => ({
      ...p,
      archivedAt: new Date().toISOString(),
      archiveReason: reason
    }));
    
    setArchivedProjects(prev => [...prev, ...archived]);
    const updatedProjects = projects.filter(p => !projectIds.includes(p.id));
    saveProjects(updatedProjects);
    setShowArchiveModal(false);
    
    localStorage.setItem('archivedProjects', JSON.stringify([...archivedProjects, ...archived]));
  };

  const stats = {
    total: projects.length,
    upcoming: projects.filter(p => p.status === 'upcoming').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalRevenue: projects.reduce((sum, p) => sum + p.paid, 0)
  };

  return (
    <>
      <Helmet>
        <title>Manajemen Proyek - MUA Finance Manager</title>
        <meta name="description" content="Kelola semua proyek makeup dengan tracking lengkap" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className={cn("w-full max-w-full-xl mx-auto px-2 sm:px-4 lg: py-4 sm:py-6", mobileClasses.card)}>
          {/* Header */}
          <div className={cn("mb-4 sm:", mobileClasses.marginBottom)}>
            <div className={cn("flex items-center justify-between ", mobileClasses.marginBottomSmall)}>
              <div>
                <h1 className={cn("text-lg sm:text-2xl lg:text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-heading font-bold text-foreground", mobileClasses.heading1)}>
                  Manajemen Proyek
                </h1>
                <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground mt-1">
                  Kelola semua proyek makeup Anda
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex bg-surface rounded-lg overflow-hidden p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-md transition-smooth ${
                      viewMode === 'grid' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="LayoutGrid" size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-2 rounded-md transition-smooth ${
                      viewMode === 'calendar' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name="Calendar" size={18} />
                  </button>
                </div>
                <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                  <Icon name="Plus" size={20} sm:size={20} />
                  <span className="hidden sm:inline ml-2">Tambah Proyek</span>
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={cn("mb-4 sm:", mobileClasses.marginBottom)}>
              <div className="border-b border-border">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                      activeTab === 'active'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Proyek Aktif
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      {projects.filter(p => p.status !== 'completed').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`pb-3 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                      activeTab === 'completed'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Proyek Selesai
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                      {projects.filter(p => p.status === 'completed').length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter untuk Proyek Selesai */}
            {activeTab === 'completed' && (
              <div className={cn("mb-4 sm:mb-6  bg-card rounded-lg border border-border", mobileClasses.cardCompact)}>
                <div className={cn("flex flex-col sm:flex-row sm:items-center ga", mobileClasses.cardCompact)}>
                  <div className="flex-1">
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                      Filter Periode Selesai
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'today', 'week', 'month', 'custom'].map(filterType => (
                        <button
                          key={filterType}
                          onClick={() => setCompletedFilter(filterType)}
                          className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                            completedFilter === filterType
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {filterType === 'all' ? 'Semua' : 
                           filterType === 'today' ? 'Hari Ini' :
                           filterType === 'week' ? 'Minggu Ini' :
                           filterType === 'month' ? 'Bulan Ini' : 'Custom'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {completedFilter === 'custom' && (
                  <div className={cn("mt-4 flex flex-col sm:flex-row ", mobileClasses.gapSmall)}>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Dari Tanggal
                      </label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Sampai Tanggal
                      </label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowArchiveModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Kelola Arsip
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const result = exportCompletedProjects(getFilteredCompleted(), {
                          startDate: completedFilter === 'custom' ? customDateRange.start : null,
                          endDate: completedFilter === 'custom' ? customDateRange.end : null
                        });
                        alert(`✅ Berhasil export ${result.count} proyek ke ${result.filename}`);
                      } catch (error) {
                        alert('❌ Gagal export data: ' + error.message);
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      try {
                        exportProjectReport(getFilteredCompleted());
                        alert('✅ Laporan berhasil di-download');
                      } catch (error) {
                        alert('❌ Gagal generate laporan: ' + error.message);
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Laporan
                  </button>
                </div>
              </div>
            )}

            {/* Statistik Proyek Selesai */}
            {activeTab === 'completed' && (
              <CompletedProjectStats projects={getFilteredCompleted()} />
            )}

            {/* Stats Cards */}
            <div className={cn("grid grid-cols- w-full 2 md:grid-cols-5 gap-2 sm:gap-3 lg:gap-2 sm:gap-3 lg:ga mb-3 sm:mb-4 sm:mb-4 sm:mb-6", mobileClasses.cardCompact)}>
              <div className={cn("bg-card border border-border rounded-xl ", mobileClasses.cardCompact)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Briefcase" size={20} sm:size={20} color="var(--color-primary)" />
                  <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Total</span>
                </div>
                <p className={cn(" font-bold text-foreground", mobileClasses.heading2)}>{stats.total}</p>
              </div>
              <div className={cn("bg-card border border-border rounded-xl ", mobileClasses.cardCompact)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Clock" size={20} sm:size={20} color="rgb(59 130 246)" />
                  <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Upcoming</span>
                </div>
                <p className={cn(" font-bold text-foreground", mobileClasses.heading2)}>{stats.upcoming}</p>
              </div>
              <div className={cn("bg-card border border-border rounded-xl ", mobileClasses.cardCompact)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="PlayCircle" size={20} sm:size={20} color="rgb(234 179 8)" />
                  <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Progress</span>
                </div>
                <p className={cn(" font-bold text-foreground", mobileClasses.heading2)}>{stats.inProgress}</p>
              </div>
              <div className={cn("bg-card border border-border rounded-xl ", mobileClasses.cardCompact)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle2" size={20} sm:size={20} color="rgb(34 197 94)" />
                  <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Selesai</span>
                </div>
                <p className={cn(" font-bold text-foreground", mobileClasses.heading2)}>{stats.completed}</p>
              </div>
              <div className={cn("bg-card border border-border rounded-xl ", mobileClasses.cardCompact)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Wallet" size={20} sm:size={20} color="var(--color-primary)" />
                  <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Revenue</span>
                </div>
                <p className={cn(" font-bold text-foreground", mobileClasses.heading4)}>
                  {formatCurrency(stats.totalRevenue).replace('IDR', 'Rp').replace(',00', '')}
                </p>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Cari proyek atau klien..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2 sm:py-3 text-sm sm:text-base bg-surface border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Icon 
                    name="Search" 
                    size={16} sm:size={20} 
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" 
                  />
                </div>

                {/* Filters Row 1 - Status */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { value: 'all', label: 'Semua' },
                    { value: 'upcoming', label: 'Akan Datang' },
                    { value: 'in-progress', label: 'Progress' },
                    { value: 'completed', label: 'Selesai' }
                  ].map(item => (
                    <button
                      key={item.value}
                      onClick={() => setFilter(item.value)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-smooth ${
                        filter === item.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Filters Row 2 - Advanced */}
                <div className={cn("flex flex-col sm:flex-row ", mobileClasses.gapSmall)}>
                  <select
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value)}
                    className="px-4 py-2 bg-surface border border-input rounded-lg text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Semua Klien</option>
                    {uniqueClients.map(clientId => {
                      const client = clients.find(c => c.id === clientId);
                      return (
                        <option key={clientId} value={clientId}>
                          {client?.name || 'Unknown'}
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Budget"
                      value={filterBudgetRange.min}
                      onChange={(e) => setFilterBudgetRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="px-3 py-2 bg-surface border border-input rounded-lg text-foreground text-xs sm:text-sm w-28 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="px-2 py-2 text-muted-foreground">-</span>
                    <input
                      type="number"
                      placeholder="Max Budget"
                      value={filterBudgetRange.max}
                      onChange={(e) => setFilterBudgetRange(prev => ({ ...prev, max: parseInt(e.target.value) || 999999999 }))}
                      className="px-3 py-2 bg-surface border border-input rounded-lg text-foreground text-xs sm:text-sm w-28 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-surface border border-input rounded-lg text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="date">Urutkan: Tanggal</option>
                    <option value="budget">Urutkan: Budget</option>
                    <option value="status">Urutkan: Status</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <CalendarView 
              projects={projects} 
              onProjectClick={setSelectedProject}
              onEditProject={setEditingProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <div className={cn("w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto ", mobileClasses.marginBottomSmall)}>
                    <Icon name="Briefcase" size={40} color="var(--color-muted-foreground)" />
                  </div>
                  <h3 className={cn(" font-heading font-semibold text-foreground mb-2", mobileClasses.heading4)}>
                    {searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Proyek'}
                  </h3>
                  <p className={cn("text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground mb-4 sm:", mobileClasses.marginBottom)}>
                    {searchQuery 
                      ? 'Coba ubah kata kunci pencarian'
                      : 'Mulai tambahkan proyek makeup Anda'
                    }
                  </p>
                  {!searchQuery && (
                    <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                      <Icon name="Plus" size={20} sm:size={20} />
                      <span className="ml-2">Tambah Proyek Pertama</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className={cn("grid grid-cols- w-full 1 md:grid-cols-2 lg:grid-cols-3 ga", mobileClasses.cardCompact)}>
                  {filteredProjects.map((project) => {
                    const progress = calculateProgress(project.paid, project.budget);
                    return (
                      <div
                        key={project.id}
                        className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-smooth group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 cursor-pointer" onClick={() => setSelectedProject(project)}>
                            <h3 className="font-heading font-bold text-foreground mb-1">
                              {project.title}
                            </h3>
                            <p className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                              <Icon name="User" size={14} />
                              {getClientName(project)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusBadge(project.status)}
                          </div>
                        </div>

                        <div className={cn("space-y-2  cursor-pointer", mobileClasses.marginBottomSmall)} onClick={() => setSelectedProject(project)}>
                          <div className="flex items-center gap-2 text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                            <Icon name="Tag" size={16} />
                            <span>{project.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                            <Icon name="Calendar" size={16} />
                            <span>{formatDate(project.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">
                            <Icon name="MapPin" size={16} />
                            <span className="truncate">{project.location}</span>
                          </div>
                        </div>

                        <div className="border-t border-border pt-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-xs sm:text-xs sm:text-sm text-muted-foreground">Pembayaran</span>
                            <span className="text-xs sm:text-sm font-semibold text-foreground truncate">{progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground">
                              {formatCurrency(project.paid).replace('IDR', 'Rp').replace(',00', '')}
                            </span>
                            <span className="font-semibold text-foreground truncate">
                              {formatCurrency(project.budget).replace('IDR', 'Rp').replace(',00', '')}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(project);
                            }}
                          >
                            <Icon name="Edit" size={16} />
                            <span className="ml-1">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="text-error hover:bg-error/10"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>

        {/* Add Project Modal */}
        {isAddModalOpen && (
          <AddProjectModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddProject}
          />
        )}

        {/* Edit Project Modal */}
        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSave={handleEditProject}
          />
        )}

        {/* Archive Project Modal */}
        {showArchiveModal && (
          <ArchiveProjectModal
            projects={projects.filter(p => p.status === 'completed')}
            onClose={() => setShowArchiveModal(false)}
            onArchive={handleArchiveProjects}
          />
        )}
        {/* Project Detail Modal */}
        {selectedProject && (
          <div
            className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center ", mobileClasses.cardCompact)}
            onClick={() => setSelectedProject(null)}
          >
            <div
              className={cn("bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 lg:", mobileClasses.card)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("flex items-start justify-between mb-4 sm:", mobileClasses.marginBottom)}>
                <div className="flex-1">
                  <h2 className={cn(" font-heading font-bold text-foreground mb-2", mobileClasses.heading2)}>
                    {selectedProject.title}
                  </h2>
                  {getStatusBadge(selectedProject.status)}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)}>
                  <Icon name="X" size={20} sm:size={24} />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Client Info */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">INFORMASI KLIEN</h3>
                  <div className={cn("grid grid-cols- w-full 2 ga", mobileClasses.cardCompact)}>
                    <div className={cn("flex items-center ", mobileClasses.gapSmall)}>
                      <Icon name="User" size={20} sm:size={20} color="var(--color-primary)" />
                      <div>
                        <p className="text-xs text-muted-foreground">Klien</p>
                        <p className="font-medium text-foreground">{selectedProject.client}</p>
                      </div>
                    </div>
                    <div className={cn("flex items-center ", mobileClasses.gapSmall)}>
                      <Icon name="Tag" size={20} sm:size={20} color="var(--color-primary)" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tipe</p>
                        <p className="font-medium text-foreground">{selectedProject.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">DETAIL ACARA</h3>
                  <div className="space-y-3">
                    <div className={cn("flex items-start ", mobileClasses.gapSmall)}>
                      <Icon name="Calendar" size={20} sm:size={20} color="var(--color-primary)" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tanggal</p>
                        <p className="font-medium text-foreground">{formatDate(selectedProject.date)}</p>
                      </div>
                    </div>
                    <div className={cn("flex items-start ", mobileClasses.gapSmall)}>
                      <Icon name="MapPin" size={20} sm:size={20} color="var(--color-primary)" />
                      <div>
                        <p className="text-xs text-muted-foreground">Lokasi</p>
                        <p className="font-medium text-foreground">{selectedProject.location}</p>
                      </div>
                    </div>
                    {selectedProject.description && (
                      <div className={cn("flex items-start ", mobileClasses.gapSmall)}>
                        <Icon name="FileText" size={20} sm:size={20} color="var(--color-primary)" />
                        <div>
                          <p className="text-xs text-muted-foreground">Deskripsi</p>
                          <p className="font-medium text-foreground">{selectedProject.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team */}
                {selectedProject.team && selectedProject.team.length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">TIM</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {selectedProject.services && selectedProject.services.length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">LAYANAN</h3>
                    <div className="space-y-2">
                      {selectedProject.services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Icon name="Check" size={16} color="var(--color-primary)" />
                          <span className="text-foreground">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">KEUANGAN</h3>
                  <div className={cn("bg-surface rounded-xl ", mobileClasses.cardCompact)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Progress Pembayaran</span>
                      <span className="font-semibold text-foreground truncate">
                        {calculateProgress(selectedProject.paid, selectedProject.budget)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${calculateProgress(selectedProject.paid, selectedProject.budget)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Terbayar</p>
                        <p className={cn("font-bold  text-primary", mobileClasses.heading4)}>
                          {formatCurrency(selectedProject.paid).replace('IDR', 'Rp').replace(',00', '')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Budget</p>
                        <p className={cn("font-bold  text-foreground", mobileClasses.heading4)}>
                          {formatCurrency(selectedProject.budget).replace('IDR', 'Rp').replace(',00', '')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedProject.notes && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">CATATAN</h3>
                    <div className={cn("bg-surface rounded-xl ", mobileClasses.cardCompact)}>
                      <p className="text-foreground">{selectedProject.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={cn("flex  pt-4 border-t border-border", mobileClasses.gapSmall)}>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setEditingProject(selectedProject);
                      setSelectedProject(null);
                    }}
                  >
                    <Icon name="Edit" size={20} sm:size={20} />
                    <span className="ml-2">Edit Proyek</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="text-error hover:bg-error/10"
                  >
                    <Icon name="Trash2" size={20} sm:size={20} />
                    <span className="ml-2">Hapus</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectManagement;
