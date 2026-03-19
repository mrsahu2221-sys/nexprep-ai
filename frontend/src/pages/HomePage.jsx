import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FileText, GraduationCap, Upload, Type, BarChart3, Timer, Award, Zap } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const { isPaid, questionsUsed, MAX_FREE_QUESTIONS } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText, title: t('mockTest'), color: '#3b82f6',
      desc: 'NEET 180Q · JEE Mains 75Q · JEE Advanced Paper 1+2',
      sub: 'Full-length timed tests with OMR-style interface',
      to: '/mock-test',
    },
    {
      icon: GraduationCap, title: t('chapterPractice'), color: '#22c55e',
      desc: 'Select chapter → Get exam-style questions',
      sub: '10, 20, 30 or 50 questions per session',
      to: '/chapter-practice',
    },
    {
      icon: Upload, title: t('pdfUpload'), color: '#a855f7',
      desc: 'Upload any chapter PDF or notes',
      sub: 'AI reads & generates questions from your content',
      to: '/pdf-upload',
    },
    {
      icon: Type, title: t('topicType'), color: '#f59e0b',
      desc: 'Type any topic → Get instant questions',
      sub: 'Quick practice on any concept',
      to: '/topic-type',
    },
  ];

  const exams = [
    { name: t('neetUG'), q: '180Q', time: '200 min', marks: '720', color: 'var(--success)' },
    { name: t('jeeMains'), q: '75Q', time: '180 min', marks: '300', color: 'var(--info)' },
    { name: t('jeeAdvanced'), q: 'P1+P2', time: '6 hrs', marks: '396', color: 'var(--accent)' },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div className="fade-in" style={{
          textAlign: 'center', padding: 'var(--space-2xl) 0',
        }}>
          <div className="social-proof" style={{ marginBottom: 'var(--space-lg)', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
            <span className="dot" /> {t('socialProof')}
          </div>
          <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1 }}>
            <span className="text-gradient">Apni Exam Prep</span> ko{' '}
            <br /><span className="text-gold">Next Level</span> pe le jao 🚀
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: 16, fontWeight: 500 }}>
            AI-powered questions · Real exam difficulty · Smart explanations
          </p>
        </div>

        {/* Exam Cards */}
        <div className="grid-3 mb-lg">
          {exams.map((exam, i) => (
            <div key={i} className="card"
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/mock-test')}>
              <div style={{
                width: 60, height: 60, borderRadius: 20, margin: '0 auto var(--space-md)',
                background: `linear-gradient(135deg, ${exam.color}, transparent)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 30px ${exam.color}20`,
              }}>
                <Award size={32} color="#fff" />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{exam.name}</h3>
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 'var(--space-md)',
                marginTop: 12, fontSize: '0.9rem', color: 'var(--text-secondary)',
                fontWeight: 600,
              }}>
                <span>{exam.q}</span>
                <span style={{ color: 'var(--glass-border)' }}>|</span>
                <span>{exam.time}</span>
                <span style={{ color: 'var(--glass-border)' }}>|</span>
                <span>{exam.marks} {t('marks')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <h2 style={{ marginBottom: 'var(--space-xl)', fontSize: '2rem' }}>Practice Modes</h2>
        <div className="grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
          {features.map(({ icon: Icon, title, color, desc, sub, to }, i) => (
            <div key={i} className="card"
              style={{ cursor: 'pointer', padding: 'var(--space-xl)' }}
              onClick={() => navigate(to)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
                <div style={{
                   width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                   background: `linear-gradient(135deg, ${color}, transparent)`,
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   boxShadow: `0 0 20px ${color}20`,
                }}>
                  <Icon size={32} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>{title}</h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 4 }}>{desc}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard CTA */}
        <div className="card" style={{
          textAlign: 'center', padding: 'var(--space-2xl)',
          border: '1px solid var(--accent)',
          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.05), transparent)',
        }}>
          <BarChart3 size={44} color="var(--accent)" style={{ margin: '0 auto var(--space-md)' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>{t('dashboard')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto var(--space-xl)' }}>
            Track accuracy, weak areas, score history & predicted rank with our AI analytics engine.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '16px 32px' }}>
            <Zap size={20} /> View AI Analytics
          </button>
        </div>

        {/* Demo warning */}
        {!isPaid && (
          <div style={{
            textAlign: 'center', padding: 'var(--space-lg)',
            fontSize: '0.85rem', color: 'var(--text-muted)',
          }}>
            Free demo: {MAX_FREE_QUESTIONS - questionsUsed} questions remaining •{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>
              Upgrade to Lifetime Access
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
