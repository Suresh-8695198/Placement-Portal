

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function StudentsList() {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const coordinatorUsername = localStorage.getItem("coordinatorUsername") || "";
  const coordinatorName =
    localStorage.getItem("coordinatorName") ||
    coordinatorUsername ||
    "Coordinator";

  useEffect(() => {
    if (!coordinatorUsername) {
      setError("Please login again.");
      return;
    }
    fetchInitialData();
  }, [coordinatorUsername]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/coordinator/by-coordinator/${coordinatorUsername}/`
      );
      setProgrammes(res.data.programmes || []);
      setBatches(res.data.batch_years || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleProgrammeClick = async (prog) => {
    setSelectedProgramme(prog);
    setSelectedBatch("");
    setStudents([]);

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/coordinator/by-coordinator/${coordinatorUsername}/`,
        { params: { programme: prog } }
      );
      setBatches(res.data.batch_years || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load batches.");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchClick = async (batch) => {
    setSelectedBatch(batch);

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/coordinator/by-coordinator/${coordinatorUsername}/`,
        {
          params: {
            programme: selectedProgramme,
            batch: batch,
          },
        }
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "4rem", color: "#fff", textAlign: "center" }}>
        <h2 style={{ color: "#e0bbff" }}>{error}</h2>
      </div>
    );
  }

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #4c1d95, #6d28d9, #8b5cf6);
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          margin: 0;
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
          font-size: 3rem;
          font-weight: 800;
          color: #7f40ed;                    /* darker violet */
          text-shadow: 0 4px 14px rgba(109,40,217,0.6);
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 1.45rem;
          font-weight: 500;
          color: #9c48f0;                    /* darker subtitle */
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.975);
          border-radius: 1.6rem;
          padding: 2.8rem;
          box-shadow: 0 22px 70px rgba(109,40,217,0.25);
          backdrop-filter: blur(12px);
        }

        h2.section-title {
          color: #6d28d9;
          font-size: 2.3rem;
          font-weight: 700;
          margin: 2.2rem 0 1.6rem;
          text-shadow: 0 1px 4px rgba(109,40,217,0.15);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.8rem;
          margin-bottom: 2.8rem;
        }

        .card {
          background: #ffffff;
          border-radius: 1.2rem;
          padding: 2.6rem 1.8rem;
          cursor: pointer;
          text-align: center;
          box-shadow: 0 6px 22px rgba(0,0,0,0.1);
          transition: all 0.32s ease;
          border-left: 6px solid #8b5cf6;
          border-right: 1px solid #e5e7eb;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 18px 45px rgba(139,92,246,0.32);
        }

        .card h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #6d28d9;
          margin: 0;
        }

        .card.active {
          background: linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd);
          color: white;
          border-left: 8px solid #d1b4ff;
          box-shadow: 0 14px 40px rgba(124,58,237,0.45);
        }

        .card.active h3 {
          color: white;
        }

        .back-btn {
          margin: 1.2rem 0 2.2rem;
          padding: 0.85rem 2.2rem;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border: none;
          border-radius: 999px;
          color: white;
          font-weight: 600;
          font-size: 1.12rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        .back-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.5);
        }

        .loading-text {
          text-align: center;
          color: #7c3aed;
          font-size: 1.4rem;
          padding: 5rem 0;
          font-weight: 500;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 1.8rem;
          border-radius: 1.2rem;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(109,40,217,0.18);
        }

        th {
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: white;
          padding: 1.3rem 1.8rem;
          font-weight: 600;
          text-align: left;
          font-size: 1.05rem;
        }

        td {
          padding: 1.2rem 1.8rem;
          background: white;
          border-bottom: 1px solid #f3e8ff;
        }

        tr:hover td {
          background: #f8f5ff;
        }

        .empty-message {
          text-align: center;
          padding: 5rem 1rem;
          color: #6b7280;
          font-size: 1.3rem;
          font-style: italic;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <h1 className="welcome-title">Welcome, {coordinatorName}</h1>
          <div className="subtitle">Student Management Dashboard</div>
        </div>

        <div className="glass-card">
          {loading && <div className="loading-text">Loading data...</div>}

          {/* PROGRAMMES */}
          {!selectedProgramme && (
            <>
              <h2 className="section-title">Select Programme</h2>
              <div className="grid">
                {programmes.map((prog) => (
                  <div
                    key={prog}
                    className={`card ${selectedProgramme === prog ? "active" : ""}`}
                    onClick={() => handleProgrammeClick(prog)}
                  >
                    <h3>{prog.replace(/_/g, " ").toUpperCase()}</h3>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* BATCHES */}
          {selectedProgramme && !selectedBatch && (
            <>
              <button
                className="back-btn"
                onClick={() => setSelectedProgramme("")}
              >
                ← Back to Programmes
              </button>

              <h2 className="section-title">Select Batch / Year</h2>
              <div className="grid">
                {batches.map((year) => (
                  <div
                    key={year}
                    className={`card ${selectedBatch === year ? "active" : ""}`}
                    onClick={() => handleBatchClick(year)}
                  >
                    <h3>{year}</h3>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STUDENTS TABLE */}
          {selectedProgramme && selectedBatch && (
            <>
              <button
                className="back-btn"
                onClick={() => setSelectedBatch("")}
              >
                ← Back to Batches
              </button>

              <h2 className="section-title">
                Students — {selectedProgramme.replace(/_/g, " ").toUpperCase()} ({selectedBatch})
              </h2>

              {students.length === 0 ? (
                <div className="empty-message">
                  No students found in this batch.
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Reg No</th>
                      <th>Name</th>
                      <th>UG/PG</th>
                      <th>Programme</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id || s.university_reg_no}>
                        <td>{s.university_reg_no}</td>
                        <td>{s.name}</td>
                        <td>{s.ug_pg}</td>
                        <td>{s.programme}</td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>{s.passed_out_year}</td>
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