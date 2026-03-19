

// components/company/CompanySideBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function CompanySideBar() {
  return (
    <>
      <style>{`
        :root {
          --sidebar-bg: #0f172a;
          --sidebar-text: #94a3b8;
          --sidebar-active-bg: #3b82f6;
          --sidebar-active-text: #ffffff;
          --sidebar-hover-bg: rgba(255, 255, 255, 0.05);
          --sidebar-border: #1e293b;
          --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sidebar-wrapper {
          width: 280px;
          height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
        }

        @media (max-width: 992px) {
          .sidebar-wrapper {
            width: 85px;
          }
          .sidebar-brand .brand-name,
          .menu-label,
          .nav-label,
          .upgrade-card {
            display: none;
          }
          .nav-link {
            justify-content: center;
            padding: 1rem !important;
            margin: 0.5rem !important;
          }
          .nav-icon {
            margin: 0 !important;
          }
        }

        .sidebar-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.5rem 0.75rem;
          margin-bottom: 2.5rem;
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          background: #4f46e5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
        }

        .menu-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          padding-left: 1rem;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .nav-item {
          margin-bottom: 0.4rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: var(--sidebar-text);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.2s ease;
          gap: 12px;
        }

        .nav-link:hover {
          background: var(--sidebar-hover-bg);
          color: #0f172a;
        }

        .nav-link.active {
          background: var(--sidebar-active-bg);
          color: var(--sidebar-active-text);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
        }

        .nav-icon {
          font-size: 1.25rem;
          width: 24px;
          display: flex;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .nav-link.active .nav-icon {
          color: white;
        }

        .sidebar-wrapper {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sidebar-wrapper::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="sidebar-wrapper">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <i className="fas fa-rocket"></i>
            </div>
            <span className="brand-name">Portal</span>
          </div>

          <p className="menu-label">Main Menu</p>

          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="profile"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-th-large nav-icon"></i>
                <span className="nav-label">Overview</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="post-job"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-plus-circle nav-icon"></i>
                <span className="nav-label">Post Job</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="applicants"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-user-friends nav-icon"></i>
                <span className="nav-label">Applicants</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="report"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="fas fa-chart-line nav-icon"></i>
                <span className="nav-label">Reports</span>
              </NavLink>
            </li>
          </ul>


        </div>
      </div>
    </>
  );
}
