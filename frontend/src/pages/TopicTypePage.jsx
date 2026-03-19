import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Zap, Loader, Search } from 'lucide-react';

export default function TopicTypePage() {
  const { t, lang } = useLanguage();
  const { canAccess } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [exam, setExam] = useState('neet');
  const [numQ, setNumQ] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (!canAccess()) return;
    setLoading(true);

    try {
      const { data } = await axios.post('/api/questions/generate', {
        exam, topic: topic.trim(), count: numQ,
        language: lang || 'en', difficulty: 'mixed',
      });
      if (data.questions?.length > 0) {
        const results = { exam, questions: data.questions.map((q, i) => ({ ...q, id: i, qType: 'mcq' })),
          answers: {}, totalQuestions: data.questions.length,
          score: 0, total: data.questions.length * 4,
          correct: 0, wrong: 0, unattempted: data.questions.length,
          timestamp: new Date().toISOString(), topic };
        localStorage.setItem('prepmaster_last_result', JSON.stringify(results));
        navigate('/results');
      } else throw new Error('empty');
    } catch {
      const qs = [];
      for (let i = 0; i < numQ; i++) {
        qs.push({ id: i, qType: 'mcq',
          question: `[${topic}] Sample Q${i+1} — Connect backend for AI-generated questions`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: Math.floor(Math.random() * 4),
          explanation: { correct: 'Connect API', wrong: {}, trick: 'N/A', ncert: 'N/A' },
        });
      }
      const results = { exam, questions: qs, answers: {}, totalQuestions: numQ,
        score: 0, total: numQ * 4, correct: 0, wrong: 0, unattempted: numQ,
        timestamp: new Date().toISOString(), topic };
      localStorage.setItem('prepmaster_last_result', JSON.stringify(results));
      navigate('/results');
    } finally { setLoading(false); }
  };

  const quickTopics = [
    'Newton\'s Laws of Motion', 'Organic Reactions', 'Cell Division',
    'Electrostatics', 'Probability', 'Chemical Equilibrium',
    'Human Reproduction', 'Matrices', 'Thermodynamics',
  ];

  return (
    <div className="fade-in">
      <div className="container" style={{ maxWidth: 650, margin: 'var(--space-2xl) auto' }}>
        <h1 className="text-center" style={{ marginBottom: 'var(--space-2xl)', fontSize: '3.5rem' }}>
          <span className="text-gradient">AI Topic Prep</span>
        </h1>

        <div className="card" style={{ padding: 'var(--space-2xl)' }}>
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="label">Exam Context</label>
            <select className="input" value={exam} onChange={e => setExam(e.target.value)}>
              <option value="neet">NEET UG</option>
              <option value="jee_mains">JEE Mains</option>
              <option value="jee_advanced">JEE Advanced</option>
            </select>
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="label">What do you want to learn?</label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--accent)',
              }} />
              <input className="input" style={{ paddingLeft: 48, height: 56, fontSize: '1.1rem' }}
                placeholder="Type any topic (e.g. Quantum Mechanics)..." value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
            </div>
          </div>

          {/* Quick Topics */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase' }}>
              Trending Topics:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickTopics.map(tp => (
                <button key={tp} className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 20 }}
                  onClick={() => setTopic(tp)}>{tp}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="label">Question Count</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {[10, 20, 30, 50].map(n => (
                <button key={n} className={`btn ${numQ === n ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setNumQ(n)}>{n}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-premium btn-lg w-full" disabled={!topic.trim() || loading}
            onClick={handleGenerate} style={{ padding: '18px' }}>
            {loading ? (
              <><Loader size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Crafting...</>
            ) : (
              <><Zap size={20} /> Generate AI Questions</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
