import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, FileText, Loader, AlertCircle } from 'lucide-react';

export default function PdfUploadPage() {
  const { t, lang } = useLanguage();
  const { canAccess } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [exam, setExam] = useState('neet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) { setFile(accepted[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const handleGenerate = async () => {
    if (!file) return;
    if (!canAccess()) return;
    setLoading(true); setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('exam', exam);
      formData.append('language', lang || 'en');

      const { data } = await axios.post('/api/questions/from-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.questions?.length > 0) {
        const results = {
          exam, questions: data.questions.map((q, i) => ({ ...q, id: i, qType: 'mcq' })),
          answers: {}, totalQuestions: data.questions.length,
          score: 0, total: data.questions.length * 4,
          correct: 0, wrong: 0, unattempted: data.questions.length,
          timestamp: new Date().toISOString(), source: 'pdf',
        };
        localStorage.setItem('prepmaster_last_result', JSON.stringify(results));
        navigate('/results');
      } else throw new Error('No questions');
    } catch {
      // Fallback
      const qs = [];
      for (let i = 0; i < 10; i++) {
        qs.push({ id: i, qType: 'mcq',
          question: `[PDF] Sample Q${i+1} from "${file.name}" — Connect backend for AI questions`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: Math.floor(Math.random() * 4),
          explanation: { correct: 'Connect backend', wrong: {}, trick: 'N/A', ncert: 'N/A' },
        });
      }
      const results = { exam, questions: qs, answers: {}, totalQuestions: 10,
        score: 0, total: 40, correct: 0, wrong: 0, unattempted: 10,
        timestamp: new Date().toISOString(), source: 'pdf' };
      localStorage.setItem('prepmaster_last_result', JSON.stringify(results));
      navigate('/results');
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <div className="container" style={{ maxWidth: 650, margin: 'var(--space-2xl) auto' }}>
        <h1 className="text-center" style={{ marginBottom: 'var(--space-2xl)', fontSize: '3.5rem' }}>
          <span className="text-gradient">PDF Prep</span>
        </h1>

        <div className="card" style={{ padding: 'var(--space-2xl)' }}>
          {/* Exam Selector */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="label">Exam Context</label>
            <select className="input" value={exam} onChange={e => setExam(e.target.value)}>
              <option value="neet">NEET UG</option>
              <option value="jee_mains">JEE Mains</option>
              <option value="jee_advanced">JEE Advanced</option>
            </select>
          </div>

          {/* Dropzone */}
          <div {...getRootProps()} className="card"
            style={{ 
              marginBottom: 'var(--space-xl)', padding: 'var(--space-2xl)', textAlign: 'center',
              border: isDragActive ? '2px dashed var(--accent)' : '2px dashed var(--glass-border)',
              background: isDragActive ? 'var(--glass-highlight)' : 'var(--glass)',
              cursor: 'pointer',
            }}>
            <input {...getInputProps()} />
            {file ? (
              <div>
                <FileText size={56} className="text-gold" style={{ margin: '0 auto var(--space-md)' }} />
                <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{file.name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                  {(file.size / 1024).toFixed(1)} KB · Ready to process
                </p>
              </div>
            ) : (
              <div>
                <div style={{ 
                  width: 80, height: 80, borderRadius: '50%', background: 'var(--glass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)'
                }}>
                  <Upload size={36} color="var(--text-muted)" />
                </div>
                <h3 style={{ marginBottom: 8 }}>Drop your notes here</h3>
                <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                  PDF files only · AI will extract questions
                </p>
              </div>
            )}
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.95rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 12 }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button className="btn btn-premium btn-lg w-full" disabled={!file || loading} onClick={handleGenerate} style={{ padding: '18px' }}>
            {loading ? (
              <><Loader size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Crafting Questions...</>
            ) : (
              <><Upload size={20} /> Generate AI Questions</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
