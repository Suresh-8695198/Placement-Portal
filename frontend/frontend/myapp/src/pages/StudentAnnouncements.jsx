


import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export default function StudentAnnouncements() {
  const [messages, setMessages] = useState([]);
  const studentEmail = localStorage.getItem("studentEmail");

  useEffect(() => {
    if (!studentEmail) return;
    fetchMessages();
  }, [studentEmail]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/coordinator/student-messages/`, {
        params: { email: studentEmail },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  // Format date to Indian local time (IST)
  const formatDateIST = (dateString) => {
    if (!dateString) return "—";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      console.warn("Invalid date format:", dateString);
      return dateString || "—";
    }
  };

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
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <style>{`
        :root {
          --primary: #4B0082;
          --primary-light: #6A0DAD;
          --light-violet-bg: rgba(139, 92, 246, 0.15);
          --light-violet-text: #7c3aed;
          --light-violet-border: rgba(139, 92, 246, 0.3);
          --text: #1e293b;
          --text-light: #475569;
          --bg-card: #ffffff;
          --border-light: #e2e8f0;
          --violet-text: #5b21b6;
        }

        .announcements-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          background: #ffffff;
          min-height: 100vh;
        }

        .announce-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.8rem;
          flex-wrap: wrap;
        }

        .announce-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 2.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(75,0,130,0.28);
        }

        .section-title {
          font-size: clamp(2rem, 5vw, 2.6rem);
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: var(--text-light);
          font-size: 1.05rem;
          margin-top: 0.4rem;
        }

        .announcement-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.6rem;
        }

        @media (max-width: 992px) {
          .announcement-grid {
            grid-template-columns: 1fr;
          }
        }

        .announce-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .announce-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(75,0,130,0.14);
        }

        .announce-header-inner {
          background: var(--light-violet-bg);
          padding: 1.3rem 1.6rem;
          border-bottom: 1px solid var(--light-violet-border);
        }

        .announce-title {
          margin: 0;
          font-size: 1.32rem;
          font-weight: 700;
          color: var(--violet-text);
        }

        .announce-body {
          padding: 1.6rem;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.62;
          flex: 1;
          overflow: hidden;
        }

        .announce-message {
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-height: 340px;
          overflow-y: auto;
        }

        .announce-footer {
          padding: 1rem 1.6rem;
          background: #f8fafc;
          border-top: 1px solid var(--border-light);
          font-size: 0.92rem;
          color: var(--text-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: auto;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .no-messages-box {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 4.5rem 2.5rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        .no-messages-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--violet-text);
          margin-bottom: 1.2rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .announcements-page { padding: 3rem 1rem 2.5rem; }
          .announce-avatar { width: 80px; height: 80px; font-size: 2.4rem; }
          .section-title { font-size: 2.2rem; }
        }

        @media (max-width: 576px) {
          .announce-header { flex-direction: column; align-items: flex-start; }
          .announce-avatar { width: 70px; height: 70px; font-size: 2.1rem; }
          .section-title { font-size: 2rem; }
          .announce-body { font-size: 0.98rem; }
          .announce-footer { flex-direction: column; align-items: flex-start; gap: 0.7rem; }
        }
      `}</style>

      <div className="announcements-page">
        <div className="announce-header">
          <div className="announce-avatar">
            <i className="bi bi-megaphone-fill"></i>
          </div>
          <div>
            <h1 className="section-title">Department Announcements</h1>
            <p className="subtitle">
              Important updates and notices from your department coordinator
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="no-messages-box">
            <h2 className="no-messages-title">No Announcements Yet</h2>
            <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>
              Stay tuned! Important department updates and notices will appear here when available.
            </p>
          </div>
        ) : (
          <div className="announcement-grid">
            {messages.map((msg) => (
              <div key={msg.id} className="announce-card">
                <div className="announce-header-inner">
                  <h4 className="announce-title">{msg.title || "Announcement"}</h4>
                </div>

                <div className="announce-body">
                  <div className="announce-message">
                    {msg.message || "—"}
                  </div>
                </div>

                <div className="announce-footer">
                  <div className="meta-item">
                    <i className="bi bi-person-circle"></i>
                    <span>Sent by: {msg.sent_by || "Coordinator"}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-calendar-event"></i>
                    <span>{formatDateIST(msg.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}