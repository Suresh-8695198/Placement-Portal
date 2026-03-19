// components/company/CompanyTopBar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyTopBar() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Company");

  useEffect(() => {
    const name = localStorage.getItem("companyName");
    const email = localStorage.getItem("companyEmail");
    if (name) setCompanyName(name);
    else if (email) setCompanyName(email.split("@")[0] || "Company");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/company-login");
  };

  return (
    <>
      <style>{`
        :root {
          --primary-start: #6366f1;
          --primary-end: #8b5cf6;
          --primary-glow: rgba(99, 102, 241, 0.5);
        }

        .topbar-area {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(24px) saturate(160%);
          border-bottom: 1px solid rgba(255,255,255,0.32);
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.1),
            inset 0 0 20px rgba(255,255,255,0.4);
          padding: 0.9rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
          color: #1e293b;
          overflow: hidden;
        }

        .topbar-area::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(99,102,241,0.25) 20%,
            transparent 40%,
            rgba(139,92,246,0.18) 60%,
            transparent 100%
          );
          opacity: 0.45;
          pointer-events: none;
          animation: crystalMove 16s linear infinite;
        }

        @keyframes crystalMove {
          0%   { transform: translateX(-30%) translateY(-30%); }
          100% { transform: translateX(30%)  translateY(30%); }
        }

        .welcome {
          font-size: 1.45rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 2;
        }

        .welcome span {
          font-weight: 800;
          background: linear-gradient(90deg, var(--primary-start), var(--primary-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 8px var(--primary-glow);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.7rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 20px var(--primary-glow);
          position: relative;
          overflow: hidden;
          z-index: 2;
        }

        .logout-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 32px var(--primary-glow);
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          inset: -50%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.55),
            transparent
          );
          animation: shine 2.6s infinite;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .logout-btn:hover::before {
          opacity: 1;
        }

        @keyframes shine {
          0%   { transform: translateX(-120%) rotate(30deg); }
          60%, 100% { transform: translateX(120%) rotate(30deg); }
        }

        .logout-btn i {
          font-size: 1.2rem;
          transition: transform 0.35s ease;
        }

        .logout-btn:hover i {
          transform: rotate(180deg) scale(1.2);
        }

        .logout-btn:hover::after,
        .logout-btn:focus::after {
          content: '✨';
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 1rem;
          opacity: 0.8;
          animation: twinkle 1.8s infinite;
          pointer-events: none;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }

        @media (max-width: 768px) {
          .topbar-area { padding: 0.8rem 1.5rem; flex-wrap: wrap; gap: 1rem; }
          .welcome { font-size: 1.1rem; }
          .logout-btn { padding: 0.65rem 1.3rem; font-size: 0.95rem; }
        }

        @media (max-width: 576px) {
          .topbar-area { padding: 0.7rem 1.2rem; justify-content: center; }
          .welcome { font-size: 1rem; text-align: center; }
        }
      `}</style>

      <div className="topbar-area">
        <div className="welcome">
          Welcome, <span>{companyName}</span> ✨
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </>
  );
}