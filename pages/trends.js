import Head from 'next/head';

export default function Trends() {
  const stats = [
    { label: 'Median Luxury Price', value: '$4.2M', trend: '+5.2%' },
    { label: 'Avg Days on Market', value: '28', trend: '-12%' },
    { label: 'Active Premium Listings', value: '1,240', trend: '+2.1%' },
    { label: 'Avg AI Listing Conversion', value: '14.5%', trend: '+45%' },
  ];

  return (
    <div className="trends-page">
      <Head>
        <title>Market Trends | FlowEstate AI</title>
      </Head>

      <div className="container animate-fade-in">
        <div className="header">
           <h1 className="heading" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Real Estate <span className="text-gradient">Market Trends</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
            Leverage multi-modal data to get high-level insights into macroeconomic housing trends and AI integration performance.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card stat-card">
              <h3 className="text-muted">{stat.label}</h3>
              <div className="stat-row">
                <span className="stat-value heading">{stat.value}</span>
                <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="chart-layout">
          <div className="glass-card chart-card">
            <h3 className="heading" style={{ marginBottom: '24px' }}>Luxury Price Index (Last 12 Months)</h3>
            <div className="fake-chart">
               <svg viewBox="0 0 800 300" className="chart-svg">
                 <path d="M 0 250 Q 100 240 200 200 T 400 150 T 600 100 T 800 50" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                 <path d="M 0 300 L 0 250 Q 100 240 200 200 T 400 150 T 600 100 T 800 50 L 800 300 Z" fill="var(--primary-glow)" />
               </svg>
            </div>
          </div>

          <div className="side-cards">
            <div className="glass-card info-card highlight">
              <h4 className="heading text-gradient" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>FlowBrain Predictive Insight</h4>
              <p className="text-muted">
                Based on current vector analysis of thousands of listings, we predict a <strong>3.5% increase</strong> in smart-home-equipped luxury properties in coastal cities next quarter. Homes generated via AI staging sell <strong>45% faster</strong> on average.
              </p>
            </div>
            <div className="glass-card info-card">
               <h4 className="heading" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Regional Hotspots</h4>
               <ul className="hotspot-list text-muted">
                 <li>1. Austin, TX <span className="positive">+18%</span></li>
                 <li>2. Miami, FL <span className="positive">+14%</span></li>
                 <li>3. Scottsdale, AZ <span className="positive">+11%</span></li>
               </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .trends-page {
          min-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        .header {
          margin-bottom: 60px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          padding: 32px;
        }

        .stat-card h3 {
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .stat-value {
          font-size: 2.5rem;
          line-height: 1;
        }

        .stat-trend {
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.9rem;
        }

        .positive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .chart-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .chart-card {
          padding: 40px;
        }

        .fake-chart {
          width: 100%;
          height: 300px;
          border-left: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        
        .chart-svg {
          width: 100%;
          height: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .side-cards {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-card {
          padding: 32px;
          flex: 1;
        }

        .highlight {
          border-left: 4px solid var(--primary);
        }

        .hotspot-list {
          list-style: none;
        }

        .hotspot-list li {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        @media (max-width: 1024px) {
          .chart-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
