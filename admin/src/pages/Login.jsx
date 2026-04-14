// ════════════════════════════════════════════════════════
// LOGIN.jsx
// ════════════════════════════════════════════════════════
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Cannot connect to server.' : err.message || 'Login failed.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#f8fafb', border: '1.5px solid #ecf0f0',
    color: '#0c1e21', borderRadius: '12px', padding: '12px 16px',
    fontSize: '14px', outline: 'none', transition: 'all 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f8fafb' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: '#1a598a' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: '#1e8a8a' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-md"
            style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}>
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#0c1e21' }}>Blog Admin</h1>
          <p className="mt-1 text-sm" style={{ color: '#67787a' }}>Sign in to your control panel</p>
        </div>

        <div className="rounded-2xl p-8 shadow-sm" style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}>
          {error && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-sm" style={{ background: '#ef444410', border: '1px solid #ef444430', color: '#dc2626' }}>
              <AlertCircle size={17} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#67787a' }}>Email Address</label>
              <input type="email" required autoComplete="email" value={form.email}
                onChange={e => { setError(''); setForm(p => ({ ...p, email: e.target.value })); }}
                placeholder="admin@blog.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1a598a'}
                onBlur={e => e.target.style.borderColor = '#ecf0f0'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#67787a' }}>Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required value={form.password}
                  onChange={e => { setError(''); setForm(p => ({ ...p, password: e.target.value })); }}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#1a598a'}
                  onBlur={e => e.target.style.borderColor = '#ecf0f0'}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#a9b8b8' }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none"
              style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* <div className="mt-4 rounded-2xl p-4 text-xs space-y-1" style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}>
          <p className="font-semibold mb-2" style={{ color: '#1a425c' }}>Default credentials after seeding:</p>
          <p style={{ color: '#67787a' }}>📧 Email: <span className="font-mono" style={{ color: '#1a598a' }}>admin@blog.com</span></p>
          <p style={{ color: '#67787a' }}>🔑 Password: <span className="font-mono" style={{ color: '#1a598a' }}>admin123</span></p>
          <p className="pt-2" style={{ borderTop: '1px solid #ecf0f0', color: '#a9b8b8' }}>
            Run <span className="font-mono" style={{ color: '#67787a' }}>node seed.js</span> in backend if not seeded
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Login;