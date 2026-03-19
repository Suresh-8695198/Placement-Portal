








// src/pages/ApplicationStatus.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

export default function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const navigate = useNavigate();
  const studentEmail = localStorage.getItem('studentEmail');

  useEffect(() => {
    if (!studentEmail) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [navigate, studentEmail]);

  useEffect(() => {
    applyFilters();
  }, [applications, searchText, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${API_BASE}/api/students/applications/my/?email=${studentEmail}`
      );

      const apps = res.data.applications || [];
      setApplications(apps);
      setFilteredApps(apps);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Could not load your applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...applications];

    if (searchText.trim()) {
      const term = searchText.toLowerCase().trim();
      result = result.filter(
        (app) =>
          (app.job_title || '').toLowerCase().includes(term) ||
          (app.company || '').toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      result = result.filter(
        (app) => (app.status || '').toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredApps(result);
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) => (prev === status ? null : status));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="text-danger fs-4 fw-medium mb-4">{error}</div>
      </div>
    );
  }

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

        .app-status-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          background: #ffffff;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .status-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 3.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(75,0,130,0.28);
          flex-shrink: 0;
        }

        .section-title {
          font-size: clamp(1.8rem, 5vw, 2.4rem);
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

        .action-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.7rem 1.4rem;
          font-size: 0.96rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(75,0,130,0.25);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(75,0,130,0.4);
        }

        .refresh-btn {
          background: white;
          color: var(--primary);
          border: 1px solid var(--primary);
        }

        .refresh-btn:hover:not(:disabled) {
          background: var(--light-violet-bg);
        }

        .browse-btn {
          padding: 0.8rem 1.6rem;
          font-size: 1rem;
        }

        .filter-controls {
          background: var(--light-violet-bg);
          border: 1px solid var(--light-violet-border);
          border-radius: 12px;
          padding: 1.2rem;
          margin-bottom: 2rem;
        }

        .search-input {
          padding: 0.65rem 1.1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.97rem;
          width: 100%;
          max-width: 400px;
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }

        .status-btn {
          padding: 0.55rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 999px;
          border: 1px solid;
          transition: all 0.2s;
          min-width: 105px;
        }

        .status-btn:hover {
          transform: translateY(-1px);
        }

        .status-btn.active {
          color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .status-btn-shortlisted { background: #fefce8; color: #ca8a04; border-color: #fde047; }
        .status-btn-shortlisted.active { background: #facc15; color: #713f12; }
        .status-btn-selected   { background: #ecfdf5; color: #15803d; border-color: #86efac; }
        .status-btn-selected.active   { background: #22c55e; color: white; }
        .status-btn-rejected   { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
        .status-btn-rejected.active   { background: #ef4444; color: white; }

        .status-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .status-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 720px;
        }

        .status-table th {
          background: var(--light-violet-bg);
          color: var(--violet-text);
          font-weight: 700;
          text-align: left;
          padding: 1rem 1.1rem;
          font-size: 0.98rem;
          border-bottom: 2px solid var(--border-light);
        }

        .status-table td {
          padding: 1rem 1.1rem;
          font-size: 0.94rem;
          color: var(--text);
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .status-table tbody tr:hover {
          background: #f8fafc;
        }

        .status-badge {
          display: inline-block;
          padding: 0.38rem 0.9rem;
          border-radius: 999px;
          font-size: 0.84rem;
          font-weight: 600;
          min-width: 90px;
          text-align: center;
          border: 1px solid;
        }

        .status-rejected   { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
        .status-shortlisted { background: #fefce8; color: #ca8a04; border-color: #fde047; }
        .status-selected   { background: #ecfdf5; color: #15803d; border-color: #86efac; }
        .status-pending,
        .status-applied,
        .status-default    { background: #f3f4f6; color: #4b5563; border-color: #d1d5db; }

        .cover-letter-cell {
          max-width: 300px;
          white-space: pre-wrap;
          word-break: break-word;
          color: var(--text-light);
          font-size: 0.92rem;
        }

        .no-apps-box {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 3.5rem 2rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .app-status-page {
            padding: 3rem 1rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .app-status-page {
            padding: 2.5rem 0.8rem 2rem;
          }

          .status-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.2rem;
          }

          .status-avatar {
            width: 80px;
            height: 80px;
            font-size: 2.6rem;
          }

          .section-title {
            font-size: 2.1rem;
          }

          .filter-controls {
            padding: 1rem;
          }

          .search-input {
            max-width: 100%;
          }

          .status-btn {
            min-width: 95px;
            padding: 0.5rem 1rem;
            font-size: 0.88rem;
          }

          .action-btn {
            padding: 0.65rem 1.3rem;
            font-size: 0.94rem;
          }
        }

        @media (max-width: 576px) {
          .app-status-page {
            padding: 2rem 0.6rem 1.5rem;
          }

          .status-avatar {
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

          .filter-controls .d-flex {
            flex-direction: column;
            align-items: stretch;
            gap: 0.9rem;
          }

          .status-btn {
            width: 100%;
            min-width: unset;
          }

          .action-btn,
          .refresh-btn,
          .browse-btn {
            width: 100%;
            padding: 0.75rem;
            font-size: 0.97rem;
          }

          .status-table th,
          .status-table td {
            padding: 0.9rem 0.8rem;
            font-size: 0.9rem;
          }

          .status-badge {
            min-width: 80px;
            padding: 0.35rem 0.8rem;
            font-size: 0.82rem;
          }

          .cover-letter-cell {
            max-width: 220px;
          }

          .no-apps-box {
            padding: 2.8rem 1.5rem;
          }
        }

        @media (max-width: 400px) {
          .section-title {
            font-size: 1.65rem;
          }

          .status-avatar {
            width: 60px;
            height: 60px;
            font-size: 1.9rem;
          }
        }

        .refresh-btn {
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 0.7rem 1.4rem;
  font-size: 0.96rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(75,0,130,0.12);
  transition: all 0.25s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--light-violet-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(75,0,130,0.2);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
      `}</style>

      <div className="app-status-page">
        <button className="action-btn mb-4" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-circle-fill me-2"></i> Back
        </button>

        <div className="status-header">
          <div className="status-avatar">
            <i className="bi bi-list-check"></i>
          </div>
          <div>
            <h1 className="section-title">My Applications</h1>
            <p className="subtitle">Track the status of your job applications</p>
          </div>
        </div>

        <div className="filter-controls">
          <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
            <input
              type="text"
              className="search-input"
              placeholder="Search by job title or company..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <div className="d-flex gap-2 flex-wrap">
              <button
                className={`status-btn status-btn-shortlisted ${statusFilter === 'shortlisted' ? 'active' : ''}`}
                onClick={() => toggleStatusFilter('shortlisted')}
              >
                Shortlisted
              </button>
              <button
                className={`status-btn status-btn-selected ${statusFilter === 'selected' ? 'active' : ''}`}
                onClick={() => toggleStatusFilter('selected')}
              >
                Selected
              </button>
              <button
                className={`status-btn status-btn-rejected ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => toggleStatusFilter('rejected')}
              >
                Rejected
              </button>
            </div>

            <button
              className="refresh-btn ms-sm-auto"
              onClick={fetchApplications}
              disabled={loading}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="no-apps-box">
            <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--violet-text)', marginBottom: '1.2rem' }}>
              No applications yet
            </h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              You haven't applied to any jobs yet. Start exploring opportunities now!
            </p>
            <button className="action-btn browse-btn" onClick={() => navigate('/dashboard/companies')}>
              <i className="bi bi-search me-2"></i> Browse Available Jobs
            </button>
          </div>
        ) : (
          <div className="status-card">
            <div className="table-responsive">
              <table className="status-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Cover Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No applications match your search or filter
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app, index) => (
                      <tr key={app.id || app.job_id || index}>
                        <td>{app.job_title || 'Untitled Job'}</td>
                        <td>{app.company || 'Unknown Company'}</td>
                        <td>{app.applied_at || 'N/A'}</td>
                        <td>
                          <span className={`status-badge status-${(app.status || 'pending').toLowerCase()}`}>
                            {app.status || 'Pending'}
                          </span>
                        </td>
                        <td className="cover-letter-cell">
                          {app.cover_letter ? (
                            <div title={app.cover_letter}>
                              {app.cover_letter.substring(0, 120)}
                              {app.cover_letter.length > 120 ? '...' : ''}
                            </div>
                          ) : (
                            'No cover letter'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}