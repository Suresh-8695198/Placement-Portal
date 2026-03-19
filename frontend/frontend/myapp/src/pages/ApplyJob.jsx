
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const studentEmail = localStorage.getItem('studentEmail');

  useEffect(() => {
    if (!studentEmail) {
      navigate('/login');
      return;
    }

    checkIfApplied();
    fetchJobDetails();
  }, [jobId, navigate]);

  const checkIfApplied = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/students/applications/my/?email=${studentEmail}`
      );
      const applied = res.data.applications.some(
        (app) => app.job_id === Number(jobId)
      );
      setAlreadyApplied(applied);
    } catch (err) {
      console.error('Failed to check application status:', err);
    }
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE}/companies/jobs/active/`);
      const found = res.data.jobs?.find((j) => j.id === Number(jobId));

      if (!found) {
        setError('This job is no longer available or does not exist.');
      } else {
        setJob(found);
      }
    } catch (err) {
      console.error('Job fetch error:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyApplied) {
      alert('You have already applied to this job!');
      return;
    }

    if (!window.confirm('Are you sure you want to submit your application?')) {
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`${API_BASE}/api/students/jobs/apply/`, {
        email: studentEmail,
        job_id: jobId,
        cover_letter: coverLetter.trim(),
      });

      alert('Application submitted successfully!');
      navigate('/dashboard/status');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application.';
      alert(msg);
      console.error('Application error:', err);
    } finally {
      setSubmitting(false);
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
      <div className="text-center py-5 text-danger fs-4 fw-medium">
        {error}
      </div>
    );
  }

  if (!job) return null;

  return (
    <>
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

        .apply-page-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1rem;
          background: #ffffff;
          color: var(--text);
          min-height: 100vh;
          box-sizing: border-box;
        }

        .apply-header {
          display: flex;
          align-items: center;
          gap: 1.4rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .apply-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 2.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(75,0,130,0.25);
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

        .back-action-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.7rem 1.5rem;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(75,0,130,0.25);
          margin-bottom: 2rem;
        }

        .back-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(75,0,130,0.4);
        }

        .back-action-btn::before {
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

        .apply-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          padding: 2rem;
        }

        .job-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.8rem;
          margin-bottom: 2rem;
        }

        .meta-block h3 {
          font-size: 1.28rem;
          font-weight: 700;
          color: var(--violet-text);
          margin-bottom: 0.9rem;
        }

        .meta-block p {
          margin: 0.5rem 0;
          color: var(--text-light);
        }

        .meta-block strong {
          color: var(--text);
        }

        .job-description {
          line-height: 1.65;
          color: var(--text);
          margin-bottom: 2.2rem;
        }

        .already-applied-box {
          background: var(--light-violet-bg);
          border: 1px solid var(--light-violet-border);
          border-radius: 16px;
          padding: 2.5rem 1.8rem;
          text-align: center;
        }

        .already-applied-box h3 {
          color: var(--light-violet-text);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        textarea.form-textarea {
          width: 100%;
          padding: 1rem 1.4rem;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          background: white;
          font-size: 1.02rem;
          color: var(--text);
          resize: vertical;
          min-height: 180px;
          transition: all 0.25s ease;
        }

        textarea.form-textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(75,0,130,0.15);
          outline: none;
        }

        .action-btn {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          padding: 0.8rem 2rem;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
          text-align: center;
        }

        .action-btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
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

        .action-btn-view {
          background: var(--light-violet-bg);
          color: var(--light-violet-text);
          border: 1px solid var(--light-violet-border);
        }

        .action-btn-view:hover {
          background: rgba(139, 92, 246, 0.25);
          transform: translateY(-1px);
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .apply-page-content {
            padding: 1.2rem 0.5rem;
          }
          .apply-card {
            padding: 1.2rem 0.7rem;
          }
        }
        @media (max-width: 768px) {
          .apply-page-content {
            padding: 1rem 0.2rem;
            min-height: unset;
          }
          .job-meta-grid {
            grid-template-columns: 1fr;
            gap: 1.1rem;
          }
          .apply-avatar {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
          .apply-card {
            padding: 1rem 0.5rem;
          }
          .action-btn {
            padding: 0.6rem 1.1rem;
            font-size: 0.95rem;
            min-width: 100px;
          }
        }
        @media (max-width: 480px) {
          .apply-page-content {
            padding: 0.5rem 0.1rem;
          }
          .apply-avatar {
            width: 38px;
            height: 38px;
            font-size: 0.9rem;
          }
          .section-title {
            font-size: 1.1rem;
          }
          .apply-card {
            padding: 0.5rem 0.1rem;
          }
          .action-btn {
            padding: 0.45rem 0.7rem;
            font-size: 0.85rem;
            min-width: 70px;
          }
        }
      `}</style>

      <div className="apply-page-content">
        <button 
          className="action-btn action-btn-primary back-action-btn" 
          onClick={() => navigate(-1)}
        >
          ← Back to Jobs
        </button>

        <div className="apply-header">
          <div className="apply-avatar">
            <i className="fas fa-paper-plane"></i>
          </div>
          <div>
            <h1 className="section-title">Apply for {job.title}</h1>
            <p style={{ color: "var(--text-light)", marginTop: "0.4rem", fontSize: "1.05rem" }}>
              Submit your application with confidence
            </p>
          </div>
        </div>

        <div className="apply-card">
          <div className="job-meta-grid">
            <div className="meta-block">
              <h3>Company</h3>
              <p style={{ fontSize: "1.18rem", fontWeight: 600, color: "var(--violet-text)" }}>
                {job.company}
              </p>
              <p>{job.company_location || 'Not specified'}</p>
            </div>

            <div className="meta-block">
              <h3>Job Details</h3>
              <p><strong>Location:</strong> {job.job_location || 'Not specified'}</p>
              <p><strong>Type:</strong> {job.job_type || 'Full-time'}</p>
              <p><strong>Salary:</strong> {job.salary_range || 'Not disclosed'}</p>
              {job.last_date_to_apply && (
                <p style={{ color: "#dc2626" }}>
                  <strong>Apply by:</strong> {job.last_date_to_apply}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 style={{ fontSize: "1.32rem", fontWeight: 700, color: "var(--violet-text)", marginBottom: "1rem" }}>
              Job Description
            </h3>
            <div className="job-description">
              {job.description?.split('\n').map((line, i) => (
                <p key={i} className="mb-3">{line}</p>
              )) || 'No description available.'}
            </div>
          </div>

          {alreadyApplied ? (
            <div className="already-applied-box">
              <h3>You have already applied!</h3>
              <p style={{ marginBottom: "1.5rem", color: "var(--text-light)" }}>
                Your application is under review. Check status anytime in "My Applications".
              </p>
              <button
                className="action-btn action-btn-view"
                onClick={() => navigate('/dashboard/status')}
              >
                View My Applications
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-lg font-medium mb-3"
                  style={{ color: "var(--text)" }}
                >
                  Cover Letter (optional but recommended)
                </label>
                <textarea
                  className="form-textarea"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={10}
                  placeholder="Tell us why you're excited about this role, your relevant skills, experience, or what makes you a strong fit..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="action-btn action-btn-primary w-100"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}









