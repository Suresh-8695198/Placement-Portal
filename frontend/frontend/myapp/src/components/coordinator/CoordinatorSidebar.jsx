// src/components/coordinator/CoordinatorSidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function CoordinatorSidebar() {
  const location = useLocation();

  // Optional: if you have sub-routes under any item, you can use similar logic
  const isActiveSection = (basePath) => location.pathname.startsWith(basePath);

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <style>{`
        .coordinator-sidebar-wrapper {
          width: 260px;
          height: 100vh;
          background: #ffffff;
          border-radius: 0 !important;
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.08),
            0 4px 20px rgba(0,0,0,0.06);
          border-right: 1px solid rgba(229,231,235,0.9);
          transition: width 0.38s ease;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        @media (max-width: 992px) {
          .coordinator-sidebar-wrapper {
            width: 80px;
          }
          .coordinator-sidebar-title,
          .section-label {
            display: none !important;
          }
          .section-link {
            justify-content: center !important;
            padding: 1.2rem 0 !important;
          }
        }

        .coordinator-sidebar-inner {
          height: 100%;
          padding: 2.2rem 1.4rem;
          display: flex;
          flex-direction: column;
        }

        .coordinator-sidebar-title {
          font-size: 2.05rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 2.6rem;
          text-align: center;
          background: linear-gradient(90deg, #7c3aed, #c084fc, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 6px rgba(124,58,237,0.25);
        }

        .section-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.3rem;
          color: #374151;               /* gray-700 */
          font-size: 1.04rem;
          font-weight: 500;
          text-decoration: none;
          border-radius: 1rem;
          transition: all 0.32s ease;
          margin-bottom: 0.5rem;
        }

        .section-link:hover {
          background: rgba(124,58,237,0.08);   /* light violet tint */
          color: #7c3aed;                      /* violet-600 */
          transform: translateX(6px);
        }

        .section-link.active {
          background: linear-gradient(135deg, #7c3aed, #c084fc, #a78bfa);
          color: white;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(124,58,237,0.28);
          transform: scale(1.03);
        }

        .section-link .nav-icon {
          font-size: 1.4rem;
          min-width: 36px;
          text-align: center;
          color: #9ca3af;               /* gray-400 */
          transition: all 0.32s ease;
        }

        .section-link:hover .nav-icon,
        .section-link.active .nav-icon {
          color: white;
          transform: scale(1.15);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 1.8rem;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.3rem;
          color: white;
          font-size: 1.04rem;
          font-weight: 600;
          background: linear-gradient(135deg, #ef4444, #f87171);
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 5px 18px rgba(239,68,68,0.25);
          position: relative;
          overflow: hidden;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(239,68,68,0.4);
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 200%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s;
        }

        .logout-btn:hover::before {
          left: 100%;
        }

        .coordinator-sidebar-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .coordinator-sidebar-wrapper::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="coordinator-sidebar-wrapper">
        <div className="coordinator-sidebar-inner">
          <h3 className="coordinator-sidebar-title">Coordinator</h3>

          <NavLink
            to="/coordinator/dashboard"
            className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
          >
            <i className="fas fa-tachometer-alt nav-icon"></i>
            <span className="section-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/coordinator/students"
            className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
          >
            <i className="fas fa-users nav-icon"></i>
            <span className="section-label">Students</span>
          </NavLink>

          <NavLink
            to="/coordinator/upload"
            className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
          >
            <i className="fas fa-file-upload nav-icon"></i>
            <span className="section-label">Upload Excel</span>
          </NavLink>

          <NavLink
            to="/coordinator/jobs"
            className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
          >
            <i className="fas fa-briefcase nav-icon"></i>
            <span className="section-label">Jobs</span>
          </NavLink>

          <NavLink
            to="/coordinator/selected-students-report"
            className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
          >
            <i className="fas fa-chart-bar nav-icon"></i>
            <span className="section-label">Reports</span>
          </NavLink>
          <NavLink
  to="/coordinator/announcements"
  className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
>
  <i className="fas fa-bullhorn nav-icon"></i>
  <span className="section-label">Announcements</span>
</NavLink>

<NavLink
  to="/coordinator/admin-announcements"
  className={({ isActive }) => `section-link ${isActive ? "active" : ""}`}
>
  <i className="fas fa-bullhorn nav-icon"></i>
  <span className="section-label">Admin Announcements</span>
</NavLink>

          <div className="sidebar-footer">
            <button
              className="logout-btn"
              onClick={() => {
                // Adjust logout logic as needed for coordinator
                localStorage.clear();
                window.location.href = "/coordinator/login"; // or wherever your coordinator login is
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}