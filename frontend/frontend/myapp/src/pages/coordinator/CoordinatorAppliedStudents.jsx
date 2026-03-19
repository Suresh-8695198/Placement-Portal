
// src/pages/coordinator/CoordinatorAppliedStudents.jsx
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function CoordinatorAppliedStudents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const programme = searchParams.get("programme") || "";
  const year = searchParams.get("year") || "";
  const jobId = searchParams.get("job_id") || "";
  const jobTitle = searchParams.get("job_title") || "";

  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const coordinatorName = localStorage.getItem("coordinatorUsername") || "Coordinator";
  const department = localStorage.getItem("coordinatorDepartment") || "Department";

  // Filter applications
  const filteredApplications = applications.filter((app) =>
    app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.student?.university_reg_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredApplications.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredApplications.length / entriesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // CSV download function
  const downloadCSV = () => {
    if (applications.length === 0) return;

    const headers = [
      "Reg No",
      "Name",
      "Email",
      "Department",
      "Programme",
      "Year",
      "Phone",
      "CGPA",
      "Job Title",
      "Status",
      "Applied On",
      "Cover Letter",
    ];

    const rows = applications.map((app) => [
      app.student?.university_reg_no || "N/A",
      app.student?.name || "N/A",
      app.student?.email || "N/A",
      app.student?.department || "N/A",
      app.student?.programme || "N/A",
      app.student?.year || "N/A",
      app.student?.phone || "N/A",
      app.student?.cgpa || "N/A",
      app.job?.title || "Untitled Job",
      app.status || "Pending",
      app.applied_at || "N/A",
      app.cover_letter ? `"${app.cover_letter.replace(/"/g, '""')}"` : "No cover letter",
    ]);

    const csvContent =
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
      setError("Job ID is missing.");
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
          border-radius: 0;
          padding: 1.5rem;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.04);
          transition: all 0.25s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 6px 6px 0px rgba(0,0,0,0.08);
        }

        .stat-value {
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--primary-dark);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #94a3b8;
          border-radius: 10px;
          padding: 0.55rem 1rem;
          gap: 10px;
          min-width: 320px;
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-dark);
        }

        .action-btn {
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
    </>
  );
}