import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Timer from '../components/Timer';
import axios from 'axios';
import { Flag, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const EXAM_CONFIG = {
  neet: { name: 'NEET UG', totalQ: 180, time: 200, marks: 720,
    sections: [
      { name: 'Physics', count: 45, type: 'mcq' },
      { name: 'Chemistry', count: 45, type: 'mcq' },
      { name: 'Botany', count: 45, type: 'mcq' },
      { name: 'Zoology', count: 45, type: 'mcq' },
    ],
    marking: { correct: 4, wrong: -1, unattempted: 0 },
  },
  jee_mains: { name: 'JEE Mains', totalQ: 75, time: 180, marks: 300,
    sections: [
      { name: 'Physics', count: 25, type: 'mixed', mcq: 20, numerical: 5 },
      { name: 'Chemistry', count: 25, type: 'mixed', mcq: 20, numerical: 5 },
      { name: 'Mathematics', count: 25, type: 'mixed', mcq: 20, numerical: 5 },
    ],
    marking: { correct: 4, wrong: -1, unattempted: 0 },
  },
  jee_advanced: { name: 'JEE Advanced', totalQ: 54, time: 180, marks: 198,
    sections: [
      { name: 'Physics', count: 18, type: 'advanced' },
      { name: 'Chemistry', count: 18, type: 'advanced' },
      { name: 'Mathematics', count: 18, type: 'advanced' },
    ],
    marking: { correct: 4, wrong: -1, partial: true },
  },
};

export default function MockTestPage() {
  const { t, lang } = useLanguage();
  const { canAccess, trackQuestion } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState(new Set());
  const [activeSection, setActiveSection] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  const startTest = async (examType) => {
    if (!canAccess()) return;
    setExam(examType);
    setLoading(true);

    try {
      const config = EXAM_CONFIG[examType];
      const allQuestions = [];

      for (const section of config.sections) {
        const { data } = await axios.post('/api/questions/generate', {
          exam: examType, subject: section.name,
          count: Math.min(section.count, 10), // limit for API
          language: lang || 'en', difficulty: 'mixed',
        });
        const qs = (data.questions || []).map((q, i) => ({
          ...q, section: section.name,
          qType: section.type === 'mixed' && i >= (section.mcq || section.count) ? 'numerical' : 'mcq',
          id: `${section.name}_${i}`,
        }));
        allQuestions.push(...qs);
      }

      // If API failed or returned nothing, use sample questions
      if (allQuestions.length === 0) {
        const config = EXAM_CONFIG[examType];
        for (const section of config.sections) {
          for (let i = 0; i < Math.min(section.count, 5); i++) {
            allQuestions.push({
              id: `${section.name}_${i}`,
              section: section.name,
              question: `[${section.name}] Sample Question ${i + 1}: This is a placeholder. Connect the backend API for real AI-generated questions.`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct: 0,
              qType: 'mcq',
              explanation: { correct: 'Sample explanation', wrong: {}, trick: 'N/A', ncert: 'N/A' },
            });
          }
        }
      }

      setQuestions(allQuestions);
      setTestStarted(true);
    } catch (err) {
      // Fallback: generate placeholder questions
      const config = EXAM_CONFIG[examType];
      const allQuestions = [];
      for (const section of config.sections) {
        for (let i = 0; i < Math.min(section.count, 5); i++) {
          allQuestions.push({
            id: `${section.name}_${i}`, section: section.name, qType: 'mcq',
            question: `[${section.name}] Sample Question ${i + 1} — Connect backend for AI questions`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct: 0,
            explanation: { correct: 'Connect the backend API for explanations', wrong: {}, trick: 'N/A', ncert: 'N/A' },
          });
        }
      }
      setQuestions(allQuestions);
      setTestStarted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIdx, value) => {
    trackQuestion();
    setAnswers(prev => ({ ...prev, [qIdx]: value }));
  };

  const toggleMark = (qIdx) => {
    setMarked(prev => {
      const s = new Set(prev);
      s.has(qIdx) ? s.delete(qIdx) : s.add(qIdx);
      return s;
    });
  };

  const handleSubmit = useCallback(() => {
    setTestEnded(true);
    const config = EXAM_CONFIG[exam];
    let score = 0, correct = 0, wrong = 0, unattempted = 0;

    questions.forEach((q, i) => {
      if (answers[i] === undefined) { unattempted++; }
      else if (answers[i] === q.correct) { correct++; score += config.marking.correct; }
      else { wrong++; score += config.marking.wrong; }
    });

    // Save results and navigate
    const results = {
      exam, score, total: config.marks, correct, wrong, unattempted,
      questions, answers, totalQuestions: questions.length,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('prepmaster_last_result', JSON.stringify(results));

    // Save to history
    const history = JSON.parse(localStorage.getItem('prepmaster_history') || '[]');
    history.push({ exam, score, total: config.marks, correct, wrong, unattempted,
      totalQuestions: questions.length, timestamp: results.timestamp });
    localStorage.setItem('prepmaster_history', JSON.stringify(history));

    navigate('/results');
  }, [exam, questions, answers, navigate]);

  // Get sections for current exam
  const config = exam ? EXAM_CONFIG[exam] : null;
  const sections = config ? config.sections : [];
  const sectionQuestions = sections.length > 0
    ? questions.filter(q => q.section === sections[activeSection]?.name)
    : questions;
  const sectionOffset = sections.length > 0
    ? questions.findIndex(q => q.section === sections[activeSection]?.name)
    : 0;

  // ===== EXAM SELECTION SCREEN =====
  if (!testStarted) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 className="text-center fade-in-up" style={{ marginBottom: 'var(--space-xl)' }}>
            🎯 {t('mockTest')} — {t('fullTest')}
          </h1>

          {loading ? (
            <div className="card text-center" style={{ padding: 'var(--space-2xl)' }}>
              <Loader size={48} className="spin" color="var(--accent)"
                style={{ margin: '0 auto var(--space-md)', animation: 'spin 1s linear infinite' }} />
              <h3>{t('loadingQuestions')}</h3>
              <p className="text-secondary mt-sm">Crafting premium AI questions...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {Object.entries(EXAM_CONFIG).map(([key, cfg]) => (
                <div key={key} className="card"
                  style={{ cursor: 'pointer' }} onClick={() => startTest(key)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: 6 }}>{cfg.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {cfg.totalQ} {t('questions')} · {cfg.time} {t('minutes')} · {cfg.marks} {t('marks')}
                      </p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                        {cfg.sections.map((s, i) => (
                          <span key={i} className="badge" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>{s.name}</span>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-premium">{t('startTest')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== TEST INTERFACE =====
  const q = questions[currentQ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Timer Bar */}
      <div className="timer-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{config.name}</span>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            {t('question')} {currentQ + 1} {t('of')} {questions.length}
          </span>
        </div>
        <Timer totalMinutes={config.time} onTimeUp={handleSubmit} />
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          {t('submitTest')}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="tabs" style={{ margin: 'var(--space-sm) var(--space-lg)' }}>
        {sections.map((s, i) => (
          <button key={i} className={`tab ${activeSection === i ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(i);
              const idx = questions.findIndex(q => q.section === s.name);
              if (idx >= 0) setCurrentQ(idx);
            }}>
            {s.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flex: 1, gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)' }}>
        {/* Question Panel */}
        <div style={{ flex: 1 }}>
          {q && (
            <div className="card fade-in" style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <span className="badge" style={{ background: 'var(--accent)', color: '#fff' }}>Q{currentQ + 1}</span>
                <span className="badge" style={{ background: q.qType === 'numerical' ? 'var(--gold)' : 'var(--accent-light)', color: '#050a18' }}>
                  {q.qType === 'numerical' ? t('numerical') : t('mcq')}
                </span>
              </div>

              <p style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>
                {q.question}
              </p>

              {/* MCQ Options */}
              {q.qType !== 'numerical' && q.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {q.options.map((opt, oi) => (
                    <button key={oi}
                      onClick={() => handleAnswer(currentQ, oi)}
                      className="card"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-xl)',
                        width: '100%', padding: '16px 24px',
                        background: answers[currentQ] === oi ? 'var(--accent)' : 'var(--glass)',
                        borderColor: answers[currentQ] === oi ? 'var(--accent-light)' : 'var(--glass-border)',
                        cursor: 'pointer', textAlign: 'left',
                        color: '#fff',
                      }}>
                      <span className={`orb ${answers[currentQ] === oi ? 'selected' : ''}`}
                        style={{ flexShrink: 0 }}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{opt}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Numerical Input */}
              {q.qType === 'numerical' && (
                <div style={{ marginTop: 'var(--space-md)' }}>
                  <label className="label">Enter your answer:</label>
                  <input type="number" className="numerical-input"
                    value={answers[currentQ] ?? ''}
                    onChange={(e) => handleAnswer(currentQ, parseFloat(e.target.value))}
                    placeholder="0.00" />
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)',
                flexWrap: 'wrap',
              }}>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => { setAnswers(prev => { const n = {...prev}; delete n[currentQ]; return n; }); }}>
                  {t('clearResponse')}
                </button>
                <button className={`btn btn-sm ${marked.has(currentQ) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleMark(currentQ)}>
                  <Flag size={14} /> {t('markReview')}
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary"
              disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}>
              <ChevronLeft size={16} /> {t('prevQuestion')}
            </button>
            <button className="btn btn-primary"
              disabled={currentQ === questions.length - 1}
              onClick={() => setCurrentQ(p => p + 1)}>
              {t('nextQuestion')} <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div className="card" style={{ width: 220, flexShrink: 0, alignSelf: 'flex-start' }}>
          <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: '0.85rem' }}>
            Question Navigator
          </h4>
          <div className="q-nav-grid">
            {questions.map((_, i) => (
              <button key={i} onClick={() => { setCurrentQ(i); }}
                className={`q-nav-btn ${i === currentQ ? 'active' : ''} ${
                  answers[i] !== undefined ? 'answered' : ''} ${
                  marked.has(i) ? 'review' : ''}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-md)', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--success)' }} />
              Answered: {Object.keys(answers).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--warning)' }} />
              Marked: {marked.size}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
              Unanswered: {questions.length - Object.keys(answers).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
