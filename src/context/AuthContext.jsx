import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Wraps any promise with a timeout — prevents infinite hanging
const withTimeout = (promise, ms = 15000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT: Request timed out. Check your internet connection.')), ms)
  );
  return Promise.race([promise, timeout]);
};

// Write to Firestore non-blocking — won't freeze auth if DB not ready
const saveUserProfile = async (user, extra = {}) => {
  try {
    await withTimeout(
      setDoc(
        doc(db, 'users', user.uid),
        { uid: user.uid, fullName: user.displayName || extra.fullName || '', email: user.email, createdAt: new Date().toISOString(), ...extra },
        { merge: true }
      ),
      8000
    );
  } catch (err) {
    console.warn('Firestore profile write skipped:', err.message);
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, fullName) => {
    const { user } = await withTimeout(
      createUserWithEmailAndPassword(auth, email, password)
    );
    await updateProfile(user, { displayName: fullName });
    saveUserProfile(user, { fullName }); // fire-and-forget
    return user;
  };

  const login = (email, password) => {
    return withTimeout(signInWithEmailAndPassword(auth, email, password));
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const { user } = await withTimeout(signInWithPopup(auth, provider), 60000);
    saveUserProfile(user); // fire-and-forget
    return user;
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, loginWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
