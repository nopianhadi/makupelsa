// Centralized localStorage data management utilities
import { nanoid } from 'nanoid';

export const dataStore = {
  // Generic get/set/update functions
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      
      // Handle QuotaExceededError
      if (error.name === 'QuotaExceededError') {
        alert('Penyimpanan penuh! Gambar terlalu besar atau terlalu banyak data. Coba:\n\n1. Hapus beberapa project lama\n2. Gunakan gambar dengan ukuran lebih kecil\n3. Kurangi jumlah gambar per project');
      }
      
      return false;
    }
  },

  // Check available storage
  getStorageInfo: () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    
    // Approximate localStorage limit (5MB in most browsers)
    const limit = 5 * 1024 * 1024;
    const used = total * 2; // UTF-16 encoding
    const available = limit - used;
    const percentage = (used / limit) * 100;
    
    return {
      used,
      available,
      limit,
      percentage: Math.round(percentage),
      usedMB: (used / (1024 * 1024)).toFixed(2),
      availableMB: (available / (1024 * 1024)).toFixed(2)
    };
  },

  // Clients management
  getClients: () => dataStore.get('clients', []),
  setClients: (clients) => dataStore.set('clients', clients),
  
  addClient: (client) => {
    const clients = dataStore.getClients();
    const newClient = { 
      ...client, 
      id: nanoid(),
      portalId: nanoid(12) // Generate unique portal ID for client portal access
    };
    clients.push(newClient);
    dataStore.setClients(clients);
    return newClient;
  },

  updateClient: (id, updates) => {
    const clients = dataStore.getClients();
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c);
    dataStore.setClients(updated);
    return updated.find(c => c.id === id);
  },

  deleteClient: (id) => {
    const clients = dataStore.getClients();
    const filtered = clients.filter(c => c.id !== id);
    dataStore.setClients(filtered);
    return true;
  },

  getClientByPortalId: (portalId) => {
    const clients = dataStore.getClients();
    return clients.find(c => c.portalId === portalId);
  },

  // Bookings management
  getBookings: () => dataStore.get('bookings', []),
  setBookings: (bookings) => dataStore.set('bookings', bookings),

  addBooking: (booking) => {
    const bookings = dataStore.getBookings();
    const newBooking = { ...booking, id: nanoid() };
    bookings.push(newBooking);
    dataStore.setBookings(bookings);
    return newBooking;
  },

  updateBooking: (id, updates) => {
    const bookings = dataStore.getBookings();
    const updated = bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    dataStore.setBookings(updated);
    return updated.find(b => b.id === id);
  },

  deleteBooking: (id) => {
    const bookings = dataStore.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    dataStore.setBookings(filtered);
    return true;
  },

  // Gallery projects management
  getProjects: () => dataStore.get('gallery_projects', []),
  setProjects: (projects) => dataStore.set('gallery_projects', projects),

  addProject: (project) => {
    const projects = dataStore.getProjects();
    const newProject = {
      ...project,
      id: nanoid(),
      publicId: nanoid(10),
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    dataStore.setProjects(projects);
    return newProject;
  },

  updateProject: (id, updates) => {
    const projects = dataStore.getProjects();
    const updated = projects.map(p => p.id === id ? { ...p, ...updates } : p);
    dataStore.setProjects(updated);
    return updated.find(p => p.id === id);
  },

  deleteProject: (id) => {
    const projects = dataStore.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    dataStore.setProjects(filtered);
    return true;
  },

  getProjectByPublicId: (publicId) => {
    const projects = dataStore.getProjects();
    return projects.find(p => p.publicId === publicId);
  },

  // Payments and invoices management
  getPayments: () => dataStore.get('payments', []),
  setPayments: (payments) => dataStore.set('payments', payments),

  addPayment: (payment) => {
    const payments = dataStore.getPayments();
    const newPayment = { ...payment, id: nanoid() };
    payments.push(newPayment);
    dataStore.setPayments(payments);
    return newPayment;
  },

  updatePayment: (id, updates) => {
    const payments = dataStore.getPayments();
    const updated = payments.map(p => p.id === id ? { ...p, ...updates } : p);
    dataStore.setPayments(updated);
    return updated.find(p => p.id === id);
  },

  deletePayment: (id) => {
    const payments = dataStore.getPayments();
    const filtered = payments.filter(p => p.id !== id);
    dataStore.setPayments(filtered);
    return true;
  },

  getInvoices: () => dataStore.get('invoices', []),
  setInvoices: (invoices) => dataStore.set('invoices', invoices),

  addInvoice: (invoice) => {
    const invoices = dataStore.getInvoices();
    const newInvoice = { ...invoice, id: nanoid() };
    invoices.push(newInvoice);
    dataStore.setInvoices(invoices);
    return newInvoice;
  },

  updateInvoice: (id, updates) => {
    const invoices = dataStore.getInvoices();
    const updated = invoices.map(i => i.id === id ? { ...i, ...updates } : i);
    dataStore.setInvoices(updated);
    return updated.find(i => i.id === id);
  },

  deleteInvoice: (id) => {
    const invoices = dataStore.getInvoices();
    const filtered = invoices.filter(i => i.id !== id);
    dataStore.setInvoices(filtered);
    return true;
  },

  // Leads management
  getLeads: () => dataStore.get('leads', []),
  setLeads: (leads) => dataStore.set('leads', leads),

  addLead: (lead) => {
    const leads = dataStore.getLeads();
    const newLead = { ...lead, id: nanoid() };
    leads.push(newLead);
    dataStore.setLeads(leads);
    return newLead;
  },

  updateLead: (id, updates) => {
    const leads = dataStore.getLeads();
    const updated = leads.map(l => l.id === id ? { ...l, ...updates } : l);
    dataStore.setLeads(updated);
    return updated.find(l => l.id === id);
  },

  deleteLead: (id) => {
    const leads = dataStore.getLeads();
    const filtered = leads.filter(l => l.id !== id);
    dataStore.setLeads(filtered);
    return true;
  },

  // Promotions management
  getPromotions: () => dataStore.get('promotions', []),
  setPromotions: (promotions) => dataStore.set('promotions', promotions),

  addPromotion: (promotion) => {
    const promotions = dataStore.getPromotions();
    const newPromotion = { 
      ...promotion, 
      id: nanoid(),
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    promotions.push(newPromotion);
    dataStore.setPromotions(promotions);
    return newPromotion;
  },

  updatePromotion: (id, updates) => {
    const promotions = dataStore.getPromotions();
    const updated = promotions.map(p => p.id === id ? { ...p, ...updates } : p);
    dataStore.setPromotions(updated);
    return updated.find(p => p.id === id);
  },

  deletePromotion: (id) => {
    const promotions = dataStore.getPromotions();
    const filtered = promotions.filter(p => p.id !== id);
    dataStore.setPromotions(filtered);
    return true;
  },

  // Team members management
  getTeamMembers: () => dataStore.get('team_members', []),
  setTeamMembers: (members) => dataStore.set('team_members', members),

  addTeamMember: (member) => {
    const members = dataStore.getTeamMembers();
    const newMember = { 
      ...member, 
      id: nanoid(),
      joinDate: new Date().toISOString(),
      completedJobs: 0,
      rating: 0,
      status: 'active'
    };
    members.push(newMember);
    dataStore.setTeamMembers(members);
    return newMember;
  },

  updateTeamMember: (id, updates) => {
    const members = dataStore.getTeamMembers();
    const updated = members.map(m => m.id === id ? { ...m, ...updates } : m);
    dataStore.setTeamMembers(updated);
    return updated.find(m => m.id === id);
  },

  deleteTeamMember: (id) => {
    const members = dataStore.getTeamMembers();
    const filtered = members.filter(m => m.id !== id);
    dataStore.setTeamMembers(filtered);
    return true;
  },

  // Public client links management
  getPublicClientLinks: () => dataStore.get('public_client_links', []),
  
  generatePublicClientLink: (clientId) => {
    const links = dataStore.getPublicClientLinks();
    const publicId = nanoid(12);
    const newLink = {
      clientId,
      publicId,
      createdAt: new Date().toISOString(),
      accessCount: 0
    };
    links.push(newLink);
    dataStore.set('public_client_links', links);
    return publicId;
  },

  getClientByPublicId: (publicId) => {
    const links = dataStore.getPublicClientLinks();
    const link = links.find(l => l.publicId === publicId);
    if (!link) return null;
    
    // Increment access count
    const updated = links.map(l => 
      l.publicId === publicId 
        ? { ...l, accessCount: l.accessCount + 1, lastAccessed: new Date().toISOString() }
        : l
    );
    dataStore.set('public_client_links', updated);
    
    const clients = dataStore.getClients();
    return clients.find(c => c.id === link.clientId);
  },

  // Service packages management
  getServicePackages: () => dataStore.get('service_packages', []),
  setServicePackages: (packages) => dataStore.set('service_packages', packages),

  addServicePackage: (pkg) => {
    const packages = dataStore.getServicePackages();
    const newPackage = { 
      ...pkg, 
      id: nanoid(),
      createdAt: new Date().toISOString()
    };
    packages.push(newPackage);
    dataStore.setServicePackages(packages);
    return newPackage;
  },

  updateServicePackage: (id, updates) => {
    const packages = dataStore.getServicePackages();
    const updated = packages.map(p => p.id === id ? { ...p, ...updates } : p);
    dataStore.setServicePackages(updated);
    return updated.find(p => p.id === id);
  },

  deleteServicePackage: (id) => {
    const packages = dataStore.getServicePackages();
    const filtered = packages.filter(p => p.id !== id);
    dataStore.setServicePackages(filtered);
    return true;
  },

  // Pricelist management
  getPricelists: () => dataStore.get('pricelists', []),
  setPricelists: (pricelists) => dataStore.set('pricelists', pricelists),

  addPricelist: (pricelist) => {
    const pricelists = dataStore.getPricelists();
    const newPricelist = {
      ...pricelist,
      id: nanoid(),
      publicId: nanoid(10),
      createdAt: new Date().toISOString()
    };
    pricelists.push(newPricelist);
    dataStore.setPricelists(pricelists);
    return newPricelist;
  },

  updatePricelist: (id, updates) => {
    const pricelists = dataStore.getPricelists();
    const updated = pricelists.map(p => p.id === id ? { ...p, ...updates } : p);
    dataStore.setPricelists(updated);
    return updated.find(p => p.id === id);
  },

  deletePricelist: (id) => {
    const pricelists = dataStore.getPricelists();
    const filtered = pricelists.filter(p => p.id !== id);
    dataStore.setPricelists(filtered);
    return true;
  },

  getPricelistByPublicId: (publicId) => {
    const pricelists = dataStore.getPricelists();
    return pricelists.find(p => p.publicId === publicId);
  }
};
