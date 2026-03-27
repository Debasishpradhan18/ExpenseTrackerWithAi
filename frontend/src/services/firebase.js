import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '12345',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id'
};

const isDemoMode = firebaseConfig.apiKey === 'demo-key';

let app, auth, googleProvider;

if (!isDemoMode) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, isDemoMode };

// Mock Functions for Demo Mode
export const loginWithGoogle = async () => {
  if (isDemoMode) return Promise.resolve({ user: { email: 'demo@example.com', displayName: 'Demo User', uid: 'demo-123' }});
  return signInWithPopup(auth, googleProvider);
};

export const loginWithEmail = async (email, password) => {
  if (isDemoMode) return Promise.resolve({ user: { email, displayName: 'Demo User', uid: 'demo-123' }});
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password) => {
  if (isDemoMode) return Promise.resolve({ user: { email, displayName: 'Demo User', uid: 'demo-123' }});
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  if (isDemoMode) return Promise.resolve();
  return signOut(auth);
};
