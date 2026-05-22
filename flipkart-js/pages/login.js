import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, ShoppingBag } from 'lucide-react';
import { loginUser, registerUser } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = router.query.redirect || '/';
      router.replace(redirect);
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      login(data);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirm) { toast.error('Please fill all fields'); return; }
    if (regPassword !== regConfirm) { toast.error('Passwords do not match'); return; }
    if (regPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await registerUser(regName, regEmail, regPassword);
      login(data);
      toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
      router.push('/');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
    background: '#fafafa',
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9e9e9e',
    pointerEvents: 'none',
  };

  return (
    <>
      <Head>
        <title>Login – Flipkart</title>
        <meta name="description" content="Login or create your Flipkart account" />
      </Head>

      <style>{`
        .login-input:focus { border-color: #2874f0 !important; background: white !important; box-shadow: 0 0 0 3px rgba(40,116,240,0.08); }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: rgba(40,116,240,0.05); }
        .login-btn { transition: all 0.2s; }
        .login-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(40,116,240,0.35); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .show-pwd-btn:hover { color: #2874f0; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a3a6e 0%, #2874f0 50%, #0f2a5e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{
          display: 'flex',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '860px',
          minHeight: '520px',
        }}>

          {/* Left panel */}
          <div style={{
            flex: '1 1 320px',
            background: 'linear-gradient(160deg, #2874f0 0%, #1a57c8 100%)',
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'white',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                <ShoppingBag size={28} />
                <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>Flipkart</span>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.3, marginBottom: '16px' }}>
                {tab === 'login' ? 'Login to your account' : 'Create your account'}
              </h1>
              <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: 1.7 }}>
                {tab === 'login'
                  ? 'Get access to your orders, wishlist, and exclusive member deals.'
                  : 'Join millions of shoppers. Enjoy exclusive deals, fast delivery, and more.'}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: 1.7, fontStyle: 'italic' }}>
                "Shopping has never been this easy and fun. Absolutely love Flipkart!"
              </p>
              <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px', fontWeight: 600 }}>— Happy Customer</p>
            </div>
          </div>

          {/* Right panel */}
          <div style={{
            flex: '1 1 400px',
            background: 'white',
            padding: '40px 40px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Tabs */}
            <div style={{ display: 'flex', border: '1.5px solid #e8e8e8', borderRadius: '10px', padding: '4px', marginBottom: '32px', background: '#f8f8f8' }}>
              {['login', 'register'].map((t) => (
                <button
                  key={t}
                  className="tab-btn"
                  onClick={() => { setTab(t); setShowPassword(false); }}
                  style={{
                    flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                    background: tab === t ? 'white' : 'transparent',
                    color: tab === t ? '#2874f0' : '#878787',
                    fontWeight: tab === t ? 700 : 500,
                    fontSize: '14px',
                    boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {t === 'login' ? 'Login' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="login-input"
                    style={inputStyle}
                    required
                    autoComplete="email"
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="login-input"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="show-pwd-btn"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e9e9e', transition: 'color 0.2s', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="login-btn"
                  style={{
                    padding: '14px', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #2874f0, #1a57c8)', color: 'white',
                    fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'Inter, sans-serif', opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Logging in…</> : 'Login'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#878787' }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: '#2874f0', fontWeight: 700, cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} style={iconStyle} />
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Full name"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="login-input"
                    style={inputStyle}
                    required
                    autoComplete="name"
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="Email address"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="login-input"
                    style={inputStyle}
                    required
                    autoComplete="email"
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 6 characters)"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="login-input"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="show-pwd-btn"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e9e9e', transition: 'color 0.2s', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    className="login-input"
                    style={inputStyle}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="login-btn"
                  style={{
                    padding: '14px', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #2874f0, #1a57c8)', color: 'white',
                    fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'Inter, sans-serif', opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating account…</> : 'Create Account'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '13px', color: '#878787' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: '#2874f0', fontWeight: 700, cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
