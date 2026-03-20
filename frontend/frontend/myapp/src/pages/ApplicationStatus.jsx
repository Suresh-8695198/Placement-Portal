








// src/pages/ApplicationStatus.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

export default function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [dateFilter, setDateFilter] = useState('All time');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const navigate = useNavigate();
  const studentEmail = localStorage.getItem('studentEmail');

  useEffect(() => {
    if (!studentEmail) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [navigate, studentEmail]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${API_BASE}/api/students/applications/my/?email=${studentEmail}`
      );
      const apps = res.data.applications || [];
      setApplications(apps);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Could not load your applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = useMemo(() => {
    let result = [...applications];

    if (searchText.trim()) {
      const term = searchText.toLowerCase().trim();
      result = result.filter(
        (app) =>
          (app.job_title || '').toLowerCase().includes(term) ||
          (app.company || '').toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(
        (app) => (app.status || '').toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (dateFilter !== 'All time') {
      const now = new Date();
      result = result.filter((app) => {
        const appDate = new Date(app.applied_at);
        if (isNaN(appDate.getTime())) return true;
        if (dateFilter === 'Last 7 days') {
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          return appDate >= sevenDaysAgo;
        }
        if (dateFilter === 'Last 30 days') {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          return appDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.applied_at) - new Date(a.applied_at);
      if (sortBy === 'Oldest') return new Date(a.applied_at) - new Date(b.applied_at);
      if (sortBy === 'Company A-Z') return (a.company || '').localeCompare(b.company || '');
      if (sortBy === 'Company Z-A') return (b.company || '').localeCompare(a.company || '');
      return 0;
    });

    return result;
  }, [applications, searchText, statusFilter, sortBy, dateFilter]);

  const totalEntries = filteredApps.length;
  const indexOfLastApp = currentPage * entriesPerPage;
  const indexOfFirstApp = indexOfLastApp - entriesPerPage;
  const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, sortBy, dateFilter, entriesPerPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem', borderWidth: '0.2rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-status-container">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <style>{`
        :root {
          --brand-green: #047857; /* Emerald-700, matching active sidebar */
          --brand-green-hover: #065f46;
          --bg-main: #f3f4f6;
          --border-ui: #e5e7eb;
          --text-deep: #111827;
          --text-muted: #6b7280;
        }

        .modern-status-container {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-main);
          min-height: 100vh;
          padding: 0.25rem 1.5rem;
        }

        .page-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* --- Header Card Section --- */
        .header-card {
          background: white;
          border-radius: 0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--border-ui);
          margin-bottom: 2rem;
        }

        .header-top-block {
          background-color: var(--brand-green);
          padding: 2.5rem 2.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .header-top-block h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .header-top-block p {
          font-size: 0.925rem;
          opacity: 0.9;
          max-width: 600px;
          margin-bottom: 0;
        }

        .header-decoration {
          position: absolute;
          right: 3%;
          bottom: -20%;
          opacity: 0.15;
          font-size: 12rem;
          transform: rotate(-15deg);
          pointer-events: none;
        }

        /* --- Filter Row Toolbar --- */
        .filter-toolbar {
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          background: #fafafa;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-box input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.8rem;
          border: 1px solid var(--border-ui);
          border-radius: 0;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--brand-green);
          background: white;
        }

        .toolbar-btn {
          padding: 0.65rem 1.25rem;
          border-radius: 0;
          border: 1px solid var(--border-ui);
          background: #f1f5f9;
          font-weight: 600;
          font-size: 0.9rem;
          color: #4b5563;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .toolbar-btn:hover {
          background: #e2e8f0;
          color: var(--text-deep);
        }

        .toolbar-btn.active.btn-all {
          background-color: #fbbf24; /* Professional Amber-400 */
          color: #000000;
          border-color: #fbbf24;
        }

        .toolbar-btn.active.btn-applied {
          background-color: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .toolbar-btn.active.btn-selected {
          background-color: var(--brand-green);
          color: white;
          border-color: var(--brand-green);
        }

        .entries-section {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .entries-select {
          padding: 0.45rem 0.6rem;
          border: 1px solid var(--border-ui);
          border-radius: 0;
          background: white;
          font-weight: 600;
        }

        /* --- Advanced Filters Panel --- */
        .advanced-panel {
          padding: 1.5rem 2.5rem;
          border-top: 1px solid var(--border-ui);
          background: #ffffff;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .adv-filter-group label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .adv-filter-group select {
          width: 100%;
          padding: 0.6rem;
          border-radius: 0;
          border: 1px solid var(--border-ui);
        }

        /* --- Table Body --- */
        .table-card {
          background: white;
          border-radius: 0;
          border: 1px solid var(--border-ui);
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .status-table {
          width: 100%;
          border-collapse: collapse;
        }

        .status-table th {
          background: #f9fafb;
          padding: 1.25rem 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          text-align: left;
          border-bottom: 2px solid var(--border-ui);
        }

        .status-table td {
          padding: 1.25rem 2rem;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border-ui);
          vertical-align: middle;
        }

        .app-job-cell {
          display: flex;
          flex-direction: column;
        }

        .app-company { font-weight: 700; color: var(--text-deep); }
        .app-title { font-size: 0.85rem; color: var(--text-muted); }

        .badge-status {
          padding: 0.4rem 0.8rem;
          border-radius: 0;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .badge-selected { background: #dcfce7; color: #166534; }
        .badge-shortlisted { background: #fef9c3; color: #854d0e; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .badge-applied { background: #e0e7ff; color: #3730a3; }
        .badge-pending { background: #f3f4f6; color: #4b5563; }

        /* --- Pagination --- */
        .pagination-footer {
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
          border-top: 1px solid var(--border-ui);
        }

        .page-btn {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          border: 1px solid var(--border-ui);
          background: white;
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0 0.2rem;
          transition: 0.2s;
        }

        .page-btn.active {
          background-color: var(--brand-green);
          color: white;
          border-color: var(--brand-green);
        }

        .page-btn:hover:not(.active):not(:disabled) {
          background: #f3f4f6;
        }

        /* --- Empty State --- */
        .empty-state {
          padding: 6rem 1rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3.5rem;
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        @media (max-width: 1024px) {
          .filter-toolbar {
            flex-direction: column;
            align-items: stretch;
            padding: 1.5rem;
          }
          .entries-section { margin-left: 0; padding-top: 1rem; border-top: 1px solid var(--border-ui); }
          .header-top-block { padding: 2rem; }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header-card">
          <div className="header-top-block">
            <h1>My Applications</h1>
            <p>Explorer and discover roles that match your academic profile and professional skills. Track your journey with real-time updates.</p>
            <i className="bi bi-graph-up-arrow header-decoration"></i>
          </div>

          <div className="filter-toolbar">
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input 
                type="text" 
                placeholder="Search by title, company, or skills..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <button 
              className={`toolbar-btn ${showAdvanced ? 'active' : ''}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <i className="bi bi-sliders"></i>
              Advanced Filters
            </button>

            <div className="d-flex gap-2">
              <button 
                className={`toolbar-btn btn-all ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => setStatusFilter('All')}
              >
                All
              </button>
              <button 
                className={`toolbar-btn btn-applied ${statusFilter === 'Applied' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Applied')}
              >
                Applied
              </button>
              <button 
                className={`toolbar-btn btn-selected ${statusFilter === 'Selected' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Selected')}
              >
                Selected
              </button>
            </div>

            <div className="entries-section">
              <span>Show</span>
              <select 
                className="entries-select" 
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
              >
                <option value={6}>6 items</option>
                <option value={10}>10 items</option>
                <option value={25}>25 items</option>
              </select>
              <span><i className="bi bi-chevron-down ms-1" style={{ fontSize: '0.7rem' }}></i></span>
            </div>
          </div>

          {showAdvanced && (
            <div className="advanced-panel">
              <div className="adv-filter-group">
                <label>Sort Applications</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                  <option value="Company A-Z">Company (A-Z)</option>
                  <option value="Company Z-A">Company (Z-A)</option>
                </select>
              </div>
              <div className="adv-filter-group">
                <label>Time Period</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <option value="All time">All time</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                </select>
              </div>
              <div className="adv-filter-group">
                <label>History</label>
                <select onChange={(e) => setStatusFilter(e.target.value === 'History' ? 'Rejected' : 'All')}>
                  <option value="Active">Active Only</option>
                  <option value="History">Archived/Rejected</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="table-card">
          <div className="table-responsive">
            <table className="status-table">
              <thead>
                <tr>
                  <th>Position & Company</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {currentApps.length > 0 ? (
                  currentApps.map((app, index) => (
                    <tr key={app.id || index}>
                      <td>
                        <div className="app-job-cell">
                          <span className="app-company">{app.company || 'Unknown Company'}</span>
                          <span className="app-title">{app.job_title || 'Software Trainee'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <i className="bi bi-calendar-event"></i>
                          <span>{app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-status badge-${(app.status || 'pending').toLowerCase()}`}>
                          <i className={`bi ${getStatusIcon(app.status)}`}></i>
                          {app.status || 'Applied'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-link text-success fw-bold p-0 text-decoration-none">
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <i className="bi bi-folder2-open empty-icon"></i>
                        <h4 className="fw-bold">No Records Found</h4>
                        <p className="text-muted">Adjust your filters or search keywords to find your applications.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalEntries > entriesPerPage && (
            <div className="pagination-footer">
              <span className="text-muted small">Showing {indexOfFirstApp + 1}-{Math.min(indexOfLastApp, totalEntries)} of {totalEntries} results</span>
              <div className="pagination-nav">
                <button className="page-link page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button className="page-link page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusIcon(status) {
  const s = (status || '').toLowerCase();
  if (s === 'selected') return 'bi-check-circle-fill';
  if (s === 'shortlisted') return 'bi-star-fill';
  if (s === 'rejected') return 'bi-x-circle-fill';
  if (s === 'applied') return 'bi-send-fill';
  return 'bi-clock-history';
}
