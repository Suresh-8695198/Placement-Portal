



import React, { useEffect, useState } from "react";

const Projects = () => {
  const BASE_URL = "http://localhost:8000/api/students";
  const email = localStorage.getItem("studentEmail");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    github_link: "",
    live_link: "",
  });

  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    description: "",
    technologies: "",
    github_link: "",
    live_link: "",
  });

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // ================= LOAD =================
  const loadProjects = async () => {
    if (!email) {
      setError("No email found. Please login again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/get-projects/?email=${email}`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err) {
      console.error("Projects load error:", err);
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // ================= ADD =================
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAdd = async () => {
    if (!form.title.trim()) {
      setError("Project title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/add-project/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email }),
      });

      if (!res.ok) throw new Error("Failed to add project");

      setForm({
        title: "",
        description: "",
        technologies: "",
        github_link: "",
        live_link: "",
      });

      loadProjects();
    } catch (err) {
      setError("Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const openEdit = (p) => {
    setEditForm({ ...p });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    if (!editForm.title.trim()) {
      setError("Project title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/edit-project/${editForm.id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update project");

      setShowModal(false);
      loadProjects();
    } catch (err) {
      setError("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/delete-project/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");

      loadProjects();
    } catch (err) {
      setError("Could not delete project");
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

        .projects-page-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          background: #ffffff;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .projects-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .projects-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 3.8rem;
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

        .subtitle {
          color: var(--text-light);
          font-size: 1.05rem;
          margin-top: 0.4rem;
        }

        .projects-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          padding: 1.8rem 2rem;
          position: relative;
        }

        .add-project-form {
          display: grid;
          gap: 1.3rem;
          margin-bottom: 2rem;
        }

        .add-project-form input,
        .add-project-form textarea {
          width: 100%;
          padding: 0.8rem 1.3rem;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 0.97rem;
        }

        .add-project-form input:focus,
        .add-project-form textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(75,0,130,0.15);
          outline: none;
        }

        .add-project-form textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .action-btn {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          padding: 0.7rem 1.4rem;
          font-size: 0.96rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
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
        }

        .project-item {
          padding: 1.4rem 1.6rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .project-title {
          font-size: 1.22rem;
          font-weight: 700;
          color: var(--violet-text);
          margin: 0;
        }

        .project-tech {
          font-size: 0.95rem;
          color: #64748b;
        }

        .project-links {
          display: flex;
          gap: 1.4rem;
          flex-wrap: wrap;
          font-size: 0.96rem;
        }

        .project-links a {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
        }

        .project-links a:hover {
          text-decoration: underline;
        }

        .project-description {
          font-size: 0.96rem;
          line-height: 1.6;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 0.4rem;
        }

        .read-more-btn:hover {
          text-decoration: underline;
        }

        .project-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 0.6rem;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.75);
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
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        .no-projects {
          color: #64748b;
          font-style: italic;
          text-align: center;
          padding: 3rem 1rem;
          font-size: 1.08rem;
        }

        /* ─── Modal ─── */
        .modal-content {
          border-radius: 16px;
          border: none;
          box-shadow: 0 12px 40px rgba(75,0,130,0.22);
        }

        .modal-header {
          background: var(--light-violet-bg);
          border-bottom: 1px solid #e2e8f0;
          padding: 1.2rem 1.5rem;
        }

        .modal-title {
          color: var(--violet-text);
          font-weight: 700;
          font-size: 1.32rem;
        }

        .modal-body {
          padding: 1.4rem 1.6rem;
        }

        .modal-footer {
          padding: 1rem 1.6rem;
          border-top: 1px solid #e2e8f0;
          background: #fafbfc;
        }

        .modal-form-label {
          font-weight: 600;
          color: var(--violet-text);
          margin-bottom: 0.45rem;
          font-size: 0.95rem;
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .projects-page-content {
            padding: 3rem 1rem 2rem;
          }
          .projects-card {
            padding: 1.6rem 1.4rem;
          }
        }

        @media (max-width: 768px) {
          .projects-page-content {
            padding: 2.5rem 0.8rem 1.8rem;
          }
          .projects-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.2rem;
          }
          .projects-avatar {
            width: 80px;
            height: 80px;
            font-size: 2.6rem;
          }
          .section-title {
            font-size: 2.1rem;
          }
          .add-project-form {
            gap: 1.1rem;
          }
          .project-item {
            padding: 1.3rem 1.2rem;
          }
          .project-title {
            font-size: 1.18rem;
          }
          .action-btn {
            padding: 0.65rem 1.2rem;
            font-size: 0.93rem;
            min-width: 120px;
          }
        }

        @media (max-width: 576px) {
          .projects-page-content {
            padding: 2rem 0.6rem 1.5rem;
          }
          .projects-avatar {
            width: 70px;
            height: 70px;
            font-size: 2.2rem;
          }
          .section-title {
            font-size: 1.85rem;
          }
          .subtitle {
            font-size: 0.98rem;
          }
          .add-project-form {
            gap: 1rem;
          }
          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .action-btn {
            width: 100%;
            min-width: unset;
            padding: 0.7rem;
          }
          .project-item {
            padding: 1.2rem 1rem;
          }
          .project-actions {
            flex-direction: column;
            gap: 0.8rem;
          }
          .project-actions .action-btn {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          .section-title {
            font-size: 1.65rem;
          }
          .projects-avatar {
            width: 60px;
            height: 60px;
            font-size: 1.9rem;
          }
        }
      `}</style>

      <div className="projects-page-content">
        {/* Header */}
        <div className="projects-header">
          <div className="projects-avatar">
            <i className="bi bi-folder-fill"></i>
          </div>
          <div>
            <h1 className="section-title">My Projects</h1>
            <p className="subtitle">
              Showcase your work, technologies, and achievements
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="projects-card" style={{ position: "relative" }}>
          {loading && (
            <div className="loading-overlay">
              {showModal ? "Updating..." : "Saving..."}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {/* Add Project Form */}
          <div className="add-project-form">
            <input
              name="title"
              placeholder="Project Title *"
              value={form.title}
              onChange={handleAddChange}
            />
            <input
              name="technologies"
              placeholder="Technologies (comma separated)"
              value={form.technologies}
              onChange={handleAddChange}
            />
            <textarea
              name="description"
              placeholder="Describe your project in detail..."
              value={form.description}
              onChange={handleAddChange}
            />
            <input
              type="url"
              name="github_link"
              placeholder="GitHub Repository URL"
              value={form.github_link}
              onChange={handleAddChange}
            />
            <input
              type="url"
              name="live_link"
              placeholder="Live Demo URL (optional)"
              value={form.live_link}
              onChange={handleAddChange}
            />
          </div>

          <div className="form-actions">
            <button
              className="action-btn action-btn-primary"
              onClick={submitAdd}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Project
            </button>
          </div>

          <hr style={{ margin: "2.2rem 0", borderColor: "#e2e8f0" }} />

          {/* Project List */}
          {projects.length === 0 ? (
            <div className="no-projects">
              No projects added yet. Start building your portfolio!
            </div>
          ) : (
            projects.map((p) => {
              const isExpanded = expandedDescriptions[p.id] || false;
              const maxLength = 500;
              const description = p.description || "";
              const isLong = description.length > maxLength;
              const displayText =
                isExpanded || !isLong
                  ? description
                  : description.substring(0, maxLength).trim() + "...";

              return (
                <div key={p.id} className="project-item">
                  <div className="project-title">{p.title}</div>

                  {p.technologies && (
                    <div className="project-tech">
                      Technologies: {p.technologies}
                    </div>
                  )}

                  <div className="project-links">
                    {p.github_link && (
                      <a
                        href={p.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                    {p.live_link && (
                      <a
                        href={p.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>

                  {description && (
                    <div className="project-description">
                      {displayText}
                      {isLong && (
                        <button
                          className="read-more-btn"
                          onClick={() =>
                            setExpandedDescriptions((prev) => ({
                              ...prev,
                              [p.id]: !prev[p.id],
                            }))
                          }
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="project-actions">
                    <button
                      className="action-btn action-btn-outline"
                      onClick={() => openEdit(p)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button
                      className="action-btn action-btn-danger"
                      onClick={() => deleteProject(p.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Modal */}
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
                  <i className="bi bi-pencil-square me-2"></i> Edit Project
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="modal-form-label">Project Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="modal-form-label">Technologies</label>
                  <input
                    type="text"
                    className="form-control"
                    name="technologies"
                    value={editForm.technologies}
                    onChange={handleEditChange}
                  />
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

                <div className="mb-3">
                  <label className="modal-form-label">GitHub Link</label>
                  <input
                    type="url"
                    className="form-control"
                    name="github_link"
                    value={editForm.github_link}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="modal-form-label">Live Demo Link</label>
                  <input
                    type="url"
                    className="form-control"
                    name="live_link"
                    value={editForm.live_link}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="action-btn action-btn-outline px-4"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="action-btn action-btn-primary px-5"
                  onClick={submitEdit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;