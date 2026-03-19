
// pages/company/CompanyDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import CompanySideBar from "../../components/company/CompanySideBar";
import CompanyTopBar from "../../components/company/CompanyTopBar";

export default function CompanyDashboard() {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <style>{`
        :root {
          --primary-start: #6366f1;
          --primary-end: #8b5cf6;
          --primary-glow: rgba(99, 102, 241, 0.4);
        }

        * { margin:0; padding:0; box-sizing:border-box; }

        html, body {
          height: 100%;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: linear-gradient(135deg, #0f172a, #1e3a8a, var(--primary-start));
          color: #e2e8f0;
          overflow: hidden;
        }

        .dashboard-layout {
          height: 100vh;
          width: 100vw;
          display: flex;
          overflow: hidden;
        }

        .sidebar-wrapper {
          flex-shrink: 0;
          z-index: 100;
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(8px);
        }

        .topbar-wrapper {
          flex-shrink: 0;
        }

        .content-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          -webkit-overflow-scrolling: touch;
        }

        .content-wrapper > * {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 1.4rem;
          padding: 2rem;
          box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.25);
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .content-wrapper { padding: 1.5rem; }
          .content-wrapper > * { padding: 1.6rem; border-radius: 1.2rem; }
        }

        @media (max-width: 576px) {
          .content-wrapper { padding: 1.2rem; }
          .content-wrapper > * { padding: 1.4rem; border-radius: 1rem; }
        }
      `}</style>

      <div className="dashboard-layout">
        <div className="sidebar-wrapper">
          <CompanySideBar />
        </div>

        <div className="main-area">
          <div className="topbar-wrapper">
            <CompanyTopBar />
          </div>

          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}