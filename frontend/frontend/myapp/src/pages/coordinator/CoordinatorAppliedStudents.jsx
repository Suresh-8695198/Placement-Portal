// src/pages/coordinator/CoordinatorAppliedStudents.jsx
import React, { useEffect, useState } from "react";
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

  const coordinatorName = localStorage.getItem("coordinatorUsername") || "Coordinator";

  // Fetch applicants for this job
  useEffect(() => {
    if (!jobId) {
      setError("Job ID is missing for this job.");
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

  // Download CSV for this job
  const downloadCSV = () => {
    if (!jobId) return;
    window.open(`${API_BASE}/coordinator/download-applications/?job_id=${jobId}`, "_blank");
  };

  return (
    <>
      <style>{`
        :root{--primary:#7c3aed;--primary-dark:#6d28d9;--primary-light:#a78bfa;--accent:#c084fc;--glass-bg:rgba(255,255,255,0.975);}
        body{background:linear-gradient(135deg,#4c1d95,#6d28d9,#8b5cf6);min-height:100vh;margin:0;font-family:'Segoe UI',sans-serif;color:#1f2937;}
        .page-wrapper{padding:2.5rem 1.5rem;max-width:1400px;margin:0 auto;}
        .header{text-align:center;margin-bottom:2.5rem;}
        .welcome-title{font-size:2.6rem;font-weight:800;color:#7f40ed;margin-bottom:0.5rem;}
        .dept-badge{background:linear-gradient(135deg,var(--primary),var(--accent));color:white;padding:0.7rem 1.8rem;border-radius:999px;font-weight:600;}
        .glass-card{background:var(--glass-bg);border-radius:1.6rem;padding:2.5rem;box-shadow:0 22px 70px rgba(109,40,217,0.25);}
        h2.section-title{color:var(--primary-dark);font-size:2.1rem;font-weight:700;margin:1.8rem 0;}
        .back-btn, .download-btn{padding:0.85rem 2.2rem;margin-right:1rem;background:linear-gradient(135deg,var(--primary),var(--primary-light));border:none;border-radius:999px;color:white;font-weight:600;font-size:1.1rem;cursor:pointer;box-shadow:0 4px 14px rgba(124,58,237,0.3);}
        .back-btn:hover, .download-btn:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(124,58,237,0.45);}
        table{width:100%;border-collapse:collapse;margin-top:1.5rem;}
        th{background:linear-gradient(135deg,var(--primary),var(--accent));color:white;padding:1.2rem;text-align:left;}
        td{padding:1.2rem;border-bottom:1px solid #f3e8ff;background:white;}
        tr:hover td{background:#f9f5ff;}
        .empty-message{text-align:center;padding:5rem 1rem;color:#6b7280;font-size:1.4rem;}
        .error-message{color:#dc2626;text-align:center;padding:2rem;font-size:1.3rem;}
        .loading-text{color:var(--primary);text-align:center;padding:5rem;font-size:1.4rem;}
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <h1 className="welcome-title">Welcome, {coordinatorName}</h1>
          {programme && year && <div className="dept-badge">{programme.replace(/_/g, " ")} • {year}</div>}
        </div>

        <div className="glass-card">
          <button className="back-btn" onClick={() => navigate("/coordinator/jobs")}>← Back to Jobs</button>
          <button className="download-btn" onClick={downloadCSV}>Download CSV</button>

          <h2 className="section-title">
            Applied Students — {jobTitle || `${programme.replace(/_/g," ")} • ${year}`}
          </h2>

          {loading ? (
            <div className="loading-text">Loading student applications...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : applications.length === 0 ? (
            <div className="empty-message">No students have applied yet for this job.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Programme</th>
                  <th>Year</th>
                  <th>Phone</th>
                  <th>CGPA</th>
                  <th>Job Title</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Cover Letter</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.application_id}>
                    <td>{app.student?.name || "N/A"}</td>
                    <td>{app.student?.email || "N/A"}</td>
                    <td>{app.student?.department || "N/A"}</td>
                    <td>{app.student?.programme || "N/A"}</td>
                    <td>{app.student?.year || "N/A"}</td>
                    <td>{app.student?.phone || "N/A"}</td>
                    <td>{app.student?.cgpa || "N/A"}</td>
                    <td>{app.job?.title || "Untitled Job"}</td>
                    <td>{app.status || "Pending"}</td>
                    <td>{app.applied_at || "N/A"}</td>
                    <td>{app.cover_letter ? (app.cover_letter.length > 100 ? app.cover_letter.slice(0, 100) + "..." : app.cover_letter) : "No cover letter"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}