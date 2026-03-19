
// src/pages/admin/AdminJobs.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPageLayout from "../../components/admin/AdminPageLayout";

const API_BASE = "http://127.0.0.1:8000/admin-panel/";
const STUDENT_API = "http://127.0.0.1:8000/api/students/";

export default function AdminJobs() {
  const { status } = useParams();
  const navigate = useNavigate();

  const validTabs = ["pending", "approved", "rejected"];
  const initialTab = validTabs.includes(status) ? status : "pending";

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedProgrammes, setSelectedProgrammes] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  // Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    location: "",
    title: "",
    salary: "",
    jobType: "",
    department: "",
    programme: "",
    year: ""
  });

  // ────────────────────────────────────────────────
  //                DATA FETCHING
  // ────────────────────────────────────────────────

  useEffect(() => {
    fetch(`${STUDENT_API}years/`)
      .then((res) => res.json())
      .then((data) => setGraduationYears(data.years || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${STUDENT_API}programmes/`)
      .then((res) => res.json())
      .then((data) => setProgrammes(data.programmes || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}coordinators/`)
      .then((res) => res.json())
      .then((data) => {
        const uniqueDepts = [...new Set(data.coordinators?.map((c) => c.department) || [])];
        setDepartments(uniqueDepts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadJobs(activeTab);
  }, [activeTab]);

  const loadJobs = async (tab) => {
    setLoading(true);
    let url = `${API_BASE}`;
    if (tab === "pending") url += "pending-jobs/";
    else if (tab === "approved") url += "approved-jobs/";
    else url += "rejected-jobs/";

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();

      const key =
        tab === "pending" ? "pending_jobs" :
        tab === "approved" ? "approved_jobs" :
        "rejected_jobs";

      const list = data[key] || [];
      setJobs(list);
      setFilteredJobs(list);
    } catch {
      setMessage("Failed to load jobs");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //                     SEARCH
  // ────────────────────────────────────────────────

  useEffect(() => {
    let result = jobs;

    // Apply global search query
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      result = result.filter((j) =>
        [j.title, j.company, j.location, j.job_type, j.salary_range]
          .some((v) => v?.toLowerCase().includes(term)) ||
        j.departments?.join(" ").toLowerCase().includes(term) ||
        j.programmes?.join(" ").toLowerCase().includes(term) ||
        j.graduation_years?.join(" ").toString().includes(term)
      );
    }

    // Apply specific advanced filters
    if (filters.company.trim()) {
      const term = filters.company.toLowerCase().trim();
      result = result.filter(j => j.company?.toLowerCase().includes(term));
    }
    if (filters.location.trim()) {
      const term = filters.location.toLowerCase().trim();
      result = result.filter(j => j.location?.toLowerCase().includes(term));
    }
    if (filters.title.trim()) {
      const term = filters.title.toLowerCase().trim();
      result = result.filter(j => j.title?.toLowerCase().includes(term));
    }
    if (filters.salary.trim()) {
      const term = filters.salary.toLowerCase().trim();
      result = result.filter(j => j.salary_range?.toLowerCase().includes(term));
    }
    if (filters.jobType) {
      result = result.filter(j => j.job_type === filters.jobType);
    }
    if (filters.department) {
      result = result.filter(j => 
        j.show_to_all_departments || 
        (Array.isArray(j.departments) && j.departments.includes(filters.department))
      );
    }
    if (filters.programme) {
      result = result.filter(j => 
        Array.isArray(j.programmes) && j.programmes.includes(filters.programme)
      );
    }
    if (filters.year) {
      result = result.filter(j => 
        Array.isArray(j.graduation_years) && j.graduation_years.includes(filters.year)
      );
    }

    setFilteredJobs(result);
  }, [searchQuery, filters, jobs]);

  // ────────────────────────────────────────────────
  //                 APPROVE / REJECT
  // ────────────────────────────────────────────────

  const handleApproveClick = (jobId) => {
    setSelectedJobId(jobId);
    setSelectedDepartments([]);
    setSelectedProgrammes([]);
    setSelectedYears([]);
    setSelectAll(false);
    setShowModal(true);
  };

  const handleAction = async (type, jobId) => {
    const isApprove = type === "approve";
    const url = `${API_BASE}${isApprove ? "approve-job/" : "reject-job/"}`;

    try {
      const body = {
        id: jobId,
        departments: selectAll ? [] : selectedDepartments,
        programmes: selectAll ? [] : selectedProgrammes,
        graduation_years: selectedYears,
        show_to_all_departments: selectAll,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();

      setMessage(`Job successfully ${isApprove ? "approved" : "rejected"}`);
      setMessageType("success");
      loadJobs(activeTab);
    } catch {
      setMessage("Action failed");
      setMessageType("error");
    } finally {
      setShowModal(false);
    }
  };

  const handleShowDetails = (job) => {
    setSelectedJobDetails(job);
    setShowDetailsModal(true);
  };

  // Always show department, programme, and graduation year columns for all tabs
  const showColumns = true;

  // ────────────────────────────────────────────────
  //                     RENDER
  // ────────────────────────────────────────────────

  return (
    <AdminPageLayout title="Job Postings Approval" icon="fas fa-briefcase">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      <style>{`
        .jobs-wrapper {
          padding: 0;
          background: transparent;
          min-height: 100vh;
          font-family: 'Manrope', sans-serif;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: #000000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .page-title i {
          color: #10b981; /* Green icon as requested */
        }

        .back-btn {
          padding: 0.6rem 1.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          background: #ffffff;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateX(-2px);
        }

        .control-bar {
          background: #ffffff;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 280px;
          max-width: 450px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #1e293b;
          font-size: 0.9rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          border-radius: 0.75rem;
          border: 1.5px solid #f1f5f9;
          background: #f8fafc;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-input:focus {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .filter-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .tabs-container {
          display: flex;
          gap: 0.25rem;
          background: #f1f5f9;
          padding: 0.35rem;
          border-radius: 0.85rem;
        }

        .advanced-filters-btn {
          padding: 0.75rem 1.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          background: #ffffff;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          height: 100%;
        }

        .advanced-filters-btn:hover {
          background: #f8fafc;
          color: #1e293b;
          border-color: #cbd5e1;
        }

        .advanced-filters-btn.active {
          background: #f0fdf4;
          color: #10b981;
          border-color: #10b981;
        }

        .advanced-filter-panel {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          animation: slideInDown 0.3s ease-out;
        }

        .filter-field, .filter-select {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.25rem;
          border-radius: 0.6rem;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          font-size: 0.85rem;
          font-weight: 500;
          color: #000000;
          outline: none;
          transition: all 0.2s;
        }

        .filter-select {
          padding-left: 2.25rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' %3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
        }

        .filter-field:focus, .filter-select:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .filter-input-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-input-wrapper {
          position: relative;
        }

        .filter-input-wrapper i {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.85rem;
          color: #000000;
        }

        .filter-field {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.25rem;
          border-radius: 0.6rem;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.85rem;
          font-weight: 500;
          color: #000000;
          outline: none;
          transition: all 0.2s;
        }

        .filter-field:focus {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .clear-filters-btn {
          padding: 0.65rem 1rem;
          border: none;
          background: #fef2f2;
          color: #ef4444;
          font-weight: 700;
          font-size: 0.75rem;
          border-radius: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          align-self: flex-end;
        }

        .clear-filters-btn:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        .tab {
          padding: 0.5rem 1.25rem;
          border: none;
          background: transparent;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: 0.6rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover:not(.active) {
          color: #1e293b;
          background: rgba(255,255,255,0.5);
        }

        .tab.active.pending {
          background: #3b82f6;
          color: #ffffff;
        }

        .tab.active.approved {
          background: #10b981;
          color: #ffffff;
        }

        .tab.active.rejected {
          background: #ef4444;
          color: #ffffff;
        }

        /* ─── Table Styling ────────────────────────────────────────── */
        .table-wrapper {
          background: #ffffff;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          width: 100%;
          max-width: 100%;
        }

        .table {
          width: 100%;
          min-width: 1200px; /* Ensure all columns are visible with scroll if needed */
          border-collapse: collapse;
          border-spacing: 0;
          margin: 0;
        }

        .table th {
          background: #f8fafc;
          text-align: left;
          padding: 1rem 0.75rem; /* More compact padding */
          font-weight: 700;
          color: #64748b;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e2e8f0;
        }

        .table td {
          padding: 1rem 0.75rem; /* More compact padding */
          border-bottom: 1px solid #f1f5f9;
          color: #000000;
          font-size: 0.875rem;
          vertical-align: middle;
          font-weight: 400;
          white-space: nowrap; /* Prevent contents from wrapping awkwardly */
        }

        .table tr:last-child td { border-bottom: none; }

        .job-title-cell {
          font-weight: 600;
          color: #0f172a;
          line-height: 1.4;
        }

        .company-cell {
          font-weight: 500;
          color: #6366f1;
        }

        .meta-text {
          color: #000000;
          font-size: 0.81rem;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .action-cell {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          min-width: 320px; /* Ensure enough space for 3 buttons */
        }

        .btn-action {
          padding: 0.5rem 0.85rem;
          border-radius: 0.6rem;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1.5px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .btn-approve {
          background: #f0fdf4;
          color: #10b981;
          border-color: #dcfce7;
        }

        .btn-approve:hover {
          background: #10b981;
          color: #ffffff;
          border-color: #10b981;
          transform: translateY(-1px);
        }

        .btn-reject {
          background: #fef2f2;
          color: #ef4444;
          border-color: #fee2e2;
        }

        .btn-reject:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
          transform: translateY(-1px);
        }

        .btn-details {
          background: #f8fafc;
          color: #6366f1;
          border-color: #e2e8f0;
        }

        .btn-details:hover {
          background: #6366f1;
          color: #ffffff;
          border-color: #6366f1;
          transform: translateY(-1px);
        }

        /* ─── Detail Modal Styling ───────────────────────────────── */
        .detail-card {
          border: 1px solid #f1f5f9;
          border-radius: 1rem;
          padding: 1.25rem;
          background: #ffffff;
          margin-bottom: 0;
          transition: all 0.25s;
        }

        .detail-card:hover {
          border-color: #6366f1;
          background: #fcfcff;
        }

        .detail-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-value {
          font-size: 1rem;
          color: #0f172a;
          font-weight: 700;
        }

        .detail-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 0.9rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-right: 0.6rem;
          margin-bottom: 0.6rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .detail-badge:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .job-desc-box {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-left: 5px solid #6366f1;
          font-size: 1rem;
          line-height: 1.7;
          color: #334155;
          max-height: 350px;
          overflow-y: auto;
          white-space: pre-line;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .modal-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .section-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 2.5rem 0;
          position: relative;
        }

        .section-divider::after {
          content: attr(data-label);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: #ffffff;
          padding: 0 1rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        @media (max-width: 768px) {
          .modal-details-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ─── Empty State ────────────────────────────────────────── */
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: #ffffff;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          margin-top: 1rem;
        }

        .empty-icon {
          font-size: 3.5rem;
          color: #e2e8f0;
          margin-bottom: 1.5rem;
          display: block;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-desc {
          color: #0f172a;
          font-weight: 400;
          font-size: 0.95rem;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ─── Message ─────────────────────────────────────────────── */
        .message {
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .message.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .message.error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

        /* ─── Modal Refinements ──────────────────────────────────── */
        .modal-content {
          border-radius: 1.25rem;
          border: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          padding: 1.5rem;
          background: #f8fafc;
          border-top-left-radius: 1.25rem;
          border-top-right-radius: 1.25rem;
        }

        .modal-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-footer {
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-bottom-left-radius: 1.25rem;
          border-bottom-right-radius: 1.25rem;
        }

        .form-check-label {
          color: #1e293b;
          font-weight: 500;
        }

        .section-header {
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 2rem 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .scroll-area {
          max-height: 220px;
          overflow-y: auto;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #f1f5f9;
        }

        .action-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .action-btn-outline {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .action-btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .action-btn-primary {
          background: #10b981;
          color: #ffffff;
        }

        .action-btn-primary:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        
        @media (max-width: 768px) {
          .control-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-container {
            max-width: 100%;
          }
          .filter-group {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-actions {
            flex-direction: column;
            align-items: flex-start;
          }
          .back-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="jobs-wrapper">
        <div className="header-actions">
          <h1 className="page-title">
            <i className="fas fa-briefcase"></i>
            Manage Job Approvals
          </h1>
          <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message}
          </div>
        )}

        <div className="control-bar">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Quick search everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <button 
            className={`advanced-filters-btn ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <i className={`fas fa-${showAdvancedFilters ? 'times' : 'sliders-h'}`}></i>
            {showAdvancedFilters ? 'Close Filters' : 'Advanced Filters'}
            {(filters.company || filters.location || filters.title || filters.salary) && (
              <span className="badge bg-success ms-1 rounded-pill">!</span>
            )}
          </button>

          <div className="filter-group">
            <span className="filter-label">Status</span>
            <div className="tabs-container">
              {validTabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? `active ${tab}` : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="advanced-filter-panel">
            <div className="filter-input-group">
              <label className="filter-input-label">Company Name</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-building"></i>
                <input 
                  type="text" 
                  className="filter-field" 
                  placeholder="e.g. Google"
                  value={filters.company}
                  onChange={(e) => setFilters({...filters, company: e.target.value})}
                />
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Job Title</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-id-badge"></i>
                <input 
                  type="text" 
                  className="filter-field" 
                  placeholder="e.g. Software Engineer"
                  value={filters.title}
                  onChange={(e) => setFilters({...filters, title: e.target.value})}
                />
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Location</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-map-marker-alt"></i>
                <input 
                  type="text" 
                  className="filter-field" 
                  placeholder="e.g. Bangalore"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Salary Range</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-money-bill-wave"></i>
                <input 
                  type="text" 
                  className="filter-field" 
                  placeholder="e.g. 10 - 20 LPA"
                  value={filters.salary}
                  onChange={(e) => setFilters({...filters, salary: e.target.value})}
                />
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Job Type</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-clock"></i>
                <select 
                  className="filter-select"
                  value={filters.jobType}
                  onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Department</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-university"></i>
                <select 
                  className="filter-select"
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                >
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Programme</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-graduation-cap"></i>
                <select 
                  className="filter-select"
                  value={filters.programme}
                  onChange={(e) => setFilters({...filters, programme: e.target.value})}
                >
                  <option value="">All Programmes</option>
                  {programmes.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="filter-input-group">
              <label className="filter-input-label">Batch Year</label>
              <div className="filter-input-wrapper">
                <i className="fas fa-calendar-alt"></i>
                <select 
                  className="filter-select"
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                >
                  <option value="">All Years</option>
                  {graduationYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button 
              className="clear-filters-btn"
              onClick={() => setFilters({
                company: "", location: "", title: "", salary: "", 
                jobType: "", department: "", programme: "", year: ""
              })}
            >
              <i className="fas fa-undo me-1"></i>
              Reset
            </button>
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <i className="fas fa-circle-notch fa-spin empty-icon" style={{color: '#10b981'}}></i>
            <div className="empty-title">Loading job postings...</div>
            <div className="empty-desc">Please wait while we fetch the latest listings.</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <i className={`fas fa-${activeTab === 'approved' ? 'check-double' : activeTab === 'rejected' ? 'ban' : 'clock'} empty-icon`}></i>
            <div className="empty-title">No {activeTab} jobs found</div>
            <div className="empty-desc">
              {searchQuery 
                ? `We couldn't find any results matching "${searchQuery}".`
                : `There are currently no job postings in the ${activeTab} category.`}
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Salary</th>
                    <th>Departments</th>
                    <th>Programmes</th>
                    <th>Years</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td data-label="Title" className="job-title-cell">
                        {job.title || "—"}
                      </td>
                      <td data-label="Company" className="company-cell">
                        <i className="fas fa-building me-1 opacity-75"></i>
                        {job.company || "—"}
                      </td>
                      <td data-label="Location">
                        <div className="meta-text">
                          <i className="fas fa-map-marker-alt"></i>
                          {job.location || "—"}
                        </div>
                      </td>
                      <td data-label="Type">
                         <span className="badge bg-light text-dark border">{job.job_type || "—"}</span>
                      </td>
                      <td data-label="Salary">{job.salary_range || "—"}</td>
                      <td data-label="Departments">
                        <div className="meta-text">
                          {job.show_to_all_departments
                            ? "All Departments"
                            : Array.isArray(job.departments)
                              ? job.departments.join(", ")
                              : job.departments || "—"}
                        </div>
                      </td>
                      <td data-label="Programmes">
                        <div className="meta-text">
                          {Array.isArray(job.programmes)
                            ? job.programmes.join(", ")
                            : job.programmes || "—"}
                        </div>
                      </td>
                      <td data-label="Years">
                        <div className="meta-text">
                          <i className="fas fa-calendar-alt"></i>
                          {Array.isArray(job.graduation_years)
                            ? job.graduation_years.join(", ")
                            : job.graduation_years || "—"}
                        </div>
                      </td>
                      <td data-label="Actions">
                        <div className="action-cell">
                          <button
                            className="btn-action btn-details"
                            onClick={() => handleShowDetails(job)}
                          >
                            <i className="fas fa-info-circle"></i>
                            Full Details
                          </button>
                          {activeTab !== "approved" && (
                            <button
                              className="btn-action btn-approve"
                              onClick={() => handleApproveClick(job.id)}
                            >
                              <i className="fas fa-check"></i>
                              Approve
                            </button>
                          )}
                          {activeTab !== "rejected" && (
                            <button
                              className="btn-action btn-reject"
                              onClick={() => handleAction("reject", job.id)}
                            >
                              <i className="fas fa-times"></i>
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        )}

        {/* Job Visibility Modal */}
        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fas fa-eye me-2" style={{color: '#10b981'}}></i>
                    Visibility Settings
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="mb-4 text-black opacity-70">
                    Define the target audience for this job posting.
                  </p>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAll"
                      checked={selectAll}
                      onChange={() => {
                        setSelectAll(!selectAll);
                        if (!selectAll) {
                          setSelectedDepartments([]);
                          setSelectedProgrammes([]);
                        }
                      }}
                    />
                    <label className="form-check-label fw-bold" htmlFor="selectAll">
                      Show to All Departments & Programmes
                    </label>
                  </div>

                  {!selectAll && (
                    <>
                      <div className="section-header">
                        <i className="fas fa-graduation-cap"></i>
                        Programmes
                      </div>
                      <div className="scroll-area">
                        {programmes.map((p) => (
                          <div key={p.name} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`prog-${p.name}`}
                              checked={selectedProgrammes.includes(p.name)}
                              onChange={() => {
                                setSelectedProgrammes((prev) =>
                                  prev.includes(p.name)
                                    ? prev.filter((x) => x !== p.name)
                                    : [...prev, p.name]
                                );
                                if (!selectedDepartments.includes(p.department)) {
                                  setSelectedDepartments((prev) => [...prev, p.department]);
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`prog-${p.name}`}>
                              {p.name} <small className="text-black opacity-50 ms-1">({p.department})</small>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="section-header">
                        <i className="fas fa-calendar-check"></i>
                        Graduation Years
                      </div>
                      <div className="scroll-area">
                        {graduationYears.map((y) => (
                          <div key={y} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`year-${y}`}
                              checked={selectedYears.includes(y)}
                              onChange={() =>
                                setSelectedYears((prev) =>
                                  prev.includes(y) ? prev.filter((x) => x !== y) : [...prev, y]
                                )
                              }
                            />
                            <label className="form-check-label" htmlFor={`year-${y}`}>
                              {y}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="action-btn action-btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn-primary"
                    style={{backgroundColor: '#10b981'}}
                    onClick={() => handleAction("approve", selectedJobId)}
                  >
                    Confirm & Approve
                  </button>
                </div>
            </div>
          </div>
        )}

        {/* Full Application Details Modal */}
        {showDetailsModal && selectedJobDetails && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" style={{maxWidth: '850px', width: '95%', padding: '0'}} onClick={e => e.stopPropagation()}>
              
              {/* Decorative Header */}
              <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center" style={{borderTopLeftRadius: '1.25rem', borderTopRightRadius: '1.25rem'}}>
                <div className="d-flex align-items-center gap-4">
                  <div className="bg-white shadow-sm p-3 rounded-4 d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px'}}>
                    <i className="fas fa-building fa-2x text-primary opacity-50"></i>
                  </div>
                  <div>
                    <h4 className="fw-800 mb-1" style={{fontFamily: 'Outfit', letterSpacing: '-0.02em'}}>
                      {selectedJobDetails.title}
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-700 px-2">Job Opening</span>
                      <span className="text-secondary small fw-500">• Posted by <strong>{selectedJobDetails.company}</strong></span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4" style={{maxHeight: '75vh', overflowY: 'auto'}}>
                
                {/* Status Alert if not approved */}
                {activeTab === 'pending' && (
                  <div className="alert alert-warning border-0 d-flex align-items-center gap-3 mb-4 rounded-4 shadow-sm">
                    <i className="fas fa-shield-alt fa-lg"></i>
                    <div>
                      <h6 className="mb-0 fw-700">Verification Required</h6>
                      <p className="mb-0 small opacity-75">Please review the details thoroughly before granting access to students.</p>
                    </div>
                  </div>
                )}

                <div className="modal-details-grid">
                  <div className="detail-card">
                    <div className="detail-label">
                      <i className="fas fa-map-marker-alt"></i> Location
                    </div>
                    <div className="detail-value">{selectedJobDetails.location || "On-site / Remote not specified"}</div>
                  </div>
                  
                  <div className="detail-card">
                    <div className="detail-label">
                      <i className="fas fa-money-bill-wave"></i> Package / Salary
                    </div>
                    <div className="detail-value text-success">
                      {selectedJobDetails.salary_range || "Competitive / Not Disclosed"}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-label">
                      <i className="fas fa-briefcase"></i> Employment Type
                    </div>
                    <div className="detail-value">{selectedJobDetails.job_type}</div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-label">
                      <i className="fas fa-hourglass-end"></i> Application Deadline
                    </div>
                    <div className="detail-value text-danger">
                      {selectedJobDetails.application_deadline 
                        ? new Date(selectedJobDetails.application_deadline).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'}) 
                        : "Ongoing Enrollment"}
                    </div>
                  </div>
                </div>

                <div className="section-divider" data-label="Job Scope"></div>

                <div className="mb-5">
                  <div className="detail-label mb-3">
                    <i className="fas fa-file-alt"></i> Detailed Description & Candidate Requirements
                  </div>
                  <div className="job-desc-box">
                    {selectedJobDetails.description || "The company has not provided a text-based description for this role."}
                  </div>
                </div>

                <div className="section-divider" data-label="Student Eligibility"></div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="detail-label mb-3">
                      <i className="fas fa-university"></i> Eligible Departments
                    </div>
                    <div className="d-flex flex-wrap">
                      {selectedJobDetails.show_to_all_departments ? (
                        <span className="detail-badge bg-primary text-white border-0">All Departments</span>
                      ) : selectedJobDetails.departments && selectedJobDetails.departments.length > 0 ? (
                        selectedJobDetails.departments.map(dept => (
                          <span key={dept} className="detail-badge">{dept}</span>
                        ))
                      ) : (
                        <span className="text-muted small">No specific departments set.</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="detail-label mb-3">
                      <i className="fas fa-calendar-check"></i> Target Graduating Batches
                    </div>
                    <div className="d-flex flex-wrap">
                      {selectedJobDetails.graduation_years && selectedJobDetails.graduation_years.length > 0 ? (
                        selectedJobDetails.graduation_years.map(year => (
                          <span key={year} className="detail-badge" style={{background: '#f0fdf4', color: '#16a34a', borderColor: '#dcfce7'}}>Class of {year}</span>
                        ))
                      ) : (
                        <span className="text-muted small">No batch restrictions.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer p-4 border-top bg-light" style={{borderBottomLeftRadius: '1.25rem', borderBottomRightRadius: '1.25rem'}}>
                <button 
                  type="button" 
                  className="btn btn-light fw-700 px-4 py-2 border rounded-3"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close View
                </button>
                
                {activeTab === "pending" && (
                  <button 
                    type="button" 
                    className="btn btn-success fw-700 px-4 py-2 rounded-3 shadow-sm ms-2"
                    style={{backgroundColor: '#10b981'}}
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApproveClick(selectedJobDetails.id);
                    }}
                  >
                    Confirm & Approve Job
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
