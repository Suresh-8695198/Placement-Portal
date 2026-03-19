import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CoordinatorPageLayout from "../../components/coordinator/CoordinatorPageLayout";

const API_BASE = "http://localhost:8000";

export default function CoordinatorAnnouncements() {
  const navigate = useNavigate();
  const username = localStorage.getItem("coordinatorUsername");
  const department = localStorage.getItem("coordinatorDepartment") || "Department";

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Hide formMessage after 2 seconds
  useEffect(() => {
    if (formMessage) {
      const timer = setTimeout(() => {
        setFormMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [formMessage]);

  useEffect(() => {
    if (!username) {
      navigate("/coordinator/login");
      return;
    }
    fetchAnnouncements();
  }, [username, navigate]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_BASE}/coordinator/my-announcements/`, {
        params: { username },
      });
      setAnnouncements(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFormMessage("Please fill title and message");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setFormMessage("");

    try {
      if (editingId) {
        await axios.post(`${API_BASE}/coordinator/edit-message/`, {
          id: editingId,
          username,
          title,
          message,
        });
        setFormMessage("Announcement updated successfully!");
      } else {
        await axios.post(`${API_BASE}/coordinator/send-message/`, {
          username,
          title,
          message,
        });
        setFormMessage("Announcement published successfully!");
      }
      setIsSuccess(true);
      setTitle("");
      setMessage("");
      setEditingId(null);
      fetchAnnouncements();
    } catch (err) {
      setFormMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setMessage(item.message);
    setEditingId(item.id);

    // Scroll smoothly to the form
    const formEl = document.getElementById("announcement-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await axios.post(`${API_BASE}/coordinator/delete-message/`, { id, username });
      setFormMessage("Announcement deleted successfully!");
      setIsSuccess(true);
      fetchAnnouncements();
    } catch (err) {
      setFormMessage("Delete failed. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <CoordinatorPageLayout title="Announcements">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <style>{`
        body {
          background: linear-gradient(135deg, #6b46c1, #9f7aea);
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #2d3748;
        }

        .page-wrapper {
          padding: 2.5rem 1.5rem;
          max-width: 1200px;
          margin: auto;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
        }

        .welcome-title {
          font-size: 2.6rem;
          font-weight: 700;
          color: #7c3aed;
        }

        .dept-badge {
          background: linear-gradient(135deg, #7c3aed, #c084fc);
          padding: 0.6rem 1.8rem;
          border-radius: 50px;
          display: inline-block;
          margin-top: 1rem;
          font-weight: 600;
          color: white;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        .glass-card {
          background: rgba(255,255,255,0.94);
          border-radius: 1.5rem;
          padding: 2.2rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          backdrop-filter: blur(12px);
          margin-bottom: 2.5rem;
        }

        .form-message {
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          margin-bottom: 1.8rem;
          text-align: center;
          font-weight: 500;
        }

        .success  { background: #f3e8ff; color: #6b21a8; }
        .error    { background: #fee2e2; color: #991b1b; }

        .input-label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.6rem;
          display: block;
        }

        .form-control {
          border-radius: 0.9rem;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.2rem;
        }

        .form-control:focus {
          border-color: #c084fc;
          box-shadow: 0 0 0 0.25rem rgba(192,132,252,0.2);
        }

        .btn-main {
          background: linear-gradient(135deg, #7c3aed, #c084fc);
          border: none;
          padding: 0.85rem 2.4rem;
          border-radius: 999px;
          color: white;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-main:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(124,58,237,0.35);
        }

        .btn-main:disabled {
          opacity: 0.6;
        }

        .announcement-list-title {
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #6b21a8;
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

        .announcement-item {
          background: #ffffff;
          border-radius: 1.2rem;
          padding: 1.7rem;
          border: 1px solid #e5e7eb;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .announcement-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(124,58,237,0.15);
        }

        .announcement-title {
          font-size: 1.32rem;
          font-weight: 700;
          color: #5b21b6;
          margin-bottom: 0.9rem;
        }

        .announcement-text {
          flex: 1;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: break-word;
          color: #4b5563;
          line-height: 1.58;
          margin-bottom: 1.2rem;
          max-height: 320px;
          overflow-y: auto;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.94rem;
          color: #6b7280;
          margin-top: auto;
        }

        .action-btn {
          padding: 0.5rem 1.3rem;
          font-size: 0.94rem;
          border-radius: 999px;
          border: none;
          font-weight: 500;
          transition: all 0.25s;
        }

        .action-btn.edit {
          background: #e9d5ff;
          color: #6b21a8;
        }

        .action-btn.edit:hover {
          background: #d8b4fe;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #e11d48;
        }

        .action-btn.delete:hover {
          background: #fecaca;
        }

        .no-announcements {
          text-align: center;
          color: #6b7280;
          font-size: 1.15rem;
          padding: 3rem 1rem;
          font-style: italic;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <h1 className="welcome-title">
            Welcome, {username || "Coordinator"}
          </h1>
          <div className="dept-badge">
            {department} Department
          </div>
        </div>

        {/* Creation Form */}
        <div className="glass-card">
          {formMessage && (
            <div className={`form-message ${isSuccess ? "success" : "error"}`}>
              {formMessage}
            </div>
          )}

          <form id="announcement-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="input-label">Announcement Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title..."
              />
            </div>

            <div className="mb-4">
              <label className="input-label">Message</label>
              <textarea
                className="form-control"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement message here..."
              />
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn-main" disabled={loading}>
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Publishing..."
                  : editingId
                  ? "Update Announcement"
                  : "Publish Announcement"}
              </button>
            </div>
          </form>
        </div>

        {/* Previous Announcements */}
        <div className="glass-card">
          <h4 className="announcement-list-title">
            <i className="fas fa-bullhorn me-2"></i>
            Previous Announcements
          </h4>

          {announcements.length === 0 ? (
            <div className="no-announcements">
              No announcements published yet.
            </div>
          ) : (
            <div className="announcement-grid">
              {announcements.map((item) => (
                <div key={item.id} className="announcement-item">
                  <div className="announcement-title">{item.title}</div>

                  <div className="announcement-text">{item.message}</div>

                  <div className="meta">
                    <span>{item.date || "—"}</span>
                    <div>
                      <button
                        className="action-btn edit me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CoordinatorPageLayout>
  );
}