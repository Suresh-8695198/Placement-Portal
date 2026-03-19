
// src/pages/coordinator/CoordinatorAppliedStudents.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
>>>>>>> 5ccdf130edeb676ed266c06214ad31c7a8d63c91
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function CoordinatorAppliedStudents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const programme = searchParams.get("programme") || "";
  const year = searchParams.get("year") || "";
  const jobTitle = searchParams.get("job_title") || "";

  // Table features
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: ""
  });
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  // Filtering Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const student = app.student || {};
      const matchesSearch = 
        (student.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesName = student.name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesEmail = student.email?.toLowerCase().includes(filters.email.toLowerCase());
      const matchesStatus = filters.status ? app.status === filters.status : true;
      return matchesSearch && matchesName && matchesEmail && matchesStatus;
    });
  }, [applications, searchQuery, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredApplications.length / entriesPerPage) || 1;
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredApplications.slice(start, start + entriesPerPage);
  }, [filteredApplications, currentPage, entriesPerPage]);

  // CSV download function
  const downloadCSV = () => {
    if (!jobId) return;
    window.open(`${API_BASE}/coordinator/download-applications/?job_id=${jobId}`, "_blank");
  };
      app.cover_letter ? `"${app.cover_letter.replace(/"/g, '""')}"` : "No cover letter",
    ]);

      setError("Job ID is missing for this selection.");
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Applicants_${jobTitle || "Job"}_${new Date().toISOString().slice(0,10)}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!jobId) {
<<<<<<< HEAD
      setError("Job ID is missing.");
=======
      setError("Job ID is missing for this selection.");
>>>>>>> 5ccdf130edeb676ed266c06214ad31c7a8d63c91
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/coordinator/job-applicants/`, {
          params: { job_id: jobId },
        });
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load student applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

<<<<<<< HEAD
  if (error && !loading) {
    return (
      <div className="error-container">
        <div className="error-card">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <style>{`
        /* Your existing CSS remains unchanged - keeping it compact here */
        :root {
          --primary: #7c3aed;
          --primary-dark: #5b21b6;
          --primary-darker: #4c1d95;
          --text-dark: #0f172a;
          --text-muted: #64748b;
          --bg-light: #f8fafc;
          --border: #e2e8f0;
        }
        /* ... rest of your styles ... */
              :root {
          --primary: #7c3aed;
          --primary-dark: #5b21b6;
          --primary-darker: #4c1d95;
          --text-dark: #0f172a;
          --text-muted: #64748b;
          --bg-light: #f8fafc;
          --border: #e2e8f0;
        }

        .applicants-wrapper {
          padding: 1.5rem 2.5rem 3rem;
          max-width: 1550px;
          margin: 0 auto;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .breadcrumb-item { cursor: pointer; transition: color 0.2s; }
        .breadcrumb-item:hover { color: var(--primary); }
        .breadcrumb-item.active { color: var(--text-dark); pointer-events: none; }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .header-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-dark);
          margin: 0;
        }

        .header-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-top: 4px;
        }

        .stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border: 2px solid var(--border);
          if (error && !loading) {
            return (
              <div className="error-container">
                <div className="error-card">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Retry</button>
                </div>
              </div>
            );
          }

          return (
            <div className="coordinator-applied-students">
              <style>{`
                /* Professional and modern CSS merged from both versions */
                .coordinator-applied-students {
                  padding: 2rem;
                  background: #f8fafc;
                  min-height: 100%;
                }
                .page-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  margin-bottom: 2.5rem;
                  padding-bottom: 1.5rem;
                  border-bottom: 2px solid #e2e8f0;
                }
                .header-title-group {
                  flex: 1;
                }
                .welcome-text {
                  font-size: 1rem;
                  color: #64748b;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                  margin-bottom: 0.5rem;
                  font-weight: 700;
                }
                .main-title {
                  font-size: 2.25rem;
                  color: #1e1b4b;
                  font-weight: 900;
                  margin: 0;
                  line-height: 1.1;
                }
                .subtitle-badge {
                  display: inline-flex;
                  align-items: center;
                  gap: 0.6rem;
                  margin-top: 0.8rem;
                  background: #e0e7ff;
                  color: #4338ca;
                  padding: 0.5rem 1.2rem;
                  border-radius: 0.4rem;
                  font-weight: 800;
                  font-size: 0.9rem;
                }
                .action-group {
                  display: flex;
                  gap: 1rem;
                }
                .btn-action {
                  padding: 0.65rem 1.5rem;
                  border-radius: 0.5rem;
                  font-weight: 800;
                  font-size: 0.9rem;
                  cursor: pointer;
                  transition: all 0.2s;
                  display: flex;
                  align-items: center;
                  gap: 0.6rem;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  border: none;
                }
                .btn-back { background: #f1f5f9; color: #475569; }
                .btn-back:hover { background: #e2e8f0; }
                .btn-download { background: #4f46e5; color: #ffffff; }
                .btn-download:hover { background: #4338ca; transform: translateY(-2px); }
                /* ...existing code for table, search, pagination, etc... */
              `}</style>

              <div className="page-header">
                <div className="header-title-group">
                  <div className="welcome-text">MANAGEMENT PORTAL — {coordinatorName}</div>
                  <h1 className="main-title">Applied Students</h1>
                  <div className="subtitle-badge">
                    <i className="fas fa-briefcase"></i>
                    {jobTitle || (programme ? `${programme.replace(/_/g, " ")} • ${year}` : "View Applications")}
                  </div>
                </div>
                <div className="action-group">
                  <button className="btn-action btn-back" onClick={() => navigate("/coordinator/jobs")}> <i className="fas fa-arrow-left"></i> Back to Jobs </button>
                  <button className="btn-action btn-download" onClick={downloadCSV}> <i className="fas fa-file-csv"></i> Download CSV </button>
                </div>
              </div>
              {/* ...existing code for stats bar, search, table, pagination, etc... */}
            </div>
          );
          background: white;
          border: 2px solid #94a3b8;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          font-weight: 700;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: #f8f9ff;
        }

        .entries-select {
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 0.5rem 2rem 0.5rem 1rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1rem;
        }

        .table-container {
          background: white;
          border: 2px solid var(--border);
          border-radius: 0;
          overflow: hidden;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.04);
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }

        .modern-table thead th {
          background: var(--primary-dark);
          color: white;
          padding: 1.1rem 1.25rem;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          text-align: left;
          border-bottom: 3px solid var(--primary-darker);
        }

        .modern-table tbody tr {
          transition: background 0.18s;
        }

        .modern-table tbody tr:nth-child(even) {
          background: #fcfdfe;
        }

        .modern-table tbody tr:hover {
          background: #f1f5f9;
        }

        .modern-table td {
          padding: 1.15rem 1.25rem;
          vertical-align: middle;
          border-bottom: 1px solid #f1f5f9;
        }

        .reg-no {
          font-family: monospace;
          font-weight: 600;
          color: #1e293b;
          letter-spacing: 0.5px;
        }

        .student-name { font-weight: 700; color: var(--text-dark); }
        .student-email { color: var(--text-muted); font-size: 0.9rem; }

        .status-tag {
          padding: 0.35rem 0.9rem;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .status-pending  { background: #fef3c7; color: #92400e; }
        .status-accepted { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }

        .pagination-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 0 1rem 0;
  border-top: 1px solid #f1f5f9;
  padding-right: 3rem;           /* ← main control: 2rem = subtle, 5rem = stronger shift */
  padding-left: 1rem;            /* optional: keeps left side clean */
}

        .page-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          background: white;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-btn:hover { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .loading-overlay, .empty-state {
          padding: 6rem 1rem;
          text-align: center;
          color: var(--text-muted);
        }

        .spinner {
          width: 44px;
          height: 44px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.2rem;
        }
 .page-btn.active {
  background: var(--success);
  color: white;
  border-color: var(--success-dark);
}

.page-btn:hover:not(.active) {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-light);
}

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="applicants-wrapper">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <span
            className="breadcrumb-item"
            onClick={() => navigate("/coordinator/jobs")}
          >
            {department}
          </span>
          <i className="fas fa-chevron-right" style={{ fontSize: "0.75rem", opacity: 0.6 }}></i>
          <span className="breadcrumb-item active">Job Applicants</span>
        </div>

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="header-title">
              Applicants — {jobTitle || "Selected Position"}
            </h1>
            {programme && year && (
              <div className="header-subtitle">
                {programme.replace(/_/g, " ")} • Batch {year}
              </div>
            )}
          </div>
=======
  // Filtering Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const student = app.student || {};
      const matchesSearch = 
        (student.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesName = student.name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesEmail = student.email?.toLowerCase().includes(filters.email.toLowerCase());
      const matchesStatus = filters.status ? app.status === filters.status : true;

      return matchesSearch && matchesName && matchesEmail && matchesStatus;
    });
  }, [applications, searchQuery, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredApplications.length / entriesPerPage) || 1;
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredApplications.slice(start, start + entriesPerPage);
  }, [filteredApplications, currentPage, entriesPerPage]);

  const downloadCSV = () => {
    if (!jobId) return;
    window.open(`${API_BASE}/coordinator/download-applications/?job_id=${jobId}`, "_blank");
  };

  return (
    <div className="coordinator-applied-students">
      <style>{`
        /* ─── Base Overrides for 100% Professional Look ──────────────── */
        .coordinator-applied-students {
          padding: 2rem;
          background: #f8fafc;
          min-height: 100%;
        }

        /* ─── Header Area ─────────────────────────────────────────── */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .header-title-group {
          flex: 1;
        }

        .welcome-text {
          font-size: 1rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .main-title {
          font-size: 2.25rem;
          color: #1e1b4b;
          font-weight: 900;
          margin: 0;
          line-height: 1.1;
        }

        .subtitle-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.8rem;
          background: #e0e7ff;
          color: #4338ca;
          padding: 0.5rem 1.2rem;
          border-radius: 0.4rem;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .action-group {
          display: flex;
          gap: 1rem;
        }

        .btn-action {
          padding: 0.65rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
        }

        .btn-back { background: #f1f5f9; color: #475569; }
        .btn-back:hover { background: #e2e8f0; }

        .btn-download { background: #4f46e5; color: #ffffff; }
        .btn-download:hover { background: #4338ca; transform: translateY(-2px); }

        /* ─── Filter Bar ─────────────────────────────────────────── */
        .control-bar {
          background: #ffffff;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0; /* Forced sharp corners */
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
          justify-content: space-between;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          background: #f8fafc;
        }

        .search-input:focus {
           outline: none;
           border-color: #4f46e5;
           background: #ffffff;
        }

        .filter-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .entries-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          color: #475569;
          font-size: 0.9rem;
        }

        .select-input {
          padding: 0.5rem 2rem 0.5rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.4rem;
          background-color: #ffffff;
          cursor: pointer;
          font-weight: 700;
        }

        /* ─── Professional Table ──────────────────────────────────── */
        .table-wrapper {
          background: #ffffff;
          border-radius: 0 !important;
          border: 2px solid #1e1b4b; /* Solid Navy frame */
          overflow-x: auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .table {
          width: 100%;
          min-width: 1300px;
          border-collapse: collapse;
          margin: 0;
        }

        .table th {
          background-color: #1e1b4b !important;
          padding: 1.25rem 1rem;
          text-align: left;
          color: #ffffff !important;
          font-weight: 900;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          border: none;
        }

        .table td {
          padding: 1.25rem 1rem;
          border-bottom: 1.5px solid #f1f5f9;
          color: #1e1b4b !important;
          font-size: 0.9rem;
          font-weight: 800; /* Ultra-bold contents */
          vertical-align: middle;
          white-space: nowrap;
          background-color: #ffffff;
          transition: background 0.2s;
        }

        .table tbody tr:hover td {
          background-color: #f1f5f9;
        }

        .status-badge {
          padding: 0.4rem 1rem;
          border-radius: 2rem;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          border-width: 1.5px;
          border-style: solid;
        }

        .status-pending { background: #fffbeb; color: #d97706; border-color: #fde68a; }
        .status-selected { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
        .status-rejected { background: #fef2f2; color: #991b1b; border-color: #fecaca; }

        /* ─── Pagination ─────────────────────────────────────────── */
        .footer-bar {
          margin-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .showing-text {
          color: #64748b;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .pagination {
          display: flex;
          gap: 0.5rem;
        }

        .pagination-btn {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #1e1b4b;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 0.4rem;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #4f46e5;
          color: #4f46e5;
          background: #f5f3ff;
        }

        .pagination-btn.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ─── Empty & Error States ────────────────────────────────── */
        .empty-state {
          text-align: center;
          padding: 8rem 2rem;
          background: #ffffff;
          border: 2px dashed #e2e8f0;
          border-radius: 1rem;
        }

        .empty-icon {
          font-size: 4rem;
          color: #cbd5e1;
          margin-bottom: 1.5rem;
        }

        .empty-title {
          font-size: 1.5rem;
          color: #64748b;
          font-weight: 700;
        }

        .loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10rem;
          color: #4f46e5;
          font-weight: 900;
        }
      `}</style>

      <div className="page-header">
        <div className="header-title-group">
          <div className="welcome-text">MANAGEMENT PORTAL — {coordinatorName}</div>
          <h1 className="main-title">
            Applied Students
          </h1>
          <div className="subtitle-badge">
            <i className="fas fa-briefcase"></i>
            {jobTitle || (programme ? `${programme.replace(/_/g, " ")} • ${year}` : "View Applications")}
          </div>
        </div>

        <div className="action-group">
          <button className="btn-action btn-back" onClick={() => navigate("/coordinator/jobs")}>
            <i className="fas fa-arrow-left"></i> Back to Jobs
          </button>
          <button className="btn-action btn-download" onClick={downloadCSV}>
            <i className="fas fa-file-csv"></i> Download CSV
          </button>
>>>>>>> 5ccdf130edeb676ed266c06214ad31c7a8d63c91
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {applications.filter(a => (a.status || "Pending") === "Pending").length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {new Set(applications.map(a => a.student?.email)).size}
            </div>
            <div className="stat-label">Unique Students</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="fw-bold">Loading applications...</p>
          </div>
        ) : (
          <>
            <div className="controls-header">
              <div className="search-box">
                <i className="fas fa-search" style={{ color: "#94a3b8" }}></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, email, reg no..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span style={{ fontWeight: 600, color: "#475569" }}>Show</span>
                  <select
                    className="entries-select"
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <button className="action-btn" onClick={downloadCSV}>
                  <i className="fas fa-file-export"></i>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="table-container">
              {filteredApplications.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-users-slash" style={{ fontSize: "3.2rem", opacity: 0.25 }}></i>
                  <p style={{ marginTop: "1.2rem", fontSize: "1.15rem", fontWeight: 600 }}>
                    {searchTerm
                      ? "No matching applications found"
                      : "No students have applied yet."}
                  </p>
                </div>
              ) : (
                <>
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th style={{ width: "140px" }}>Reg No</th>
                        <th style={{ width: "180px" }}>Student</th>
                        <th style={{ width: "220px" }}>Email</th>
                        <th>Programme / Year</th>
                        <th style={{ width: "90px" }}>CGPA</th>
                        <th style={{ width: "130px" }}>Phone</th>
                        <th style={{ width: "110px" }}>Status</th>
                        <th style={{ width: "130px" }}>Applied On</th>
                        <th>Cover Letter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntries.map((app) => (
                        <tr key={app.application_id}>
                          <td>
                            <span className="reg-no">
                              {app.student?.university_reg_no || "—"}
                            </span>
                          </td>
                          <td>
                            <div className="student-name">{app.student?.name || "N/A"}</div>
                          </td>
                          <td>{app.student?.email || "—"}</td>
                          <td>
                            {app.student?.programme?.replace(/_/g, " ")}{" "}
                            {app.student?.year ? `• ${app.student.year}` : ""}
                          </td>
                          <td>{app.student?.cgpa || "—"}</td>
                          <td>{app.student?.phone || "—"}</td>
                          <td>
                            <span
                              className={`status-tag status-${(app.status || "pending").toLowerCase()}`}
                            >
                              {app.status || "Pending"}
                            </span>
                          </td>
                          <td>{app.applied_at || "—"}</td>
                          <td style={{ maxWidth: "240px" }}>
                            {app.cover_letter ? (
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  cursor: "pointer",
                                  color: "var(--primary)",
                                  textDecoration: "underline",
                                }}
                                onClick={() => setSelectedCoverLetter(app.cover_letter)}
                              >
                                {app.cover_letter.length > 100
                                  ? app.cover_letter.slice(0, 97) + "..."
                                  : app.cover_letter}
                              </div>
                            ) : (
                              <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                                No cover letter
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="pagination-wrap">
                    <div style={{ color: "#64748b", fontWeight: 500 ,marginRight: "5rem"}}>
                      Showing <strong>{indexOfFirstEntry + 1}</strong>–
                      <strong>{Math.min(indexOfLastEntry, filteredApplications.length)}</strong> of{" "}
                      <strong>{filteredApplications.length}</strong>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>

                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;

                        if (totalPages > 7) {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                          ) {
                            return (
                              <button
                                key={page}
                                className={`page-btn ${currentPage === page ? "active" : ""}`}
                                onClick={() => paginate(page)}
                              >
                                {page}
                              </button>
                            );
                          }
                          if (page === currentPage - 3 || page === currentPage + 3) {
                            return <span key={page}>…</span>;
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            className={`page-btn ${currentPage === page ? "active" : ""}`}
                            onClick={() => paginate(page)}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        className="page-btn"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => paginate(currentPage + 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Full Cover Letter Modal */}
        {selectedCoverLetter && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1.5rem",
            }}
            onClick={() => setSelectedCoverLetter(null)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                maxWidth: "720px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>
                  Cover Letter
                </h3>
                <button
                  onClick={() => setSelectedCoverLetter(null)}
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.5rem",
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: "2rem", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {selectedCoverLetter}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="control-bar">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by student name, email, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="entries-control">
            Show 
            <select 
              className="select-input"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            Entries
          </div>
        </div>
      </div>

      <div className="data-section">
        {loading ? (
          <div className="loading-overlay">
             <i className="fas fa-spinner fa-spin fa-3x mb-3"></i>
             Fetching Applicant Records...
          </div>
        ) : error ? (
          <div className="empty-state">
            <i className="fas fa-exclamation-triangle empty-icon text-danger"></i>
            <h3 className="empty-title text-danger">{error}</h3>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users-slash empty-icon"></i>
            <h3 className="empty-title">No applications found for this job listing.</h3>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Programme</th>
                    <th>Year</th>
                    <th>Phone</th>
                    <th>CGPA</th>
                    <th>Job Status</th>
                    <th>Applied On</th>
                    <th>Cover Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplications.map((app) => (
                    <tr key={app.application_id}>
                      <td>{app.student?.name || "N/A"}</td>
                      <td>{app.student?.email || "N/A"}</td>
                      <td>{app.student?.department?.replace(/_/g, " ") || "N/A"}</td>
                      <td>{app.student?.programme || "N/A"}</td>
                      <td>{app.student?.year || "N/A"}</td>
                      <td>{app.student?.phone || "N/A"}</td>
                      <td>{app.student?.cgpa || "N/A"}</td>
                      <td>
                        <span className={`status-badge status-${(app.status || "pending").toLowerCase()}`}>
                           {app.status || "Pending"}
                        </span>
                      </td>
                      <td>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <div style={{maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.8rem', opacity: 0.85}}>
                          {app.cover_letter ? (app.cover_letter.length > 80 ? app.cover_letter.slice(0, 80) + "..." : app.cover_letter) : "—"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="footer-bar">
              <div className="showing-text">
                Showing {Math.min((currentPage - 1) * entriesPerPage + 1, filteredApplications.length)} to {Math.min(currentPage * entriesPerPage, filteredApplications.length)} of {filteredApplications.length} Entries
              </div>
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}