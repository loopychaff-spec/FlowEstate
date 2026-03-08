import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Search() {
  const router = useRouter();
  const { properties } = useAuth();
  const { q } = router.query;
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');

  // Initial load effect
  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    // On first load without a query, just show everything
    if (!q && messages.length === 0) {
      setResults(properties);
      setLoading(false);
      return;
    }
    
    // If there is a querystring `q` but no messages yet, treat it as the first message
    if (q && messages.length === 0) {
      handleChatSubmit(null, q.toString());
    }
  }, [router.isReady, q]);

  const handleChatSubmit = async (e, initialQuery = null) => {
    if (e) e.preventDefault();
    const queryToSend = initialQuery || inputQuery.trim();
    if (!queryToSend) return;

    // Add user message to UI immediately
    const newMessages = [...messages, { role: 'user', content: queryToSend }];
    setMessages(newMessages);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          properties: properties 
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Add AI response to UI
        setMessages(prev => [...prev, { role: 'ai', content: data.aiResponse }]);
        
        // Filter properties based on the IDs the AI matched
        if (data.matchedIds && data.matchedIds.length > 0) {
          const matchedProps = properties.filter(p => data.matchedIds.includes(p.id.toString()));
          setResults(matchedProps);
        } else {
          setResults([]); // AI found no matches
        }
      } else {
        console.error("AI Search Failed:", data);
        setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error connecting to my predictive models. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble analyzing the market right now. Give me a moment." }]);
    }
    
    setChatLoading(false);
    setLoading(false); // Disable global initial loader
  };

  return (
    <div className="search-page">
      <Head>
        <title>Search | FlowEstate AI</title>
      </Head>

      <div className="search-header glass-card">
        <div className="header-content animate-fade-in">
          <h1 className="heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            FlowBrain <span className="text-gradient">Discovery</span>
          </h1>
          
          <form className="search-bar" onSubmit={handleChatSubmit}>
            <input 
              type="text" 
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask FlowBrain for a specific vibe, location, or add on to your previous search..." 
              required
              disabled={chatLoading}
            />
            <button type="submit" className="btn-primary" disabled={chatLoading}>
              {chatLoading ? 'Thinking...' : 'Ask AI'}
            </button>
          </form>
        </div>
      </div>

      <div className="search-layout">
        {/* Chat History Sidebar */}
        <div className="chat-sidebar glass-card">
          <h3 className="heading" style={{ marginBottom: '16px', fontSize: '1.25rem' }}>FlowBrain Matchmaker</h3>
          <div className="chat-history">
            {messages.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', marginTop: '40px' }}>
                Start a conversation to find your perfect environment. I'll remember everything you ask!
              </p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role}`}>
                  <div className="bubble-role">{msg.role === 'user' ? 'You' : 'FlowBrain'}</div>
                  <div className="bubble-content">{msg.content}</div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="chat-bubble ai pulse">
                <div className="bubble-role">FlowBrain</div>
                <div className="bubble-content">Analyzing inventory and environmental vectors...</div>
              </div>
            )}
          </div>
        </div>

        <div className="results-container">
          {loading ? (
            <div className="loading-state animate-fade-in">
              <div className="orb-spinner"></div>
              <h3 className="heading">Analyzing Parameters</h3>
              <p className="text-muted">FlowBrain is searching thousands of listings for the perfect match...</p>
            </div>
          ) : (
            <div className="results-content animate-fade-in">
              <div className="results-info">
                <h2 className="heading" style={{ fontSize: '1.5rem' }}>
                  {messages.length > 0 ? 'Curated AI Matches' : 'All Available Platform Listings'}
                </h2>
                <p className="text-muted">{results.length} properties found</p>
              </div>

            <div className="property-grid">
              {results.length > 0 ? results.map((prop) => (
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
              )) : (
                <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }} className="glass-card">
                  <h3 className="heading">No Active Listings</h3>
                  <p className="text-muted">Generate some listings in your Partner Dashboard first!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
        }

        .search-header {
          padding: 60px 40px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .search-layout {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
          align-items: start;
        }

        .chat-sidebar {
          padding: 24px;
          height: calc(100vh - 250px);
          position: sticky;
          top: 120px;
          margin: 40px 0 40px 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .chat-history {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .chat-bubble {
          padding: 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .chat-bubble.user {
          align-self: flex-end;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-bottom-right-radius: 4px;
          margin-left: 20px;
        }

        .chat-bubble.ai {
          align-self: flex-start;
          background: linear-gradient(145deg, rgba(99, 102, 241, 0.1), transparent);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-bottom-left-radius: 4px;
          margin-right: 20px;
        }

        .bubble-role {
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          color: var(--text-muted);
        }

        .chat-bubble.ai .bubble-role {
          color: var(--primary);
        }

        .search-bar {
          display: flex;
          max-width: 1000px;
          margin: 0 auto;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 8px;
          border-radius: 16px;
          border: 1px solid var(--border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        .search-bar input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary, var(--foreground));
          font-family: inherit;
          font-size: 1.1rem;
          padding: 0 16px;
          outline: none;
        }

        .results-container {
          padding: 60px 40px 60px 0;
        }

        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 40vh;
          text-align: center;
        }

        .orb-spinner {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-glow);
          margin-bottom: 32px;
          animation: pulse 2s infinite ease-in-out;
          box-shadow: 0 0 40px var(--primary);
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        /* Property Grid Styles matching index.js */
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

        @media (max-width: 1024px) {
          .search-layout {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .chat-sidebar {
            height: auto;
            max-height: 400px;
            position: relative;
            top: 0;
            margin: 40px;
          }
          
          .results-container {
            padding: 0 40px 60px 40px;
          }

          .property-grid {
            grid-template-columns: 1fr;
          }
          .search-bar {
            flex-direction: column;
            background: transparent;
            border: none;
            padding: 0;
            box-shadow: none;
          }
          .search-bar input {
            background: rgba(255,255,255,0.05);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid var(--border);
          }
        }
      `}</style>
    </div>
  );
}
