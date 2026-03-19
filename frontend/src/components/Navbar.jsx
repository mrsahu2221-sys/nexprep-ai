import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Home, FileText, Upload, Type, BarChart3, Settings, Globe, GraduationCap, Crown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { t, lang, setLang, LANGUAGES } = useLanguage();
  const { user, logout, isPaid, questionsUsed, MAX_FREE_QUESTIONS } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const links = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/mock-test', icon: FileText, label: t('mockTest') },
    { to: '/chapter-practice', icon: GraduationCap, label: t('chapterPractice') },
    { to: '/pdf-upload', icon: Upload, label: t('pdfUpload') },
    { to: '/topic-type', icon: Type, label: t('topicType') },
    { to: '/dashboard', icon: BarChart3, label: t('dashboard') },
  ];

  return (
    <nav style={{
      background: 'rgba(5, 10, 24, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '0 var(--space-lg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 70, maxWidth: 1200, margin: '0 auto',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontWeight: 900, fontSize: '1.4rem', color: '#fff',
          textDecoration: 'none', letterSpacing: '-0.02em',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #d4af37, #f1c40f)',
            borderRadius: 12, width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--gold-glow)',
          }}>
            <Crown size={24} color="#050a18" strokeWidth={2.5} />
          </div>
          <span className="text-gradient">NexPrep <span style={{ color: 'var(--accent-light)' }}>AI</span></span>
        </Link>

        {/* Nav Links - desktop */}
        <div className="nav-links" style={{
          display: 'flex', gap: 4, alignItems: 'center',
        }}>
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 500,
              color: location.pathname === to ? 'var(--accent)' : 'var(--text-secondary)',
              background: location.pathname === to ? 'var(--bg-hover)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}>
              <Icon size={16} />
              <span className="nav-label">{label}</span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {!isPaid && (
                <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                  {questionsUsed}/{MAX_FREE_QUESTIONS} free
                </span>
              )}
              {isPaid && <span className="badge badge-success">PRO ✓</span>}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', background: 'var(--bg-hover)', borderRadius: 20 }}>
                {user.photoURL && (
                  <img src={user.photoURL} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {user.displayName?.split(' ')[0]}
                </span>
                <button onClick={logout} className="btn-ghost" style={{ padding: 4, display: 'flex' }} title="Logout">
                  <Settings size={14} />
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
              Login
            </Link>
          )}

          {/* Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon"
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{ fontSize: '1.1rem' }}>
              <Globe size={18} />
            </button>
            {showLangMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 4,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 8, minWidth: 160, zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
              }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center',
                      width: '100%', padding: '8px 12px', border: 'none',
                      background: lang === l.code ? 'var(--bg-hover)' : 'transparent',
                      color: lang === l.code ? 'var(--accent)' : 'var(--text-primary)',
                      borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)',
                      fontSize: '0.9rem',
                    }}>
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
