
// src/pages/coordinator/CoordinatorJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function CoordinatorJobs() {
  const navigate = useNavigate();

  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);

  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [searchJob, setSearchJob] = useState("");
  const [jobType, setJobType] = useState("active");

  const [loading, setLoading] = useState(true);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [error, setError] = useState("");

  const coordinatorName =
    localStorage.getItem("coordinatorUsername") || "Coordinator";
  const department = localStorage.getItem("coordinatorDepartment") || "";

  useEffect(() => {
    if (!department) {
      navigate("/coordinator/login");
      return;
    }
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/coordinator/programmes/`, {
        params: { department },
      });
      setProgrammes(res.data.programmes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load programmes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProgramme) {
      fetchAvailableGraduationYears();
    }
  }, [selectedProgramme]);

  const fetchAvailableGraduationYears = async () => {
    try {
      setYearsLoading(true);
      setError("");
      setAvailableYears([]);
      setJobs([]);

      const yearsRes = await axios.get(`${API_BASE}/api/students/years/`, {
        params: {
          department,
          programme: selectedProgramme,
        },
      });

      let years = yearsRes.data.years || [];
      years = years.sort((a, b) => b - a);

      if (years.length === 0) {
        setAvailableYears([]);
        return;
      }

      const yearJobChecks = years.map(async (year) => {
        try {
          const jobsRes = await axios.get(`${API_BASE}/companies/jobs/`, {
            params: {
              department,
              programme: selectedProgramme,
              graduation_year: year,
              status: "all",
            },
          });

          return (jobsRes.data.jobs || []).length > 0 ? year : null;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(yearJobChecks);
      const yearsWithJobs = results.filter((y) => y !== null);

      setAvailableYears(yearsWithJobs);
    } catch (err) {
      console.error(err);
      setError("Failed to load available batches.");
    } finally {
      setYearsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear !== null) {
      fetchJobs();
    }
  }, [selectedYear, jobType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      let endpoint = `${API_BASE}/companies/jobs/`;
      const params = {
        department,
        programme: selectedProgramme,
        graduation_year: selectedYear,
      };

      if (jobType === "active") {
        endpoint = `${API_BASE}/companies/jobs/active/`;
        params.status = "active";
      } else {
        params.status = "all";
      }

      const res = await axios.get(endpoint, {
        params,
      });

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (job.title || "").toLowerCase().includes(searchJob.toLowerCase()) ||
      (job.company || "").toLowerCase().includes(searchJob.toLowerCase()) ||
      (job.job_location || "").toLowerCase().includes(searchJob.toLowerCase())
  );

  const handleViewApplicants = (job) => {
    const companyEmail =
      job?.company_email ||
      job?.companyEmail ||
      job?.company?.email ||
      "";

    const query = new URLSearchParams({
      department,
      programme: selectedProgramme || "",
      year: selectedYear !== null ? String(selectedYear) : "",
      job_id: job?.id ? String(job.id) : "",
      email: companyEmail,
      job_title: job?.title || "",
    });

    navigate(`/coordinator/applied-students?${query.toString()}`, {
      state: {
        jobId: job?.id || null,
        companyEmail,
        jobTitle: job?.title || "",
        department,
        programme: selectedProgramme || "",
        year: selectedYear || "",
      },
    });
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #7c3aed;
          --primary-dark: #6d28d9;
          --primary-light: #a78bfa;
          --accent: #c084fc;
          --glass-bg: rgba(255, 255, 255, 0.975);
          --shadow-sm: 0 6px 22px rgba(0,0,0,0.1);
          --shadow-md: 0 14px 40px rgba(124,58,237,0.32);
        }

        body {
          background: linear-gradient(135deg, #4c1d95, #6d28d9, #8b5cf6);
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          margin: 0;
          color: #1f2937;
        }

        .page-wrapper {
          padding: 2.5rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 3.2rem;
        }

        .welcome-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: #7f40ed;
          text-shadow: 0 4px 14px rgba(109,40,217,0.5);
          margin-bottom: 0.6rem;
          letter-spacing: -0.4px;
        }

        .dept-badge {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 0.7rem 1.8rem;
          border-radius: 999px;
          font-weight: 600;
          font-size: 1.1rem;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        .glass-card {
          background: var(--glass-bg);
          border-radius: 1.6rem;
          padding: 2.8rem;
          box-shadow: 0 22px 70px rgba(109,40,217,0.25);
        }

        h2.section-title {
          color: var(--primary-dark);
          font-size: 2.2rem;
          font-weight: 700;
          margin: 2rem 0 1.8rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.8rem;
        }

        .card {
          background: white;
          border-radius: 1.3rem;
          padding: 2.4rem 1.6rem;
          cursor: pointer;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.32s ease;
          border-left: 6px solid var(--primary-light);
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-md);
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 1.5rem;
        }

        th {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 1.3rem 1.6rem;
        }

        td {
          padding: 1.25rem 1.6rem;
          background: white;
          border-bottom: 1px solid #f3e8ff;
        }

        .back-btn {
          margin: 1rem 0 2.2rem;
          padding: 0.85rem 2.2rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border: none;
          border-radius: 999px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 14px rgba(124,58,237,0.3);
        }

        .back-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.45);
        }

        .toggle-container {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        }

        .toggle-btn {
          padding: 0.8rem 1.8rem;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          border: 2px solid var(--primary);
          background: white;
          color: var(--primary-dark);
          font-size: 1rem;
        }

        .toggle-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 14px rgba(124,58,237,0.3);
        }

        .toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(124,58,237,0.25);
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 0.9rem 1.3rem;
          margin: 1.5rem 0;
          border: 2px solid #e5e7eb;
          border-radius: 999px;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }

        .empty-message {
          text-align: center;
          padding: 4rem 1rem;
          color: #6b7280;
          font-size: 1.35rem;
          font-weight: 500;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <h1 className="welcome-title">Welcome, {coordinatorName}</h1>
          <div className="dept-badge">{department} Department</div>
        </div>

        <div className="glass-card">

          {!selectedProgramme && !loading && (
            <>
              <h2 className="section-title">Select Programme</h2>
              <div className="grid">
                {programmes.map((prog) => (
                  <div
                    key={prog}
                    className="card"
                    onClick={() => setSelectedProgramme(prog)}
                  >
                    <h3>{prog.replace(/_/g, " ")}</h3>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedProgramme && !selectedYear && (
            <>
              <button className="back-btn" onClick={() => setSelectedProgramme(null)}>
                ← Back to Programmes
              </button>

              <h2 className="section-title">Select Graduation Year</h2>

              {yearsLoading ? (
                <div>Checking available batches...</div>
              ) : (
                <div className="grid">
                  {availableYears.map((year) => (
                    <div
                      key={year}
                      className="card"
                      onClick={() => setSelectedYear(year)}
                    >
                      <h3>{year}</h3>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedProgramme && selectedYear && (
            <>
              <button className="back-btn" onClick={() => setSelectedYear(null)}>
                ← Back to Years
              </button>

              <h2 className="section-title">
                {jobType === "active" ? "Active " : ""}Jobs for{" "}
                {selectedProgramme.replace(/_/g, " ")} — {selectedYear}
              </h2>

              <div className="toggle-container">
                <button 
                  className={`toggle-btn ${jobType === "active" ? "active" : ""}`}
                  onClick={() => setJobType("active")}
                >
                  Active Jobs
                </button>
                <button 
                  className={`toggle-btn ${jobType === "all" ? "active" : ""}`}
                  onClick={() => setJobType("all")}
                >
                  All Jobs
                </button>
              </div>

              <input
                className="search-input"
                type="text"
                placeholder="Search jobs..."
                value={searchJob}
                onChange={(e) => setSearchJob(e.target.value)}
              />

              {filteredJobs.length === 0 ? (
                <div className="empty-message">
                  {jobType === "active" 
                    ? "No active jobs found for this batch." 
                    : "No jobs found for this batch."}
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Last Date</th>
                      <th>Applicants</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>{job.company}</td>
                        <td>{job.job_location}</td>
                        <td>{job.salary_range}</td>
                        <td>{job.last_date_to_apply}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleViewApplicants(job)}
                          >
                            View Applicants
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </>
          )}
        </div>
      </div>
    </>
  );
}

