import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Loader, BookOpen } from 'lucide-react';

const CHAPTERS = {
  neet: {
    Physics: ['Laws of Motion', 'Work Energy Power', 'Gravitation', 'Electrostatics', 'Current Electricity', 'Optics', 'Modern Physics', 'Thermodynamics', 'Waves', 'Magnetism'],
    Chemistry: ['Chemical Bonding', 'Periodic Table', 'Organic Chemistry', 'Equilibrium', 'Electrochemistry', 'Solutions', 'Coordination Compounds', 'Aldehydes & Ketones', 'Polymers', 'Biomolecules'],
    Botany: ['Cell Biology', 'Plant Morphology', 'Plant Physiology', 'Genetics', 'Ecology', 'Plant Reproduction', 'Biotechnology', 'Plant Kingdom', 'Anatomy of Plants'],
    Zoology: ['Human Physiology', 'Animal Kingdom', 'Evolution', 'Human Reproduction', 'Human Health', 'Microbes', 'Body Fluids', 'Locomotion', 'Neural Control'],
  },
  jee_mains: {
    Physics: ['Mechanics', 'Electrostatics', 'Current Electricity', 'Magnetism', 'Optics', 'Modern Physics', 'Waves', 'Thermodynamics', 'Rotational Motion', 'SHM'],
    Chemistry: ['Organic Chemistry', 'Physical Chemistry', 'Inorganic Chemistry', 'Chemical Kinetics', 'Electrochemistry', 'Solutions', 'Equilibrium', 'Coordination Compounds', 'Metallurgy', 'Polymers'],
    Mathematics: ['Calculus', 'Coordinate Geometry', 'Algebra', 'Trigonometry', 'Probability', 'Matrices & Determinants', 'Vectors', 'Complex Numbers', 'Sequences & Series', 'Differential Equations'],
  },
  jee_advanced: {
    Physics: ['Mechanics', 'Electrodynamics', 'Optics & Waves', 'Thermodynamics', 'Modern Physics'],
    Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    Mathematics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry', 'Vectors & 3D'],
  },
};

export default function ChapterPracticePage() {
  const { t, lang } = useLanguage();
  const { canAccess, trackQuestion } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [numQ, setNumQ] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const subjects = exam ? Object.keys(CHAPTERS[exam] || {}) : [];
  const chapters = exam && subject ? (CHAPTERS[exam]?.[subject] || []) : [];

  const startPractice = async () => {
    if (!canAccess()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/questions/generate', {
        exam, subject, chapter, count: numQ, language: lang || 'en', difficulty: 'mixed',
      });
      if (data.questions?.length > 0) {
        setQuestions(data.questions.map((q, i) => ({ ...q, id: i, qType: 'mcq' })));
      } else { throw new Error('Empty'); }
    } catch {
      // Fallback
      const qs = [];
      for (let i = 0; i < numQ; i++) {
        qs.push({ id: i, qType: 'mcq',
          question: `[${chapter}] Sample Q${i+1} — Connect backend for AI questions`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: Math.floor(Math.random() * 4),
          explanation: { correct: 'Connect API for explanations', wrong: {}, trick: 'N/A', ncert: 'N/A' },
        });
      }
      setQuestions(qs);
    } finally { setLoading(false); }
  };

  const handleAnswer = (qIdx, val) => { trackQuestion(); setAnswers(p => ({ ...p, [qIdx]: val })); };

  const finishPractice = () => {
    let score = 0, correct = 0, wrong = 0;
    questions.forEach((q, i) => {
      if (answers[i] === undefined) return;
      if (answers[i] === q.correct) { correct++; score += 4; }
      else { wrong++; score -= 1; }
    });
    const results = { exam, score, total: questions.length * 4, correct, wrong,
      unattempted: questions.length - correct - wrong, questions, answers,
      totalQuestions: questions.length, timestamp: new Date().toISOString(), chapter };
    localStorage.setItem('prepmaster_last_result', JSON.stringify(results));
    const history = JSON.parse(localStorage.getItem('prepmaster_history') || '[]');
    history.push({ exam, score, total: questions.length * 4, correct, wrong,
      unattempted: questions.length - correct - wrong, totalQuestions: questions.length,
      timestamp: results.timestamp, chapter });
    localStorage.setItem('prepmaster_history', JSON.stringify(history));
    navigate('/results');
  };

  // Selection Screen
  // Selection Screen
  if (questions.length === 0) {
    return (
      <div className="fade-in">
        <div className="container" style={{ maxWidth: 600, margin: 'var(--space-2xl) auto' }}>
          <h1 className="text-center" style={{ marginBottom: 'var(--space-2xl)', fontSize: '3rem' }}>
            <span className="text-gradient">Chapter Practice</span>
          </h1>

          {loading ? (
            <div className="card text-center" style={{ padding: 'var(--space-2xl)' }}>
              <Loader size={48} className="spin" color="var(--accent)" style={{ margin: '0 auto var(--space-md)', animation: 'spin 1s linear infinite' }} />
              <h3>Crafting AI questions...</h3>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div className="card" style={{ padding: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                <div>
                  <label className="label">Exam Target</label>
                  <select className="input" value={exam}
                    onChange={e => { setExam(e.target.value); setSubject(''); setChapter(''); }}>
                    <option value="">Select Exam</option>
                    <option value="neet">NEET UG</option>
                    <option value="jee_mains">JEE Mains</option>
                    <option value="jee_advanced">JEE Advanced</option>
                  </select>
                </div>
                {exam && (
                  <div>
                    <label className="label">Subject</label>
                    <select className="input" value={subject}
                      onChange={e => { setSubject(e.target.value); setChapter(''); }}>
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                {subject && (
                  <div>
                    <label className="label">Chapter</label>
                    <select className="input" value={chapter}
                      onChange={e => setChapter(e.target.value)}>
                      <option value="">Select Chapter</option>
                      {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                {chapter && (
                  <>
                    <div>
                      <label className="label">Goal Size</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {[10, 20, 30, 50].map(n => (
                          <button key={n} className={`btn ${numQ === n ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1 }}
                            onClick={() => setNumQ(n)}>{n}</button>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-premium btn-lg w-full mt-lg" onClick={startPractice} style={{ padding: '18px' }}>
                      <BookOpen size={20} /> Start Practice
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Practice Interface
  const q = questions[currentQ];
  return (
    <div className="fade-in">
      <div className="container" style={{ maxWidth: 750, margin: 'var(--space-xl) auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <span className="badge" style={{ background: 'var(--accent)', color: '#fff' }}>{chapter}</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t('question')} {currentQ + 1} / {questions.length}</span>
        </div>
        
        <div className="card fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>{q.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {q.options?.map((opt, oi) => (
              <button key={oi} onClick={() => handleAnswer(currentQ, oi)} className="card" style={{
                padding: '16px 24px', textAlign: 'left',
                background: answers[currentQ] === oi ? 'var(--accent)' : 'var(--glass)',
                borderColor: answers[currentQ] === oi ? 'var(--accent-light)' : 'var(--glass-border)',
                cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', width: '100%',
              }}>
                <span className={`orb ${answers[currentQ] === oi ? 'selected' : ''}`}
                  style={{ flexShrink: 0 }}>
                  {String.fromCharCode(65 + oi)}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{opt}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} disabled={currentQ === 0}
            onClick={() => setCurrentQ(p => p - 1)}> {t('prevQuestion')}</button>
          
          {currentQ < questions.length - 1 ? (
            <button className="btn btn-premium" style={{ flex: 1 }}
              onClick={() => setCurrentQ(p => p + 1)}>{t('nextQuestion')}</button>
          ) : (
            <button className="btn btn-premium" style={{ flex: 1 }} onClick={finishPractice}>{t('submitTest')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
