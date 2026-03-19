


// CompanyProfile.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

const getCsrfToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
};

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const companyEmail = localStorage.getItem("companyEmail");

  // Auto-hide save message
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(""), 2200);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Fetch profile
  useEffect(() => {
    if (!companyEmail) {
      setError("Company email not found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/companies/profile/${encodeURIComponent(companyEmail)}/`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to load profile (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setCompany(data);
        setFormData(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [companyEmail]);

  const getInitials = (name) => {
    if (!name?.trim()) return "?";
    return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  };


  // Remove Logo Modal State
  const [showRemoveLogoModal, setShowRemoveLogoModal] = useState(false);
  const [removingLogo, setRemovingLogo] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Remove Logo Handler
  const handleRemoveLogo = () => {
    setShowRemoveLogoModal(true);
  };

  const confirmRemoveLogo = async () => {
    setRemovingLogo(true);
    const csrfToken = getCsrfToken();
    try {
      const res = await fetch(
        `${API_BASE}/companies/profile/remove-logo/${encodeURIComponent(companyEmail)}/`,
        {
          method: "DELETE",
          headers: {
            ...(csrfToken && { "X-CSRFToken": csrfToken }),
          },
          credentials: "same-origin",
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to remove logo");
      setCompany((prev) => ({ ...prev, logo: null }));
      setFormData((prev) => ({ ...prev, logo: null }));
      setShowRemoveLogoModal(false);
      setSaveMessage("Logo removed successfully!");
    } catch (err) {
      setSaveMessage(`Error: ${err.message}`);
      setShowRemoveLogoModal(false);
    } finally {
      setRemovingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveMessage("");
    const csrfToken = getCsrfToken();

    try {
      let body;
      let headers;
      if (formData.logo && formData.logo instanceof File) {
        body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "logo" && value instanceof File) {
            body.append("logo", value);
          } else {
            body.append(key, value);
          }
        });
        headers = { ...(csrfToken && { "X-CSRFToken": csrfToken }) };
      } else {
        body = JSON.stringify(formData);
        headers = {
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken }),
        };
      }

      const res = await fetch(
        `${API_BASE}/companies/profile/update/${encodeURIComponent(companyEmail)}/`,
        {
          method: "POST",
          headers,
          credentials: "same-origin",
          body,
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || `Update failed (${res.status})`);
      }

      setCompany(result.company || formData);
      setShowEditModal(false);
      setSaveMessage("Profile updated successfully!");
    } catch (err) {
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const openEditModal = () => {
    setFormData({ ...company });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSaveMessage("");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!company) return null;

  const initials = getInitials(company.name);

  return (
    <>

      <style>{`
        :root {
          --bg-main: #f8fafc;
          --card-bg: #ffffff;
          --primary-brand: #4f46e5;
          --text-main: #0f172a;
          --text-secondary: #64748b;
          --border-color: #e2e8f0;
          --font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .profile-container {
          min-height: 100vh;
          font-family: var(--font-family);
          color: var(--text-main);
        }

        .main-content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Profile Header Component */
        .profile-header-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 3rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .avatar-container {
          position: relative;
          width: 160px;
          height: 160px;
        }

        .avatar-circle {
          width: 160px;
          height: 160px;
          border-radius: 40px; /* Squircle look */
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--primary-brand);
          border: 4px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .company-name {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin-bottom: 0.5rem;
        }

        .company-industry {
          font-size: 1.1rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit {
          background: var(--primary-brand);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          border: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-edit:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        /* Detail Cards */
        .section-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .detail-card:hover {
          border-color: var(--primary-brand);
          background: #fafbff;
        }

        .detail-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          display: block;
        }

        .detail-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-icon {
          color: var(--primary-brand);
          font-size: 1.25rem;
        }

        /* Sections */
        .content-section {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }

        .about-text {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #334155;
          white-space: pre-wrap;
        }

        /* Social Links */
        .social-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0.6rem 1.25rem;
          background: #f1f5f9;
          border-radius: 100px;
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .social-pill:hover {
          background: #e2e8f0;
          color: #0f172a;
          transform: translateY(-2px);
          border-color: #cbd5e1;
        }

        /* Modal Redesign */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 850px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-color);
          animation: modalAppear 0.3s ease-out;
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border-color);
          background: #f8fafc;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-radius: 0 0 24px 24px;
        }

        .form-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .form-control {
          background: #fcfdfe;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 0.6rem 1rem;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          border-color: var(--primary-brand);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          background: #ffffff;
        }

        /* Success Alert */
        .toast-success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #10b981;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 3000;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 992px) {
          .section-grid { grid-template-columns: repeat(2, 1fr); }
          .profile-header-card { padding: 2rem; }
        }

        @media (max-width: 640px) {
          .section-grid { grid-template-columns: 1fr; }
          .profile-header-card { text-align: center; }
          .avatar-container { margin: 0 auto 1.5rem; }
          .company-name { font-size: 1.75rem; }
          .company-industry { justify-content: center; }
          .btn-edit { width: 100%; justify-content: center; margin-top: 1.5rem; }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <div className="profile-container">
        <div className="main-content-wrapper">
          {/* HEADER SECTION */}
          <div className="profile-header-card">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="avatar-container">
                  <div className="avatar-circle">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt="Company Logo"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      initials
                    )}
                  </div>
                </div>
              </div>
              <div className="col ms-2">
                <h1 className="company-name">{company.name || "Company Name"}</h1>
                <div className="company-industry">
                  <i className="bi bi-patch-check-fill text-primary"></i>
                  {company.industry || "Industry not specified"}
                </div>
              </div>
              <div className="col-auto">
                <button className="btn-edit" onClick={openEditModal}>
                  <i className="bi bi-pencil-square"></i>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* KEY STATS/INFO GRID */}
          <div className="section-grid">
            <div className="detail-card">
              <span className="detail-label">Office Email</span>
              <div className="detail-value">
                <i className="bi bi-envelope detail-icon"></i>
                {company.email}
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-label">Contact No.</span>
              <div className="detail-value">
                <i className="bi bi-telephone detail-icon"></i>
                {company.contact || "N/A"}
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-label">Location</span>
              <div className="detail-value">
                <i className="bi bi-geo-alt detail-icon"></i>
                {company.location || "N/A"}
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-label">Company Type</span>
              <div className="detail-value">
                <i className="bi bi-building detail-icon"></i>
                {company.company_type || "N/A"}
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-label">Workforce</span>
              <div className="detail-value">
                <i className="bi bi-people detail-icon"></i>
                {company.employee_count || "N/A"}
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-label">Founded In</span>
              <div className="detail-value">
                <i className="bi bi-calendar-event detail-icon"></i>
                {company.founded_year || "N/A"}
              </div>
            </div>
          </div>

          {/* ABOUT SECTION */}
          <div className="content-section">
            <h2 className="section-title">
              <i className="bi bi-info-circle"></i>
              About the Company
            </h2>
            <p className="about-text">
              {company.description || "No company description has been provided yet."}
            </p>
          </div>

          {/* SOCIAL & WEB SECTION */}
          <div className="content-section">
            <h2 className="section-title">
              <i className="bi bi-share"></i>
              Presence & Website
            </h2>
            <div className="d-flex flex-wrap gap-3">
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <i className="bi bi-globe"></i>
                  Website
                </a>
              )}
              {company.linkedin && (
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <i className="bi bi-linkedin"></i>
                  LinkedIn
                </a>
              )}
              {company.twitter && (
                <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <i className="bi bi-twitter-x"></i>
                  Twitter/X
                </a>
              )}
              {company.facebook && (
                <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <i className="bi bi-facebook"></i>
                  Facebook
                </a>
              )}
              {company.instagram && (
                <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="social-pill">
                  <i className="bi bi-instagram"></i>
                  Instagram
                </a>
              )}
              {!company.website && !company.linkedin && !company.twitter && !company.facebook && !company.instagram && (
                <span className="text-muted italic">No social or web links available.</span>
              )}
            </div>
          </div>

          {/* Success/Error Message */}
          {saveMessage && (
            <div className="toast-success">
              <i className={`bi bi-${saveMessage.includes("Error") ? "exclamation-circle" : "check-circle-fill"}`}></i>
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────── */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Company Profile</h2>
              <button className="btn-close" onClick={closeEditModal} style={{ border: 'none', background: 'none', fontSize: '1.5rem'}}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="row g-4">
                <div className="col-md-6 text-center">
                    <label className="form-label d-block text-start">Company Logo</label>
                    <div className="d-flex align-items-center gap-3">
                        <div style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                             <img
                                src={formData.logo instanceof File ? URL.createObjectURL(formData.logo) : formData.logo || "/placeholder-logo.png"}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="flex-grow-1">
                            <input type="file" className="form-control" name="logo" accept="image/*" onChange={handleInputChange} />
                            {formData.logo && (
                                <button type="button" className="btn btn-link text-danger btn-sm p-0 mt-1" onClick={handleRemoveLogo}>
                                    Remove current logo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Industry</label>
                  <input type="text" className="form-control" name="industry" value={formData.industry || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Website URL</label>
                  <input type="url" className="form-control" name="website" value={formData.website || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact Number</label>
                  <input type="text" className="form-control" name="contact" value={formData.contact || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location (City)</label>
                  <input type="text" className="form-control" name="location" value={formData.location || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <input type="text" className="form-control" name="state" value={formData.state || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Country</label>
                  <input type="text" className="form-control" name="country" value={formData.country || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Founded Year</label>
                  <input type="number" className="form-control" name="founded_year" value={formData.founded_year || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Company Type</label>
                  <input type="text" className="form-control" name="company_type" value={formData.company_type || ""} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Employee Count</label>
                  <input type="text" className="form-control" name="employee_count" value={formData.employee_count || ""} onChange={handleInputChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input type="url" className="form-control" name="linkedin" value={formData.linkedin || ""} onChange={handleInputChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Company Description</label>
                  <textarea className="form-control" rows="4" name="description" value={formData.description || ""} onChange={handleInputChange}></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light px-4" onClick={closeEditModal}>Cancel</button>
              <button type="button" className="btn btn-primary px-5" onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Logo Confirmation Modal */}
      {showRemoveLogoModal && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div className="modal-content" style={{ maxWidth: 400 }}>
            <div className="modal-body text-center p-5">
              <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '3rem'}}></i>
              <h3 className="mt-3 mb-2">Remove Logo?</h3>
              <p className="text-muted">Are you sure you want to remove the company logo? This action cannot be undone.</p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-light px-4" onClick={() => setShowRemoveLogoModal(false)}>Cancel</button>
                <button className="btn btn-danger px-4" onClick={confirmRemoveLogo} disabled={removingLogo}>
                  {removingLogo ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}