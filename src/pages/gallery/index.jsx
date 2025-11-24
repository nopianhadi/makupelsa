import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { dataStore } from '../../utils/dataStore';
import ProjectCard from './components/ProjectCard';
import ProjectForm from './components/ProjectForm';
import ProjectDetail from './components/ProjectDetail';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'photoshoot', label: 'Photoshoot' },
    { value: 'event', label: 'Event' },
    { value: 'other', label: 'Lainnya' }
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedCategory]);

  const loadProjects = () => {
    const allProjects = dataStore.getProjects();
    setProjects(allProjects);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    setFilteredProjects(filtered);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      dataStore.deleteProject(projectId);
      loadProjects();
    }
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      dataStore.updateProject(editingProject.id, projectData);
    } else {
      dataStore.addProject(projectData);
    }
    setShowForm(false);
    setEditingProject(null);
    loadProjects();
  };

  const handleCopyLink = (project) => {
    if (project.publicId) {
      const link = `${window.location.origin}/gallery/public/${project.publicId}`;
      navigator.clipboard.writeText(link);
      alert('Link berhasil disalin!');
    }
  };

  const handleViewDetail = (project) => {
    setSelectedProject(project);
  };

  return (
    <>
      <Helmet>
        <title>Gallery - MUA Finance Manager</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Image" size={24} color="var(--color-primary)" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  Gallery Project
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola dan bagikan portfolio project Anda
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 mb-6">
            {(() => {
              const storageInfo = dataStore.getStorageInfo();
              if (storageInfo.percentage > 80) {
                return (
                  <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-2">
                    <Icon name="AlertTriangle" size={18} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-warning">Penyimpanan hampir penuh ({storageInfo.percentage}%)</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Tersisa {storageInfo.availableMB}MB. Hapus project lama atau gunakan gambar lebih kecil.
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari project..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-smooth ${
                      selectedCategory === cat.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <Button
                variant="default"
                size="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddProject}
                className="w-full sm:w-auto"
              >
                Tambah Project
              </Button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="Image" size={40} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'Tidak ada project ditemukan' : 'Belum ada project'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Mulai tambahkan project portfolio Anda'}
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <Button
                  variant="default"
                  size="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddProject}
                >
                  Tambah Project Pertama
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onCopyLink={handleCopyLink}
                  onViewDetail={() => handleViewDetail(project)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={() => {
            handleEditProject(selectedProject);
            setSelectedProject(null);
          }}
        />
      )}
    </>
  );
};

export default Gallery;
