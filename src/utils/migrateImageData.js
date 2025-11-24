/**
 * Utility untuk migrasi data gambar dari URL ke base64
 * Digunakan saat pertama kali load aplikasi
 */

export const migrateGalleryProjects = () => {
  try {
    const projects = localStorage.getItem('gallery_projects');
    if (!projects) {
      console.log('ℹ️ No gallery projects to migrate');
      return;
    }

    const parsed = JSON.parse(projects);
    
    if (!Array.isArray(parsed)) {
      console.warn('⚠️ Gallery projects is not an array, resetting...');
      localStorage.setItem('gallery_projects', JSON.stringify([]));
      return;
    }

    // Always migrate to ensure correct format
    const migrated = parsed.map(project => {
      // Ensure project has required fields
      if (!project || typeof project !== 'object') {
        return null;
      }

      return {
        ...project,
        images: Array.isArray(project.images) 
          ? project.images.map(img => {
              // If already in correct format
              if (img && typeof img === 'object' && img.url) {
                return img;
              }
              // If it's just a URL string
              if (typeof img === 'string' && img.trim()) {
                return { url: img, caption: '' };
              }
              // Skip invalid images
              return null;
            }).filter(Boolean) // Remove null values
          : []
      };
    }).filter(Boolean); // Remove null projects

    localStorage.setItem('gallery_projects', JSON.stringify(migrated));
    console.log(`✅ Gallery projects migrated successfully (${migrated.length} projects)`);
  } catch (error) {
    console.error('❌ Error migrating gallery projects:', error);
    // Reset to empty array on error
    localStorage.setItem('gallery_projects', JSON.stringify([]));
  }
};

export const migrateTeamMembers = () => {
  try {
    const members = localStorage.getItem('team_members');
    if (!members) return;

    const parsed = JSON.parse(members);
    
    // Ensure avatar is string (not object)
    const migrated = parsed.map(member => ({
      ...member,
      avatar: typeof member.avatar === 'string' ? member.avatar : ''
    }));

    localStorage.setItem('team_members', JSON.stringify(migrated));
    console.log('✅ Team members migrated successfully');
  } catch (error) {
    console.error('Error migrating team members:', error);
  }
};

export const migrateProfileData = () => {
  try {
    const profile = localStorage.getItem('user_profile');
    if (!profile) return;

    const parsed = JSON.parse(profile);
    
    // Ensure logo and signature are strings
    const migrated = {
      ...parsed,
      logoUrl: typeof parsed.logoUrl === 'string' ? parsed.logoUrl : '',
      signatureUrl: typeof parsed.signatureUrl === 'string' ? parsed.signatureUrl : ''
    };

    localStorage.setItem('user_profile', JSON.stringify(migrated));
    console.log('✅ Profile data migrated successfully');
  } catch (error) {
    console.error('Error migrating profile data:', error);
  }
};

// Run all migrations
export const runAllMigrations = () => {
  console.log('🔄 Running data migrations...');
  migrateGalleryProjects();
  migrateTeamMembers();
  migrateProfileData();
  console.log('✅ All migrations completed');
};
