
// components/company/CompanySideBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function CompanySideBar() {
  return (
    <>
      <style>{`
        :root {
          --primary-start: #6366f1;
          --primary-end:   #8b5cf6;
          --primary-glow:  rgba(99, 102, 241, 0.4);
          --text-main:     #1e293b;
          --text-secondary:#475569;
          --glass-bg:      rgba(255, 255, 255, 0.82);
          --glass-border:  rgba(255,255,255,0.28);
        }

        .sidebar-wrapper {
          width: 260px;
          height: 100%;
          background: var(--glass-bg);
          
          /* Completely remove all rounded corners */
          border-radius: 0 !important;
          
          box-shadow: 
            0 10px 32px rgba(0,0,0,0.12),
            inset 0 0 24px rgba(255,255,255,0.35);
          backdrop-filter: blur(24px) saturate(180%);
          transition: width 0.38s ease;
          overflow: hidden;
          border-right: 1px solid var(--glass-border);
        }

        @media (max-width: 992px) {
          .sidebar-wrapper {
            width: 80px;
          }
          .sidebar-title,
          .nav-label {
            display: none;
          }
          .nav-link {
            justify-content: center;
            padding: 1.2rem 0;
          }
        }

        .sidebar-inner {
          height: 100%;
          padding: 2.2rem 1.4rem;
          display: flex;
          flex-direction: column;
        }

        .sidebar-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 2.8rem;
          text-align: center;
          background: linear-gradient(90deg, var(--primary-start), var(--primary-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .nav-item {
          margin-bottom: 0.7rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.3rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 500;
          border-radius: 12px;           /* ← you can also set this to 0 if you want square nav items */
          transition: all 0.28s ease;
        }

        .nav-link:hover {
          background: rgba(99,102,241,0.08);
          color: var(--text-main);
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.12);
        }

        .nav-link.active {
          background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
          color: white;
          font-weight: 600;
          box-shadow: 0 6px 20px var(--primary-glow);
        }

        .nav-icon {
          font-size: 1.45rem;
          min-width: 36px;
          text-align: center;
          color: var(--text-secondary);
          transition: all 0.28s ease;
        }

        .nav-link:hover .nav-icon {
          transform: scale(1.12);
          color: var(--text-main);
        }

        .nav-link.active .nav-icon {
          color: white;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .sidebar-wrapper::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="sidebar-wrapper">
        <div className="sidebar-inner">
          <h3 className="sidebar-title">Company</h3>

          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="profile"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-building nav-icon"></i>
                <span className="nav-label">Profile</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="post-job"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-plus-square nav-icon"></i>
                <span className="nav-label">Post Job</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="applicants"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-users nav-icon"></i>
                <span className="nav-label">Applicants</span>
              </NavLink>
            </li>


            <li className="nav-item">
  <NavLink
    to="report"
    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
  >
    <i className="fas fa-chart-bar nav-icon"></i>
    <span className="nav-label">Report</span>
  </NavLink>
</li>
          </ul>
        </div>
      </div>
    </>
  );
}