
// src/components/coordinator/CoordinatorTopBar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoordinatorTopBar({
  username = "Coordinator",
  department = "",
  onToggleSidebar
}) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("Coordinator");

  useEffect(() => {
    // Get from localStorage OR fallback to prop
    const storedName =
      localStorage.getItem("coordinatorName") ||
      localStorage.getItem("coordinatorUsername") ||
      username;

    if (storedName && storedName.trim() !== "") {
      const cleanedName = storedName
        .replace(/\b\b/gi, "")   // remove TEST word
        .replace(/\s+/g, " ")       // remove extra spaces
        .trim();

      // 🔥 Overwrite old value permanently
      localStorage.setItem("coordinatorUsername", cleanedName);

      setDisplayName(cleanedName || "Coordinator");
    } else {
      setDisplayName("Coordinator");
    }
  }, [username]); // runs if username prop changes

  const handleLogout = () => {
    localStorage.clear();
    navigate("/coordinator/login", { replace: true });
  };

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
        .coordinator-topbar {
          background: #ffffff;
          border-bottom: 1px solid rgba(229,231,235,0.9);
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          padding: 0 24px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          left: 260px;
          right: 0;
          z-index: 1100;
          color: #111827;
          transition: left 0.3s ease;
        }

        @media (max-width: 992px) {
          .coordinator-topbar {
            left: 0;
          }
        }

        .coordinator-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .coordinator-welcome {
          font-size: 1.2rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .coordinator-welcome i {
          font-size: 1.4rem;
          color: #7c3aed;
        }

        .name {
          font-weight: 700;
          color: #7c3aed;
        }

        .department-badge {
          font-size: 0.8rem;
          font-weight: 600;
          background: #ede9fe;
          color: #6b21a8;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .coordinator-logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          background: #ef4444;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .coordinator-logout-btn:hover {
          background: #dc2626;
        }

        .menu-toggle-btn {
          font-size: 1.4rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        @media (min-width: 993px) {
          .menu-toggle-btn {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .coordinator-topbar {
            height: 55px;
            padding: 0 14px;
          }

          .coordinator-welcome {
            font-size: 0.95rem;
          }

          .department-badge {
            display: none;
          }

          .coordinator-logout-btn {
            padding: 6px 10px;
            font-size: 0;
            width: 36px;
            height: 36px;
            justify-content: center;
          }

          .coordinator-logout-btn span {
            display: none;
          }

          .coordinator-logout-btn i {
            font-size: 1rem;
          }
        }
      `}</style>

      <header className="coordinator-topbar">
        <div className="coordinator-left">
          <button className="menu-toggle-btn" onClick={onToggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>

          <div className="coordinator-welcome">
            <i className="fas fa-user-graduate"></i>
            Welcome, <span className="name">{displayName}</span>
            {department && (
              <span className="department-badge">{department}</span>
            )}
          </div>
        </div>

        <button className="coordinator-logout-btn" onClick={handleLogout}>
          <span>Logout</span>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </header>
    </>
  );
}