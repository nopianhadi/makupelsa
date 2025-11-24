import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import QuickActionButton from '../../components/ui/QuickActionButton';
import AddTeamMemberModal from './components/AddTeamMemberModal';
import { dataStore } from '../../utils/dataStore';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = () => {
    const stored = dataStore.getTeamMembers();
    if (stored.length === 0) {
      // Initial mock data
      const mockTeam = [
        {
          name: "Sarah Wijaya",
          role: "Lead MUA",
          email: "sarah@example.com",
          phone: "081234567890",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          completedJobs: 45,
          rating: 4.8,
          specialties: ["Bridal", "Traditional"],
          status: "active",
          joinDate: "2023-01-15",
          paymentsPaid: 45000000,
          paymentsUnpaid: 5000000
        },
        {
          name: "Dina Kartika",
          role: "Senior MUA",
          email: "dina@example.com",
          phone: "082345678901",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
          completedJobs: 32,
          rating: 4.7,
          specialties: ["Modern", "Party"],
          status: "active",
          joinDate: "2023-02-20",
          paymentsPaid: 32000000,
          paymentsUnpaid: 8000000
        },
        {
          name: "Emma Putri",
          role: "MUA",
          email: "emma@example.com",
          phone: "083456789012",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          completedJobs: 18,
          rating: 4.5,
          specialties: ["Casual", "Wedding"],
          status: "active",
          joinDate: "2023-06-10",
          paymentsPaid: 18000000,
          paymentsUnpaid: 2000000
        }
      ];
      mockTeam.forEach(member => dataStore.addTeamMember(member));
      setTeamMembers(dataStore.getTeamMembers());
    } else {
      setTeamMembers(stored);
    }
  };

  const handleSaveMember = (memberData) => {
    if (editingMember) {
      dataStore.updateTeamMember(editingMember.id, memberData);
    } else {
      dataStore.addTeamMember(memberData);
    }
    loadTeamMembers();
    setEditingMember(null);
  };

  const handleDeleteMember = (id) => {
    if (confirm('Yakin ingin menghapus anggota tim ini?')) {
      dataStore.deleteTeamMember(id);
      loadTeamMembers();
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dataStore.updateTeamMember(id, { status: newStatus });
    loadTeamMembers();
  };

  // Filtering and sorting logic
  const getFilteredAndSortedMembers = () => {
    let filtered = teamMembers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(m => m.role === filterRole);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'jobs':
          return b.completedJobs - a.completedJobs;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  };

  const filteredMembers = getFilteredAndSortedMembers();
  const uniqueRoles = [...new Set(teamMembers.map(m => m.role))];

  // Calculate stats
  const totalPaymentsPaid = teamMembers.reduce((sum, m) => sum + (m.paymentsPaid || 0), 0);
  const totalPaymentsUnpaid = teamMembers.reduce((sum, m) => sum + (m.paymentsUnpaid || 0), 0);

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    totalJobs: teamMembers.reduce((sum, m) => sum + m.completedJobs, 0),
    avgRating: teamMembers.length > 0 ? (teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1) : 0,
    bestPerformer: teamMembers.length > 0 ? teamMembers.reduce((prev, curr) => (prev.rating > curr.rating) ? prev : curr).name : 'N/A',
    totalPaymentsPaid,
    totalPaymentsUnpaid,
    totalPayments: totalPaymentsPaid + totalPaymentsUnpaid
  };

  return (
    <>
      <Helmet>
        <title>Manajemen Tim - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className={cn("w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg: py-4 sm:py-4 sm:py-6", mobileClasses.card)}>
          {/* Header */}
          <div className={cn("mb-4 sm:", mobileClasses.marginBottom)}>
            <div className="flex items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
              <h1 className={cn("text-lg sm:text-2xl lg:text-xl sm:text-2xl lg: font-heading font-bold text-foreground", mobileClasses.heading1)}>
                Manajemen Tim
              </h1>
              <QuickActionButton
                label="Tambah Anggota"
                icon="UserPlus"
                variant="primary"
                onClick={() => {
                  setEditingMember(null);
                  setIsAddModalOpen(true);
                }}
              />
            </div>
            <p className="text-xs sm:text-xs sm:text-sm text-muted-foreground">
              Kelola tim makeup artist dan performa mereka
            </p>
          </div>

          {/* Team Stats - Enhanced */}
          <div className={cn("grid grid-cols- w-full 1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:ga mb-4 sm:mb-6", mobileClasses.cardCompact)}>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-3 sm:p-4 lg:", mobileClasses.card)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-xs sm:text-sm text-muted-foreground">Total Anggota</span>
                <Icon name="Users" size={16} color="var(--color-primary)" />
              </div>
              <div className={cn("text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>{stats.total}</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-3 sm:p-4 lg:", mobileClasses.card)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-xs sm:text-sm text-muted-foreground">Aktif</span>
                <Icon name="CheckCircle2" size={16} color="rgb(34 197 94)" />
              </div>
              <div className={cn("text-xl sm:text-2xl lg:text-xl sm:text-2xl lg: font-bold text-foreground", mobileClasses.heading1)}>{stats.active}</div>
              <div className="text-xs text-muted-foreground mt-1">{Math.round((stats.active / stats.total) * 100)}%</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-3 sm:p-4 lg:", mobileClasses.card)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-xs sm:text-sm text-muted-foreground">Pembayaran Lunas</span>
                <Icon name="CheckCircle" size={16} color="rgb(34 197 94)" />
              </div>
              <div className={cn("text-base sm:text-lg lg: font-bold text-foreground", mobileClasses.heading2)}>Rp {(stats.totalPaymentsPaid / 1000000).toFixed(1)} Jt</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-3 sm:p-4 lg:", mobileClasses.card)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-xs sm:text-sm text-muted-foreground">Pembayaran Tertunda</span>
                <Icon name="Clock" size={16} color="rgb(234 179 8)" />
              </div>
              <div className={cn("text-base sm:text-lg lg: font-bold text-foreground", mobileClasses.heading2)}>Rp {(stats.totalPaymentsUnpaid / 1000000).toFixed(1)} Jt</div>
            </div>
            <div className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg:p-3 sm:p-4 lg:", mobileClasses.card)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-xs sm:text-sm text-muted-foreground">Total Pembayaran</span>
                <Icon name="Wallet" size={16} color="var(--color-primary)" />
              </div>
              <div className={cn("text-base sm:text-lg lg: font-bold text-foreground", mobileClasses.heading2)}>Rp {(stats.totalPayments / 1000000).toFixed(1)} Jt</div>
            </div>
          </div>

          {/* Search & Filter - Enhanced */}
          <div className={cn("mb-4 sm:mb-6 flex flex-col gap-2 sm:", mobileClasses.gapSmall)}>
            <div className="flex-1 relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2 sm:py-3 text-xs sm:text-sm sm:text-base bg-surface border border-input rounded-lg sm:rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className={cn("flex gap-2 sm:", mobileClasses.gapSmall)}>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="flex-1 px-2 sm:px-4 py-2 sm:py-2 sm:py-3 text-xs sm:text-xs sm:text-sm bg-surface border border-input rounded-lg sm:rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Role</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-2 sm:px-4 py-2 sm:py-2 sm:py-3 text-xs sm:text-xs sm:text-sm bg-surface border border-input rounded-lg sm:rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-2 sm:px-4 py-2 sm:py-2 sm:py-3 text-xs sm:text-xs sm:text-sm bg-surface border border-input rounded-lg sm:rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Nama</option>
                <option value="rating">Rating</option>
                <option value="jobs">Pekerjaan</option>
              </select>
            </div>
          </div>

          {/* Team Members Grid - Enhanced */}
          <div className={cn("grid grid-cols- w-full 1 md:grid-cols-2 lg:grid-cols-3 ga", mobileClasses.cardCompact)}>
            {filteredMembers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className={cn("w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto ", mobileClasses.marginBottomSmall)}>
                  <Icon name="Users" size={40} color="var(--color-muted-foreground)" />
                </div>
                <p className="text-muted-foreground">Tidak ada anggota tim yang cocok</p>
              </div>
            ) : (
              filteredMembers.map(member => (
                <div key={member.id} className={cn("bg-card border border-border rounded-lg overflow-hidden p-3 sm:p-4 lg: hover:shadow-lg transition-shadow group", mobileClasses.card)}>
                  {/* Status Badge */}
                  <div className={cn("absolute to right-4", mobileClasses.cardCompact)}>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'active' 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-gray-500/10 text-gray-600'
                    }`}>
                      {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className={cn("flex items-start ga mb-4", mobileClasses.cardCompact)}>
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="Star" size={14} color="var(--color-warning)" />
                        <span className="text-xs sm:text-sm font-medium">{member.rating}</span>
                        <span className="text-xs text-muted-foreground">({member.completedJobs} jobs)</span>
                      </div>
                    </div>
                  </div>

                  <div className={cn("space-y-2 ", mobileClasses.marginBottomSmall)}>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Icon name="Mail" size={16} color="var(--color-muted-foreground)" />
                      <span className="text-muted-foreground truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Icon name="Phone" size={16} color="var(--color-muted-foreground)" />
                      <span className="text-muted-foreground">{member.phone}</span>
                    </div>
                  </div>

                  <div className={cn("flex flex-wrap gap-2 ", mobileClasses.marginBottomSmall)}>
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Payment Status */}
                  <div className={cn("grid grid-cols- w-full 2 gap-2  text-xs", mobileClasses.marginBottomSmall)}>
                    <div className="bg-green-500/10 rounded-lg p-2">
                      <p className="text-muted-foreground">Sudah Bayar</p>
                      <p className="font-bold text-green-600">Rp {((member.paymentsPaid || 0) / 1000000).toFixed(1)} Jt</p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-2">
                      <p className="text-muted-foreground">Belum Bayar</p>
                      <p className="font-bold text-yellow-600">Rp {((member.paymentsUnpaid || 0) / 1000000).toFixed(1)} Jt</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="flex-1 px-3 py-2 bg-muted text-foreground rounded-md text-xs sm:text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                      <Icon name="Eye" size={14} className="inline mr-1" />
                      Detail
                    </button>
                    <button 
                      onClick={() => {
                        setEditingMember(member);
                        setIsAddModalOpen(true);
                      }}
                      className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Icon name="Edit" size={14} className="inline mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(member.id, member.status)}
                      className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        member.status === 'active' 
                          ? 'bg-amber-600 text-white hover:bg-amber-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {member.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Member Detail Modal */}
          {selectedMember && (
            <div className={cn("fixed inset-0 bg-black/50 flex items-center justify-center z-50 ", mobileClasses.cardCompact)}>
              <div className={cn("bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 lg:", mobileClasses.card)}>
                <div className={cn("flex items-start justify-between ", mobileClasses.marginBottom)}>
                  <div className="flex-1">
                    <h2 className={cn(" font-heading font-bold text-foreground mb-2", mobileClasses.heading2)}>
                      {selectedMember.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">{selectedMember.role}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Icon name="X" size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Profile */}
                  <div className={cn("flex items-center gap-3 sm:p-4 lg:", mobileClasses.card)}>
                    <img 
                      src={selectedMember.avatar} 
                      alt={selectedMember.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <div className="mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          selectedMember.status === 'active' 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-gray-500/10 text-gray-600'
                        }`}>
                          {selectedMember.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <div className={cn("flex items-center ga", mobileClasses.cardCompact)}>
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <p className={cn(" font-bold flex items-center gap-1", mobileClasses.heading2)}>
                            {selectedMember.rating}
                            <Icon name="Star" size={16} color="var(--color-warning)" />
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pekerjaan Selesai</p>
                          <p className={cn(" font-bold", mobileClasses.heading2)}>{selectedMember.completedJobs}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">INFORMASI KONTAK</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Mail" size={16} color="var(--color-primary)" />
                        <span className="text-foreground">{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={16} color="var(--color-primary)" />
                        <span className="text-foreground">{selectedMember.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">KEAHLIAN</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">PERFORMA</h3>
                    <div className={cn("bg-surface rounded-lg overflow-hidden  space-y-3", mobileClasses.cardCompact)}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full">
                            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${(selectedMember.rating / 5) * 100}%` }} />
                          </div>
                          <span className="font-semibold text-foreground truncate">{selectedMember.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">Pekerjaan</span>
                        <span className="font-semibold text-foreground truncate">{selectedMember.completedJobs} projects</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={cn("flex  pt-4 border-t border-border", mobileClasses.gapSmall)}>
                    <button 
                      onClick={() => {
                        setEditingMember(selectedMember);
                        setIsAddModalOpen(true);
                        setSelectedMember(null);
                      }}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Edit Profil
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(selectedMember.id, selectedMember.status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedMember.status === 'active' 
                          ? 'bg-amber-600 text-white hover:bg-amber-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {selectedMember.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button 
                      onClick={() => {
                        handleDeleteMember(selectedMember.id);
                        setSelectedMember(null);
                      }}
                      className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <AddTeamMemberModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingMember(null);
          }}
          onSave={handleSaveMember}
          editData={editingMember}
        />
      </div>
    </>
  );
};

export default Team;
