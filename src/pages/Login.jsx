import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(emailRef.current.value, passwordRef.current.value);
      } else {
        await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value);
      }
      navigate('/');
    } catch (err) {
      let message = 'Authentication failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try logging in.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/configuration-not-found') {
        message = 'Firebase Auth not enabled. Please enable Email/Password in Firebase Console.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setError('');
  };

  return (
    <div className="login-layout" style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-color)',
      color: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* ── LEFT PANEL ── */}
      <div className="login-left-panel" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem',
        background: 'linear-gradient(160deg, #080808 0%, #111111 100%)',
        borderRight: '1px solid var(--card-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2.5rem' }}>
          <BrainCircuit size={44} color="var(--primary)" />
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px' }}>MindMate</h1>
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.3' }}>
          Master your studies,<br />
          <span style={{ color: 'var(--primary)' }}>without burning out.</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '480px', lineHeight: '1.9' }}>
          MindMate is the first burnout-aware study planner — combining academic task management with daily wellbeing tracking so you can perform at your best, every day.
        </p>

        <div className="login-feature-grid" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '480px' }}>
          {[
            { emoji: '📋', title: 'Task Planner', desc: 'Organize assignments with smart priorities.' },
            { emoji: '😴', title: 'Sleep & Stress Tracking', desc: 'Log your daily signals in seconds.' },
            { emoji: '🔥', title: 'Burnout Score', desc: 'Get real-time risk alerts before it is too late.' },
            { emoji: '📊', title: 'Analytics', desc: 'Visualize your wellbeing vs. study trends.' }
          ].map((f, i) => (
            <div key={i} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{f.emoji}</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px', color: 'var(--primary)' }}>{f.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right-panel" style={{
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#0a0a0a'
      }}>
        <div className="login-card" style={{
          width: '100%',
          background: '#111111',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '2.5rem'
        }}>
          {/* ── TABS ── */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', marginBottom: '2.5rem' }}>
            {['Login', 'Sign Up'].map((tab) => {
              const active = (tab === 'Login') === isLogin;
              return (
                <button
                  key={tab}
                  onClick={() => switchTab(tab === 'Login')}
                  style={{
                    padding: '0.8rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: 'all 0.25s ease',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            {isLogin ? 'Sign in to continue your study journey.' : 'Join MindMate and study smarter, not harder.'}
          </p>

          {/* ── ERROR ── */}
          {error && (
            <div style={{
              background: 'rgba(255,59,59,0.1)',
              border: '1px solid rgba(255,59,59,0.3)',
              color: '#ff6b6b',
              borderRadius: '10px',
              padding: '0.9rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  ref={nameRef}
                  placeholder="Full Name"
                  required
                  className="input-field"
                  style={{ paddingLeft: '2.8rem' }}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                ref={emailRef}
                placeholder="Email Address"
                required
                className="input-field"
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                ref={passwordRef}
                placeholder="Password (min. 6 characters)"
                required
                className="input-field"
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '50px',
                fontSize: '1rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading
                ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Please wait...</>
                : isLogin ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>

          {/* ── DIVIDER ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
          </div>

          {/* ── GOOGLE BUTTON ── */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              background: 'rgba(255,255,255,0.04)',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'background 0.25s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.2 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.5 35.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.5 5.9l.1-.1 6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            By continuing, you agree to MindMate's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
