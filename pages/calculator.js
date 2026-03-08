import Head from 'next/head';
import { useState } from 'react';

export default function Calculator() {
  const [price, setPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const calculateMortgage = () => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    const mathPower = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPayment = (principal * monthlyRate * mathPower) / (mathPower - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMortgage();
  const taxEstimate = (price * 0.0125) / 12; // Estimate 1.25% annual property tax
  const insuranceEstimate = (price * 0.005) / 12; // Estimate 0.5% annual insurance
  
  const totalMonthly = monthlyPayment + taxEstimate + insuranceEstimate;

  return (
    <div className="calculator-page">
      <Head>
        <title>Mortgage Calculator | FlowEstate AI</title>
      </Head>

      <div className="container animate-fade-in">
        <div className="header">
           <h1 className="heading" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            Mortgage <span className="text-gradient">Calculator</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
            Estimate your monthly payments, including principal, interest, taxes, and insurance for your luxury property.
          </p>
        </div>

        <div className="calculator-layout">
          <div className="glass-card controls-card">
            <div className="input-group">
              <label className="heading">Home Price</label>
              <div className="input-wrapper">
                <span className="currency">$</span>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(Math.min(10000000000, Number(e.target.value)))}
                  className="calc-input"
                  max="10000000000"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="heading">Down Payment</label>
              <div className="input-wrapper">
                <span className="currency">$</span>
                <input 
                  type="number" 
                  value={downPayment} 
                  onChange={(e) => setDownPayment(Math.min(price, Number(e.target.value)))}
                  className="calc-input"
                  max={price}
                />
              </div>
              <div className="percentage-hint text-muted">
                {((downPayment / price) * 100).toFixed(1)}% of price
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label className="heading">Interest Rate</label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    step="0.1" 
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Math.min(100, Number(e.target.value)))}
                    className="calc-input"
                    max="100"
                  />
                  <span className="percent">%</span>
                </div>
              </div>

              <div className="input-group">
                <label className="heading">Loan Term</label>
                <div className="input-wrapper">
                  <select 
                    value={loanTerm} 
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="calc-input select-input"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card results-card">
             <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Estimated Monthly Cost</h3>
             <div className="total-cost text-gradient">
               ${totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
             </div>
             
             <div className="breakdown">
               <div className="breakdown-item">
                 <div className="color-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
                 <div className="item-details">
                   <span className="item-label">Principal & Interest</span>
                   <span className="item-value">${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                 </div>
               </div>
               <div className="breakdown-item">
                 <div className="color-dot" style={{ backgroundColor: 'var(--secondary)' }}></div>
                 <div className="item-details">
                   <span className="item-label">Property Taxes</span>
                   <span className="item-value">${taxEstimate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                 </div>
               </div>
               <div className="breakdown-item">
                 <div className="color-dot" style={{ backgroundColor: '#10b981' }}></div>
                 <div className="item-details">
                   <span className="item-label">Home Insurance</span>
                   <span className="item-value">${insuranceEstimate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                 </div>
               </div>
             </div>
             
             <div className="loan-summary text-muted">
               Loan Amount: ${(price - downPayment).toLocaleString('en-US')}
             </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calculator-page {
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        .header {
          margin-bottom: 60px;
        }

        .calculator-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 40px;
        }

        .controls-card, .results-card {
          padding: 40px;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .calc-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          padding: 16px;
          border-radius: 12px;
          color: var(--text-primary, var(--foreground));
          font-size: 1.25rem;
          font-family: inherit;
          outline: none;
          transition: var(--transition-smooth);
        }

        .calc-input:focus {
          border-color: var(--primary);
        }

        .currency {
          position: absolute;
          left: 16px;
          font-size: 1.25rem;
          color: var(--text-muted);
        }

        .calc-input[type="number"] {
          padding-left: 40px;
        }
        
        .input-row .calc-input[type="number"] {
          padding-left: 16px;
          padding-right: 40px;
        }

        .percent {
          position: absolute;
          right: 16px;
          font-size: 1.25rem;
          color: var(--text-muted);
        }

        .select-input {
          padding-left: 16px;
          appearance: none;
        }

        .percentage-hint {
          margin-top: 8px;
          font-size: 0.9rem;
        }

        .total-cost {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 40px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .breakdown {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .item-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
        }
        
        .item-value {
          font-weight: 600;
        }

        .loan-summary {
          padding-top: 24px;
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 1.1rem;
        }

        @media (max-width: 900px) {
          .calculator-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
