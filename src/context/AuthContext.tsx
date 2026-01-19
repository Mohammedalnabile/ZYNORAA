import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'driver';

export type AvailabilityStatus = 'online' | 'offline' | 'busy';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  activeRole: UserRole;
  availabilityStatus: AvailabilityStatus;
  trustScore: number;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: (remainAvailable?: boolean) => Promise<void>;
  signup: (data: SignupData) => Promise<boolean>;
  updateRole: (role: UserRole) => void;
  updateAvailabilityStatus: (status: AvailabilityStatus) => void;
  hasRole: (role: UserRole) => boolean;
  canAccess: (requiredRoles?: UserRole[]) => boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roles: UserRole[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = user !== null;

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('zynora-user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        });
      } catch {
        localStorage.removeItem('zynora-user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('zynora-user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        roles: ['buyer', 'seller', 'driver'],
        activeRole: 'buyer',
        availabilityStatus: 'online',
        trustScore: 85,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (remainAvailable = false): Promise<void> => {
    if (user) {
      // Update availability status before logout
      const finalStatus: AvailabilityStatus = remainAvailable ? 'online' : 'offline';
      
      // TODO: Send to backend
      console.log('Logging out with availability:', finalStatus);
      
      // Clear local storage
      localStorage.removeItem('zynora-user');
      setUser(null);
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock signup - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        roles: data.roles,
        activeRole: data.roles[0],
        availabilityStatus: 'online',
        trustScore: 50,
        createdAt: new Date(),
      };
      
      setUser(newUser);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setUser({ ...user, activeRole: role });
    }
  };

  const updateAvailabilityStatus = (status: AvailabilityStatus) => {
    if (user) {
      setUser({ ...user, availabilityStatus: status });
      // TODO: Sync with backend
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const canAccess = (requiredRoles?: UserRole[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user) return false;
    return requiredRoles.some(role => user.roles.includes(role));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
        signup,
        updateRole,
        updateAvailabilityStatus,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
