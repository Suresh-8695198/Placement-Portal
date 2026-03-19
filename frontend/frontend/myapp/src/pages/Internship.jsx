
import React, { useEffect, useState } from "react";

const Internship = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const email = localStorage.getItem("studentEmail");

  const [form, setForm] = useState({
    domain: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    id: null,
    domain: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // ================= LOAD =================
  const loadInternships = async () => {
    if (!email) {
      setError("No email found. Please login again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8000/api/students/internship/list/?email=${email}`
      );

      if (!res.ok) throw new Error("Failed to load internships");

      const data = await res.json();
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Internships load error:", err);
      setError("Could not load internships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  // ================= ADD =================
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAdd = async () => {
    if (!form.domain.trim() || !form.company.trim() || !form.start_date) {
      setError("Domain, Company and Start Date are required");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      email,
      domain: form.domain.trim(),
      company: form.company.trim(),
      start_date: form.start_date,
      end_date: form.end_date || null,
      description: form.description.trim(),
    };

    try {
      const res = await fetch("http://localhost:8000/api/students/internship/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add internship");

      setForm({
        domain: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
      });

      loadInternships();
    } catch (err) {
      setError("Failed to add internship");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const openEdit = (intern) => {
    setEditForm({
      id: intern.id,
      domain: intern.domain || "",
      company: intern.company || "",
      start_date: intern.start_date || "",
      end_date: intern.end_date || "",
      description: intern.description || "",
    });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    if (!editForm.domain.trim() || !editForm.company.trim() || !editForm.start_date) {
      setError("Domain, Company and Start Date are required");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      domain: editForm.domain.trim(),
      company: editForm.company.trim(),
      start_date: editForm.start_date,
      end_date: editForm.end_date || null,
      description: editForm.description.trim(),
    };

    try {
      const res = await fetch(
        `http://localhost:8000/api/students/internship/edit/${editForm.id}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update internship");

      setShowModal(false);
      loadInternships();
    } catch (err) {
      setError("Failed to update internship");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteInternship = async (id) => {
    if (!window.confirm("Delete this internship?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8000/api/students/internship/delete/${id}/`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete internship");

      loadInternships();
    } catch (err) {
      setError("Could not delete internship");
    } finally {
      setLoading(false);
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

        .internships-page-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
          background: #ffffff;
          color: var(--text);
          min-height: 100vh;
          box-sizing: border-box;
        }

        .internships-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .internships-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 3.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(75,0,130,0.25);
          flex-shrink: 0;
        }

        .section-title {
          font-size: clamp(1.6rem, 4.5vw, 2.1rem);
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .internships-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          padding: 1.8rem 2rem;
          position: relative;
          box-sizing: border-box;
        }

        .form-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
          margin-bottom: 1.4rem;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        input, textarea {
          width: 100%;
          padding: 0.85rem 1.4rem;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        input:focus, textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(75,0,130,0.15);
          outline: none;
        }

        textarea {
          min-height: 140px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1.4rem;
        }

        .action-btn {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          text-align: center;
          border: none;
        }

        .action-btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          box-shadow: 0 4px 12px rgba(75,0,130,0.25);
        }

        .action-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(75,0,130,0.4);
        }

        .action-btn-primary::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          transform: skewX(-25deg);
          animation: shine 3.2s linear infinite;
        }

        @keyframes shine {
          0%   { left: -100%; }
          100% { left: 150%; }
        }

        .action-btn-outline {
          background: white;
          color: var(--primary);
          border: 1px solid var(--primary);
        }

        .action-btn-outline:hover {
          background: var(--light-violet-bg);
        }

        .action-btn-danger {
          background: var(--light-violet-bg);
          color: var(--light-violet-text);
          border: 1px solid var(--light-violet-border);
        }

        .action-btn-danger:hover {
          background: rgba(139, 92, 246, 0.25);
          transform: translateY(-1px);
        }

        .internship-item {
          padding: 1.4rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1.4rem;
        }

        .internship-content {
          margin-bottom: 1.2rem;
        }

        .internship-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--violet-text);
          margin-bottom: 0.4rem;
        }

        .internship-company {
          font-size: 1.05rem;
          color: var(--text-light);
          margin-bottom: 0.3rem;
        }

        .internship-dates {
          font-size: 0.95rem;
          color: #64748b;
          font-style: italic;
          margin-bottom: 0.8rem;
        }

        .internship-description {
          line-height: 1.6;
          color: var(--text);
          white-space: pre-wrap;
        }

        .internship-actions {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1.2rem;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          z-index: 10;
          color: var(--primary);
          font-weight: 600;
        }

        .error-message {
          color: #dc2626;
          background: rgba(220,38,38,0.08);
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .no-internships {
          color: #64748b;
          font-style: italic;
          text-align: center;
          padding: 2.5rem 1rem;
          font-size: 1.1rem;
        }

        /* ────────────────────────────────────────
           Compact Edit Modal (same as Projects)
        ──────────────────────────────────────── */
        .modal-content {
          border-radius: 16px;
          border: none;
          box-shadow: 0 12px 40px rgba(75, 0, 130, 0.22);
        }

        .modal-header {
          background: linear-gradient(135deg, rgba(75,0,130,0.06), rgba(106,13,173,0.06));
          border-bottom: 1px solid #e2e8f0;
          padding: 1.2rem 1.5rem;
        }

        .modal-title {
          font-size: 1.32rem;
          font-weight: 700;
          color: var(--violet-text);
        }

        .modal-body {
          padding: 1.3rem 1.5rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #fafbfc;
        }

        .modal-form-label {
          font-weight: 600;
          color: var(--violet-text);
          margin-bottom: 0.45rem;
          font-size: 0.96rem;
        }

        input.form-control,
        textarea.form-control {
          border-radius: 10px;
          padding: 0.7rem 1.2rem;
          font-size: 0.98rem;
        }

        textarea {
          min-height: 110px;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .internships-page-content {
            padding: 2.5rem 0.5rem 1.5rem;
          }
          .internships-card {
            padding: 1.2rem 0.7rem;
          }
        }

        @media (max-width: 768px) {
          .internships-page-content {
            padding: 2rem 0.2rem 1rem;
            min-height: unset;
          }
          .internships-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .internships-avatar {
            width: 70px;
            height: 70px;
            font-size: 2.1rem;
          }
          .form-group {
            grid-template-columns: 1fr;
            gap: 0.7rem;
          }
          .internship-actions {
            flex-direction: column;
            gap: 0.8rem;
          }
          .modal-dialog {
            margin: 0.5rem;
          }
          .internship-item {
            padding: 0.8rem 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .internships-page-content {
            padding: 1rem 0.1rem 0.5rem;
          }
          .internships-header {
            gap: 0.5rem;
          }
          .internships-avatar {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }
          .section-title {
            font-size: 1.1rem;
          }
          .internships-card {
            padding: 0.7rem 0.2rem;
          }
          .action-btn {
            padding: 0.5rem 0.7rem;
            font-size: 0.85rem;
            min-width: 90px;
          }
          .form-actions {
            gap: 0.5rem;
          }
        }

        .internship-description {
          line-height: 1.6;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 8.5rem;
        }

        .internship-description::after {
          content: "...";
          color: var(--primary-light);
          font-weight: 500;
        }

        .internship-item:hover .internship-description {
          -webkit-line-clamp: unset;
          max-height: none;
        }
      `}</style>

      <div className="internships-page-content">
        {/* Header */}
        <div className="internships-header">
          <div className="internships-avatar">
            <i className="bi bi-briefcase-fill"></i>
          </div>
          <div>
            <h1 className="section-title">My Internships</h1>
            <p style={{ color: "var(--text-light)", marginTop: "0.5rem", fontSize: "1.05rem" }}>
              Showcase your professional experiences and achievements
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="internships-card" style={{ position: "relative" }}>
          {loading && (
            <div className="loading-overlay">
              {showModal ? "Updating..." : "Saving..."}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {/* Add Form */}
          <div className="form-group">
            <input
              name="domain"
              placeholder="Domain / Role (e.g. Full-Stack Development)"
              value={form.domain}
              onChange={handleAddChange}
            />
            <input
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleAddChange}
            />
          </div>

          <div className="form-group">
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleAddChange}
            />
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleAddChange}
            />
          </div>

          <div className="form-group full">
            <textarea
              name="description"
              placeholder="Describe your responsibilities, projects, and achievements..."
              value={form.description}
              onChange={handleAddChange}
            />
          </div>

          <div className="form-actions">
            <button
              className="action-btn action-btn-primary"
              onClick={submitAdd}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Internship
            </button>
          </div>

          <hr style={{ margin: "2.5rem 0", borderColor: "#e2e8f0" }} />

          {/* List of internships */}
          {internships.length === 0 ? (
            <div className="no-internships">
              No internships added yet. Start building your professional journey!
            </div>
          ) : (
            internships.map((intern) => (
              <div key={intern.id} className="internship-item">
                <div className="internship-content">
                  <div className="internship-title">{intern.domain}</div>
                  <div className="internship-company">at {intern.company}</div>
                  <div className="internship-dates">
                    {intern.start_date} — {intern.end_date || "Present"}
                  </div>
                  {intern.description && (
                    <div className="internship-description">
                      {intern.description}
                    </div>
                  )}
                </div>

                <div className="internship-actions">
                  <button
                    className="action-btn action-btn-outline"
                    onClick={() => openEdit(intern)}
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </button>
                  <button
                    className="action-btn action-btn-danger"
                    onClick={() => deleteInternship(intern.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal - Now same style as Projects */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.55)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i> Edit Internship
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="modal-form-label">Domain / Role *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="domain"
                    value={editForm.domain}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="modal-form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company"
                    value={editForm.company}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="modal-form-label">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      value={editForm.start_date}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="modal-form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="end_date"
                      value={editForm.end_date}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="modal-form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="5"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="action-btn action-btn-outline px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="action-btn action-btn-primary px-5"
                  onClick={submitEdit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Internship;