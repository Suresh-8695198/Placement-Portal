

// src/pages/StudentJobs.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000/companies';

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false); // false = Active only, true = All jobs

  const navigate = useNavigate();
  const studentEmail = localStorage.getItem('studentEmail');

  useEffect(() => {
    if (!studentEmail) {
      navigate('/login');
      return;
    }
    fetchJobs();
  }, [navigate, studentEmail, showAll]); // Re-fetch when toggle changes
const fetchJobs = async () => {
  try {
    setLoading(true);
    setError(null);

    const params = { email: studentEmail };
params.status = showAll ? 'all' : 'active'; // <-- use this instead of params.all

    const res = await axios.get(`${API_BASE}/jobs/active/`, {
      params,
      withCredentials: true,
    });

    // Debug the full response
    console.log(`Fetched ${showAll ? 'All' : 'Active'} jobs response:`, res.data);

    // Safely get jobs array (handle missing/wrong format)
    const receivedJobs = res.data.jobs || res.data || []; 
    console.log(`Parsed jobs count: ${receivedJobs.length}`);

    setJobs(receivedJobs);
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    setError('Failed to load jobs. Please try again later.');
  } finally {
    setLoading(false);
  }
};
  const filteredJobs = jobs.filter((job) =>
    `${job.title || ''} ${job.company || ''} ${job.description || ''} ${(job.skills || []).join(' ')}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleApplyClick = (jobId) => {
    navigate(`/dashboard/apply/${jobId}`);
  };

  const handleViewCompanyWebsite = async (companyEmail) => {
    if (!companyEmail) {
      alert('Company website information not available.');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE.replace('/companies', '')}/companies/website/`, {
        params: { email: companyEmail },
        withCredentials: true,
      });

      if (res.data.success && res.data.website) {
        let url = res.data.website.trim();
        if (!url.match(/^https?:\/\//i)) url = `https://${url}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        alert(res.data.error || 'Company website not available.');
      }
    } catch (err) {
      console.error('Failed to fetch company website:', err);
      alert('Could not load company website at the moment.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="text-danger fs-4 fw-medium mb-4">{error}</div>
        {error.includes('Session') && (
          <button className="btn btn-primary px-5 py-3 fs-5" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        )}
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
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <style>{`
        /* Your existing styles — unchanged */
        :root {
          --primary: #4B0082;
          --primary-light: #6A0DAD;
          --light-violet-bg: rgba(139, 92, 246, 0.15);
          --text: #1e293b;
          --text-light: #475569;
          --bg-card: #ffffff;
          --border-light: #e2e8f0;
          --violet-text: #5b21b6;
        }
        .student-jobs-page {
          background: #ffffff;
          min-height: 100vh;
          padding: 4rem 1.5rem 2rem;
          box-sizing: border-box;
        }
        .section-title {
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          font-weight: 800;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .search-container { max-width: 520px; }
        .form-control {
          border-radius: 12px;
          padding: 0.8rem 1.4rem;
          font-size: 1.05rem;
          border: 1px solid #d1d5db;
          box-sizing: border-box;
        }
        .form-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 0.3rem rgba(75,0,130,0.18);
        }
        .job-card {
          border-radius: 16px;
          border: 1px solid var(--border-light);
          box-shadow: 0 6px 20px rgba(0,0,0,0.07);
          transition: all 0.28s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.12);
        }
        .job-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--violet-text);
          margin-bottom: 0.5rem;
        }
        .company-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--violet-text);
        }
        .job-meta {
          font-size: 0.95rem;
          color: var(--text-light);
        }
        .job-description {
          font-size: 0.96rem;
          line-height: 1.65;
          color: var(--text-light);
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .action-btn {
          border-radius: 10px;
          padding: 0.8rem 1.6rem;
          font-weight: 600;
          min-width: 165px;
          font-size: 1rem;
        }
        .action-btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
        }
        .action-btn-outline {
          background: white;
          color: var(--primary);
          border: 1px solid var(--primary);
        }
        .action-btn-outline:hover {
          background: var(--light-violet-bg);
        }
        .action-btn-outline:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .no-jobs {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 3.5rem 2.5rem;
          text-align: center;
          color: var(--text-light);
          font-size: 1.15rem;
        }
        .jobs-header-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 3.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(75,0,130,0.28);
        }
        .skills-tag {
          background: var(--light-violet-bg);
          color: var(--violet-text);
          padding: 0.35rem 0.85rem;
          border-radius: 0.5rem;
          font-size: 0.92rem;
          font-weight: 500;
          border: 1px solid rgba(75, 0, 130, 0.2);
        }
        .toggle-btn {
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .toggle-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(75,0,130,0.3);
        }
        .toggle-btn:hover:not(.active) {
          background: var(--light-violet-bg);
        }
        /* Responsive Styles */
        @media (max-width: 1024px) { .student-jobs-page { padding: 2.5rem 0.5rem 1.5rem; } }
        @media (max-width: 768px) {
          .student-jobs-page { padding: 1.2rem 0.2rem 1rem; }
          .jobs-header-avatar { width: 70px; height: 70px; font-size: 2.1rem; }
          .section-title { font-size: 1.2rem; }
          .job-card { padding: 1rem 0.7rem; }
          .action-btn { padding: 0.6rem 1rem; font-size: 0.92rem; min-width: 100px; }
        }
        @media (max-width: 576px) {
          .student-jobs-page { padding: 0.7rem 0.1rem 0.5rem; }
          .jobs-header-avatar { width: 48px; height: 48px; font-size: 1.2rem; }
          .section-title { font-size: 1rem; }
          .job-card { padding: 0.5rem 0.2rem; }
          .action-btn { padding: 0.45rem 0.7rem; font-size: 0.85rem; min-width: 70px; }
        }
      `}</style>

      <div className="student-jobs-page container">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-4">
          <div className="d-flex align-items-center gap-4">
            <div className="jobs-header-avatar">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div>
              <h1 className="section-title mb-1">
                {showAll ? "All Jobs for Your Department" : "Active Jobs for Your Department"}
              </h1>
              <p className="text-muted mb-0 fs-5">
                {showAll 
                  ? "All jobs ever posted visible to your department" 
                  : "Currently active opportunities matching your department"}
              </p>
            </div>
          </div>

          <div className="d-flex gap-3 flex-wrap align-items-center">
            <button
              className={`btn toggle-btn ${!showAll ? 'active' : ''}`}
              onClick={() => setShowAll(false)}
            >
              Active Jobs
            </button>
            <button
              className={`btn toggle-btn ${showAll ? 'active' : ''}`}
              onClick={() => setShowAll(true)}
            >
              All Jobs
            </button>

            <div className="search-container" style={{ minWidth: '280px' }}>
              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Search by title, company, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="no-jobs mx-auto" style={{ maxWidth: '700px' }}>
            {searchQuery 
              ? 'No matching jobs found. Try different keywords.' 
              : showAll 
                ? 'No jobs have ever been posted for your department yet.' 
                : 'No active job openings right now. Check back soon!'}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredJobs.map((job) => (
              <div className="col" key={job.id}>
                <div className="job-card p-4">
                  <h3 className="job-title">{job.title || 'Untitled Position'}</h3>
                  <div className="company-name mb-2">{job.company || 'Company not specified'}</div>

                  <div className="job-meta d-flex flex-wrap gap-3 mb-3">
                    <span>{job.job_location || 'Location not specified'}</span>
                    <span>•</span>
                    <span>{job.job_type || 'Full-time'}</span>
                  </div>

                  <div className="job-details mb-3">
                    {job.salary_range && <p className="mb-1"><strong>Salary:</strong> {job.salary_range}</p>}
                    {job.last_date_to_apply && (
                      <p className={`mb-1 ${new Date(job.last_date_to_apply) < new Date() ? 'text-danger' : ''}`}>
                        <strong>Apply by:</strong> {job.last_date_to_apply}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    {Array.isArray(job.skills) && job.skills.length > 0 ? (
                      <>
                        <h6 className="fw-semibold mb-2" style={{ color: '#000000' }}>
                          Required Skills:
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className="skills-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <small className="text-muted fst-italic">
                        No specific skills listed
                      </small>
                    )}
                  </div>

                  <p className="job-description mb-4">
                    {job.description || 'No description available.'}
                  </p>

                  <div className="job-actions mt-auto d-flex flex-column gap-3">
                    <button
                      className="action-btn action-btn-outline"
                      onClick={() => handleViewCompanyWebsite(job.company_email)}
                      disabled={!job.company_email}
                    >
                      <i className="bi bi-box-arrow-up-right me-2"></i>
                      View Company Website
                    </button>

                    <button
                      className="action-btn action-btn-primary"
                      onClick={() => handleApplyClick(job.id)}
                    >
                      <i className="bi bi-send-fill me-2"></i>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}