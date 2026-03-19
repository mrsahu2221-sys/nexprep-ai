import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Chrome, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogle = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      // With signInWithPopup, the page does not reload, but onAuthStateChanged in AuthContext will handle the update.
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fade-in" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', padding: 'var(--space-xl)'
    }}>
      <div className="card glass-panel" style={{ maxWidth: 450, width: '100%', padding: 'var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="text-gold" style={{ fontSize: '2.5rem', marginBottom: 8 }}>
            <ShieldCheck size={48} style={{ margin: '0 auto' }} />
          </div>
          <h2>Secure Access</h2>
          <p style={{ color: 'var(--text-secondary)' }}>NexPrep AI Strict Authentication</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', 
            padding: '12px', borderRadius: 8, marginBottom: 20, fontSize: '0.9rem',
            border: '1px solid rgba(255, 68, 68, 0.2)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Social Auth */}
        <button onClick={handleGoogle} disabled={loading} className="btn btn-secondary w-full mb-md" 
          style={{ justifyContent: 'center', gap: 12, height: 54 }}>
          <Chrome size={20} /> Continue with Google
        </button>


        <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          By continuing, you agree to the single-session policy. 
          Logging in on another device will disconnect this session.
        </p>
      </div>
    </div>
  );
}
