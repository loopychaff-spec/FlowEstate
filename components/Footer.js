export default function Footer() {
  return (
    <footer className="footer animate-fade-in">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="logo-small heading">Flow<span className="primary-text">Estate</span></h3>
          <p className="footer-desc">The future of high-end, AI-powered real estate experiences.</p>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-heading">Product</h4>
            <a href="/search">Marketplace</a>
            <a href="/dashboard">Partner Dashboard</a>
            <a href="/calculator">Mortgage Calculator</a>
            <a href="/trends">Market Trends</a>
            <a href="/predictor">Property Predictor</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <a href="/about">About Us</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <a href="/login">Seller Login</a>
            <a href="/buyer-login">Buyer Sign In</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 FlowEstate AI. All rights reserved.</p>
          <div className="social-links">
            <a href="https://x.com/FlowEstateAI" target="_blank" rel="noopener noreferrer">Twitter (X)</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          margin-top: 100px;
          padding: 80px 0 40px;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid var(--border);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .footer-brand {
          margin-bottom: 60px;
        }

        .logo-small {
          font-size: 1.25rem;
          margin-bottom: 16px;
        }

        .primary-text {
          color: var(--primary);
        }

        .footer-desc {
          color: var(--text-muted);
          max-width: 300px;
          font-size: 0.9rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 40px;
          margin-bottom: 60px;
        }

        .footer-heading {
          margin-bottom: 24px;
          font-size: 1rem;
          font-weight: 600;
        }

        .footer-col a {
          display: block;
          margin-bottom: 12px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer-col a:hover {
          color: white;
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .social-links {
          display: flex;
          gap: 24px;
        }
      `}</style>
    </footer>
  );
}
