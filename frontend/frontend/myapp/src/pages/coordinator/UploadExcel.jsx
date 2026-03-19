






// src/pages/coordinator/UploadExcel.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:8000";

export default function UploadExcel() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [coordinatorName] = useState(localStorage.getItem("coordinatorUsername") || "Coordinator");
  const [department] = useState(localStorage.getItem("coordinatorDepartment") || "Department");

  const [mode, setMode] = useState(""); // "edit" or "delete"
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);

  // Fetch single student by Roll No
  const fetchStudent = async () => {
    if (!rollNo.trim()) return setMessage("Enter University Roll No");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/students/${rollNo}/`, { withCredentials: true });
      setStudent(res.data);
      setMessage(`Student found: ${res.data.name}`);
      setIsSuccess(true);
    } catch (err) {
      setStudent(null);
      setMessage("Student not found");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Save edited student
  const saveEdit = async () => {
    if (!student) return;
    setLoading(true);
    try {
      await axios.put(`${API_BASE}/api/students/${student.university_reg_no}/`, student, { withCredentials: true });
      setMessage("Student updated successfully!");
      setIsSuccess(true);
      setStudent(null);
      setMode("");
      setRollNo("");
    } catch (err) {
      setMessage("Update failed");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const deleteStudent = async () => {
    if (!student) return;
    if (!window.confirm(`Delete ${student.name}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/students/${student.university_reg_no}/`, { withCredentials: true });
      setMessage("Student deleted successfully!");
      setIsSuccess(true);
      setStudent(null);
      setRollNo("");
    } catch (err) {
      setMessage("Delete failed");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Upload Excel
  const uploadExcel = async () => {
    if (!file) {
      setMessage("Please select an Excel file first.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("Processing your file...");
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("excel", file);

    try {
      const res = await axios.post(
        `${API_BASE}/api/students/process-excel/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setMessage(res.data.message || "Students imported successfully!");
      setIsSuccess(true);
      setFile(null);
    } catch (err) {
      setMessage("Upload failed: " + (err.response?.data?.error || err.message || "Unknown error"));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <style>{`
        body {
          background: linear-gradient(135deg, #6b46c1 0%, #9f7aea 100%);
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #2d3748;
          overflow-x: hidden;
        }

        .upload-page { min-height: 100vh; position: relative; padding: 2.5rem 1.5rem; }
        .upload-wrapper { max-width: 900px; margin: 0 auto; z-index: 1; position: relative; }
        .header { text-align: center; color: white; margin-bottom: 3.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.35); }
        .welcome-title { font-size: 2.6rem; font-weight: 700; color: #7c3aed; margin-bottom: 0.8rem; }
        .dept-badge { display: inline-block; background: linear-gradient(135deg, #7c3aed, #c084fc); color: white; padding: 0.6rem 1.6rem; border-radius: 50px; font-size: 1.15rem; font-weight: 600; box-shadow: 0 6px 20px rgba(124,58,237,0.5); }
        .glass-card { background: rgba(255,255,255,0.93); border-radius: 1.5rem; padding: 2.8rem 2.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.18); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.3); transition: all 0.4s ease; }
        .glass-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(0,0,0,0.22); }
        .upload-title { font-size: 2.1rem; font-weight: 700; color: #7c3aed; text-align: center; margin-bottom:1.2rem; }
        .upload-subtitle { color: #4a5568; text-align: center; margin-bottom: 2.5rem; font-size: 1.1rem; }
        .message-box { padding: 1.3rem; border-radius: 1rem; margin-bottom: 2.2rem; font-weight: 500; text-align: center; border: 1px solid; }
        .message-success { background: #e9d8fd; color: #6b21a8; border-color: #c084fc; }
        .message-error { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
        .action-buttons { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin: 2.5rem 0; }
        .btn-primary-gradient, .btn-success-gradient, .btn-choose { padding: 1rem 2.2rem; font-weight: 600; font-size: 1.05rem; border-radius: 50px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); transition: all 0.35s ease; display: flex; align-items: center; gap: 0.7rem; cursor: pointer; }
        .btn-choose { background: rgba(124,58,237,0.1); border: 2px dashed #c084fc; color: #7c3aed; }
        .btn-choose:hover { background: rgba(124,58,237,0.2); border-color: #7c3aed; transform: translateY(-3px); }
        .btn-primary-gradient { background: linear-gradient(135deg, #7c3aed, #c084fc); color: white; border: none; }
        .btn-success-gradient { background: linear-gradient(135deg, #10b981, #34d399); color: white; border: none; }
        .btn-primary-gradient:hover:not(:disabled), .btn-success-gradient:hover:not(:disabled) { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .btn-primary-gradient:disabled, .btn-success-gradient:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }
        .file-info { margin-top: 1.8rem; padding: 1.2rem; background: rgba(243,232,255,0.5); border-radius: 1rem; color: #4a5568; text-align: center; font-size: 1rem; }
        .info-text { margin-top: 2.5rem; text-align: center; color: #6b7280; font-size: 0.98rem; }
        .floating-dots { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .dot { position: absolute; background: rgba(255, 255, 255, 0.7); border-radius: 50%; box-shadow: 0 0 14px rgba(255,255,255,0.45); animation: floatDot 14s infinite ease-in-out; }
        @keyframes floatDot { 0%,100% { transform: translate(0,0) scale(1); opacity: 0.65; } 50% { transform: translateY(-50px) scale(1.25); opacity:1; } }
        @media (max-width: 992px) { .welcome-title { font-size: 2.2rem; } .glass-card { padding: 2rem 1.8rem; } }
        @media (max-width: 768px) { .upload-page { padding: 1.8rem 1rem; } .action-buttons { flex-direction: column; gap:1.2rem; } .btn-primary-gradient, .btn-success-gradient, .btn-choose { width:100%; justify-content:center; } }
        @media (max-width: 576px) { .welcome-title { font-size:1.9rem; } .upload-title { font-size:1.7rem; } .glass-card { padding:1.5rem 1.2rem; border-radius:1.2rem; } }
      `}</style>

      <div className="upload-page">
        <div className="floating-dots">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="dot" style={{
              width: `${Math.random()*10+6}px`,
              height: `${Math.random()*10+6}px`,
              left: `${Math.random()*100}%`,
              top: `${Math.random()*100}%`,
              animationDelay: `${Math.random()*12}s`
            }} />
          ))}
        </div>

        <div className="upload-wrapper">
          <div className="header">
            <h1 className="welcome-title">Welcome, {coordinatorName}!</h1>
            <div className="dept-badge"><i className="fas fa-building me-2"></i>{department} Department</div>
          </div>

          <div className="glass-card">
            <h2 className="upload-title">Bulk Upload Students</h2>
            <p className="upload-subtitle">Upload an Excel file (.xlsx / .xls) with student data</p>

            {message && <div className={`message-box ${isSuccess ? 'message-success':'message-error'}`}>{message}</div>}

            {/* Bulk Upload & Add */}
            <div className="action-buttons">
              <div style={{position:'relative'}}>
                <button className="btn-choose"><i className="fas fa-file-excel fa-lg"></i> Choose Excel File</button>
                <input type="file" accept=".xlsx,.xls" onChange={(e)=>setFile(e.target.files?.[0]||null)}
                  style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
              </div>
              <button className="btn-primary-gradient" onClick={uploadExcel} disabled={loading||!file}>
                {loading ? <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span> Processing...
                </>:<>
                  <i className="fas fa-upload"></i> Upload & Process
                </>}
              </button>
              <button className="btn-success-gradient" onClick={()=>navigate('/coordinator/students/add')}>
                <i className="fas fa-user-plus"></i> Add Single Student
              </button>
            </div>

            {/* Edit/Delete Student */}
            <div className="action-buttons mt-3">
              <input type="text" placeholder="Enter University Roll No" value={rollNo} onChange={(e)=>setRollNo(e.target.value)} className="form-control" />
              <button className="btn-primary-gradient" onClick={()=>{setMode("edit"); fetchStudent();}}>Edit</button>
              <button className="btn-success-gradient" onClick={()=>{setMode("delete"); fetchStudent();}}>Delete</button>
            </div>

            {/* Edit Form */}
            {student && mode==="edit" && (
              <div className="mt-3">
                <input type="text" value={student.name} placeholder="Name" onChange={(e)=>setStudent({...student,name:e.target.value})} className="form-control mb-2"/>
                <input type="email" value={student.email} placeholder="Email" onChange={(e)=>setStudent({...student,email:e.target.value})} className="form-control mb-2"/>
                <input type="text" value={student.department} placeholder="Department" onChange={(e)=>setStudent({...student,department:e.target.value})} className="form-control mb-2"/>
                <input type="text" value={student.programme||""} placeholder="Programme" onChange={(e)=>setStudent({...student,programme:e.target.value})} className="form-control mb-2"/>
                <input type="text" value={student.phone||""} placeholder="Phone" onChange={(e)=>setStudent({...student,phone:e.target.value})} className="form-control mb-2"/>
                <input type="number" value={student.passed_out_year||""} placeholder="Passed Out Year" onChange={(e)=>setStudent({...student,passed_out_year:e.target.value})} className="form-control mb-2"/>
                <button className="btn-primary-gradient mt-2" onClick={saveEdit}>Save Changes</button>
              </div>
            )}

            {/* Delete Form */}
            {student && mode==="delete" && (
              <div className="mt-3">
                <p>Delete <strong>{student.name}</strong> from <strong>{student.department}</strong>?</p>
                <button className="btn-success-gradient" onClick={deleteStudent}>Confirm Delete</button>
              </div>
            )}

            {file && <div className="file-info"><strong>Selected:</strong> {file.name}<br/><span style={{opacity:0.8}}>{(file.size/1024).toFixed(1)} KB • {file.type||'Excel File'}</span></div>}

            <div className="info-text mt-4"><i className="fas fa-info-circle me-2"></i>Ensure your Excel follows the required format: Reg No, Name, Email, Department, Programme, Phone, Passed Out Year</div>

          </div>
        </div>
      </div>
    </>
  )
}