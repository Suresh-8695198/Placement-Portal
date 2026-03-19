import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminPageLayout from "../../components/admin/AdminPageLayout";

const API_BASE = "http://127.0.0.1:8000";

export default function AdminJobApplicants() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId, companyEmail, jobTitle } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId || !companyEmail) {
      setError("Missing job or company information");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${API_BASE}/companies/applications/?email=${companyEmail}&job_id=${jobId}`, {
        withCredentials: true, // ← added – usually needed in your other admin requests
      })
      .then((res) => {
        setStudents(res.data.applications || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load applicants");
      })
      .finally(() => setLoading(false));
  }, [jobId, companyEmail]);

  const handleDownloadExcel = () => {
    if (!jobId || !companyEmail) return;
    window.open(
      `${API_BASE}/companies/download-excel/?email=${companyEmail}&job_id=${jobId}`,
      "_blank"
    );
  };

  return (
    <AdminPageLayout title={jobTitle ? `${jobTitle} - Applicants` : "Job Applicants"}>
      <style>{`
        :root {
          --gradient: linear-gradient(135deg, #ec4899, #f97316, #a78bfa);
          --primary: #4B0082;
          --primary-light: #6A0DAD;
          --success: #10b981;
          --success-light: #34d399;
          --bg-light: #f9fafb;
          --card-bg: #ffffff;
          --text-dark: #111827;
          --text-muted: #6b7280;
          --border: #e5e7eb;
          --shadow-sm: 0 4px 14px rgba(0,0,0,0.06);
          --shadow-md: 0 10px 28px rgba(0,0,0,0.11);
        }

        .applicants-wrapper {
          padding: 2rem 1.5rem 4rem;
          background: var(--bg-light);
          min-height: 100vh;
        }

        .back-btn {
          margin-bottom: 1.6rem;
          padding: 0.7rem 1.5rem;
          border: none;
          border-radius: 9999px;
          background: #6366f1;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }

        .back-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .error-message {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #ef4444, #f87171);
          color: white;
          border-radius: 1rem;
          text-align: center;
          font-weight: 600;
          max-width: 600px;
          margin: 0 auto 1.5rem;
        }

        .loading-text,
        .empty-state {
          text-align: center;
          padding: 6rem 1.5rem;
          color: var(--text-muted);
          font-size: 1.25rem;
          font-style: italic;
        }

        .download-btn {
          padding: 0.75rem 1.8rem;
          background: linear-gradient(135deg, var(--success), var(--success-light));
          color: white;
          border: none;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 1.02rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 14px rgba(16,185,129,0.25);
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(16,185,129,0.35);
        }

        .download-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 1.2rem;
          box-shadow: var(--shadow-md);
          background: var(--card-bg);
          border: 1px solid var(--border);
        }

        .applicants-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .applicants-table th,
        .applicants-table td {
          padding: 1.1rem 1.4rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .applicants-table th {
          background: var(--gradient);
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.92rem;
          letter-spacing: 0.4px;
        }

        .applicants-table tr:hover {
          background: rgba(167,139,250,0.04);
        }

        .student-name {
          font-weight: 600;
          color: var(--text-dark);
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .applicants-table thead {
            display: none;
          }

          .applicants-table tr {
            display: block;
            margin-bottom: 1.4rem;
            background: white;
            border-radius: 1rem;
            box-shadow: var(--shadow-sm);
            padding: 1.2rem;
          }

          .applicants-table td {
            display: flex;
            justify-content: space-between;
            border: none;
            padding: 0.7rem 0;
            font-size: 0.98rem;
          }

          .applicants-table td:before {
            content: attr(data-label);
            font-weight: 700;
            color: var(--text-dark);
            text-transform: uppercase;
            min-width: 110px;
          }
        }
      `}</style>

      <div className="applicants-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="header-container">
          <h2 className="page-title">{jobTitle ? `${jobTitle} - Applicants` : "Job Applicants"}</h2>

          {students.length > 0 && !loading && !error && (
            <button className="download-btn" onClick={handleDownloadExcel}>
              Download Excel
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-text">Loading applicants...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            No applications found for this job yet.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Year</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr key={index}>
                    <td data-label="Name" className="student-name">
                      {s.student?.name || "—"}
                    </td>
                    <td data-label="Email">{s.student?.email || "—"}</td>
                    <td data-label="Department">{s.student?.department || "—"}</td>
                    <td data-label="Phone">{s.student?.phone || "—"}</td>
                    <td data-label="Year">{s.student?.year || "—"}</td>
                    <td data-label="CGPA">{s.student?.cgpa || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}