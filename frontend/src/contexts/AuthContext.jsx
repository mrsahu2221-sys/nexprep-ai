import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  // Axios Interceptor for Session Invalidations
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && error.response?.data?.code === 'SESSION_EXPIRED') {
          console.warn('Session expired - multiple logins detected');
          logout();
          alert('Logged in from another device. Please login again.');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Sync with Backend
  const syncWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.post('/api/auth/login', { token });
      
      const { user: dbUser, sessionId } = response.data;
      
      // Store Session ID for future requests
      localStorage.setItem('sessionId', sessionId);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['x-session-id'] = sessionId;
      
      setUser({ ...firebaseUser, ...dbUser });
    } catch (err) {
      console.error('Backend Sync Failed:', err.message);
      signOut(auth);
    }
  };

  const syncUser = async () => {
    if (auth.currentUser) {
      await syncWithBackend(auth.currentUser);
    }
  };

  useEffect(() => {
    // Handle Redirect Result (Fallback)
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        console.log('✅ Redirect login successful');
        await syncWithBackend(result.user);
      }
    }).catch((err) => {
      console.error('Redirect Error:', err.message);
      if (err.code !== 'auth/popup-closed-by-user') {
        alert('Authentication failed. Please try again.');
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncWithBackend(firebaseUser);
      } else {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        delete axios.defaults.headers.common['x-session-id'];
        localStorage.removeItem('sessionId');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Check if mobile or similar restricted environment
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('📱 Mobile detected - Using Redirect');
        return await signInWithRedirect(auth, googleProvider);
      }

      console.log('🖥️ Desktop detected - Attempting Popup');
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login Method Error:', err.code, err.message);
      
      // Fallback for blocked popups or other issues
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        console.log('⚠️ Popup blocked - Falling back to Redirect');
        return await signInWithRedirect(auth, googleProvider);
      }
      throw err;
    }
  };


  const logout = () => signOut(auth);

  const canAccess = () => {
    return (user?.isPaid || (user?.questionsUsed || 0) < 5);
  };

  const trackQuestion = async () => {
    if (!user) return;
    // Local update for immediate UI feedback
    setUser(prev => ({ ...prev, questionsUsed: (prev.questionsUsed || 0) + 1 }));
  };

  const value = {
    user,
    loading,
    showPaywall,
    setShowPaywall,
    isPaid: user?.isPaid || false,
    questionsUsed: user?.questionsUsed || 0,
    MAX_FREE_QUESTIONS: 5,
    canAccess,
    trackQuestion,
    syncUser,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
