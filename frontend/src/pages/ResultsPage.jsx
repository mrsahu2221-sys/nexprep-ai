import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Trophy, CheckCircle, XCircle, MinusCircle, ArrowLeft, 
  ChevronDown, ChevronUp, Lightbulb, BookOpen, Zap, BarChart3 
} from 'lucide-react';

export default function ResultsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('prepmaster_last_result');
    if (data) setResult(JSON.parse(data));
  }, []);

  if (!result) {
    return (
      <div className="page">
        <div className="container text-center" style={{ paddingTop: 'var(--space-3xl)' }}>
          <h2>{t('noData')}</h2>
          <button className="btn btn-primary mt-lg" onClick={() => navigate('/')}>
            {t('backHome')}
          </button>
        </div>
      </div>
    );
  }

  const { score, total, correct, wrong, unattempted, questions, answers, totalQuestions, exam } = result;
  const accuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(1) : 0;

  // Rank prediction
  const predictRank = (score, total, exam) => {
    const pct = (score / total) * 100;
    if (exam === 'neet') {
      if (pct >= 95) return '1 - 100';
      if (pct >= 90) return '100 - 500';
      if (pct >= 80) return '500 - 5,000';
      if (pct >= 70) return '5,000 - 20,000';
      if (pct >= 60) return '20,000 - 50,000';
      return '50,000+';
    }
    if (pct >= 95) return '1 - 50';
    if (pct >= 85) return '50 - 500';
    if (pct >= 70) return '500 - 5,000';
    if (pct >= 55) return '5,000 - 20,000';
    return '20,000+';
  };

  const rank = predictRank(Math.max(0, score), total, exam);

  const stats = [
    { label: t('correct'), value: correct, color: 'var(--success)', icon: CheckCircle },
    { label: t('incorrect'), value: wrong, color: 'var(--error)', icon: XCircle },
    { label: t('unattempted'), value: unattempted, color: 'var(--text-muted)', icon: MinusCircle },
  ];

  return (
    <div className="fade-in">
      <div className="container" style={{ maxWidth: 850, margin: 'var(--space-2xl) auto' }}>
        {/* Score Card */}
        <div className="card text-center" style={{ padding: 'var(--space-3xl)', marginBottom: 'var(--space-2xl)', border: '1px solid var(--accent-light)' }}>
          <Trophy size={64} className="text-gold" style={{ margin: '0 auto var(--space-lg)' }} />
          <h1 style={{ fontSize: '4rem', marginBottom: 8, lineHeight: 1 }}>
            <span className="text-gradient">{Math.max(0, score)}</span>
            <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginLeft: 8 }}>/ {total}</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('yourScoreTotal')}</p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xl)',
            marginTop: 'var(--space-2xl)', padding: 'var(--space-xl)', background: 'var(--glass)', borderRadius: 24
          }}>
            {stats.map(({ label, value, color, icon: Icon }, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Icon size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Accuracy & Rank */}
          <div className="grid-2 mt-xl" style={{ maxWidth: 500, margin: 'var(--space-xl) auto 0' }}>
            <div className="card" style={{ textAlign: 'center', background: 'var(--glass-highlight)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{accuracy}%</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{t('accuracy')}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', background: 'var(--glass-highlight)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold)' }}>#{rank}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{t('predictedRank')}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repate(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> {t('backHome')}
          </button>
          <button className="btn btn-premium btn-lg" onClick={() => setShowReview(!showReview)}>
            <BookOpen size={18} /> {showReview ? 'Hide Analysis' : 'Detailed Analysis'}
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>
            <BarChart3 size={18} /> {t('viewFullStats')}
          </button>
        </div>

        {/* Answer Review with Explanations */}
        {showReview && questions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }} className="fade-in">
            <h2 style={{ marginBottom: 'var(--space-md)', fontSize: '2rem' }}>Detailed Analysis</h2>
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correct;
              const isAttempted = userAns !== undefined;

              return (
                <div key={i} className="card" style={{
                  borderLeft: `6px solid ${isCorrect ? '#22c55e' : isAttempted ? '#ef4444' : 'var(--glass-border)'}`,
                  background: 'var(--glass)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                    <span className="badge" style={{
                      background: isCorrect ? 'rgba(34, 197, 94, 0.1)' : isAttempted ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-highlight)',
                      color: isCorrect ? '#22c55e' : isAttempted ? '#ef4444' : 'var(--text-secondary)',
                      fontWeight: 700,
                    }}>
                      Q{i + 1} — {isCorrect ? 'MASTERED' : isAttempted ? 'REVIEW NEEDED' : 'UNATTEMPTED'}
                    </span>
                    <button className="btn btn-ghost"
                      onClick={() => setExpanded(p => ({ ...p, [i]: !p[i] }))}>
                      {expanded[i] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-xl)', lineHeight: 1.5 }}>{q.question}</p>

                  {q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{
                          padding: '12px 16px', borderRadius: 12, fontSize: '1rem',
                          display: 'flex', alignItems: 'center', gap: 12,
                          background: oi === q.correct ? 'rgba(34, 197, 94, 0.1)'
                            : oi === userAns ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-highlight)',
                          border: `1px solid ${oi === q.correct ? '#22c55e'
                            : oi === userAns && !isCorrect ? '#ef4444' : 'var(--glass-border)'}`,
                          fontWeight: (oi === q.correct || oi === userAns) ? 600 : 400,
                        }}>
                          <span style={{ fontWeight: 800, width: 24, color: 'var(--accent)' }}>{String.fromCharCode(65 + oi)}</span>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {oi === q.correct && <CheckCircle size={18} color="#22c55e" />}
                          {oi === userAns && !isCorrect && <XCircle size={18} color="#ef4444" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  {expanded[i] && q.explanation && (
                    <div className="card" style={{
                      marginTop: 'var(--space-xl)', padding: 'var(--space-lg)',
                      background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)'
                    }}>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                        <Lightbulb size={20} className="text-gold" />
                        <strong style={{ fontSize: '1.1rem', color: 'var(--gold)' }}>AI Insight</strong>
                      </div>
                      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                        {q.explanation.correct || 'N/A'}
                      </p>

                      <div className="grid-2 gap-md">
                        {q.explanation.trick && (
                          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(138, 43, 226, 0.05)' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                              <Zap size={16} color="var(--accent)" />
                              <strong style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Pro Trick</strong>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {q.explanation.trick}
                            </p>
                          </div>
                        )}

                        {q.explanation.ncert && (
                          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(212, 175, 55, 0.05)' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                              <BookOpen size={16} className="text-gold" />
                              <strong style={{ fontSize: '0.9rem', color: 'var(--gold)' }}>NCERT Reference</strong>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {q.explanation.ncert}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
