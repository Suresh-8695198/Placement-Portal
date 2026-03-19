


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
          --primary-start: #6366f1;
          --primary-end: #8b5cf6;
          --primary-glow: rgba(99, 102, 241, 0.4);
          --glass-bg: rgba(255, 255, 255, 0.94);
          --glass-border: rgba(255,255,255,0.28);
          --text-main: #1e293b;
          --text-secondary: #475569;
        }

        

        .profile-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, rgba(15,23,42,0.3), rgba(30,58,138,0.2));
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }

        .floating-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .star {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 40px solid rgba(255, 255, 255, 0.12);
          transform-origin: center;
          animation: floatStar 22s ease-in-out infinite;
          filter: blur(1px);
        }

        @keyframes floatStar {
          0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-80px) rotate(calc(var(--rot, 0deg) + 14deg)); }
        }

        .main-content-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .section-card {
          background: var(--glass-bg);
          border-radius: 1.4rem;
          padding: 2.2rem;
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.18),
            inset 0 0 24px rgba(255,255,255,0.3);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          margin-bottom: 2.5rem;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.25);
        }

        .section-title {
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 1.6rem;
          background: linear-gradient(90deg, var(--primary-start), var(--primary-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-header {
          background: var(--glass-bg);
          border-radius: 1.6rem;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
        }
.avatar-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 48px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  position: relative;
}

/* Remove gradient if there’s an image */
.avatar-circle.has-image {
  background: none;
}

/* Make the image perfectly fill the circle */
.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* fills circle and crops overflow */
  display: block;
}
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1.05rem;
        }

        .info-icon {
          font-size: 1.15rem;
          color: #6c757d !important;
          margin-right: 0.7rem;
          width: 28px;
          text-align: center;
        }

        .info-label {
          font-weight: 600;
          color: var(--text-main);
          min-width: 100px;
        }

        .info-value {
          color: var(--text-secondary);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
          border: none;
          box-shadow: 0 5px 18px var(--primary-glow);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px var(--primary-glow);
        }

        .btn-secondary {
          background: rgba(107,114,128,0.12);
          color: #4b5563;
          border: 1px solid rgba(107,114,128,0.3);
        }

        .btn-secondary:hover {
          background: rgba(107,114,128,0.22);
        }

        .alert-custom {
          border-radius: 1rem;
          padding: 1.2rem 1.5rem;
          margin-top: 1.5rem;
          font-weight: 500;
          border-left: 5px solid;
        }

        .alert-success {
          background: rgba(16,185,129,0.12);
          color: #065f46;
          border-left-color: #10b981;
        }

        .alert-danger {
          background: rgba(239,68,68,0.12);
          color: #991b1b;
          border-left-color: #ef4444;
        }

        /* Force black text where needed */
        .section-card .company-detail-text,
        .section-card .social-links-text,
        .section-card .about-description {
          color: #000000 !important;
        }

        .section-card strong {
          color: #000000 !important;
        }

        /* Modal styles – glassmorphism consistent with your design */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          background: var(--glass-bg);
          border-radius: 1.6rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.28),
                      inset 0 0 30px rgba(255,255,255,0.35);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          width: 100%;
          max-width: 900px;
          max-height: 92vh;
          overflow-y: auto;
          animation: modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          padding: 1.8rem 2.2rem 1.2rem;
          border-bottom: 1px solid rgba(226,232,240,0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-close-btn {
          background: none;
          border: none;
          font-size: 2.2rem;
          color: #64748b;
          cursor: pointer;
        }

        .modal-close-btn:hover {
          color: #ef4444;
        }

        .modal-body {
          padding: 1.8rem 2.2rem 2.2rem;
        }

        .modal-footer {
          padding: 1.4rem 2.2rem;
          border-top: 1px solid rgba(226,232,240,0.5);
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          background: rgba(255,255,255,0.35);
        }

        /* Form elements inside modal - match your style */
        .form-label {
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem 1.1rem;
          border: 1px solid rgba(209,213,219,0.6);
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.85);
          color: #000000;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: var(--primary-start);
          box-shadow: 0 0 0 4px var(--primary-glow);
          background: white;
          outline: none;
        }

        .form-control::placeholder {
          color: #6c757d;
        }

        textarea.form-control {
          min-height: 140px;
          resize: vertical;
        }

        @media (max-width: 768px) {
          .modal-content { max-width: 95%; border-radius: 1.2rem; }
          .modal-header, .modal-body, .modal-footer {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .avatar-circle { width: 110px; height: 110px; font-size: 3rem; }
        }

        /* Extra mobile responsiveness */
        @media (max-width: 576px) {
          .profile-container {
            padding: 0.7rem 0.2rem;
          }
          .main-content-wrapper {
            padding: 0;
          }
          .profile-header, .section-card {
            padding: 1.1rem 0.7rem;
            border-radius: 1rem;
          }
          .avatar-circle {
            width: 70px;
            height: 70px;
            font-size: 1.5rem;
          }
          .section-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }
          .info-item {
            font-size: 0.98rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }
          .info-icon {
            font-size: 1.1rem;
            margin-right: 0.5rem;
            width: 28px;
          }
          .info-label {
            min-width: 80px;
            font-size: 0.98rem;
          }
          .modal-content {
            padding: 0.5rem;
            border-radius: 0.7rem;
          }
          .modal-header, .modal-body, .modal-footer {
            padding-left: 0.7rem;
            padding-right: 0.7rem;
          }
          .modal-header {
            padding-top: 1rem;
            padding-bottom: 0.7rem;
          }
          .modal-footer {
            padding-bottom: 1rem;
            gap: 0.5rem;
          }
          .form-label, .form-control {
            font-size: 0.98rem;
          }
        }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <div className="profile-container">
        <div className="floating-shapes">
          <div className="star" style={{ top: "10%", left: "8%", animationDelay: "0s" }}></div>
          <div className="star" style={{ top: "25%", right: "12%", animationDelay: "-4s" }}></div>
          <div className="star" style={{ bottom: "20%", left: "15%", animationDelay: "-8s" }}></div>
          <div className="star" style={{ top: "45%", right: "18%", animationDelay: "-12s" }}></div>
        </div>

        <div className="main-content-wrapper">
          {/* PROFILE HEADER */}
          <div className="profile-header">
            <div className="row align-items-center g-5">
              <div className="col-md-3 text-center">
                <div
                  className="avatar-circle mx-auto"
                  style={company.logo ? {
                    background: 'none',
                    boxShadow: 'none',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: 0
                  } : {}}
                >
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt="Company Logo"
                      className="w-100 h-100 object-fit-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    initials
                  )}
                </div>
              </div>

              <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                  <div>
                    <h1 className="section-title mb-2">{company.name || "Company Name"}</h1>
                    <h5 className="text-muted">{company.industry || "Industry not specified"}</h5>
                  </div>
                  <button
                    className="btn btn-primary px-4 py-2"
                    onClick={openEditModal}
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <div className="info-item">
                      <span className="info-label">
                        <i className="bi bi-envelope-fill info-icon me-1"></i> Email:
                      </span>
                      <span className="info-value ms-2">{company.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="bi bi-telephone-fill info-icon me-1"></i> Contact:
                      </span>
                      <span className="info-value ms-2">{company.contact || "—"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="bi bi-globe info-icon me-1"></i> Website:
                      </span>
                      <span className="info-value ms-2">
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary fw-bold">
                            {company.website}
                          </a>
                        ) : (
                          "—"
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="bi bi-geo-alt-fill info-icon me-1"></i> Location:
                      </span>
                      <span className="info-value ms-2">{company.location || "—"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="bi bi-geo-fill info-icon me-1"></i> Address:
                      </span>
                      <span className="info-value ms-2">{company.address || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY DETAILS */}
          <div className="section-card">
            <h2 className="section-title">Company Details</h2>
            <div className="row g-4 company-detail-text">
              <div className="col-md-4">
                <strong>Company Type:</strong><br />
                {company.company_type || "—"}
              </div>
              <div className="col-md-4">
                <strong>Employee Count:</strong><br />
                {company.employee_count || "—"}
              </div>
              <div className="col-md-4">
                <strong>Founded Year:</strong><br />
                {company.founded_year || "—"}
              </div>

              <div className="col-md-4">
                <strong>Registration Number:</strong><br />
                {company.registration_number || "—"}
              </div>
              <div className="col-md-8">
                <strong>Full Address:</strong><br />
                {company.address || "—"}<br />
                {company.location && `${company.location}, `}
                {company.state && `${company.state}, `}
                {company.country || ""}
              </div>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="section-card">
            <h2 className="section-title">Social Links</h2>
            {company.linkedin || company.twitter || company.facebook || company.instagram ? (
              <div className="d-flex flex-wrap gap-3 social-links-text">
                {company.linkedin && (
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                    <i className="bi bi-linkedin me-2"></i> LinkedIn
                  </a>
                )}
                {company.twitter && (
                  <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info">
                    <i className="bi bi-twitter-x me-2"></i> Twitter/X
                  </a>
                )}
                {company.facebook && (
                  <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                    <i className="bi bi-facebook me-2"></i> Facebook
                  </a>
                )}
                {company.instagram && (
                  <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger">
                    <i className="bi bi-instagram me-2"></i> Instagram
                  </a>
                )}
              </div>
            ) : (
              <p className="social-links-text" style={{ fontStyle: "italic" }}>
                No social links added yet
              </p>
            )}
          </div>

          {/* ABOUT */}
          <div className="section-card">
            <h2 className="section-title">About the Company</h2>
            <p className="about-description lh-lg mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {company.description || "No company description has been provided yet."}
            </p>
          </div>

          {/* Success/Error Message */}
          {saveMessage && (
            <div className={`alert-custom mx-auto mt-4 ${saveMessage.includes("Error") ? "alert-danger" : "alert-success"}`} style={{ maxWidth: "600px" }}>
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
              <h2 className="section-title" style={{ margin: 0, fontSize: "1.9rem" }}>
                Edit Company Profile
              </h2>
              <button className="modal-close-btn" onClick={closeEditModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Logo</label>
                  <input
                    type="file"
                    className="form-control"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {formData.logo && (
                    <div style={{ marginTop: 8, width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img
                        src={formData.logo instanceof File ? URL.createObjectURL(formData.logo) : formData.logo}
                        alt="Current Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'scale-down', borderRadius: '50%', background: '#fff', display: 'block' }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ position: 'absolute', top: 6, right: 6, borderRadius: '50%', padding: '0.3rem 0.5rem', fontSize: '1.1rem', zIndex: 2 }}
                        onClick={handleRemoveLogo}
                        title="Remove Logo"
                        disabled={removingLogo}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                      {/* Remove Logo Modal */}
                      {showRemoveLogoModal && (
                        <div className="modal-overlay" style={{ zIndex: 2000 }}>
                          <div className="modal-content" style={{ maxWidth: 400, padding: 0 }}>
                            <div className="modal-header" style={{ borderBottom: '1px solid #eee', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '1.6rem 1.6rem 0 0' }}>
                              <h5 className="modal-title" style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>
                                <i className="bi bi-trash me-2"></i> Remove Company Logo
                              </h5>
                              <button className="modal-close-btn" onClick={() => setShowRemoveLogoModal(false)} style={{ color: '#fff' }}>×</button>
                            </div>
                            <div className="modal-body" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <i className="bi bi-exclamation-circle-fill" style={{ color: '#e53e3e', fontSize: '2.2rem', marginBottom: '0.7rem' }}></i>
                              <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                                Are you sure you want to remove the company logo?
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.98rem' }}>
                                This action cannot be undone.
                              </div>
                            </div>
                            <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee', background: '#fafbfc', gap: '1rem', borderRadius: '0 0 1.6rem 1.6rem' }}>
                              <button
                                type="button"
                                className="btn btn-secondary px-4"
                                onClick={() => setShowRemoveLogoModal(false)}
                                disabled={removingLogo}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger px-4"
                                onClick={confirmRemoveLogo}
                                disabled={removingLogo}
                              >
                                {removingLogo ? (
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : (
                                  <i className="bi bi-trash me-2"></i>
                                )}
                                Remove Logo
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contact"
                    value={formData.contact || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Full Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Industry</label>
                  <input
                    type="text"
                    className="form-control"
                    name="industry"
                    value={formData.industry || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Company Type</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company_type"
                    value={formData.company_type || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Employee Count</label>
                  <input
                    type="text"
                    className="form-control"
                    name="employee_count"
                    value={formData.employee_count || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 51-200"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Founded Year</label>
                  <input
                    type="number"
                    className="form-control"
                    name="founded_year"
                    value={formData.founded_year || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 2015"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Registration Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="registration_number"
                    value={formData.registration_number || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="form-control"
                    name="linkedin"
                    value={formData.linkedin || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Twitter / X</label>
                  <input
                    type="url"
                    className="form-control"
                    name="twitter"
                    value={formData.twitter || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Facebook</label>
                  <input
                    type="url"
                    className="form-control"
                    name="facebook"
                    value={formData.facebook || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Instagram</label>
                  <input
                    type="url"
                    className="form-control"
                    name="instagram"
                    value={formData.instagram || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Company Description</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    placeholder="Tell about your company, mission, values..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary px-5"
                onClick={closeEditModal}
                disabled={saveLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary px-5"
                onClick={handleSave}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}