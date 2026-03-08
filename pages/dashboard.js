import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, properties, addProperty, removeProperty } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotes, setAiNotes] = useState("");
  
  const [newProp, setNewProp] = useState({ 
    title: '', location: '', price: '', beds: '', baths: '', sqft: '', description: '', images: [] 
  });

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiNotes.trim()) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: aiNotes })
      });
      const data = await res.json();
      if (res.ok) {
        setNewProp({
          title: data.title || '',
          location: data.location || '',
          price: data.price || '',
          beds: data.beds || '',
          baths: data.baths || '',
          sqft: data.sqft || '',
          description: data.description || '',
          images: data.images || []
        });
      }
    } catch (error) {
      console.error("Error generating listing:", error);
    }
    setIsGenerating(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    })).then(base64Images => {
      setNewProp(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
    }).catch(console.error);
  };

  const handleAiEnhance = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const existingData = `${newProp.title} in ${newProp.location}. ${newProp.beds} beds, ${newProp.baths} baths, ${newProp.sqft} sqft. Price: ${newProp.price}. ${newProp.description}`;
    try {
      const res = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: `Enhance and fully flesh out this listing data into a premium format. Generate high quality images. Data: ${existingData}` })
      });
      const data = await res.json();
      if (res.ok) {
        setNewProp({
          title: data.title || newProp.title,
          location: data.location || newProp.location,
          price: data.price || newProp.price,
          beds: data.beds || newProp.beds,
          baths: data.baths || newProp.baths,
          sqft: data.sqft || newProp.sqft,
          sqft: data.sqft || newProp.sqft,
          description: data.description || newProp.description,
          images: data.images ? data.images : newProp.images
        });
      }
    } catch (error) {
      console.error("Error enhancing listing:", error);
    }
    setIsGenerating(false);
  };


  const seedMarketplace = async () => {
    setIsGenerating(true);
    const seedData = [
      {
        title: "The Glass Pavillion",
        location: "Montecito, CA",
        price: "$28,500,000",
        beds: 5,
        baths: 6,
        sqft: "12,000",
        description: "A triumph of modern architecture, this glass pavillion sits on 5 acres of pristine coastal land. Features a world-class art gallery.",
        image: "https://images.unsplash.com/photo-1600607687931-cebf698d2548?auto=format&fit=crop&w=1600&q=90",
        images: ["https://images.unsplash.com/photo-1600607687931-cebf698d2548?auto=format&fit=crop&w=1600&q=90"],
        user_email: "seed@flowestate.ai"
      },
      {
        title: "Neo-Tokyo Penthouse",
        location: "Shibuya, Tokyo",
        price: "$15,900,000",
        beds: 3,
        baths: 3.5,
        sqft: "4,200",
        description: "Multi-level sky residence with 360-degree views of the Tokyo skyline. Interior features rare volcanic stone.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=90",
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=90"],
        user_email: "seed@flowestate.ai"
      },
      {
        title: "The Brooklyn Ironworks",
        location: "DUMBO, NY",
        price: "$7,250,000",
        beds: 4,
        baths: 3,
        sqft: "3,800",
        description: "A converted 19th-century iron foundry transformed into a sprawling industrial loft with direct views of the Manhattan Bridge.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90"],
        user_email: "seed@flowestate.ai"
      },
      {
        title: "Azure Cliff Manor",
        location: "Amalfi Coast, Italy",
        price: "$32,000,000",
        beds: 7,
        baths: 9,
        sqft: "15,000",
        description: "Carved directly into the limestone cliffs, this legendary estate features private sea access via elevator and a terraced infinity pool.",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=90",
        images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=90"],
        user_email: "seed@flowestate.ai"
      },
      {
        title: "Modernist Desert Oasis",
        location: "Scottsdale, AZ",
        price: "$9,400,000",
        beds: 4,
        baths: 5,
        sqft: "6,500",
        description: "Angular architecture blends seamlessly with the Sonoran desert landscape. Zero-edge pool and observatory deck.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=90",
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=90"],
        user_email: "seed@flowestate.ai"
      }
    ];

    for (const item of seedData) {
      await addProperty(item);
    }
    setIsGenerating(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProp.title || !newProp.location || !newProp.price) return;
    
    const finalImages = newProp.images;
    const imageToUse = finalImages.length > 0 ? finalImages[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90";

    addProperty({
      ...newProp,
      image: imageToUse,
      images: finalImages.length > 0 ? finalImages : [imageToUse]
    });
    
    setNewProp({ title: '', location: '', price: '', beds: '', baths: '', sqft: '', description: '', images: [] });
    setAiNotes("");
    setShowAddForm(false);
  };

  return (
    <div className="page-container">
      <Head>
        <title>Dashboard | FlowEstate</title>
      </Head>
      <div className="content animate-fade-in">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 className="heading" style={{ fontSize: '3rem', marginBottom: '8px' }}>
              {user?.role === 'Partner' ? 'Partner Portal' : 'Buyer Dashboard'}
            </h1>
            <p className="description text-muted">Manage your properties and view AI-generated insights.</p>
          </div>
          {user && (
            <button className="btn-secondary" onClick={() => logout()}>Sign Out</button>
          )}
        </div>
        
        {!user ? (
          <div className="glass-card placeholder">
            <h2>Sign in Required</h2>
            <p className="text-muted">Please sign in to access your property dashboard and AI tools.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
              <button className="btn-secondary" onClick={() => router.push('/login')}>Partner Login</button>
              <button className="btn-primary" onClick={() => router.push('/buyer-login')}>Buyer Sign In</button>
            </div>
          </div>
        ) : (
          <>
            <div className="dashboard-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="heading">Your Saved Properties</h2>
                {user.role === 'Partner' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {properties.length === 0 && (
                      <button className="btn-secondary" onClick={seedMarketplace} disabled={isGenerating} style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                        {isGenerating ? 'Seeding...' : 'Seed Marketplace'}
                      </button>
                    )}
                    <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                      {showAddForm ? 'Cancel' : '+ Add Listing'}
                    </button>
                  </div>
                )}
              </div>

              {showAddForm && (
              <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                  <h3 className="heading" style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
                    FlowBrain Agent Draft
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="Type rough notes... (e.g. 5 beds in bel air, modern, needs work, around $5M)" 
                      className="input-field" 
                      style={{ flex: 1 }}
                      value={aiNotes} 
                      onChange={(e) => setNewProp({...newProp, aiNotes: e.target.value})}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAiGenerate(e); }}
                    />
                    <button className="btn-secondary" onClick={handleAiGenerate} disabled={isGenerating}>
                      {isGenerating ? 'Drafting...' : 'Generate Listing'}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ width: '100%', display: 'flex', gap: '16px' }}>
                    <input 
                      type="text" placeholder="Title (e.g. Modern Zen Estate)" className="input-field" style={{ flex: 2 }}
                      value={newProp.title} onChange={(e) => setNewProp({...newProp, title: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Location (e.g. Austin, TX)" className="input-field" style={{ flex: 1 }}
                      value={newProp.location} onChange={(e) => setNewProp({...newProp, location: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Price (e.g. $4,200,000)" className="input-field" style={{ flex: 1 }}
                      value={newProp.price} onChange={(e) => setNewProp({...newProp, price: e.target.value})}
                    />
                  </div>
                  
                  <div style={{ width: '100%', display: 'flex', gap: '16px' }}>
                    <input type="number" placeholder="Beds" className="input-field" style={{ flex: 1 }} value={newProp.beds} onChange={(e) => setNewProp({...newProp, beds: e.target.value})} />
                    <input type="number" placeholder="Baths" step="0.5" className="input-field" style={{ flex: 1 }} value={newProp.baths} onChange={(e) => setNewProp({...newProp, baths: e.target.value})} />
                    <input type="text" placeholder="SqFt" className="input-field" style={{ flex: 1 }} value={newProp.sqft} onChange={(e) => setNewProp({...newProp, sqft: e.target.value})} />
                  </div>

                  <textarea 
                    placeholder="Property Description" 
                    className="input-field" 
                    style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                    value={newProp.description} onChange={(e) => setNewProp({...newProp, description: e.target.value})}
                  />
                  
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Upload Property Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="input-field file-upload" 
                      style={{ width: '100%' }}
                      onChange={handleImageUpload}
                    />
                  </div>

                  {newProp.images && newProp.images.length > 0 && (
                    <div style={{ width: '100%', display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {newProp.images.map((img, i) => (
                        <div key={i} style={{ flex: '0 0 100px', height: '80px', borderRadius: '8px', background: `url(${img}) center/cover` }}></div>
                      ))}
                    </div>
                  )}

                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                    <button type="button" className="btn-secondary" onClick={handleAiEnhance} disabled={isGenerating}>
                      <span className="sparkle">✨</span> {isGenerating ? 'Auto-Enhancing...' : 'Auto-Enhance Data'}
                    </button>
                    <button type="submit" className="btn-primary">Save Listing</button>
                  </div>
                </form>
              </div>
            )}

              <div className="property-list">
                {properties.map((prop) => (
                  <div key={prop.id} className="property-row glass-card animate-fade-in">
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '12px', 
                        background: `url(${prop.image}) center/cover`
                      }}></div>
                      <div>
                        <h3 className="heading" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{prop.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{prop.location} • {prop.price}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <Link href="/property/1" className="btn-secondary">View Listing</Link>
                      <Link href="/property/1" className="btn-primary" style={{ background: '#10b981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)' }}>View AI</Link>
                      {user.role === 'Partner' && (
                        <button onClick={() => removeProperty(prop.id)} style={{ color: '#ef4444', marginLeft: '8px', padding: '8px' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {properties.length === 0 && (
                  <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>You haven't added any properties yet.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 40px;
          min-height: 70vh;
        }
        .description {
          margin-bottom: 40px;
        }
        .placeholder {
          padding: 80px 40px;
          text-align: center;
        }
        .placeholder h2 {
          font-size: 2rem;
          margin-bottom: 16px;
        }
        .property-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        .input-field {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-primary, var(--foreground));
          font-family: inherit;
          font-size: 1rem;
          outline: none;
        }
        @media (max-width: 768px) {
          .property-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
