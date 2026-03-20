
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function OfferLetters() {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentEmail = localStorage.getItem("studentEmail");

  useEffect(() => {
    if (!studentEmail) {
      setError("Please login to view your offer letters");
      setLoading(false);
      return;
    }

    const fetchOfferLetters = async () => {
      try {
        const response = await axios.get(`${API_BASE}/companies/offer-letters/?student_email=${encodeURIComponent(studentEmail)}`);
        setOfferLetters(response.data.offer_letters || []);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load offer letters");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferLetters();
  }, [studentEmail]);

  const formatFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  };

  return (
    <div className="offer-letter-modern-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .offer-letter-modern-page {
          min-height: 100vh;
          background: #f0f2f5;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 2rem;
          color: #1a1a1a;
          position: relative;
          overflow: hidden;
        }

        .offer-letter-modern-page::before {
          content: "";
          position: absolute;
          top: -10%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          z-index: 0;
        }

        .offer-letter-modern-page::after {
          content: "";
          position: absolute;
          bottom: -10%;
          left: -5%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          z-index: 0;
        }

        .page-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-section {
          text-align: center;
          margin-bottom: 4rem;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .badge-success {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ecfdf5;
          color: #059669;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(5, 150, 105, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.05rem;
        }

        .title-main {
          font-family: 'Outfit', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          letter-spacing: -0.05rem;
        }

        .subtitle-main {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Card Grid */
        .offer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2.5rem;
          perspective: 1000px;
        }

        @media (max-width: 480px) {
          .offer-grid {
            grid-template-columns: 1fr;
          }
        }

        .offer-card-premium {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -4px rgba(0,0,0,0.02);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .offer-card-premium::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .offer-card-premium:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.12), 0 18px 36px -18px rgba(0,0,0,0.12);
          border-color: rgba(79, 70, 229, 0.2);
        }

        .offer-card-premium:hover::before {
          opacity: 1;
        }

        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .brand-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          font-size: 1.75rem;
          font-weight: 800;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }

        .date-chip {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
        }

        .company-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
          font-family: 'Outfit', sans-serif;
        }

        .role-name {
          font-size: 1.05rem;
          color: #4f46e5;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .message-bubble {
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          border: 1px solid #f1f5f9;
          position: relative;
        }

        .message-bubble::after {
          content: '"';
          position: absolute;
          top: 5px;
          right: 15px;
          font-size: 3rem;
          font-family: serif;
          color: rgba(79, 70, 229, 0.05);
          line-height: 1;
        }

        .message-text {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
          font-style: italic;
        }

        .action-container {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-view-offer {
          width: 100%;
          background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 1.1rem;
          border-radius: 16px;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
        }

        .btn-view-offer:hover {
          background: linear-gradient(90deg, #4f46e5 0%, #6366f1 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.25);
          color: white;
        }

        .status-badge-bottom {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #10b981;
          font-weight: 700;
          justify-content: center;
        }

        /* Animations */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Loading Spinner */
        .loading-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10rem 0;
        }

        .modern-loader {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-bottom-color: #4f46e5;
          border-radius: 50%;
          animation: rotation 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-visual {
          background: white;
          border-radius: 40px;
          padding: 6rem 3rem;
          text-align: center;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lottie-placeholder {
          font-size: 6rem;
          margin-bottom: 2rem;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        .empty-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.75rem;
        }

        .empty-desc {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 400px;
          margin: 0 auto;
        }
      `}</style>

      <div className="page-content">
        <div className="header-section">
          <div className="badge-success">
            <i className="fas fa-medal"></i> Career Milestones
          </div>
          <h1 className="title-main">Success Unlocked</h1>
          <p className="subtitle-main">
            Your persistence has paid off! Browse through your official offer letters and prepare for the next chapter of your professional journey.
          </p>
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="modern-loader"></div>
            <p style={{ fontWeight: 600, color: '#64748b' }}>Curating your achievements...</p>
          </div>
        ) : error ? (
          <div className="empty-visual" style={{ borderColor: '#fee2e2', background: '#fffafa' }}>
             <div className="lottie-placeholder">⚠️</div>
             <h3 className="empty-title" style={{ color: '#ef4444' }}>System Sync Error</h3>
             <p className="empty-desc">{error}</p>
          </div>
        ) : offerLetters.length === 0 ? (
          <div className="empty-visual">
            <div className="lottie-placeholder">🏙️</div>
            <h3 className="empty-title">Your Big Moment is Coming</h3>
            <p className="empty-desc">
              Continue showcasing your incredible talent. Your next offer letter is just around the corner!
            </p>
          </div>
        ) : (
          <div className="offer-grid">
            {offerLetters.map((ol, index) => (
              <div 
                key={ol.id} 
                className="offer-card-premium"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header-flex">
                  <div className="brand-icon">
                    {ol.company_name.charAt(0)}
                  </div>
                  <div className="date-chip">
                    {new Date(ol.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="company-name">{ol.company_name}</div>
                <div className="role-name">
                  <i className="fas fa-briefcase" style={{ fontSize: '0.9rem', opacity: 0.7 }}></i>
                  {ol.job_title}
                </div>

                {ol.message && (
                  <div className="message-bubble">
                    <div className="message-text">"{ol.message}"</div>
                  </div>
                )}

                <div className="action-container">
                  <a 
                    href={formatFileUrl(ol.offer_letter_url)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-view-offer"
                  >
                    <i className="fas fa-file-pdf"></i>
                    View Official Offer
                  </a>
                  <div className="status-badge-bottom">
                    <i className="fas fa-check-double"></i>
                    Officially Selected
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
