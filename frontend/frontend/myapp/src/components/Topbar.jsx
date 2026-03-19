


// src/components/Topbar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Topbar = () => {
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    if (!email) return;

    axios
      .get(`http://localhost:8000/api/students/profile/?email=${email}`)
      .then((res) => {
        if (res.data.student && res.data.student.name) {
          setStudentName(res.data.student.name);
        } else if (res.data.student && res.data.student.username) {
          setStudentName(res.data.student.username);
        }
      })
      .catch((err) => console.log("Failed to load student name:", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <style>{`
        .topbar-area {
          background: var(--white);
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          color: var(--text-main);
        }

        .welcome {
          font-size: 1.1rem;
          font-weight: 500;
        }

        .welcome span {
          font-weight: 700;
          color: var(--primary);
        }

        .logout-btn {
          background: var(--primary);
          color: var(--white);
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: var(--transition);
        }

        .logout-btn:hover {
          background: var(--primary-hover);
          box-shadow: 0 4px 12px -2px rgba(0, 90, 156, 0.3);
          transform: translateY(-2px);
        }

        .logout-btn i {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .topbar-area {
            padding: 0.8rem 1.5rem;
          }
          .welcome {
            font-size: 1rem;
          }
          .logout-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 576px) {
          .topbar-area {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
        }
      `}</style>

      <div className="topbar-area">
        <div className="welcome">
          Welcome, <span>{studentName}</span>!
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </>
  );
};

export default Topbar;