
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
          --bg-main: #f8fafc;
          --card-bg: #ffffff;
          --primary-brand: #4f46e5;
          --text-main: #0f172a;
          --text-muted: #64748b;
        }

        * { margin:0; padding:0; box-sizing:border-box; }

        body {
          background-color: var(--bg-main);
          color: var(--text-main);
          font-family: 'Inter', -apple-system, sans-serif;
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
          background: var(--bg-main);
        }

        .topbar-wrapper {
          flex-shrink: 0;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .content-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 2.5rem;
          scroll-behavior: smooth;
        }

        /* Standardized Content Card */
        .content-wrapper > * {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Custom Scrollbar */
        .content-wrapper::-webkit-scrollbar {
          width: 8px;
        }
        .content-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }
        .content-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .content-wrapper::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 992px) {
          .content-wrapper { padding: 1.5rem; }
          .content-wrapper > * { padding: 1.8rem; border-radius: 16px; }
        }

        @media (max-width: 576px) {
          .content-wrapper { padding: 1rem; }
          .content-wrapper > * { padding: 1.2rem; border-radius: 12px; }
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