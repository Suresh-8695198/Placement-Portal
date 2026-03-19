






// src/pages/coordinator/CoordinatorDashboard.jsx  (or wherever this component lives)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

export default function CoordinatorDashboard() {
  const [coordinatorName, setCoordinatorName] = useState("");
  const [department, setDepartment] = useState("");
  const [stats, setStats] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [deptPlacement, setDeptPlacement] = useState({ total: 0, placed: 0 });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const navigate = useNavigate();

  const API_BASE = "http://127.0.0.1:8000/coordinator";

  useEffect(() => {
    const username = localStorage.getItem("coordinatorUsername");
    const dept = localStorage.getItem("coordinatorDepartment");

    if (!username) {
      navigate("/coordinator/login");
      return;
    }

    setCoordinatorName(username);
    setDepartment(dept || "Department");

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const dept = localStorage.getItem("coordinatorDepartment") || "MA_Tamil";

      const [statsRes, pieRes, yearRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboard-stats/`, { params: { department: dept }, withCredentials: true }),
        axios.get(`${API_BASE}/department-placement-stats/`, { params: { department: dept }, withCredentials: true }),
        axios.get(`${API_BASE}/year-wise-placement-trend/`, { params: { department: dept }, withCredentials: true }),
      ]);

      // Stats cards
      const statsData = statsRes.data;
      setStats([
        { title: "Total Students", value: statsData.total_students || 0, icon: "fa-users", color: "#7c3aed" },
        { title: "Active Jobs", value: statsData.active_jobs || 0, icon: "fa-briefcase", color: "#10b981" },
        { title: "All Jobs", value: statsData.all_jobs || 0, icon: "fa-list-ul", color: "#ec4899" },
      ]);

      // Pie data
      const pieData = pieRes.data;
      setDeptPlacement({
        total: pieData.total_students || 0,
        placed: pieData.placed_students || 0,
      });

      // Line chart data
      setYearData(yearRes.data || []);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setFetchError(
        error.response?.data?.error ||
        error.message ||
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = [
    { name: "Placed", value: deptPlacement.placed },
    { name: "Not Placed", value: deptPlacement.total - deptPlacement.placed },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="glass-card text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <style>{`
        body {
          background: linear-gradient(135deg, #6b46c1, #9f7aea);
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #2d3748;
        }

        .page-wrapper {
          padding: 2.5rem 1.5rem;
          max-width: 1400px;
          margin: auto;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 3.5rem;
        }

        .welcome-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: #7c3aed;
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dept-badge {
          background: linear-gradient(135deg, #7c3aed, #c084fc);
          padding: 0.7rem 1.8rem;
          border-radius: 50px;
          font-weight: 600;
          color: white;
          font-size: 1.1rem;
          display: inline-block;
          margin-top: 0.8rem;
        }

        .glass-card {
          background: rgba(255,255,255,0.94);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 60px rgba(124,58,237,0.22);
        }

        .stat-card {
          background: linear-gradient(135deg, #ffffff, #f8f5ff);
          border-radius: 1.2rem;
          padding: 1.8rem;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(124,58,237,0.18);
        }

        .stat-icon {
          font-size: 2.8rem;
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2.4rem;
          font-weight: 700;
          color: #4f46e5;
        }

        .stat-title {
          font-size: 1.1rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .chart-title {
          text-align: center;
          font-size: 1.6rem;
          font-weight: 700;
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.8rem;
        }

        .error-alert {
          background: rgba(239,68,68,0.15);
          border: 1px solid #ef4444;
          color: #991b1b;
          border-radius: 1rem;
          padding: 1.2rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .welcome-title { font-size: 2.2rem; }
          .stat-value { font-size: 2rem; }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="header">
          <h1 className="welcome-title">
            Welcome, {coordinatorName || "Coordinator"}!
          </h1>
          <div className="dept-badge">
            <i className="fas fa-building me-2"></i>
            {department} Department
          </div>
        </div>

        {fetchError && (
          <div className="error-alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {fetchError}
          </div>
        )}

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          {stats.map((stat, i) => (
            <div key={i} className="col-md-4">
              <div className="stat-card">
                <i className={`fas ${stat.icon} stat-icon`} style={{ color: stat.color }}></i>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Pie Chart */}
          <div className="col-lg-6">
            <div className="glass-card">
              <h3 className="chart-title">Department Placement Overview</h3>
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val} students`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="col-lg-6">
            <div className="glass-card">
              <h3 className="chart-title">Year-wise Placed Students Trend</h3>
              <ResponsiveContainer width="100%" height={380}>
                {yearData.length === 0 ? (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted fst-italic">
                    No placement trend data available yet
                  </div>
                ) : (
                  <LineChart data={yearData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{ background: "rgba(255,255,255,0.95)", borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                      formatter={(val) => [`${val} students placed`, ""]}
                    />
                    <Line
                      type="monotone"
                      dataKey="placed_students"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{ r: 6, strokeWidth: 2 }}
                      activeDot={{ r: 10, stroke: "#10b981", strokeWidth: 3 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}