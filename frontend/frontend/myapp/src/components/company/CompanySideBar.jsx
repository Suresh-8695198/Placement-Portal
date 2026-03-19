

// components/company/CompanySideBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function CompanySideBar() {
  return (
    <>
      <style>{`
        :root {
          --sidebar-bg: #0f172a;
          --sidebar-text: #64748b;
          --sidebar-active-bg: #4f46e5;
          --sidebar-active-text: #ffffff;
          --sidebar-hover-bg: #1e293b;
          --sidebar-border: #1e293b;
          --font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }

        .sidebar-wrapper {
          width: 280px;
          height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .sidebar-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.25rem;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 0.75rem;
          margin-bottom: 3.5rem;
        }

        .brand-logo-sq {
          width: 42px;
          height: 42px;
          background: var(--sidebar-active-bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.4);
        }

        .brand-name-text {
          font-size: 1.35rem;
          font-weight: 850;
          color: #ffffff;
          letter-spacing: -0.03em;
        }

        .nav-section-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.25rem;
          padding-left: 0.75rem;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .nav-item {
          margin-bottom: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.85rem 1rem;
          color: var(--sidebar-text);
          text-decoration: none !important;
          font-size: 0.925rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          gap: 14px;
        }

        .nav-link:hover {
          background: var(--sidebar-hover-bg);
          color: #ffffff;
        }

        .nav-link.active {
          background: var(--sidebar-active-bg);
          color: var(--sidebar-active-text);
          box-shadow: 0 4px 12px -2px rgba(79, 70, 229, 0.3);
        }

        .nav-icon {
          font-size: 1.1rem;
          width: 20px;
          display: flex;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .nav-link.active .nav-icon {
          color: white;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid var(--sidebar-border);
        }

        .user-mini-profile {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 0.75rem;
           border-radius: 14px;
           cursor: pointer;
           transition: background 0.2s;
        }

        .user-mini-profile:hover {
           background: var(--sidebar-hover-bg);
        }

        .user-avatar-sm {
           width: 36px;
           height: 36px;
           background: #1e293b;
           border-radius: 10px;
           color: #94a3b8;
           display: flex;
           align-items: center;
           justify-content: center;
           font-weight: 700;
           font-size: 0.85rem;
           border: 1px solid #334155;
        }

        .user-info-sm {
           display: flex;
           flex-direction: column;
           overflow: hidden;
        }

        .user-name-sm {
           color: #ffffff;
           font-size: 0.85rem;
           font-weight: 700;
           white-space: nowrap;
           overflow: hidden;
           text-overflow: ellipsis;
        }

        .user-role-sm {
           color: #475569;
           font-size: 0.75rem;
           font-weight: 600;
        }

        @media (max-width: 992px) {
          .sidebar-wrapper { width: 88px; }
          .brand-name-text, .nav-section-label, .nav-label, .user-info-sm { display: none; }
          .sidebar-brand { justify-content: center; padding: 0; }
          .nav-link { justify-content: center; padding: 1rem; }
          .nav-icon { margin: 0; font-size: 1.3rem; }
          .sidebar-inner { align-items: center; }
          .user-mini-profile { justify-content: center; }
        }
      `}</style>

      <div className="sidebar-wrapper">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="brand-logo-sq">
              <i className="fas fa-layer-group"></i>
            </div>
            <span className="brand-name-text">NexusHQ</span>
          </div>

          <p className="nav-section-label">Organization</p>

          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="profile"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-columns nav-icon"></i>
                <span className="nav-label">Direct Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="post-job"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-plus-square nav-icon"></i>
                <span className="nav-label">New Opportunity</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="applicants"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-users-viewfinder nav-icon"></i>
                <span className="nav-label">Talent Pool</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="report"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-chart-pie nav-icon"></i>
                <span className="nav-label">Analytics</span>
              </NavLink>
            </li>
          </ul>

          <div className="sidebar-footer">
             <div className="user-mini-profile">
                <div className="user-avatar-sm">HQ</div>
                <div className="user-info-sm">
                   <span className="user-name-sm">Organization Settings</span>
                   <span className="user-role-sm">Enterprise Account</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
