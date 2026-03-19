import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { QrCode, Clipboard, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function PaymentPage() {
  const { user, syncUser } = useAuth();
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const upiId = '6386295685@ybl';
  const amount = '500';
  const upiLink = `upi://pay?pa=${upiId}&pn=NexPrep%20AI&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('Please enter the Transaction ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/payment/upi-verify', { transactionId });
      if (data.success) {
        await syncUser();
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  if (success) {
    return (
      <div className="page fade-in">
        <div className="container text-center" style={{ maxWidth: 500, margin: 'var(--space-3xl) auto' }}>
          <div className="card" style={{ padding: 'var(--space-3xl)', border: '2px solid var(--success)' }}>
            <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto var(--space-md)' }} />
            <h2 className="text-gradient-gold" style={{ fontSize: '2.5rem', marginBottom: 12 }}>PRO Unlocked!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Your transaction has been received. Welcome to NexPrep AI PRO!
            </p>
            <p className="mt-md" style={{ color: 'var(--text-muted)' }}>Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 600, margin: 'var(--space-2xl) auto' }}>
        <h1 className="text-center" style={{ marginBottom: 'var(--space-xl)', fontSize: '3rem' }}>
          <span className="text-gradient">Go PRO</span>
        </h1>

        <div className="card" style={{ padding: 'var(--space-2xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ 
              background: '#fff', padding: 20, borderRadius: 24, display: 'inline-block',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)', marginBottom: 'var(--space-lg)'
            }}>
              <img src={qrUrl} alt="UPI QR Code" style={{ width: 220, height: 220 }} />
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Scan to Pay ₹{amount}</h3>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: 'var(--glass)', padding: '8px 16px', borderRadius: 12,
              border: '1px solid var(--glass-border)', cursor: 'pointer'
            }} onClick={copyToClipboard}>
              <span style={{ fontWeight: 600, color: 'var(--accent-light)' }}>{upiId}</span>
              <Clipboard size={16} color="var(--text-secondary)" />
            </div>
          </div>

          <div style={{ 
            background: 'var(--glass-highlight)', padding: 'var(--space-lg)', 
            borderRadius: 16, marginBottom: 'var(--space-2xl)', border: '1px solid var(--glass-border)'
          }}>
            <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <QrCode size={18} color="var(--accent)" />
              Instructions
            </h4>
            <ol style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <li>Open any UPI app (Google Pay, PhonePe, Paytm).</li>
              <li>Scan the QR code above or pay to the UPI ID.</li>
              <li>Complete the payment of ₹{amount}.</li>
              <li>Copy the **12-digit Transaction ID / UTR Number**.</li>
              <li>Enter it below to instantly unlock PRO features.</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-md">
              <label className="label">Transaction ID / UTR Number</label>
              <input 
                type="text" 
                placeholder="Enter 12-digit Transaction ID" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '16px' }}
              />
            </div>

            {error && (
              <div style={{ 
                color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', 
                padding: 12, borderRadius: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center'
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-premium btn-lg w-full" 
              disabled={loading}
              style={{ padding: '18px' }}
            >
              {loading ? (
                <><Loader size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</>
              ) : (
                'Unlock PRO Access'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
