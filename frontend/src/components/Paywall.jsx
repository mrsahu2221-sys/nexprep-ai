import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Zap, Shield, Star } from 'lucide-react';

export default function Paywall() {
  const { t } = useLanguage();
  const { showPaywall, setShowPaywall, unlockPaid } = useAuth();
  const [countdown, setCountdown] = useState(23 * 3600 + 47 * 60);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showPaywall) return;
    const iv = setInterval(() => {
      setCountdown(p => (p <= 0 ? 0 : p - 1));
    }, 1000);
    return () => clearInterval(iv);
  }, [showPaywall]);

  const hrs = Math.floor(countdown / 3600);
  const mins = Math.floor((countdown % 3600) / 60);
  const secs = countdown % 60;

  const handlePayment = () => {
    setShowPaywall(false);
    navigate('/payment');
  };

  if (!showPaywall) return null;

  return (
    <div className="paywall-overlay">
      <div className="paywall-backdrop" onClick={() => setShowPaywall(false)} />
      <div className="paywall-card">
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-lg)', fontSize: '1.8rem',
        }}>
          <Lock size={28} color="white" />
        </div>

        <h2 style={{ marginBottom: 8 }}>{t('paywallTitle')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          {t('paywallDesc')}
        </p>

        <div style={{
          background: 'var(--bg-tertiary)', borderRadius: 12,
          padding: 'var(--space-md)', marginBottom: 'var(--space-lg)',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
            {t('paywallPrice')}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, textDecoration: 'line-through' }}>
            ₹2,999
          </div>
        </div>

        {/* Features */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          marginBottom: 'var(--space-lg)', textAlign: 'left',
        }}>
          {[
            { icon: Zap, text: 'Unlimited AI-generated questions' },
            { icon: Shield, text: 'All exam modes — NEET, JEE Mains, Advanced' },
            { icon: Star, text: 'Detailed AI explanations & shortcuts' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.9rem', color: 'var(--text-secondary)',
            }}>
              <Icon size={16} color="var(--accent)" />
              {text}
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg w-full" onClick={handlePayment}>
          {t('payNow')}
        </button>

        {/* Countdown FOMO */}
        <div style={{
          marginTop: 'var(--space-md)', fontSize: '0.8rem',
          color: 'var(--warning)',
        }}>
          ⏰ {t('offerEnds')}: {hrs.toString().padStart(2, '0')}:
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>

        <button className="btn btn-ghost mt-md"
          onClick={() => setShowPaywall(false)}
          style={{ fontSize: '0.8rem' }}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}
