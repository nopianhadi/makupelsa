import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import QuickActionButton from '../../components/ui/QuickActionButton';
import AddTeamMemberModal from './components/AddTeamMemberModal';
import { dataStore } from '../../utils/dataStore';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

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
          specialties: ["Bridal", "Traditional"]
        },
        {
          name: "Dina Kartika",
          role: "Senior MUA",
          email: "dina@example.com",
          phone: "082345678901",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
          completedJobs: 32,
          rating: 4.7,
          specialties: ["Modern", "Party"]
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

  return (
    <>
      <Helmet>
        <title>Manajemen Tim - MUA Finance Manager</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
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
            <p className="text-sm text-muted-foreground">
              Kelola tim makeup artist dan performa mereka
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Anggota</span>
                <Icon name="Users" size={20} color="var(--color-primary)" />
              </div>
              <div className="text-3xl font-bold text-foreground">{teamMembers.length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Pekerjaan</span>
                <Icon name="Briefcase" size={20} color="var(--color-accent)" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {teamMembers.reduce((sum, m) => sum + m.completedJobs, 0)}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Rating Rata-rata</span>
                <Icon name="Star" size={20} color="var(--color-warning)" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {(teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)}
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Icon name="Star" size={14} color="var(--color-warning)" />
                      <span className="text-sm font-medium">{member.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Mail" size={16} color="var(--color-muted-foreground)" />
                    <span className="text-muted-foreground">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Phone" size={16} color="var(--color-muted-foreground)" />
                    <span className="text-muted-foreground">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Briefcase" size={16} color="var(--color-muted-foreground)" />
                    <span className="text-muted-foreground">{member.completedJobs} pekerjaan selesai</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingMember(member);
                      setIsAddModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(member.id, member.status)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      member.status === 'active' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {member.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button 
                    onClick={() => handleDeleteMember(member.id)}
                    className="px-3 py-2 bg-error text-white rounded-md text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
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
