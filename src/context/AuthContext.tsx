import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithGoogle: (customEmail?: string, customName?: string, role?: UserProfile['role']) => void;
  logout: () => void;
  switchRole: (role: UserProfile['role']) => void;
  switchFacility: (facility: string) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const STORAGE_KEY = 'machinemind_user_session';

const DEFAULT_USER: UserProfile = {
  id: 'usr_g_49572004425',
  name: 'Harshit Sharma',
  email: 'harshit998ops@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'Plant Operations Manager',
  facility: 'Plant Alpha - Alwar Manufacturing Hub',
  provider: 'google',
  loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default logged in with the current user email to provide instant gratification, or null
    return DEFAULT_USER;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = (customEmail?: string, customName?: string, role?: UserProfile['role']) => {
    const email = customEmail || 'harshit998ops@gmail.com';
    const name = customName || (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    const newUser: UserProfile = {
      id: `usr_g_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      avatar: email === 'harshit998ops@gmail.com'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
        : `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0284c7`,
      role: role || 'Plant Operations Manager',
      facility: 'Plant Alpha - Alwar Manufacturing Hub',
      provider: 'google',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUser(newUser);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: UserProfile['role']) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const switchFacility = (facility: string) => {
    if (user) {
      setUser({ ...user, facility });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        switchRole,
        switchFacility,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
