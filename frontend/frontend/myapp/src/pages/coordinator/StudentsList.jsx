// src/pages/coordinator/StudentsList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function StudentsList() {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const coordinatorUsername = localStorage.getItem("coordinatorUsername") || "";
  const department = localStorage.getItem("coordinatorDepartment") || "Department";

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.university_reg_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    if (students.length === 0) return;
    const headers = ["Reg No", "Name", "UG/PG", "Programme", "Email", "Phone", "Year"];
    const rows = students.map(s => [
      s.university_reg_no, s.name, s.ug_pg, s.programme, s.email, s.phone, s.passed_out_year
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Students_${selectedProgramme}_${selectedBatch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!coordinatorUsername) {
      navigate("/coordinator/login");
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
      setError("Unable to connect to the profile service.");
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
      setError("Failed to load batches for this programme.");
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
        { params: { programme: selectedProgramme, batch: batch } }
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load students for this batch.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        .students-view-wrapper {
          padding: 2.5rem;
          max-width: 1550px;
          margin: 0 auto;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .breadcrumb-item { cursor: pointer; transition: color 0.2s; }
        .breadcrumb-item:hover { color: #7c3aed; }
        .breadcrumb-item.active { color: #475569; pointer-events: none; }

        .page-header {
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.5rem;
          gap: 2rem;
        }

        .header-main { flex: 1; }
        .header-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .header-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 4px; display: block; font-weight: 500; }

        /* ─── Global Stats Bar ─── */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: #ffffff;
          border: 2px solid #94a3b8; /* Highly visible grey border */
          border-radius: 1.25rem;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all 0.3s;
        }
        .stat-card:hover { transform: translateY(-2px); border-color: #7c3aed; }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #1e293b;
        }
        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.25rem; font-weight: 800; color: #1e293b; line-height: 1.2; }
        .stat-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }

        .program-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .selection-card {
          background: #ffffff;
          border: 2px solid #94a3b8; /* Highly visible grey border */
          border-radius: 1.5rem;
          padding: 2.25rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
        }

        .selection-card:hover {
          border-color: #7c3aed;
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -10px rgba(0,0,0,0.1);
        }

        .card-icon {
          width: 52px;
          height: 52px;
          background: #f1f5f9;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c3aed;
          font-size: 1.35rem;
        }

        .selection-card:hover .card-icon { background: #7c3aed; color: #ffffff; }

        .card-name { font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0; }
        .card-meta { font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

        /* ─── Advanced Controls Header ─── */
        .controls-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: center;
          justify-content: space-between;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #94a3b8; /* Consistent border */
          border-radius: 12px;
          padding: 0.6rem 1rem;
          gap: 12px;
          max-width: 400px;
        }

        .search-input { border: none; outline: none; width: 100%; font-size: 0.85rem; font-weight: 600; color: #1e293b; }
        .search-input::placeholder { color: #94a3b8; }

        .action-btn {
          background: #ffffff;
          border: 2px solid #94a3b8; /* Consistent border */
          padding: 0.6rem 1rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover { border-color: #7c3aed; color: #7c3aed; background: #f8fafc; }

        /* ─── Table UI ─── */
        .table-container {
          background: white;
          border-radius: 1.5rem;
          padding: 1.25rem;
          border: 2px solid #94a3b8; /* Highly visible grey border */
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          overflow: hidden;
        }
        .modern-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .modern-table th { 
          padding: 1.25rem 1rem; 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: #64748b; 
          text-transform: uppercase; 
          letter-spacing: 1px;
          border-bottom: 2px solid #cbd5e1; /* Slightly lighter inner border */
        }

        .modern-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .modern-table th { 
          padding: 1.25rem 1rem; 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: #64748b; 
          text-transform: uppercase; 
          letter-spacing: 1px;
          border-bottom: 2px solid #f1f5f9;
        }
        .modern-table td { padding: 1.25rem 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
        
        .user-id { font-weight: 700; color: #64748b; font-size: 0.85rem; font-family: 'Sora', sans-serif; }
        .user-name { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
        .user-email { font-size: 0.85rem; color: #94a3b8; }
        
        .tag {
          padding: 0.35rem 0.85rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
          background: #f1f5f9;
          color: #475569;
        }

        /* ─── Loading Overlay ─── */
        .loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 0;
          color: #64748b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 80vh;
        }
        .error-card {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .error-card i { font-size: 3rem; color: #ef4444; margin-bottom: 1rem; }
        .error-card button { 
          background: #7c3aed; color: white; border: none; padding: 0.75rem 2rem; 
          border-radius: 12px; font-weight: 700; margin-top: 1.5rem; 
        }
      `}</style>

      <div className="students-view-wrapper">
        {/* Navigation Breadcrumbs */}
        <div className="breadcrumb-nav">
          <span className="breadcrumb-item" onClick={() => { setSelectedProgramme(""); setSelectedBatch(""); }}>{department}</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
          <span className={`breadcrumb-item ${!selectedProgramme ? 'active' : ''}`} onClick={() => { setSelectedProgramme(""); setSelectedBatch(""); }}>Programmes</span>
          {selectedProgramme && (
            <>
              <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
              <span className={`breadcrumb-item ${!selectedBatch ? 'active' : ''}`} onClick={() => setSelectedBatch("")}>
                {selectedProgramme.replace(/_/g, " ")}
              </span>
            </>
          )}
          {selectedBatch && (
            <>
              <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.5 }}></i>
              <span className="breadcrumb-item active">Batch {selectedBatch}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="header-main">
            <h1 className="header-title">
              {!selectedProgramme ? "Departments & Programmes" : !selectedBatch ? "Batch Selection" : "Student Directory"}
            </h1>
            <span className="header-subtitle">
              Manage and explore students within the <strong>{department.replace(/_/g, ' ')}</strong> department.
            </span>
          </div>
          
          <div className="search-box d-none d-lg-flex">
            <i className="fas fa-search" style={{ color: '#94a3b8', fontSize: '0.9rem' }}></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder={selectedBatch ? "Filter this list..." : "Global student search..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Global Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#7c3aed', background: '#f5f0ff' }}>
              <i className="fas fa-layer-group"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{programmes.length}</span>
              <span className="stat-label">Programmes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#0ea5e9', background: '#f0f9ff' }}>
              <i className="fas fa-archive"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{batches.length || '-'}</span>
              <span className="stat-label">Active Batches</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#10b981', background: '#f0fdf4' }}>
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{selectedBatch ? filteredStudents.length : '-'}</span>
              <span className="stat-label">Total Records</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="fw-bold">Fetching latest data...</p>
          </div>
        ) : (
          <>
            {/* 1. Programme Selection */}
            {!selectedProgramme && (
              <div className="program-grid">
                {programmes.map((prog) => (
                  <div key={prog} className="selection-card" onClick={() => handleProgrammeClick(prog)}>
                    <div className="card-icon"><i className="fas fa-graduation-cap"></i></div>
                    <h3 className="card-name">{prog.replace(/_/g, " ").toUpperCase()}</h3>
                    <span className="card-meta">View Batches</span>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Batch Selection */}
            {selectedProgramme && !selectedBatch && (
              <div className="program-grid">
                {batches.map((year) => (
                  <div key={year} className="selection-card" onClick={() => handleBatchClick(year)}>
                    <div className="card-icon"><i className="fas fa-calendar-alt"></i></div>
                    <h3 className="card-name">Batch {year}</h3>
                    <span className="card-meta">View Students</span>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Student Table */}
            {selectedProgramme && selectedBatch && (
              <>
                <div className="controls-header">
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    Showing {filteredStudents.length} Students
                  </span>
                  <button className="action-btn" onClick={downloadCSV}>
                    <i className="fas fa-file-export"></i>
                    Export CSV
                  </button>
                </div>

                <div className="table-container">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-users-slash mb-3" style={{ fontSize: '2.5rem', opacity: 0.2 }}></i>
                      <p className="text-muted fw-bold">No students match your search.</p>
                    </div>
                  ) : (
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>Registration No</th>
                          <th>Student Details</th>
                          <th>Degree Type</th>
                          <th>Batch Year</th>
                          <th>Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s) => (
                          <tr key={s.id || s.university_reg_no}>
                            <td><span className="user-id">{s.university_reg_no}</span></td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="user-name">{s.name}</span>
                                <span className="user-email">{s.email}</span>
                              </div>
                            </td>
                            <td><span className="tag">{s.ug_pg}</span></td>
                            <td><span className="tag" style={{ background: '#7c3aed', color: 'white' }}>{s.passed_out_year}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-sm btn-light border" title="Email Student">
                                  <i className="far fa-envelope text-primary"></i>
                                </button>
                                <button className="btn btn-sm btn-light border" title="Call Student">
                                  <i className="fas fa-phone-alt text-success"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}