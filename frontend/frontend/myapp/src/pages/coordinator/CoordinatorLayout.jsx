// src/pages/coordinator/CoordinatorLayout.jsx
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
          background: #f8fafc;
        }

        .coordinator-sidebar-space {
          flex-shrink: 0;
          width: 250px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .coordinator-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100vh;
          overflow: hidden;
        }

        .coordinator-content {
          flex: 1;
          overflow-y: auto;
          background: #f8fafc;
        }

        /* Mobile adjustments */
        @media (max-width: 992px) {
          .coordinator-sidebar-space {
            width: 80px;
          }
        }

        @media (max-width: 576px) {
          .coordinator-sidebar-space {
            width: 0;
          }
        }
      `}</style>

      <div className="coordinator-layout">
        <div className="coordinator-sidebar-space">
          <CoordinatorSidebar />
        </div>

        <div className="coordinator-main">
          <CoordinatorTopBar />

          <div className="coordinator-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
