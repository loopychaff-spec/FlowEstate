import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Predictor() {
  const { properties } = useAuth();
  const [selectedPropId, setSelectedPropId] = useState('');
  const [timeline, setTimeline] = useState('5 Years');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  const timelines = ['6 Months', '1 Year', '3 Years', '5 Years', '10 Years'];

  useEffect(() => {
    if (properties && properties.length > 0 && !selectedPropId) {
      setSelectedPropId(properties[0].id);
    }
  }, [properties]);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!selectedPropId) return;

    setLoading(true);
    const targetProp = properties.find(p => p.id === selectedPropId);

    try {
      const res = await fetch('/api/ai-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          propertyId: selectedPropId,
          propertyData: targetProp,
          timeline: timeline
        })
      });
      const data = await res.json();
      if (res.ok) {
        setForecast(data);
      }
    } catch (error) {
      console.error("Failed to generate forecast", error);
    }
    setLoading(false);
  };

  return (
    <div className="predictor-page">
      <Head>
        <title>Property Predictor | FlowEstate AI</title>
      </Head>

      <div className="container animate-fade-in">
        <div className="header">
           <h1 className="heading" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            FlowBrain <span className="text-gradient">Predictor</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
            Run multi-variable AI macroeconomic forecasting on your luxury portfolio to project future valuations.
          </p>
        </div>

        <div className="predictor-layout">
          <div className="glass-card controls-card">
            <h3 className="heading" style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Scenario Builder</h3>
            
            <form onSubmit={handlePredict}>
              <div className="input-group">
                <label className="heading">Select Asset</label>
                <select 
                  className="calc-input" 
                  value={selectedPropId} 
                  onChange={(e) => setSelectedPropId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {properties.length === 0 && <option value="">No properties available - Add one in Dashboard!</option>}
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="heading">Forecast Horizon</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {timelines.map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setTimeline(t)}
                      className={`timeline-btn ${timeline === t ? 'active' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '16px' }}
                disabled={loading || properties.length === 0}
              >
                {loading ? 'Running Simulation...' : 'Generate Forecast'}
              </button>
            </form>
          </div>

          <div className="glass-card results-card">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <h3 className="heading">Simulating {timeline} into the future...</h3>
                <p className="text-muted">Analyzing regional vectors and macroeconomic policy shifts.</p>
              </div>
            ) : forecast ? (
              <div className="forecast-results animate-fade-in">
                <div className="financial-header">
                  <div>
                    <span className="label text-muted">Projected {timeline} Value</span>
                    <h2 className="heading text-gradient" style={{ fontSize: '3.5rem', lineHeight: '1' }}>{forecast.projectedValue}</h2>
                  </div>
                  <div className={`change-badge ${forecast.percentageChange.startsWith('-') ? 'negative' : 'positive'}`}>
                    {forecast.percentageChange}
                  </div>
                </div>

                <div className="current-comp">
                  <span className="text-muted">Current Value: </span>
                  <strong>{forecast.currentValue}</strong>
                  <span style={{ margin: '0 12px', color: 'var(--border)' }}>|</span>
                  <span className="text-muted">AI Confidence: </span>
                  <strong style={{ color: 'var(--primary)' }}>{forecast.confidenceScore}%</strong>
                </div>

                <div className="analysis-section" style={{ marginTop: '32px' }}>
                  <h4 className="heading" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Market Drivers</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>
                    {forecast.analysis}
                  </p>
                </div>

                <div className="risks-section" style={{ marginTop: '32px' }}>
                  <h4 className="heading" style={{ marginBottom: '12px', fontSize: '1.25rem', color: '#ef4444' }}>Identified Risk Factors</h4>
                  <ul className="risk-list">
                    {forecast.riskFactors.map((risk, i) => (
                      <li key={i}>
                        <div className="risk-dot"></div>
                        <span style={{ color: 'var(--text-muted)' }}>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div style={{ opacity: 0.5, fontSize: '3rem', marginBottom: '16px' }}>📈</div>
                <h3 className="heading">Awaiting Simulation</h3>
                <p className="text-muted">Select a property and define your event horizon to generate an AI property valuation forecast.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .predictor-page {
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

        .predictor-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 40px;
        }

        .controls-card, .results-card {
          padding: 40px;
        }
        
        .results-card {
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .input-group {
          margin-bottom: 32px;
        }

        .input-group label {
          display: block;
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .calc-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 16px;
          border-radius: 12px;
          color: var(--text-primary, var(--foreground));
          font-size: 1.1rem;
          font-family: inherit;
          outline: none;
          transition: var(--transition-smooth);
        }

        .calc-input:focus {
          border-color: var(--primary);
        }

        .timeline-btn {
          flex: 1;
          min-width: 100px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary, var(--foreground));
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }

        .timeline-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .timeline-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 14px 0 var(--primary-glow);
        }

        .loading-state, .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .financial-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }

        .change-badge {
          padding: 12px 24px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1.5rem;
          margin-top: 12px;
        }
        
        .positive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .risk-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .risk-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .risk-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          margin-top: 8px;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .predictor-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
