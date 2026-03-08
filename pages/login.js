import { useState } from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate API call for authentication
    setTimeout(() => {
      login(email, 'Partner');
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="page-container" style={{ marginTop: '100px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Head>
        <title>Seller Login | FlowEstate</title>
      </Head>
      <div className="glass-card animate-fade-in" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h1 className="heading" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Partner Portal</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to manage your luxury listings and property analytics.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary, var(--foreground))',
              outline: 'none', 
              fontFamily: 'inherit' 
            }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary, var(--foreground))',
              outline: 'none', 
              fontFamily: 'inherit' 
            }} 
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginTop: '1rem', width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}>
        <div style={{ width: '600px', height: '600px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.3 }}></div>
      </div>
    </div>
  );
}
