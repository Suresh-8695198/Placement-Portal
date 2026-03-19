import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const API = "http://localhost:8000/admin-panel";

export default function Dashboard() {
  const [data, setData] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    approvedJobs: 0,
    pendingJobs: 0,
    totalSelected: 0,
  });

  const [yearDeptStats, setYearDeptStats] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const responses = await Promise.all([
        axios.get(`${API}/total-students/`),
        axios.get(`${API}/total-companies/`),
        axios.get(`${API}/total-jobs/`),
        axios.get(`${API}/approved-jobs-count/`),
        axios.get(`${API}/pending-jobs-count/`),
        axios.get(`${API}/total-selected/`),
        axios.get(`${API}/stats/year-department-analysis/`),
      ]);

      setData({
        totalStudents: responses[0].data.total_students || responses[0].data.count || 0,
        totalCompanies: responses[1].data.total_companies || responses[1].data.count || 0,
        totalJobs: responses[2].data.total_jobs || responses[2].data.count || 0,
        approvedJobs: responses[3].data.approved_jobs || responses[3].data.approved || 0,
        pendingJobs: responses[4].data.pending_jobs || responses[4].data.pending || 0,
        totalSelected: responses[5].data.total_selected || responses[5].data.selected || 0,
      });

      const yearData = responses[6].data || [];
      const mapped = yearData.map((item) => ({
        year: item.year ?? item.batch ?? "Unknown",
        department: item.department || item.dept || item.department_name || item.name || "Unknown",
        placed_students: Number(item.placed_students || item.placed || item.selected || item.total_selected || 0),
      }));

      setYearDeptStats(mapped);

      const uniqueDepts = [...new Set(mapped.map((item) => item.department))].filter(Boolean);
      if (uniqueDepts.length > 0 && !selectedDepartment) {
        setSelectedDepartment(uniqueDepts[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      // Even on error, we want to show dummy data, so set loading to false
      setLoading(false);
    }
  };

  // ─── Dynamic Data ──────────────────────────────────────────
  const jobChartData = [
    { name: "Total", value: data.totalJobs },
    { name: "Approved", value: data.approvedJobs },
    { name: "Pending", value: data.pendingJobs },
  ];

  const placementChartData = [
    { name: "Selected", value: data.totalSelected },
    { name: "Not Selected", value: Math.max(0, data.totalStudents - data.totalSelected) },
  ];

  const departments = [...new Set(yearDeptStats.map((item) => item.department))].filter(Boolean);

  const filteredYearData = yearDeptStats
    .filter((item) => item.department === selectedDepartment)
    .sort((a, b) => Number(a.year) - Number(b.year));

  // ─── Dummy Data for Immediate Visualization ───────────────────
  const dummyJobChartData = [
    { name: "Total", value: 520 },
    { name: "Approved", value: 410 },
    { name: "Pending", value: 110 },
  ];

  const dummyPlacementChartData = [
    { name: "Selected", value: 340 },
    { name: "Not Selected", value: 160 },
  ];

  const dummyFilteredYearData = [
    { year: "2021", placed_students: 150 },
    { year: "2022", placed_students: 210 },
    { year: "2023", placed_students: 185 },
    { year: "2024", placed_students: 275 },
    { year: "2025", placed_students: 310 },
  ];

  // Use dummy data if real data is not available or empty (e.g. while loading or on error)
  const activeJobChartData = data.totalJobs > 0 ? jobChartData : dummyJobChartData;
  const activePlacementChartData = data.totalSelected > 0 ? placementChartData : dummyPlacementChartData;
  const activeYearData = filteredYearData.length > 0 ? filteredYearData : dummyFilteredYearData;

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4 text-muted fs-5 fw-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>

      <style>{`
        body {
          background-color: #f1f5f9;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          color: #1e293b;
        }

        .page-wrapper {
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* ─── Premium Modern Cards ─────────────────────────────────── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
          padding: 10px 5px; /* Add padding to prevent hover transform/shadow clipping */
        }

        .modern-card {
          position: relative;
          border-radius: 1.5rem;
          padding: 1.75rem;
          color: white;
          overflow: hidden;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: none;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .modern-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.15);
        }

        /* Wavy Background Pattern */
        .modern-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='rgba(255,255,255,0.15)' fill-opacity='1' d='M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
          background-size: cover;
          opacity: 0.6;
          pointer-events: none;
        }

        .card-blue { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); }
        .card-gold { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .card-cyan { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); }
        .card-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .card-rose { background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); }
        .card-indigo { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 1;
        }

        .card-title {
          font-size: 0.95rem;
          font-weight: 600;
          opacity: 0.9;
        }

        .card-value {
          font-family: 'Sora', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          margin-top: 0.5rem;
          z-index: 1;
        }

        .card-filters {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .filter-pill {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 0.3rem 0.8rem;
          border-radius: 2rem;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
          cursor: pointer;
        }

        .filter-pill:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .filter-pill.active {
          background: white;
          color: #1e293b;
        }

        /* ─── Chart Containers ──────────────────────────────────────── */
        .analytics-container {
          background: transparent; /* Removed background */
          border-radius: 0;
          padding: 1rem 0; /* Adjusted padding for minimal look */
          border: none;
          box-shadow: none; /* Removed box shadow */
          height: auto;
          transition: all 0.3s ease;
          overflow: visible;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .analytics-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .view-details {
          color: #2563eb;
          background: #eff6ff;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .view-details:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }

        .dept-select {
          padding: 0.6rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          outline: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .dept-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05);
        }

        .legend-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          list-style: none;
          padding: 0;
          margin-top: 1.5rem;
        }

        .category-tabs {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding: 0.5rem 0 1rem 0;
          scrollbar-width: none;
          max-width: 100%;
          -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
        }
        .category-tabs::-webkit-scrollbar { display: none; }

        .category-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          min-width: 80px;
          transition: all 0.3s ease;
        }

        .tab-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #64748b;
          transition: all 0.3s ease;
        }

        .category-tab:hover .tab-icon-box {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: none; /* Removed glow effect */
        }

        .category-tab.active .tab-icon-box {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          box-shadow: none; /* Removed glow effect */
        }

        .tab-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-align: center;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .category-tab.active .tab-label { color: #1e293b; }

        /* Fix potential chart overflow */
        .recharts-responsive-container {
          overflow: hidden !important;
          max-width: 100%;
        }

        .row {
          margin-right: 0;
          margin-left: 0;
        }

        .col-lg-8, .col-lg-4 {
          padding-left: 0;
          padding-right: 0;
        }

        @media (min-width: 992px) {
          .col-lg-8 { padding-right: 1.5rem; }
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .metric-label { font-size: 0.8rem; font-weight: 600; color: #64748b; }
        .metric-value { font-size: 0.8rem; font-weight: 700; color: #1e293b; }
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Premium overview of placement activities and student statistics.</p>
          </div>
          <a href="#" className="view-details" onClick={(e) => { e.preventDefault(); fetchDashboard(); }}>
            <i className="fas fa-sync-alt me-2"></i>Refresh Data
          </a>
        </div>

        <div className="stat-grid">
          {/* Total Students */}
          <div className="modern-card card-blue">
            <div className="card-top">
              <div className="card-title">Total Students</div>
              <div className="card-filters">
                <button className="filter-pill active">Today</button>
                <button className="filter-pill">This Week</button>
                <button className="filter-pill">This Month</button>
              </div>
            </div>
            <div className="card-value">{data.totalStudents.toLocaleString()}</div>
          </div>

          {/* Total Companies */}
          <div className="modern-card card-gold">
            <div className="card-top">
              <div className="card-title">Total Companies</div>
              <div className="card-filters">
                <button className="filter-pill active">Today</button>
                <button className="filter-pill">This Week</button>
                <button className="filter-pill">This Month</button>
              </div>
            </div>
            <div className="card-value">{data.totalCompanies.toLocaleString()}</div>
          </div>

          {/* Total Jobs */}
          <div className="modern-card card-cyan">
            <div className="card-top">
              <div className="card-title">Total Jobs Posted</div>
              <div className="card-filters">
                <button className="filter-pill active">Today</button>
                <button className="filter-pill">This Week</button>
                <button className="filter-pill">This Month</button>
              </div>
            </div>
            <div className="card-value">{data.totalJobs.toLocaleString()}</div>
          </div>

          {/* Placed Students */}
          <div className="modern-card card-green">
            <div className="card-top">
              <div className="card-title">Placed Students</div>
              <div className="card-filters">
                <button className="filter-pill active">Today</button>
                <button className="filter-pill">This Week</button>
                <button className="filter-pill">This Month</button>
              </div>
            </div>
            <div className="card-value">{data.totalSelected.toLocaleString()}</div>
          </div>

          {/* Approved Jobs */}
          <div className="modern-card card-indigo">
            <div className="card-top">
              <div className="card-title">Approved Jobs</div>
              <div className="card-filters">
                <button className="filter-pill active">Today</button>
                <button className="filter-pill">This Week</button>
                <button className="filter-pill">This Month</button>
              </div>
            </div>
            <div className="card-value">{data.approvedJobs.toLocaleString()}</div>
          </div>

          {/* Pending Jobs */}
          <div className="modern-card card-rose">
            <div className="card-top">
              <div className="card-title">Pending Jobs</div>
              <div className="card-filters">
                <button className="filter-pill active">Today</button>
                <button className="filter-pill">This Week</button>
                <button className="filter-pill">This Month</button>
              </div>
            </div>
            <div className="card-value">{data.pendingJobs.toLocaleString()}</div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="analytics-container">
              <div className="category-tabs">
            <div className="category-tab active">
              <div className="tab-icon-box"><i className="fas fa-chart-line"></i></div>
              <span className="tab-label">General</span>
            </div>
            <div className="category-tab">
              <div className="tab-icon-box"><i className="fas fa-user-graduate"></i></div>
              <span className="tab-label">Students</span>
            </div>
            <div className="category-tab">
              <div className="tab-icon-box"><i className="fas fa-building"></i></div>
              <span className="tab-label">Companies</span>
            </div>
            <div className="category-tab">
              <div className="tab-icon-box"><i className="fas fa-briefcase"></i></div>
              <span className="tab-label">Jobs</span>
            </div>
            <div className="category-tab">
              <div className="tab-icon-box"><i className="fas fa-file-invoice"></i></div>
              <span className="tab-label">Reports</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
              Job Posting Activity
            </span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={activeJobChartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#065f46" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="barGradientOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#92400e" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9', radius: 10 }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                {activeJobChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? 'url(#barGradient)' : index === 1 ? 'url(#barGradientGreen)' : 'url(#barGradientOrange)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-4">
        <div className="analytics-container">
          <div className="analytics-header">
            <h3 className="analytics-title">Placement Analysis</h3>
            <a href="#" className="view-details" onClick={(e) => e.preventDefault()}>Refresh</a>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
              Current Academic Year Ratio
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={activePlacementChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                paddingAngle={10}
                stroke="none"
              >
                <Cell fill="#4f46e5" strokeWidth={0} />
                <Cell fill="#e2e8f0" strokeWidth={0} />
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-card-footer">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#4f46e5' }}></div>
              Placed
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#e2e8f0' }}></div>
              Pending
            </div>
          </div>
        </div>
      </div>
    </div >

      <div className="analytics-container" style={{ marginTop: "2rem" }}>
        <div className="analytics-header">
          <h3 className="analytics-title">Year-wise Placement Trend</h3>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="dept-select"
            disabled={departments.length === 0}
          >
            {departments.length === 0 ? (
              <option>No departments</option>
            ) : (
              departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))
            )}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={380}>
          {activeYearData.length === 0 ? (
            <div className="no-data">
              {selectedDepartment ? `No data for ${selectedDepartment}` : "Select a department"}
            </div>
          ) : (
            <AreaChart data={activeYearData} margin={{ top: 20, right: 30, left: -20, bottom: 40 }}>
              <defs>
                <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }}
                dy={15}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="placed_students"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorPlaced)"
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#1e40af' }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      </div >
    </>
  );
}