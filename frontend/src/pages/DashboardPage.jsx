import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart3, TrendingUp, Target, BookOpen, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('prepmaster_history') || '[]');
    setHistory(data);
  }, []);

  if (history.length === 0) {
    return (
      <div className="page">
        <div className="container text-center" style={{ paddingTop: 'var(--space-3xl)' }}>
          <BarChart3 size={64} color="var(--text-muted)" style={{ margin: '0 auto var(--space-md)' }} />
          <h2>{t('noData')}</h2>
          <p className="text-secondary mt-sm">Take your first test to unlock analytics</p>
          <button className="btn btn-primary mt-lg" onClick={() => navigate('/mock-test')}>
            {t('startTest')}
          </button>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalCorrect = history.reduce((s, h) => s + h.correct, 0);
  const totalQ = history.reduce((s, h) => s + h.totalQuestions, 0);
  const overallAccuracy = totalQ > 0 ? ((totalCorrect / totalQ) * 100).toFixed(1) : 0;

  // Score history for line chart
  const scoreData = history.map((h, i) => ({
    name: `Test ${i + 1}`,
    score: Math.max(0, h.score),
    total: h.total,
    pct: ((Math.max(0, h.score) / h.total) * 100).toFixed(0),
  }));

  // Pie chart data
  const lastTest = history[history.length - 1];
  const pieData = [
    { name: t('correct'), value: lastTest.correct, color: '#22c55e' },
    { name: t('incorrect'), value: lastTest.wrong, color: '#ef4444' },
    { name: t('unattempted'), value: lastTest.unattempted, color: '#64748b' },
  ];

  // Weak area analysis (simplified)
  const examCounts = {};
  history.forEach(h => { examCounts[h.exam] = (examCounts[h.exam] || 0) + 1; });
  const weakAreas = history
    .filter(h => (h.correct / h.totalQuestions) < 0.5)
    .map(h => h.chapter || h.exam)
    .filter(Boolean);

  // Rank prediction
  const latestScore = lastTest.score;
  const latestTotal = lastTest.total;
  const pct = (Math.max(0, latestScore) / latestTotal) * 100;
  let rank;
  if (pct >= 95) rank = 'Top 100';
  else if (pct >= 85) rank = 'Top 500';
  else if (pct >= 70) rank = 'Top 5,000';
  else if (pct >= 55) rank = 'Top 20,000';
  else rank = '50,000+';

  return (
    <div className="fade-in">
      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        <h1 style={{ marginBottom: 'var(--space-2xl)', fontSize: '3.5rem' }}>
          <span className="text-gradient">AI Analytics</span>
        </h1>

        {/* Stats Row */}
        <div className="grid-4 mb-lg">
          {[
            { label: 'Avg Accuracy', value: `${overallAccuracy}%`, icon: Target, color: 'var(--accent)' },
            { label: 'Exams Mastery', value: history.length, icon: BookOpen, color: '#3b82f6' },
            { label: 'Predicted Rank', value: rank, icon: TrendingUp, color: 'var(--gold)' },
            { label: 'Questions Mastery', value: totalQ, icon: BarChart3, color: 'var(--accent-light)' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', borderTop: `4px solid ${color}` }}>
              <div style={{ 
                width: 50, height: 50, borderRadius: '50%', background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)'
              }}>
                <Icon size={24} color={color} />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2 mb-lg" style={{ gap: 'var(--space-xl)' }}>
          {/* Score History Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-xl)', fontSize: '1.5rem', color: 'var(--gold)' }}>
              <TrendingUp size={24} style={{ marginRight: 10, verticalAlign: 'middle' }} /> Performance Orbit
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(5, 10, 24, 0.95)', border: '1px solid var(--accent)',
                    borderRadius: 16, color: '#fff', backdropFilter: 'blur(10px)',
                  }}
                />
                <Line type="monotone" dataKey="pct" stroke="var(--accent)"
                  strokeWidth={4} dot={{ fill: 'var(--accent)', r: 6, strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, fill: 'var(--gold)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Last Test Pie Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-xl)', fontSize: '1.5rem', color: 'var(--accent-light)' }}>
              <Target size={24} style={{ marginRight: 10, verticalAlign: 'middle' }} /> Question Precision
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                  paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(5, 10, 24, 0.95)', border: '1px solid var(--accent)',
                    borderRadius: 16, color: '#fff', backdropFilter: 'blur(10px)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap', marginTop: 'var(--space-md)' }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: d.color, boxShadow: `0 0 10px ${d.color}50` }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak areas / Improve suggestions */}
        <div className="card mb-lg" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), transparent)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={28} color="#ef4444" />
            Strategic Focus Areas
          </h3>
          {weakAreas.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[...new Set(weakAreas)].map((area, i) => (
                <span key={i} className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 16px', fontSize: '1rem' }}>{area}</span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Exceptional performance! You are maintaining mastery across all modules.</p>
          )}
        </div>

        {/* Test History Table */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-xl)', fontSize: '1.5rem' }}>Full History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>Index</th>
                  <th style={{ padding: '0 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>Exams Context</th>
                  <th style={{ padding: '0 16px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>Performance</th>
                  <th style={{ padding: '0 16px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>Mastery</th>
                  <th style={{ padding: '0 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.slice().reverse().map((h, i) => (
                  <tr key={i} className="glass-panel" style={{ background: 'var(--glass-highlight)', borderRadius: 16 }}>
                    <td style={{ padding: '20px 16px', borderRadius: '16px 0 0 16px', fontWeight: 700, color: 'var(--text-secondary)' }}>{history.length - i}</td>
                    <td style={{ padding: '20px 16px' }}>
                      <span className="badge" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 700 }}>{h.exam?.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                      <span className="text-gradient-gold">{Math.max(0, h.score)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: 4 }}>/ {h.total}</span>
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                         <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${((h.correct / h.totalQuestions) * 100)}%`, 
                              height: '100%', 
                              background: (h.correct / h.totalQuestions) >= 0.7 ? '#22c55e' : '#f59e0b',
                              boxShadow: `0 0 10px ${(h.correct / h.totalQuestions) >= 0.7 ? '#22c55e50' : '#f59e0b50'}`
                            }} />
                         </div>
                         <span style={{
                           fontWeight: 700,
                           color: (h.correct / h.totalQuestions) >= 0.7 ? '#22c55e' : '#f59e0b',
                         }}>
                           {((h.correct / h.totalQuestions) * 100).toFixed(0)}%
                         </span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.9rem', borderRadius: '0 16px 16px 0' }}>
                      {new Date(h.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
