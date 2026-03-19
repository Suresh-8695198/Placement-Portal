


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
          background: rgba(30, 20, 50, 0.92);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-bottom: 1px solid rgba(75,0,130,0.3);
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.4),
            inset 0 0 20px rgba(75,0,130,0.18);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          color: #e2e8f0;
          overflow: hidden;
        }

        /* Subtle moving violet overlay - same as sidebar vibe */
        .topbar-area::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(106,13,173,0.22) 20%,
            transparent 40%,
            rgba(75,0,130,0.18) 60%,
            transparent 100%
          );
          opacity: 0.6;
          pointer-events: none;
          animation: crystalMove 18s linear infinite;
        }

        @keyframes crystalMove {
          0%   { transform: translateX(-30%) translateY(-30%); }
          100% { transform: translateX(30%)  translateY(30%);  }
        }

        .welcome {
          font-size: 1.45rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 2;
        }

        .welcome span {
          font-weight: 800;
          background: linear-gradient(90deg, #4B0082, #6A0DAD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 8px rgba(75,0,130,0.35);
        }

        .logout-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #4B0082, #6A0DAD);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.7rem 1.6rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 20px rgba(75,0,130,0.4);
          z-index: 2;
        }

        .logout-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 32px rgba(75,0,130,0.55);
        }

        /* Continuous shine effect */
        .logout-btn::before {
          content: '';
          position: absolute;
          inset: -50%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.45),
            transparent
          );
          animation: shine 2.8s infinite;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .logout-btn:hover::before {
          opacity: 1;
        }

        @keyframes shine {
          0%   { transform: translateX(-120%) rotate(30deg); }
          60%, 100% { transform: translateX(120%) rotate(30deg); }
        }

        .logout-btn i {
          font-size: 1.2rem;
          transition: transform 0.35s ease;
        }

        .logout-btn:hover i {
          transform: rotate(180deg) scale(1.2);
        }

        @media (max-width: 768px) {
          .topbar-area {
            padding: 0.9rem 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .welcome {
            font-size: 1.2rem;
          }

          .logout-btn {
            padding: 0.65rem 1.3rem;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 576px) {
          .topbar-area {
            flex-direction: column;
            align-items: flex-start;
          }

          .welcome {
            margin-bottom: 0.5rem;
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