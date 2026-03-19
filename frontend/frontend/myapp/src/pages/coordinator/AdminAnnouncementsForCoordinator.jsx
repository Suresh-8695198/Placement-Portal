// src/pages/coordinator/AdminAnnouncementsForCoordinator.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function AdminAnnouncementsForCoordinator() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/coordinator/announcements/`);
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <style>{`
        :root {
          --primary: #6b46c1;
          --primary-light: #9f7aea;
          --violet-bg: rgba(139,92,246,0.15);
          --violet-border: rgba(139,92,246,0.35);
          --text: #1e293b;
          --text-light: #475569;
          --card-bg: #ffffff;
          --border: #e2e8f0;
        }

        .ann-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          min-height: 100vh;
          background: #ffffff;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.7rem;
          color: white;
          box-shadow: 0 10px 28px rgba(107,70,193,0.28);
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          margin-top: 6px;
          color: var(--text-light);
          font-size: 1.05rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }

        .card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(107,70,193,0.18);
        }

        .card-header {
          background: var(--violet-bg);
          padding: 1.3rem 1.6rem;
          border-bottom: 1px solid var(--violet-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
        }

        .badge-important {
          background: #fef3c7;
          color: #92400e;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .card-body {
          padding: 1.6rem;
          color: var(--text);
          line-height: 1.6;
          flex: 1;
        }

        .message {
          white-space: pre-wrap;
        }

        .card-footer {
          padding: 1rem 1.6rem;
          background: #f8fafc;
          border-top: 1px solid var(--border);
          font-size: 0.9rem;
          color: var(--text-light);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .no-box {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        .no-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .ann-page {
            padding: 3rem 1rem;
          }

          .title {
            font-size: 2.1rem;
          }

          .avatar {
            width: 70px;
            height: 70px;
            font-size: 2.1rem;
          }
        }
      `}</style>

      <div className="ann-page">
        <div className="header">
          <div className="avatar">
            <i className="bi bi-megaphone-fill"></i>
          </div>

          <div>
            <h1 className="title">Admin Announcements</h1>
            <div className="subtitle">
              Important updates posted by the placement administrator
            </div>
          </div>
        </div>

        {announcements.length === 0 ? (
          <div className="no-box">
            <div className="no-title">No Announcements Yet</div>
            <p style={{ color: "var(--text-light)" }}>
              Admin announcements will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid">
            {announcements.map((ann) => (
              <div key={ann.id} className="card">
                <div className="card-header">
                  <h4 className="card-title">{ann.title}</h4>

                  {ann.important && (
                    <span className="badge-important">IMPORTANT</span>
                  )}
                </div>

                <div className="card-body">
                  <div className="message">{ann.message}</div>
                </div>

                <div className="card-footer">
                  <div className="meta">
                    <i className="bi bi-person-fill"></i>
                    {ann.created_by || "Admin"}
                  </div>

                  <div className="meta">
                    <i className="bi bi-calendar-event"></i>
                    {formatDate(ann.created_at)}
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