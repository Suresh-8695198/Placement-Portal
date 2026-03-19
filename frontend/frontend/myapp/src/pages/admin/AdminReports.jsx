


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminPageLayout from "../../components/admin/AdminPageLayout";

const API_BASE = "http://localhost:8000";

export default function AdminReports() {
  const [groupedData, setGroupedData] = useState({});
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin-panel/reports/`)
      .then((res) => {
        console.log("API RESPONSE:", res.data);
        setGroupedData(res.data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Students when all levels are selected
  const studentsRaw =
    selectedDept && selectedProgramme && selectedBatch
      ? groupedData[selectedDept]?.[selectedProgramme]?.[selectedBatch] || []
      : [];

  const filteredStudents = studentSearch.trim()
    ? studentsRaw.filter((item) => {
        const term = studentSearch.toLowerCase();
        return (
          (item.university_reg_no || "").toLowerCase().includes(term) ||
          (item.student_name || "").toLowerCase().includes(term) ||
          (item.student_email || "").toLowerCase().includes(term) ||
          (item.company || "").toLowerCase().includes(term) ||
          (item.job_title || "").toLowerCase().includes(term)
        );
      })
    : studentsRaw;

  // Filtered departments
  const filteredDepts = Object.keys(groupedData).filter((dept) =>
    dept.toLowerCase().includes(search.toLowerCase())
  );

  // Programmes under selected department (show all, even empty)
  const programmesForDept = selectedDept ? Object.keys(groupedData[selectedDept] || {}) : [];
  const filteredProgrammes = programmesForDept.filter((prog) =>
    prog.toLowerCase().includes(search.toLowerCase())
  );

  // Batches under selected programme (only those with selected students)
  const batchesForProgramme =
    selectedDept && selectedProgramme
      ? Object.keys(groupedData[selectedDept]?.[selectedProgramme] || {})
      : [];

  const filteredBatches = batchesForProgramme
    .filter((batch) => {
      const studentsInBatch = groupedData[selectedDept]?.[selectedProgramme]?.[batch] || [];
      return studentsInBatch.length > 0;
    })
    .filter((batch) => batch.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminPageLayout title="Department Reports">
      <style>{`
        .page-wrapper {
          padding: 2.5rem 1.5rem;
          max-width: 1300px;
          margin: auto;
        }

        .glass-card {
          background: rgba(255,255,255,0.98);
          border-radius: 1.5rem;
          padding: 2.8rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }

        .search-wrapper {
          max-width: 520px;
          margin: 0 auto 2.2rem;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.95rem 3rem 0.95rem 1.4rem;
          border: 2px solid #e2e8f0;
          border-radius: 999px;
          font-size: 1.02rem;
          background: white;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 4px rgba(167,139,250,0.18);
          outline: none;
        }

        .clear-btn {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
        }

        .clear-btn:hover {
          color: #ef4444;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.8rem;
        }

        .card {
          background: #fff;
          border-radius: 1.2rem;
          padding: 2.2rem 1.6rem;
          cursor: pointer;
          position: relative;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 6px;
          background: linear-gradient(180deg, #ec4899, #f97316, #a78bfa);
          border-radius: 1.2rem 0 0 1.2rem;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(236,72,153,0.18);
        }

        .card h3 {
          font-size: 1.65rem;
          font-weight: 700;
          background: linear-gradient(90deg, #ec4899, #f97316, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .card .count {
          margin-top: 0.8rem;
          color: #4b5563;
          font-size: 0.98rem;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 1.5rem;
          background: #fff;
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(236,72,153,0.07);
          border: 1px solid #e5e7eb;
        }

        th {
          background: linear-gradient(135deg, #ec4899, #f97316, #a78bfa);
          color: white;
          padding: 1.2rem 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.98rem;
        }

        td {
          padding: 1.15rem 1.5rem;
          border-bottom: 1px solid #eee;
          text-align: center;
        }

        tr:hover {
          background: rgba(167,139,250,0.06);
        }

        .back-btn {
          margin-bottom: 1.8rem;
          padding: 0.7rem 1.8rem;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          border: none;
          border-radius: 999px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.05rem;
          box-shadow: 0 4px 14px rgba(59,130,246,0.15);
          transition: all 0.3s;
        }

        .back-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(59,130,246,0.22);
        }

        h2 {
          text-align: center;
          margin: 0 0 2.2rem;
          font-size: 2.1rem;
          background: linear-gradient(90deg, #ec4899, #f97316, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .empty-text {
          text-align: center;
          color: #6b7280;
          font-size: 1.15rem;
          padding: 3rem 1rem;
          font-style: italic;
        }
      `}</style>

      <div className="page-wrapper">
        <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>

        <div className="glass-card">
          {loading ? (
            <div className="empty-text">Loading department reports...</div>
          ) : !selectedDept ? (
            <>
              <h2>Select Department</h2>
              <div className="search-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-btn" onClick={() => setSearch("")}>
                    ×
                  </button>
                )}
              </div>

              {filteredDepts.length === 0 ? (
                <div className="empty-text">No departments found</div>
              ) : (
                <div className="grid">
                  {filteredDepts.map((dept) => (
                    <div
                      key={dept}
                      className="card"
                      onClick={() => {
                        setSelectedDept(dept);
                        setSearch("");
                      }}
                    >
                      <h3>{dept}</h3>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : !selectedProgramme ? (
            <>
              <button
                className="back-btn"
                onClick={() => {
                  setSelectedDept(null);
                  setSearch("");
                }}
              >
                ← Back to Departments
              </button>

              <h2>{selectedDept} - Programmes</h2>
              <div className="search-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search programme..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-btn" onClick={() => setSearch("")}>
                    ×
                  </button>
                )}
              </div>

              {filteredProgrammes.length === 0 ? (
                <div className="empty-text">
                  No programmes found in {selectedDept}
                </div>
              ) : (
                <div className="grid">
                  {filteredProgrammes.map((prog) => (
                    <div
                      key={prog}
                      className="card"
                      onClick={() => {
                        setSelectedProgramme(prog);
                        setSearch("");
                      }}
                    >
                      <h3>{prog}</h3>
                      <p className="count">
                        {(Object.values(groupedData[selectedDept]?.[prog] || {})).reduce(
                          (sum, batchStudents) => sum + (batchStudents?.length || 0),
                          0
                        )}{" "}
                        Selected
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : !selectedBatch ? (
            <>
              <button
                className="back-btn"
                onClick={() => {
                  setSelectedProgramme(null);
                  setSearch("");
                }}
              >
                ← Back to Programmes
              </button>

              <h2>
                {selectedDept} → {selectedProgramme} → Batches
              </h2>

              <div className="search-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search batch / year..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="clear-btn" onClick={() => setSearch("")}>
                    ×
                  </button>
                )}
              </div>

              {filteredBatches.length === 0 ? (
                <div className="empty-text">
                  No batches with selected students in {selectedProgramme}
                </div>
              ) : (
                <div className="grid">
                  {filteredBatches.map((batch) => (
                    <div
                      key={batch}
                      className="card"
                      onClick={() => {
                        setSelectedBatch(batch);
                        setStudentSearch("");
                        setSearch("");
                      }}
                    >
                      <h3>{batch}</h3>
                      <p className="count">
                        {(groupedData[selectedDept]?.[selectedProgramme]?.[batch] || []).length} Selected
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                className="back-btn"
                onClick={() => {
                  setSelectedBatch(null);
                  setStudentSearch("");
                }}
              >
                ← Back to Batches
              </button>

              <h2>
                {selectedDept} → {selectedProgramme} → {selectedBatch}
              </h2>

              <div className="search-wrapper">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search students by reg no, name, email, company, job..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
                {studentSearch && (
                  <button className="clear-btn" onClick={() => setStudentSearch("")}>
                    ×
                  </button>
                )}
              </div>

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
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-text">
                        No matching students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((item, index) => (
                      <tr key={index}>
                        <td>{item.university_reg_no || "—"}</td>
                        <td>{item.student_name || "—"}</td>
                        <td>{item.student_email || "—"}</td>
                        <td>{item.company || "—"}</td>
                        <td>{item.job_title || "—"}</td>
                        <td>
                          {item.selected_at && item.selected_at !== "na"
                            ? isNaN(Date.parse(item.selected_at))
                              ? "—"
                              : new Date(item.selected_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}