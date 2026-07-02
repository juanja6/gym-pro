import React, { useState } from 'react';
import { registerWithEmail, loginWithEmail, loginWithGoogle } from '../services/auth';
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) { setError('Introduce tu nombre'); setLoading(false); return; }
        await registerWithEmail(email, password, name.trim());
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      const codes = {
        'auth/email-already-in-use': 'Este email ya está registrado',
        'auth/invalid-email': 'Email no válido',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-not-found': 'No existe una cuenta con este email',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-credential': 'Credenciales incorrectas',
        'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
      };
      setError(codes[err.code] || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Error con Google. Inténtalo de nuevo.');
        setLoading(false);
      }
      // If redirect, loading stays true until page reloads
    }
  };

  return (
    <div style={styles.container}>
      {/* Background glow effects */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>
            <Dumbbell size={32} color="var(--bg)" />
          </div>
          <h1 style={styles.logoText}>GymPro</h1>
          <p style={styles.tagline}>Tu entrenador personal premium</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'register' && (
            <div style={styles.inputWrap}>
              <User size={18} color="var(--text-dim)" style={styles.inputIcon} />
              <input
                type="text" placeholder="Tu nombre" value={name}
                onChange={e => setName(e.target.value)}
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputWrap}>
            <Mail size={18} color="var(--text-dim)" style={styles.inputIcon} />
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrap}>
            <Lock size={18} color="var(--text-dim)" style={styles.inputIcon} />
            <input
              type={showPw ? 'text' : 'password'} placeholder="Contraseña" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6}
              style={styles.input}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={styles.eyeBtn}>
              {showPw ? <EyeOff size={18} color="var(--text-dim)" /> : <Eye size={18} color="var(--text-dim)" />}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>o</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading} style={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.6-11.5-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
          </svg>
          Continuar con Google
        </button>

        {/* Toggle */}
        <div style={styles.toggle}>
          <span style={{ color: 'var(--text-dim)' }}>
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </span>
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={styles.toggleBtn}>
            {mode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px 16px',
  },
  glowTop: {
    position: 'absolute',
    top: '-30%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '140%',
    height: '50%',
    background: 'radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '140%',
    height: '40%',
    background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    width: '100%',
    maxWidth: 380,
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    background: 'linear-gradient(135deg, var(--accent), #00b894)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0 8px 32px rgba(0,212,170,0.3)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--text)',
    margin: 0,
  },
  tagline: {
    fontSize: 14,
    color: 'var(--text-dim)',
    marginTop: 4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    padding: 4,
    display: 'flex',
  },
  error: {
    background: 'var(--red-dim)',
    color: 'var(--red)',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
  },
  submitBtn: {
    width: '100%',
    padding: 14,
    background: 'linear-gradient(135deg, var(--accent), #00b894)',
    color: 'var(--bg)',
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 12,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 20px rgba(0,212,170,0.3)',
    transition: 'opacity 0.15s, transform 0.1s',
    marginTop: 4,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  },
  dividerText: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  googleBtn: {
    width: '100%',
    padding: 14,
    background: 'var(--card)',
    color: 'var(--text)',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 12,
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'background 0.15s',
  },
  toggle: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
  },
  toggleBtn: {
    background: 'none',
    color: 'var(--accent)',
    fontWeight: 700,
    fontSize: 14,
    padding: 0,
  },
};
