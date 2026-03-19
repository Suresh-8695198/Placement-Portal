


// src/pages/coordinator/SelectedStudentsReport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function SelectedStudentsReport() {
  const navigate = useNavigate();

  const coordinatorName = localStorage.getItem("coordinatorUsername") || "Coordinator";
  const department = localStorage.getItem("coordinatorDepartment") || "";

  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);

  const [report, setReport] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [studentSearchTerm, setStudentSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CHECK LOGIN + FETCH PROGRAMMES
  useEffect(() => {
    if (!localStorage.getItem("coordinatorUsername")) {
      navigate("/coordinator/login");
      return;
    }
    fetchProgrammes();
  }, [navigate]);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const encodedDept = encodeURIComponent(department);
      const res = await axios.get(
        `${API_BASE}/coordinator/programmes/?department=${encodedDept}`
      );
      setProgrammes(res.data.programmes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch programmes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (programme) => {
    try {
      setLoading(true);
      setError("");

      const encodedDept = encodeURIComponent(department);
      const encodedProgramme = encodeURIComponent(programme);

      const res = await axios.get(
        `${API_BASE}/coordinator/selected-students-report/?department=${encodedDept}&programme=${encodedProgramme}`
      );

      const data = res.data.selected_students || [];

      const normalizedData = data.map((item) => ({
        ...item,
        passed_out_year: Number(item.passed_out_year),
      }));

      setReport(normalizedData);

      const uniqueBatches = [...new Set(normalizedData.map((item) => item.passed_out_year))]
        .filter(Boolean)
        .sort((a, b) => b - a);

      setBatches(uniqueBatches);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch selected students report.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered students
  const filteredStudents = report
    .filter((item) =>
      selectedBatch ? Number(item.passed_out_year) === Number(selectedBatch) : true
    )
    .filter((item) => {
      if (!studentSearchTerm.trim()) return true;
      const term = studentSearchTerm.toLowerCase();
      return (
        (item.university_reg_no || "").toLowerCase().includes(term) ||
        (item.student_name || "").toLowerCase().includes(term) ||
        (item.student_email || "").toLowerCase().includes(term) ||
        (item.company || "").toLowerCase().includes(term) ||
        (item.job_title || "").toLowerCase().includes(term)
      );
    });

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
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        h2.section-title, h3.section-title {
          color: var(--primary-dark);
          font-weight: 700;
          margin: 2rem 0 1.8rem;
          text-shadow: 0 1px 4px rgba(109,40,217,0.12);
        }

        h2.section-title { font-size: 2.2rem; }
        h3.section-title { font-size: 1.8rem; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.8rem;
          margin-bottom: 2.5rem;
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

        .card h4 {
          font-size: 1.7rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin: 0;
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

        .search-input {
          width: 100%;
          max-width: 420px;
          padding: 0.9rem 1.4rem;
          margin: 1.5rem 0 2rem;
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

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 1rem;
          border-radius: 1.3rem;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(109,40,217,0.18);
        }

        th {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          padding: 1.3rem 1.6rem;
          font-weight: 600;
          text-align: left;
          font-size: 1.05rem;
        }

        td {
          padding: 1.25rem 1.6rem;
          background: white;
          border-bottom: 1px solid #f3e8ff;
        }

        tr:hover td {
          background: #f8f5ff;
        }

        .empty-message, .loading-text {
          text-align: center;
          padding: 5rem 1rem;
          color: #6b7280;
          font-size: 1.35rem;
          font-weight: 500;
        }

        .loading-text {
          color: var(--primary);
        }

        .error-message {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .welcome-title { font-size: 2.3rem; }
          .glass-card { padding: 1.8rem; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <h1 className="welcome-title">Welcome, {coordinatorName}</h1>
          <div className="dept-badge">{department} Department</div>
        </div>

        <div className="glass-card">
          {loading && <div className="loading-text">Loading data...</div>}
          {error && <div className="error-message">{error}</div>}

          {/* STEP 1 - Select Programme */}
          {!selectedProgramme && !loading && (
            <>
              <h2 className="section-title">Select Programme</h2>
              <div className="grid">
                {programmes.map((prog) => (
                  <div
                    key={prog}
                    className="card"
                    onClick={() => {
                      setSelectedProgramme(prog);
                      fetchReport(prog);
                    }}
                  >
                    <h4>{prog.replace(/_/g, " ")}</h4>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 2 - Select Batch */}
          {selectedProgramme && !selectedBatch && (
            <>
              <button
                className="back-btn"
                onClick={() => {
                  setSelectedProgramme(null);
                  setReport([]);
                  setBatches([]);
                }}
              >
                ← Back to Programmes
              </button>

              <h2 className="section-title">
                Select Batch — {selectedProgramme.replace(/_/g, " ")}
              </h2>

              {batches.length === 0 ? (
                <div className="empty-message">No batches found with selected students.</div>
              ) : (
                <div className="grid">
                  {batches.map((year) => (
                    <div
                      key={year}
                      className="card"
                      onClick={() => setSelectedBatch(year)}
                    >
                      <h4>{year}</h4>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 3 - Students Table */}
          {selectedBatch && (
            <>
              <button
                className="back-btn"
                onClick={() => {
                  setSelectedBatch(null);
                  setStudentSearchTerm("");
                }}
              >
                ← Back to Batches
              </button>

              <h2 className="section-title">
                Selected Students — {selectedProgramme.replace(/_/g, " ")} • Batch {selectedBatch}
              </h2>

              <input
                type="text"
                placeholder="Search by reg no, name, email, company or job title..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="search-input"
              />

              {filteredStudents.length === 0 ? (
                <div className="empty-message">
                  No matching students found.
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Reg No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Selected At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((item, index) => (
                      <tr key={index}>
                        <td>{item.university_reg_no || "—"}</td>
                        <td>{item.student_name || "—"}</td>
                        <td>{item.student_email || "—"}</td>
                        <td>{item.company || "—"}</td>
                        <td>{item.job_title || "—"}</td>
                        <td>{item.selected_at || "—"}</td>
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