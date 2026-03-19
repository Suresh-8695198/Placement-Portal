// src/pages/coordinator/CoordinatorAppliedStudents.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function CoordinatorAppliedStudents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const programme = searchParams.get("programme") || "";
  const year = searchParams.get("year") || "";
  const jobId = searchParams.get("job_id") || "";
  const jobTitle = searchParams.get("job_title") || "";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Custom Table Features
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: ""
  });

  const coordinatorName = localStorage.getItem("coordinatorUsername") || "Coordinator";

  // Fetch applicants for this job
  useEffect(() => {
    if (!jobId) {
      setError("Job ID is missing for this selection.");
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
        </div>
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