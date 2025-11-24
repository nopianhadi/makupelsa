const DEMO_USERS = [
  {
    id: '1',
    email: 'demo@muafinance.com',
    password: 'demo123',
    name: 'Demo MUA',
    phone: '081234567890',
    businessName: 'Glam Beauty Studio',
    role: 'owner'
  },
  {
    id: '2',
    email: 'test@muafinance.com',
    password: 'test123',
    name: 'Test MUA',
    phone: '082345678901',
    businessName: 'Elegance Makeup',
    role: 'mua'
  }
];

class MockAuthService {
  constructor() {
    this.currentUser = null;
    this.loadSession();
  }

  loadSession() {
    const sessionData = localStorage.getItem('auth_session');
    if (sessionData) {
      try {
        this.currentUser = JSON.parse(sessionData);
      } catch (e) {
        localStorage.removeItem('auth_session');
      }
    }
  }

  saveSession(user) {
    this.currentUser = user;
    localStorage.setItem('auth_session', JSON.stringify(user));
  }

  clearSession() {
    this.currentUser = null;
    localStorage.removeItem('auth_session');
  }

  async signIn(email, password) {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email atau password salah');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.saveSession(userWithoutPassword);
    
    return { user: userWithoutPassword, session: { user: userWithoutPassword } };
  }

  async signUp(email, password, userData) {
    const existingUser = DEMO_USERS.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      ...userData,
      role: 'mua'
    };

    DEMO_USERS.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    this.saveSession(userWithoutPassword);
    
    return { user: userWithoutPassword, session: { user: userWithoutPassword } };
  }

  async signOut() {
    this.clearSession();
    return { error: null };
  }

  async getSession() {
    return { 
      user: this.currentUser,
      session: this.currentUser ? { user: this.currentUser } : null 
    };
  }

  async getUserProfile(userId) {
    if (this.currentUser && this.currentUser.id === userId) {
      return this.currentUser;
    }
    return null;
  }

  async updateProfile(userId, updates) {
    if (this.currentUser && this.currentUser.id === userId) {
      const updatedUser = { ...this.currentUser, ...updates };
      this.saveSession(updatedUser);
      return updatedUser;
    }
    throw new Error('User not found');
  }

  async resetPassword(email) {
    const user = DEMO_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Email tidak ditemukan');
    }
    return { error: null };
  }
}

export const mockAuthService = new MockAuthService();
