import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  return (
    <nav className="navbar glass-card">
      <div className="nav-container">
        <Link href="/" className="logo heading">
          Flow<span className="primary-text">Estate</span>
        </Link>
        <div className="nav-links">
          <Link href="/search" className="nav-link">Search</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/calculator" className="nav-link">Calculator</Link>
          <Link href="/trends" className="nav-link">Trends</Link>
          <Link href="/predictor" className="nav-link">Predictor</Link>
        </div>
        <div className="nav-actions">
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--text-primary)', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' 
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
            )}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>{user.role}</span>
              <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">Seller Login</Link>
              <Link href="/buyer-login" className="btn-primary">Buyer Sign In</Link>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          margin: 20px auto;
          max-width: 1400px;
          border-radius: 100px;
          padding: 16px 32px;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          color: white;
        }

        .primary-text {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
        }

        .nav-link:hover {
          color: white;
        }

        .nav-actions {
          display: flex;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .nav-links, .nav-actions {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
