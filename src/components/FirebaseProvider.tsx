import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole } from '../types';

export const AUTHORIZED_ADMIN_EMAILS = [
  'ju27ine@gmail.com',
  'eugeniojv31@gmail.com',
  'jacotradesdevs@gmail.com',
  import.meta.env.VITE_ADMIN_EMAIL || '',
].filter(Boolean).map(e => e.toLowerCase());

interface FirebaseContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  setRole: (role: UserRole) => void;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  role: 'guest',
  loading: true,
  isAdmin: false,
  setRole: () => {},
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    } catch {
      // Non-fatal if browser environment handles storage natively
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        
        if (currentUser && currentUser.email) {
          const userEmail = currentUser.email.toLowerCase();
          const isUserEmailAdmin = AUTHORIZED_ADMIN_EMAILS.includes(userEmail);

          if (isUserEmailAdmin) {
            setRole('admin');
            setIsAdmin(true);
          } else {
            // Check Firestore user doc safely
            try {
              const userDocRef = doc(db, 'users', currentUser.uid);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists() && userDoc.data()?.role === 'admin') {
                setRole('admin');
                setIsAdmin(true);
              } else {
                setRole('client');
                setIsAdmin(false);
              }
            } catch {
              setRole('client');
              setIsAdmin(false);
            }
          }
        } else {
          setRole('guest');
          setIsAdmin(false);
        }
      } catch (err) {
        console.warn('Auth state error (handled):', err);
        setRole('guest');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    role,
    loading,
    isAdmin,
    setRole,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

