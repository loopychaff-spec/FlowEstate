import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function About() {
  const { user } = useAuth();
  
  return (
    <div className="page-container">
      <Head>
        <title>About | FlowEstate</title>
      </Head>
      
      <div className="content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <h1 className="heading" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>
            The Genesis of <span className="text-gradient">FlowEstate</span>
          </h1>
          <p className="description" style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            FlowEstate is the bleeding edge of real estate. We fused state-of-the-art Generative AI with premium luxury curation 
            to fundamentally change how brokers list properties, and how buyers discover their dream homes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
            </div>
            <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>FlowBrain Agent</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>
              Partner Brokers enter raw shorthand notes about a property. Our proprietary Google Gemini-powered <b>FlowBrain Agent</b> intelligently 
              expands them into captivating, structured luxury listings complete with estimated market prices and curated Unsplash imagery in milliseconds.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>AI Neighborhood Guide</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>
              Gone are the days of sterile census data. Buyers can access the <b>AI Neighborhood Guide</b> to read localized, highly contextual insights 
              on the vibe, commute, safety, and lifestyle of the neighborhood surrounding the home, generated specifically for their viewing context.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid var(--primary)' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Virtual Staging</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>
              We aren't just selling homes; we're selling the potential. When buyers view a property, they can use our <b>"Reimagine Space"</b> tool to tell the AI how they 
              would personalize the interior to their tastes, from mid-century modern to gothic architecture, expanding the canvas of possibilities.
            </p>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Join the Network</h3>
            <p className="text-muted">Experience the luxury platform redefining digital home acquisition.</p>
          </div>
          <div>
            {!user ? (
               <Link href="/login" className="btn-primary">Become a Partner</Link>
            ) : (
               <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 40px;
          min-height: 80vh;
        }
      `}</style>
    </div>
  );
}
