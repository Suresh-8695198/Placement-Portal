import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AdminPageLayout from "../../components/admin/AdminPageLayout";

const API_BASE = "http://127.0.0.1:8000"; // adjust if needed

export default function AdminCompanyJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyEmail = location.state?.email;

  const [companyName, setCompanyName] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!companyEmail) {
      setError("No company email provided");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}/companies/jobs/by-company/?email=${companyEmail}`, {
        withCredentials: true,
      })
      .then((res) => {
        setCompanyName(res.data.company_name || "Company Jobs");
        setJobs(res.data.jobs || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load jobs");
      })
      .finally(() => setLoading(false));
  }, [companyEmail]);

  // Filter jobs by title, type, or department
  const filteredJobs = jobs.filter(
    (job) => {
      const q = search.toLowerCase();
      return (
        job.title?.toLowerCase().includes(q) ||
        job.job_type?.toLowerCase().includes(q) ||
        (Array.isArray(job.departments) && job.departments.join(", ").toLowerCase().includes(q))
      );
    }
  );

  return (
    <AdminPageLayout title={`Jobs by ${companyName}`}>
      <style>{`
        .admin-companies-wrapper {
          min-height: 100vh;
          padding: 2rem 2rem 4rem;
          background: #f9fafb;
          color: #111827;
        }

        .top-bar {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 2.5rem;
        }

        .create-btn {
          padding: 0.75rem 1.8rem;
          font-size: 1.02rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.2);
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(59, 130, 246, 0.3);
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          max-width: 420px;
          padding: 0.8rem 1.2rem;
          font-size: 1.05rem;
          border: 1.5px solid #d1d5db;
          border-radius: 9999px;
          outline: none;
          transition: border 0.2s;
          box-shadow: 0 2px 8px rgba(59,130,246,0.06);
        }
        .search-input:focus {
          border-color: #3b82f6;
        }

        /* Using same gradient title style as AdminCompanies */
        .page-title {
          font-size: 2.1rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2.5rem;
          background: linear-gradient(90deg, #ec4899, #f97316, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .message {
          padding: 1rem 1.6rem;
          border-radius: 1rem;
          font-weight: 500;
          font-size: 1.05rem;
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .message.error {
          background: rgba(239, 68, 68, 0.08);
          color: #991b1b;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
        }

        .company-card {
          background: #ffffff;
          border-radius: 1.25rem;
          padding: 2rem 1.8rem;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(229, 231, 235, 0.6);
          border-left: 6px solid transparent;
          position: relative;
          overflow: hidden;
          transition: all 0.32s ease;
          cursor: pointer;
        }

        .company-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #ec4899, #f97316, #a78bfa);
        }

        .company-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(236, 72, 153, 0.14);
        }

        .company-card h3 {
          font-size: 1.45rem;
          font-weight: 700;
          margin-bottom: 1.15rem;
          color: #1e293b;
        }

        .company-card p {
          font-size: 1.03rem;
          color: #4b5563;
          margin: 0.65rem 0;
          line-height: 1.55;
        }

        .company-card p b {
          color: #1e293b;
          font-weight: 600;
        }

        .empty-state,
        .loading-text {
          text-align: center;
          padding: 7rem 1.5rem;
          color: #6b7280;
          font-size: 1.25rem;
          font-style: italic;
          background: rgba(249, 250, 251, 0.7);
          border-radius: 1rem;
          max-width: 700px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .admin-companies-wrapper {
            padding: 1.5rem 1rem 4rem;
          }

          .top-bar {
            justify-content: center;
          }

          .companies-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 1.85rem;
          }
        }
      `}</style>

      <div className="admin-companies-wrapper">
        <div className="top-bar">
          <button
            className="create-btn"
            onClick={() => navigate("/admin/companies")}
          >
            ← Back to Companies
          </button>
        </div>

        <div className="content-container">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search by title, type, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search jobs"
            />
          </div>

          {error && <div className="message error">{error}</div>}

          {loading ? (
            <div className="loading-text">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">No jobs posted by this company yet.</div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">No jobs match your search.</div>
          ) : (
            <div className="companies-grid">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="company-card"
                  onClick={() =>
                    navigate("/admin/job-applicants", {
                      state: {
                        jobId: job.id,
                        companyEmail: companyEmail,
                        jobTitle: job.title,
                      },
                    })
                  }
                >
                  <h3>{job.title}</h3>
                  <p>
                    <b>Type:</b> {job.job_type || "—"}
                  </p>
                  <p>
                    <b>Department:</b>{" "}
                    {job.departments?.join(", ") || "All"}
                  </p>
                  <p>
                    <b>Deadline:</b>{" "}
                    {job.last_date_to_apply
                      ? new Date(job.last_date_to_apply).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}