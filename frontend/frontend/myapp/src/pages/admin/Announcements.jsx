


// src/pages/admin/Announcements.jsx
import { useRef, useState, useEffect } from "react";
import axios from "axios";

export default function Announcements() {
  const formRef = useRef(null);
  const titleInputRef = useRef(null);
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/admin-panel/announcements/");
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/admin-panel/announcements/${editId}/`, {
          title,
          message,
          important,
        });
        setEditId(null);
      } else {
        await axios.post("http://127.0.0.1:8000/admin-panel/announcements/create/", {
          title,
          message,
          important,
        });
      }

      setTitle("");
      setMessage("");
      setImportant(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to save announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ann) => {
    setTitle(ann.title);
    setMessage(ann.message);
    setImportant(ann.important);
    setEditId(ann.id);

    // Works for both window scrolling and nested scroll containers.
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Focus title field after scroll so the user can start editing immediately.
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 250);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/admin-panel/announcements/${id}/delete/`);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to delete announcement");
    }
  };

  return (
    <>
      <style>{`
        .admin-announcements-wrapper {
          min-height: 100vh;
          padding: 2rem 2rem 4rem;
          background: #f9fafb;
          color: #111827;
        }

        .page-header {
          margin-bottom: 2.5rem;
        }

        .page-title {
          font-size: 2.4rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, #ec4899, #f97316, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.025em;
          text-shadow: 0 2px 8px rgba(236, 72, 153, 0.18);
        }

        .form-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.25rem;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          border: 1px solid rgba(229,231,235,0.7);
          margin-bottom: 3.2rem;
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #ec4899, #f97316, #a78bfa);
          opacity: 0.9;
        }

        .form-title {
          font-size: 1.7rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.8rem;
        }

        .error-alert {
          padding: 1rem 1.25rem;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.22);
          color: #991b1b;
          border-radius: 1rem;
          margin-bottom: 1.8rem;
          font-size: 0.98rem;
        }

        .input-group {
          margin-bottom: 1.7rem;
        }

        .input-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.65rem;
          font-size: 0.99rem;
        }

        .text-input,
        .text-textarea {
          width: 100%;
          padding: 0.95rem 1.25rem;
          border: 1px solid #d1d5db;
          border-radius: 1rem;
          font-size: 1rem;
          background: white;
          transition: all 0.2s ease;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
        }

        .text-input:focus,
        .text-textarea:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 4px rgba(236,72,153,0.14);
        }

        .text-textarea {
          min-height: 145px;
          resize: vertical;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }

        .checkbox-group input[type="checkbox"] {
          accent-color: #ec4899;
        }

        .submit-btn {
          width: 100%;
          padding: 1.05rem 1.6rem;
          font-size: 1.08rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #ec4899, #f97316, #a78bfa);
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 5px 16px rgba(236,72,153,0.28);
          transition: all 0.32s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(236,72,153,0.38);
        }

        .submit-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          box-shadow: none;
        }

        .announcements-list-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #1e293b;
          margin: 2.8rem 0 1.6rem;
        }

        .announcements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
        }

        .announcement-card {
          background: white;
          border-radius: 1.25rem;
          padding: 2rem;
          border: 1px solid rgba(229,231,235,0.65);
          box-shadow: 0 5px 16px rgba(0,0,0,0.06);
          transition: all 0.28s ease;
          position: relative;
        }

        .announcement-card.important {
          background: linear-gradient(135deg, #fff7ed, #fdf2f8);
          border-color: #fb923c;
          box-shadow: 0 6px 20px rgba(251,146,60,0.12);
        }

        .announcement-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(236,72,153,0.14);
        }

        .ann-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.2rem;
        }

        .ann-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 0.7rem;
        }

        .btn-action {
          padding: 0.5rem 1.1rem;
          font-size: 0.92rem;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.22s;
        }

        .btn-edit {
          background: #e0f2fe;
          color: #1e40af;
        }

        .btn-edit:hover {
          background: #bae6fd;
        }

        .btn-delete {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        .ann-message {
          color: #4b5563;
          line-height: 1.65;
          margin-bottom: 1.2rem;
          white-space: pre-line;
        }

        .ann-meta {
          font-size: 0.92rem;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 6rem 1.5rem;
          color: #6b7280;
          font-size: 1.25rem;
          font-style: italic;
          background: rgba(249,250,251,0.7);
          border-radius: 1.25rem;
        }

        @media (max-width: 768px) {
          .admin-announcements-wrapper {
            padding: 1.6rem 1.1rem 4rem;
          }
          .announcements-grid {
            grid-template-columns: 1fr;
          }
          .page-title {
            font-size: 2.1rem;
          }
        }
      `}</style>

      <div className="admin-announcements-wrapper">
        <div className="page-header">
          <h1 className="page-title">Announcements</h1>
        </div>

        {/* Form Card */}
        <div className="form-card" ref={formRef}>
          <h2 className="form-title">{editId ? "Edit Announcement" : "Create New Announcement"}</h2>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-input"
                placeholder="Announcement title"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-textarea"
                placeholder="Write the announcement content here..."
                required
              />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="important"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
              />
              <label htmlFor="important" className="ml-3 text-gray-700 font-medium text-[0.99rem]">
                Mark as Important (highlight)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading
                ? "Saving..."
                : editId
                ? "Update Announcement"
                : "Post Announcement"}
            </button>
          </form>
        </div>

        {/* List Section */}
        <h2 className="announcements-list-title">Previous Announcements</h2>

        {announcements.length === 0 ? (
          <div className="empty-state">
            No announcements have been posted yet.
          </div>
        ) : (
          <div className="announcements-grid">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`announcement-card ${ann.important ? "important" : ""}`}
              >
                <div className="ann-card-header">
                  <h3 className="ann-title">{ann.title}</h3>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(ann)}
                      className="btn-action btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="btn-action btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="ann-message">{ann.message}</p>

                <div className="ann-meta">
                  Posted on {ann.created_at} by {ann.created_by}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}