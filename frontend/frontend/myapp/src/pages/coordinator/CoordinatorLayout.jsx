


import React from "react";
import { Outlet } from "react-router-dom";
import CoordinatorSidebar from "../../components/coordinator/CoordinatorSidebar";
import CoordinatorTopBar from "../../components/coordinator/CoordinatorTopBar";

export default function CoordinatorLayout() {
  return (
    <>
      <style>{`
        .coordinator-layout {
          height: 100vh;
          width: 100vw;
          display: flex;
          overflow: hidden;
          background: #ffffff;
        }

        .coordinator-sidebar {
          flex-shrink: 0;
          width: 260px;
          background: #f8fafc;
          border-right: 1px solid #e5e7eb;
        }

        .coordinator-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .coordinator-topbar-wrapper {
          flex-shrink: 0;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .coordinator-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f1f5f9;
        }

        /* Mobile adjustments */
        @media (max-width: 992px) {
          .coordinator-sidebar {
            width: 80px;
          }
        }

        @media (max-width: 576px) {
          .coordinator-sidebar {
            width: 70px;
          }

          .coordinator-content {
            padding: 16px;
          }
        }
      `}</style>

      <div className="coordinator-layout">
        {/* Sidebar */}
        <div className="coordinator-sidebar">
          <CoordinatorSidebar />
        </div>

        {/* Main Section */}
        <div className="coordinator-main">
          <div className="coordinator-topbar-wrapper">
            <CoordinatorTopBar username="Test User" department="" />
          </div>

          <div className="coordinator-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
