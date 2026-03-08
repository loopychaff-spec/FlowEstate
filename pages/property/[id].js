import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('overview');
  const [neighborhoodData, setNeighborhoodData] = useState(null);
  const [reimagineData, setReimagineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hello! I'm your dedicated FlowEstate concierge. Do you have any questions about this stunning property, or would you like to schedule a private tour?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const property = {
    id: id,
    title: "The Obsidian Glass Villa",
    address: "123 Sapphire Lane",
    city: "Beverly Hills",
    state: "CA",
    price: "$12,500,000",
    beds: 5,
    baths: 6.5,
    sqft: "7,200",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
      "https://images.unsplash.com/photo-1600607687931-cebf698d2548?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  };

  const fetchNeighborhoodGuide = async () => {
    if (neighborhoodData) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai-neighborhood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: property.address, 
          city: property.city, 
          state: property.state 
        })
      });
      const data = await res.json();
      setNeighborhoodData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReimagine = async () => {
    if (reimagineData) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reimagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: property.images[0],
          style: 'Ultra-Modern Minimalist'
        })
      });
      const data = await res.json();
      setReimagineData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'neighborhood') fetchNeighborhoodGuide();
    if (activeTab === 'reimagine') fetchReimagine();
  }, [activeTab]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/property-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyData: property,
          messages: newMessages
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', content: "I'm having a little trouble connecting to the network. Please try again in a moment." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'ai', content: "I'm having a little trouble connecting to the network. Please try again in a moment." }]);
    }

    setIsChatLoading(false);
  };

  return (
    <div className="property-page">
      <Head>
        <title>{`${property.title} | FlowEstate`}</title>
      </Head>

      <div className="property-container">
        {/* Header Section */}
        <div className="property-header animate-fade-in">
          <div className="header-info">
            <h1 className="heading">{property.title}</h1>
            <p className="address text-muted">
              {property.address}, {property.city}, {property.state}
            </p>
          </div>
          <div className="header-price">
            <span className="price text-gradient">{property.price}</span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="property-gallery animate-fade-in">
          <div className="main-image"></div>
          <div className="side-images">
            <div className="side-image image-1"></div>
            <div className="side-image image-2"></div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="property-layout">
          <div className="property-main">
            
            {/* AI Control Tabs */}
            <div className="tabs-container glass-card">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'neighborhood' ? 'active' : ''}`}
                onClick={() => setActiveTab('neighborhood')}
              >
                <span className="sparkle">✨</span> AI Neighborhood Guide
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reimagine' ? 'active' : ''}`}
                onClick={() => setActiveTab('reimagine')}
              >
                <span className="sparkle">✨</span> Reimagine This Space
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="tab-content glass-card animate-fade-in">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  <div className="quick-stats">
                    <div className="stat-box">
                      <span className="stat-label">Beds</span>
                      <span className="stat-value">{property.beds}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Baths</span>
                      <span className="stat-value">{property.baths}</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Sq Ft</span>
                      <span className="stat-value">{property.sqft}</span>
                    </div>
                  </div>
                  <div className="description">
                    <h3 className="heading">About this home</h3>
                    <p>
                      Experience unparalleled luxury in this architecturally significant glass villa. 
                      Featuring floor-to-ceiling windows that perfectly frame the city skyline, state-of-the-art 
                      smart home integration, and a private infinity pool overlooking the hills. 
                      This masterpiece represents the pinnacle of modern living.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'neighborhood' && (
                <div className="ai-content">
                  {loading ? (
                    <div className="ai-loading">
                      <div className="spinner"></div>
                      <p>FlowBrain is analyzing {property.city} local data...</p>
                    </div>
                  ) : neighborhoodData ? (
                    <div className="infrastructure-grid">
                      <div className="info-card">
                        <h4 className="heading">Neighborhood Vibe</h4>
                        <p>{neighborhoodData.vibe}</p>
                      </div>
                      <div className="info-card">
                        <h4 className="heading">Schools & Education</h4>
                        <p>{neighborhoodData.schools}</p>
                      </div>
                      <div className="info-card">
                        <h4 className="heading">Lifestyle & Amenities</h4>
                        <p>{neighborhoodData.lifestyle}</p>
                      </div>
                      <div className="info-card">
                        <h4 className="heading">Commute</h4>
                        <p>{neighborhoodData.commute}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="ai-error">Failed to load neighborhood data.</div>
                  )}
                </div>
              )}

              {activeTab === 'reimagine' && (
                <div className="ai-content">
                  {loading ? (
                    <div className="ai-loading">
                      <div className="spinner"></div>
                      <p>FlowBrain is physically restructuring the space into Ultra-Modern Minimalist...</p>
                    </div>
                  ) : reimagineData ? (
                    <div className="reimagine-results">
                      <div className="info-card highlight-card">
                        <h4 className="heading text-gradient">The Vision</h4>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{reimagineData.description}</p>
                      </div>
                      <div className="info-card" style={{ marginTop: '24px' }}>
                        <h4 className="heading">Key Transformations</h4>
                        <ul className="transformation-list">
                          {reimagineData.changes.map((change, index) => (
                            <li key={index}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="ai-error">Failed to generate virtual staging.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="property-sidebar">
            <div className="contact-card glass-card sticky agent-card">
              <div className="agent-header">
                <div className="agent-avatar"></div>
                <div>
                  <h3 className="heading" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Sarah AI</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Senior Luxury Agent</p>
                </div>
              </div>
              
              <div className="agent-chat-history">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`agent-bubble ${msg.role}`}>
                    {msg.content}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="agent-bubble ai loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                )}
              </div>

              <form className="agent-input-form" onSubmit={handleChatSubmit}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..." 
                  required 
                  className="input-field"
                  disabled={isChatLoading}
                />
                <button type="submit" className="send-btn" disabled={isChatLoading}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .property-page {
          padding-top: 60px;
          min-height: 100vh;
        }

        .property-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .header-info h1 {
          font-size: 3rem;
          margin-bottom: 8px;
        }

        .address {
          font-size: 1.25rem;
          color: var(--text-muted);
        }

        .price {
          font-size: 3rem;
          font-weight: 800;
        }

        .property-gallery {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          height: 600px;
          margin-bottom: 60px;
        }

        .main-image {
          background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
          background-size: cover;
          background-position: center;
          border-radius: 24px;
        }

        .side-images {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 24px;
        }

        .side-image {
          background-size: cover;
          background-position: center;
          border-radius: 20px;
        }
        
        .image-1 { background-image: url('https://images.unsplash.com/photo-1600607687931-cebf698d2548?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'); }
        .image-2 { background-image: url('https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'); }

        .property-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          padding-bottom: 100px;
        }

        .tabs-container {
          display: flex;
          padding: 12px;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab-btn {
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          color: var(--text-muted);
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .tab-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 20px var(--primary-glow);
        }

        .sparkle {
          margin-right: 8px;
        }

        .tab-content {
          padding: 40px;
          min-height: 400px;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          padding: 24px;
          border-radius: 16px;
          text-align: center;
        }

        .stat-label {
          display: block;
          color: var(--text-muted);
          margin-bottom: 8px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
        }

        .description h3 {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .description p {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.8;
        }

        /* AI Styles */
        .ai-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: var(--text-muted);
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

        .infrastructure-grid {
          display: grid;
          gap: 24px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          padding: 32px;
          border-radius: 16px;
        }

        .highlight-card {
          background: linear-gradient(to right, rgba(99, 102, 241, 0.1), transparent);
          border-left: 4px solid var(--primary);
        }

        .info-card h4 {
          font-size: 1.25rem;
          margin-bottom: 12px;
          color: white;
        }

        .info-card p {
          color: var(--text-muted);
          line-height: 1.7;
        }

        .transformation-list {
          list-style: none;
          display: grid;
          gap: 16px;
        }

        .transformation-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Sidebar Chatbot Styles */
        .sticky {
          position: sticky;
          top: 100px;
        }

        .agent-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 600px; /* Fixed height for chat window */
        }
        
        .agent-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 20px;
        }

        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border: 2px solid rgba(255,255,255,0.1);
        }

        .agent-chat-history {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
          padding-right: 8px; /* For scrollbar */
        }
        
        .agent-chat-history::-webkit-scrollbar {
          width: 4px;
        }
        .agent-chat-history::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }

        .agent-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.95rem;
          line-height: 1.5;
          max-width: 90%;
        }

        .agent-bubble.ai {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }

        .agent-bubble.user {
          align-self: flex-end;
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .loading-dots span {
          animation: loading 1.4s infinite reverse;
          animation-fill-mode: both;
          font-size: 1.5rem;
          line-height: 0.5;
        }
        .loading-dots span:nth-child(2) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(3) { animation-delay: -0.16s; }
        @keyframes loading {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }

        .agent-input-form {
          display: flex;
          gap: 12px;
          position: relative;
        }

        .input-field {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 16px;
          padding-right: 50px;
          border-radius: 12px;
          color: var(--text-primary, var(--foreground));
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition-smooth);
        }

        .input-field:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
        }
        
        .send-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }
        .send-btn:hover {
          filter: brightness(1.2);
        }
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .property-layout {
            grid-template-columns: 1fr;
          }
          
          .property-gallery {
            grid-template-columns: 1fr;
            height: auto;
          }
          
          .main-image {
            height: 400px;
          }

          .side-images {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 200px;
          }

          .tabs-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
