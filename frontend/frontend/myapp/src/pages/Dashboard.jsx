



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
        .dashboard-layout {
          height: 100vh;
          width: 100vw;
          display: flex;
          overflow: hidden;
          background-color: var(--bg-sidebar);
        }

        .sidebar-wrapper {
          flex-shrink: 0;
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: var(--bg-main);
          border-top-left-radius: 24px;
          border-bottom-left-radius: 24px;
          box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
          margin: 8px 8px 8px 0;
        }

        .topbar-wrapper {
          z-index: 90;
          flex-shrink: 0;
        }

        .content-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 2rem;
          -webkit-overflow-scrolling: touch;
        }

        .content-wrapper > * {
          background: none;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
          border: none;
          min-height: auto;
        }

        @media (max-width: 992px) {
          .content-wrapper {
            padding: 1.4rem 1.6rem;
          }
        }

        @media (max-width: 576px) {
          .topbar-wrapper {
            padding: 0.8rem 1.4rem;
          }

          .content-wrapper {
            padding: 1.2rem 1.4rem;
          }
        }

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