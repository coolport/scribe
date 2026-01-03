import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: number; email: string; name: string } | null;
  jwt: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Checking for stored JWT...');
    const storedJwt = localStorage.getItem('jwt');
    if (storedJwt) {
      console.log('AuthProvider: Found stored JWT');
      setJwt(storedJwt);
      setIsAuthenticated(true);
      
      try {
        const payload = JSON.parse(atob(storedJwt.split('.')[1]));
        setUser({
          id: parseInt(payload.sub),
          email: payload.email || '',
          name: payload.name || '',
        });
        console.log('AuthProvider: User loaded from storage:', payload);
      } catch (e) {
        console.error('AuthProvider: Failed to decode JWT:', e);
        logout();
      }
    } else {
      console.log('AuthProvider: No stored JWT found');
    }
  }, []);

  const login = (token: string) => {
    console.log('AuthProvider: Login called');
    localStorage.setItem('jwt', token);
    setJwt(token);
    setIsAuthenticated(true);
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: parseInt(payload.sub),
        email: payload.email || '',
        name: payload.name || '',
      });
      console.log('AuthProvider: User authenticated:', payload);
    } catch (e) {
      console.error('AuthProvider: Failed to decode JWT on login:', e);
      logout();
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logout called');
    localStorage.removeItem('jwt');
    setJwt(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
