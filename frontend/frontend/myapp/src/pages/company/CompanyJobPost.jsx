// src/pages/CompanyJobPost.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function CompanyJobPost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary_range: "",
    job_type: "full_time",
    last_date_to_apply: "",
    skills: "",
    departments: "",
    programmes: "",
    graduation_years: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const companyEmail = localStorage.getItem("companyEmail");

  useEffect(() => {
    if (!companyEmail) {
      setError("Company email not found. Please login again.");
      setLoadingJobs(false);
      return;
    }
    fetchCompanyJobs();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const filtered = jobs.filter((job) => {
      return (
        (job.title || "").toLowerCase().includes(term) ||
        (job.location || "").toLowerCase().includes(term) ||
        (job.job_type || "").toLowerCase().includes(term) ||
        (job.description || "").toLowerCase().includes(term) ||
        (Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(term))) ||
        (Array.isArray(job.departments) && job.departments.some((d) => d.toLowerCase().includes(term))) ||
        (Array.isArray(job.programmes) && job.programmes.some((p) => p.toLowerCase().includes(term)))
      );
    });

    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchCompanyJobs = async () => {
    try {
      setLoadingJobs(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/companies/jobs/my/?email=${companyEmail}`);
      const jobList = res.data?.jobs || [];
      setJobs(jobList);
      setFilteredJobs(jobList);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs. Please check your connection.");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      salary_range: "",
      job_type: "full_time",
      last_date_to_apply: "",
      skills: "",
      departments: "",
      programmes: "",
      graduation_years: "",
    });
    setIsEditing(false);
    setEditingJobId(null);
    setShowEditModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const payload = {
        ...formData,
        email: companyEmail,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        departments: formData.departments.split(",").map((d) => d.trim()).filter(Boolean),
        programmes: formData.programmes.split(",").map((p) => p.trim()).filter(Boolean),
        graduation_years: formData.graduation_years.split(",").map((y) => y.trim()).filter(Boolean),
      };

      if (isEditing && editingJobId) {
        await axios.patch(`${API_BASE}/companies/jobs/${editingJobId}/edit/?email=${companyEmail}`, payload);
        setMessage("Job updated successfully!");
        setMessageType("success");
      } else {
        await axios.post(`${API_BASE}/companies/jobs/create/`, payload);
        setMessage("Job posted successfully!");
        setMessageType("success");
      }

      resetForm();
      fetchCompanyJobs();
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
      setMessageType("error");
      console.error(err);
    }
  };

  const handleEdit = (job) => {
    setIsEditing(true);
    setEditingJobId(job.id);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary_range: job.salary_range || "",
      job_type: job.job_type || "full_time",
      last_date_to_apply: job.last_date_to_apply || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
      departments: Array.isArray(job.departments) ? job.departments.join(", ") : "",
      programmes: Array.isArray(job.programmes) ? job.programmes.join(", ") : "",
      graduation_years: Array.isArray(job.graduation_years) ? job.graduation_years.join(", ") : "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This action cannot be undone.")) return;

    try {
      await axios.delete(`${API_BASE}/companies/jobs/${jobId}/delete/?email=${companyEmail}`);
      setMessage("Job deleted successfully!");
      setMessageType("success");
      fetchCompanyJobs();
    } catch (err) {
      setMessage("Failed to delete job");
      setMessageType("error");
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary-start: #6366f1;
          --primary-end: #8b5cf6;
          --primary-glow: rgba(99, 102, 241, 0.4);
          --glass-bg: rgba(255, 255, 255, 0.94);
          --glass-border: rgba(255,255,255,0.28);
          --text-main: #1e293b;
          --text-secondary: #475569;
        }

        .jobpost-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, rgba(15,23,42,0.3), rgba(30,58,138,0.2));
          backdrop-filter: blur(8px);
        }

        .main-content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-card {
          background: var(--glass-bg);
          border-radius: 1.4rem;
          padding: 2rem;
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.18),
            inset 0 0 24px rgba(255,255,255,0.3);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          margin-bottom: 3rem;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.25);
        }

        .section-title {
          font-size: 2.1rem;
          font-weight: 900;
          margin-bottom: 1.8rem;
          background: linear-gradient(90deg, var(--primary-start), var(--primary-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-wrapper {
          position: relative;
          max-width: 500px;
          margin: 1.5rem auto 2.5rem;
        }

        .search-input {
          width: 100%;
          padding: 0.95rem 1.4rem 0.95rem 1.4rem;
          padding-right: 3.2rem;
          border: 1px solid rgba(209,213,219,0.6);
          border-radius: 9999px;
          font-size: 1rem;
          background: rgba(255,255,255,0.85);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-start);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .clear-btn {
          position: absolute;
          right: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.6rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .clear-btn:hover {
          color: #ef4444;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem 1.8rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .form-grid, .form-row {
            grid-template-columns: 1fr 1fr;
          }
          .full-width {
            grid-column: span 2;
          }
        }

        .form-label {
          display: block;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.6rem;
          font-size: 0.98rem;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.9rem 1.2rem;
          border: 1px solid rgba(209,213,219,0.6);
          border-radius: 1rem;
          font-size: 0.98rem;
          background: rgba(255,255,255,0.8);
          transition: all 0.3s ease;
          color: var(--text-main);
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--primary-start);
          box-shadow: 0 0 0 4px var(--primary-glow);
          background: white;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 12px;
          padding-right: 2.4rem;
          cursor: pointer;
        }

        .form-textarea {
          min-height: 160px;
          resize: vertical;
        }

        .form-actions {
          margin-top: 2.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 5px 18px var(--primary-glow);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px var(--primary-glow);
        }

        .btn-secondary {
          background: rgba(107,114,128,0.12);
          color: #4b5563;
          padding: 0.8rem 2rem;
          border-radius: 1rem;
          font-weight: 600;
          border: 1px solid rgba(107,114,128,0.3);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-secondary:hover {
          background: rgba(107,114,128,0.22);
        }

        .message {
          padding: 1rem 1.3rem;
          border-radius: 1rem;
          margin-bottom: 1.6rem;
          font-weight: 500;
          border-left: 5px solid;
          animation: fadeIn 0.4s forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .message-success {
          background: rgba(16,185,129,0.1);
          color: #065f46;
          border-left-color: #10b981;
        }

        .message-error {
          background: rgba(239,68,68,0.1);
          color: #991b1b;
          border-left-color: #ef4444;
        }

        .jobs-grid {
          display: grid;
          gap: 1.8rem;
          align-items: stretch;
        }

        @media (min-width: 992px) {
          .jobs-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (min-width: 768px) and (max-width: 991px) {
          .jobs-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 767px) {
          .jobs-grid { grid-template-columns: 1fr; }
        }

        .job-card {
          background: var(--glass-bg);
          border-radius: 1.4rem;
          padding: 1.8rem;
          box-shadow: 0 10px 32px rgba(0,0,0,0.15), inset 0 0 18px rgba(255,255,255,0.25);
          backdrop-filter: blur(14px);
          border: 1px solid var(--glass-border);
          transition: all 0.35s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 420px;
          overflow: hidden;
        }

        .job-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.28);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.2rem;
        }

        .job-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.3;
          margin: 0;
          flex: 1;
        }

        .status-badge {
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #fff !important;
          min-width: 85px;
          text-align: center;
          margin-left: 1rem;
        }
        .status-active {
          background: linear-gradient(135deg, #10b981, #34d399);
          color: #fff !important;
        }
        .status-inactive {
          background: linear-gradient(135deg, #ef4444, #f87171);
          color: #fff !important;
        }

        .job-meta {
          font-size: 0.93rem;
          color: #000;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .job-meta p {
          margin: 0.45rem 0;
          color: #000;
        }

        .job-description {
          color: #000;
          line-height: 1.6;
          margin: 1rem 0 1.4rem;
          flex-grow: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
        }

        .job-actions {
          display: flex;
          gap: 1rem;
          margin-top: auto;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(0,0,0,0.08);
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1 1 120px;
          padding: 0.85rem 1.5rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.98rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.28s ease;
          border: none;
          color: white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .btn-edit { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        .btn-delete { background: linear-gradient(135deg, #ef4444, #f87171); }

        .loading-spinner {
          border: 5px solid rgba(99,102,241,0.12);
          border-top: 5px solid var(--primary-start);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
          margin: 3rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          background: var(--glass-bg);
          border-radius: 1.6rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.28),
                      inset 0 0 30px rgba(255,255,255,0.35);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          width: 100%;
          max-width: 780px;
          max-height: 92vh;
          overflow-y: auto;
          animation: modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          padding: 1.8rem 2.2rem 1.2rem;
          border-bottom: 1px solid rgba(226,232,240,0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: #64748b;
          cursor: pointer;
          line-height: 1;
        }

        .modal-close-btn:hover {
          color: #ef4444;
        }

        .modal-body {
          padding: 0 2.2rem 2rem;
        }

        .modal-footer {
          padding: 1.4rem 2.2rem;
          border-top: 1px solid rgba(226,232,240,0.5);
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          background: rgba(255,255,255,0.35);
        }

        @media (max-width: 640px) {
          .modal-content { border-radius: 1.2rem; }
          .modal-header, .modal-body, .modal-footer {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
      `}</style>

      <div className="jobpost-container">
        <div className="main-content-wrapper">

          {/* Post New Job Form */}
          <div className="section-card">
            <h2 className="section-title">Post a New Job</h2>

            {message && (
              <div className={`message ${messageType === "success" ? "message-success" : "message-error"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="e.g. Senior React Developer"
                  />
                </div>

                <div>
                  <label className="form-label">Job Type *</label>
                  <select name="job_type" value={formData.job_type} onChange={handleChange} className="form-select">
                    <option value="full_time">Full Time</option>
                    <option value="internship">Internship</option>
                    <option value="part_time">Part Time</option>
                  </select>
                </div>

                <div className="form-row">
                  <div>
                    <label className="form-label">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Python, Django, React"
                    />
                  </div>

                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. Chennai (or Remote)"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="form-label">Salary Range</label>
                    <input
                      type="text"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. 8-15 LPA"
                    />
                  </div>

                  <div>
                    <label className="form-label">Last Date to Apply</label>
                    <input
                      type="date"
                      name="last_date_to_apply"
                      value={formData.last_date_to_apply}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label className="form-label">Eligible Departments</label>
                    <input
                      type="text"
                      name="departments"
                      value={formData.departments}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="CSE, IT, ECE, Mech, All"
                    />
                  </div>

                  <div>
                    <label className="form-label">Eligible Programmes</label>
                    <input
                      type="text"
                      name="programmes"
                      value={formData.programmes}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="B.Tech, MCA, M.Sc"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="full-width">
                    <label className="form-label">Eligible Graduation Years</label>
                    <input
                      type="text"
                      name="graduation_years"
                      value={formData.graduation_years}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="2024, 2025, 2026"
                    />
                  </div>
                </div>

                <div className="full-width">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                    placeholder="Describe the role, responsibilities, requirements..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Post Job
                </button>
              </div>
            </form>
          </div>

          {/* Your Posted Jobs + Search Bar */}
          <h2 className="section-title">Your Posted Jobs</h2>

          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search jobs by title, location, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm("")}>
                ×
              </button>
            )}
          </div>

          {loadingJobs ? (
            <div className="text-center py-12">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "1.2rem", color: "#94a3b8" }}>Loading your postings...</p>
            </div>
          ) : error ? (
            <div className="message message-error text-center py-8">{error}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="section-card text-center py-10">
              <p style={{ fontSize: "1.1rem", color: "#64748b", whiteSpace: "pre-line" }}>
                {searchTerm
                  ? "No matching jobs found."
                  : "You haven't posted any jobs yet.\nStart creating opportunities above!"}
              </p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <span className={`status-badge ${job.is_active ? "status-active" : "status-inactive"}`}>
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="job-meta">
                    <p>Company: {job.company || "—"}</p>
                    <p>📍 {job.location || "Not specified"}</p>
                    <p>💼 {job.job_type?.replace("_", " ") || "Not specified"}</p>
                    <p>💰 {job.salary_range || "Not disclosed"}</p>
                    {job.departments?.length > 0 && (
                      <p>🏢 Departments: {job.departments.join(", ")}</p>
                    )}
                    {job.programmes?.length > 0 && (
                      <p>📚 Programmes: {job.programmes.join(", ")}</p>
                    )}
                    {job.graduation_years?.length > 0 && (
                      <p>🎓 Years: {job.graduation_years.join(", ")}</p>
                    )}
                    {job.skills?.length > 0 && (
                      <p>🛠 Skills: {job.skills.join(", ")}</p>
                    )}
                    {job.last_date_to_apply && (
                      <p style={{ color: "#dc2626" }}>
                        Apply by: {job.last_date_to_apply}
                      </p>
                    )}
                  </div>

                  <p className="job-description">{job.description || "No description provided."}</p>

                  <div className="job-actions">
                    <button onClick={() => handleEdit(job)} className="action-btn btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="action-btn btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="section-title" style={{ margin: 0, fontSize: "1.9rem" }}>
                Edit Job Posting
              </h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label className="form-label">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Job Type *</label>
                    <select name="job_type" value={formData.job_type} onChange={handleChange} className="form-select">
                      <option value="full_time">Full Time</option>
                      <option value="internship">Internship</option>
                      <option value="part_time">Part Time</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div>
                      <label className="form-label">Skills (comma separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label className="form-label">Salary Range</label>
                      <input
                        type="text"
                        name="salary_range"
                        value={formData.salary_range}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Last Date to Apply</label>
                      <input
                        type="date"
                        name="last_date_to_apply"
                        value={formData.last_date_to_apply}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label className="form-label">Eligible Departments</label>
                      <input
                        type="text"
                        name="departments"
                        value={formData.departments}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="CSE, IT, ECE, Mech, All"
                      />
                    </div>

                    <div>
                      <label className="form-label">Eligible Programmes</label>
                      <input
                        type="text"
                        name="programmes"
                        value={formData.programmes}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="B.Tech, MCA, M.Sc"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="full-width">
                      <label className="form-label">Eligible Graduation Years</label>
                      <input
                        type="text"
                        name="graduation_years"
                        value={formData.graduation_years}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="2024, 2025, 2026"
                      />
                    </div>
                  </div>

                  <div className="full-width">
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="form-textarea"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Update Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}