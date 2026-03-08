import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { properties } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");



  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <>
      <Head>
        <title>Real Estate AI</title>
        <meta name="description" content="AI powered real estate discovery" />
      </Head>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title heading">
              Explore your <span className="text-gradient">dream home</span> with AI.
            </h1>
            <p className="hero-subtitle">
              Describe what you're looking for and let our intelligent platform instantly find the best properties that match your lifestyle.
            </p>

            <form className="search-container glass-card" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Describe your ideal home (e.g., 3 beds in Austin with a pool)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </div>
          
          <div className="hero-background">
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section className="capabilities-section">
          <div className="section-header" style={{ justifyContent: 'center', marginBottom: '60px' }}>
            <h2 className="heading">Platform Capabilities</h2>
          </div>
          
          <div className="capabilities-grid">
            <div className="capability-card glass-card">
              <div className="cap-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
              </div>
              <h3 className="heading">AI Generation</h3>
              <p className="text-muted">Draft captivating, high-converting luxury listings in seconds directly from rough notes using the FlowBrain Agent.</p>
            </div>
            <div className="capability-card glass-card">
              <div className="cap-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 className="heading">Intelligent Discovery</h3>
              <p className="text-muted">Search through properties semantically. Simply describe your dream home naturally and let our engine find the perfect match.</p>
            </div>
            <div className="capability-card glass-card">
              <div className="cap-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <h3 className="heading">Virtual Staging</h3>
              <p className="text-muted">Buyers can instantly reimagine any room's interior design to match their personal style using our state-of-the-art vision models.</p>
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="heading">Recent Discoveries</h2>
            <button className="btn-secondary" onClick={() => router.push('/search')}>View All</button>
          </div>

          <div className="property-grid">
            {properties && properties.length > 0 ? (
              properties.map((prop) => (
                <Link href={`/property/${prop.id}`} key={prop.id} className="property-card glass-card">
                  <div className="property-image" style={{ backgroundImage: `url('${prop.image || (prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90'}')` }}>
                    <div className="price-badge">{prop.price}</div>
                  </div>
                  <div className="property-info">
                    <h3 className="heading">{prop.title}</h3>
                    <p className="property-location">{prop.location}</p>
                    
                    <div className="property-metrics">
                      <div className="metric">
                        <span className="metric-value">{prop.beds !== undefined && prop.beds !== '' ? String(prop.beds) : '--'}</span>
                        <span className="metric-label">Beds</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{prop.baths !== undefined && prop.baths !== '' ? String(prop.baths) : '--'}</span>
                        <span className="metric-label">Baths</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{prop.sqft !== undefined && prop.sqft !== '' ? String(prop.sqft) : '--'}</span>
                        <span className="metric-label">SqFt</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center', gridColumn: '1 / -1' }}>
                <h3 className="heading" style={{ marginBottom: '16px' }}>No Listings Yet</h3>
                <p className="text-muted" style={{ marginBottom: '24px' }}>Sign in to your Partner Portal to start generating beautiful AI listings here.</p>
                <button className="btn-primary" onClick={() => router.push('/login')}>Sign In to Add Listings</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        main {
          padding-top: 60px;
        }

        .hero {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
        }

        .hero-title {
          font-size: clamp(3rem, 5vw, 5rem);
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
        }

        .orb-1 {
          top: -10%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: var(--primary-glow);
        }

        .orb-2 {
          bottom: -20%;
          right: -10%;
          width: 800px;
          height: 800px;
          background: rgba(168, 85, 247, 0.3);
        }

        .search-container {
          display: flex;
          padding: 8px;
          gap: 12px;
          max-width: 700px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 16px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary, var(--foreground));
          font-size: 1.1rem;
          outline: none;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .capabilities-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 100px 40px 0;
        }

        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .capability-card {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cap-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: var(--primary-glow);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid var(--primary);
        }
        
        [data-theme='light'] .cap-icon {
          border-color: rgba(147, 51, 234, 0.2);
        }

        .capability-card .heading {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .featured-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 100px 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          font-size: 2.5rem;
        }

        .property-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 32px;
        }

        .property-card {
          display: block;
          overflow: hidden;
          padding: 0;
        }

        .property-image {
          height: 250px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .price-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .property-info {
          padding: 24px;
        }

        .property-info h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .property-location {
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .property-metrics {
          display: flex;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-value {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .metric-label {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .search-container {
            flex-direction: column;
            background: transparent;
            border: none;
            backdrop-filter: none;
          }
          
          .search-input-wrapper {
            background: var(--glass);
            padding: 20px;
            border-radius: 20px;
            border: 1px solid var(--border);
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .property-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
