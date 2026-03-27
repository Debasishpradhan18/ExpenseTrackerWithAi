import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isDemoMode } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, we start logged out but simulate instantly.
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // For Demo Mode injection
  const demoLogin = (mockUser) => setUser(mockUser);
  const demoLogout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, demoLogin, demoLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
