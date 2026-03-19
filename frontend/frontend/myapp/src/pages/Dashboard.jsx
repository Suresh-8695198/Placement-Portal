



// src/pages/Dashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Dashboard = () => {
  return (
    <>
      {/* Global fonts & bootstrap */}
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #ffffff;                    /* Pure white background */
          color: #1e293b;
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
          width: 260px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-right: 1px solid rgba(226, 232, 240, 0.65);
          box-shadow: 0 6px 24px rgba(0,0,0,0.08);
          z-index: 100;
          overflow: hidden;
          transition: width 0.38s ease;
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #f9fafb;                   /* Very light gray-white for subtle separation */
        }

        .topbar-wrapper {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          z-index: 90;
          padding: 0.9rem 2rem;
          flex-shrink: 0;
        }

        .content-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 1.8rem 2rem;
          -webkit-overflow-scrolling: touch;
          background: #ffffff;
        }

        .content-wrapper > * {
          background: #ffffff;
          border-radius: 1.4rem;
          padding: 1.8rem 2rem;
          box-shadow: 0 8px 28px rgba(0,0,0,0.07);
          border: 1px solid rgba(226, 232, 240, 0.6);
          min-height: 80vh;
        }

        /* Sidebar hover expand on desktop */
        @media (min-width: 993px) {
          .sidebar-wrapper {
            width: 88px;           /* collapsed by default */
          }
          .sidebar-wrapper:hover {
            width: 260px;
          }
        }

        /* Mobile & tablet adjustments */
        @media (max-width: 992px) {
          .sidebar-wrapper {
            width: 80px;
          }
          .content-wrapper {
            padding: 1.4rem 1.6rem;
          }
          .content-wrapper > * {
            padding: 1.5rem;
            border-radius: 1.2rem;
          }
        }

        @media (max-width: 576px) {
          .sidebar-wrapper {
            width: 70px;
          }
          .topbar-wrapper {
            padding: 0.8rem 1.4rem;
          }
          .content-wrapper {
            padding: 1.2rem 1.4rem;
          }
          .content-wrapper > * {
            padding: 1.3rem;
            border-radius: 1rem;
          }
        }

        /* Hide scrollbar but keep scroll functionality */
        .content-wrapper::-webkit-scrollbar,
        .sidebar-wrapper::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="main-area">
          <div className="topbar-wrapper">
            <Topbar />
          </div>

          <div className="content-wrapper">
            <Outlet />   {/* ← Profile, Internship, Companies, Status, etc. render here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;