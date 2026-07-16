import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    return cred.user;
  }

  async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function resendVerification() {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function subscribeNewsletter(email) {
    if (!isFirebaseConfigured) return false;
    await addDoc(collection(db, 'newsletter'), { email, createdAt: serverTimestamp() });
    return true;
  }

  async function submitOrder(orderData) {
    if (!isFirebaseConfigured) return false;
    await addDoc(collection(db, 'orders'), {
      ...orderData,
      userId: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });
    return true;
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isVerified: Boolean(user?.emailVerified),
      isConfigured: isFirebaseConfigured,
      signUp,
      signIn,
      signOut,
      resendVerification,
      subscribeNewsletter,
      submitOrder,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
