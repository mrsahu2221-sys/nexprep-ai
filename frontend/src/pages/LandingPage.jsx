import { Crown, Users, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage() {
  const { setLang, LANGUAGES, t } = useLanguage();

  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: 'var(--space-xl)',
    }}>
      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
          }} />
        ))}
      </div>

      {/* Hero */}
      <div className="text-center" style={{ maxWidth: 800 }}>
        <div style={{
          width: 100, height: 100, borderRadius: 30,
          background: 'linear-gradient(135deg, #d4af37, #f1c40f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-xl)',
          boxShadow: '0 0 50px var(--gold-glow)',
          transform: 'rotate(-5deg)',
        }}>
          <Crown size={50} color="#050a18" strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '4rem', marginBottom: 12 }}>
          <span className="text-gradient">NexPrep AI</span>
        </h1>
        <p style={{
          fontSize: '1.4rem', color: 'var(--text-secondary)',
          fontWeight: 500, marginBottom: 'var(--space-2xl)',
          maxWidth: 600, margin: '0 auto var(--space-2xl)',
        }}>
          The Future of NEET & JEE Prep. AI-Driven, Premium-Crafted.
        </p>

        {/* Social proof */}
        <div className="social-proof" style={{ margin: '0 auto var(--space-2xl)' }}>
          <span className="dot" />
          <Users size={14} />
          <span>1,00,000+ NEET/JEE aspirants ki pasand</span>
        </div>

        {/* Language Selection */}
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>
            🌐 Select Your Language / अपनी भाषा चुनें
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-sm)',
          }}>
            {LANGUAGES.map((lang, i) => (
              <button key={lang.code}
                onClick={() => setLang(lang.code)}
                className={`btn btn-secondary fade-in-up stagger-${i % 4 + 1}`}
                style={{
                  padding: '14px 16px', justifyContent: 'center',
                  fontSize: '1rem',
                }}>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Features teaser */}
        <div className="grid-3 mt-xl" style={{ maxWidth: 600 }}>
          {[
            { icon: BookOpen, label: 'Real Exam Questions', sub: 'AI-generated at exact difficulty' },
            { icon: Sparkles, label: 'Smart Explanations', sub: 'Why correct + why wrong' },
            { icon: Trophy, label: 'Rank Prediction', sub: 'Know where you stand' },
          ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className={`fade-in-up stagger-${i + 1}`}
              style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
              <Icon size={28} color="var(--accent)" style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
