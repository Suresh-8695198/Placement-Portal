




// src/pages/CompanyApplicants.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function CompanyApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const companyEmail = localStorage.getItem("companyEmail");

  useEffect(() => {
    if (!companyEmail) {
      setError("Please login as company first");
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/companies/applicants/?email=${encodeURIComponent(companyEmail)}`
        );
        // Only show pending applications
        const filtered = (response.data.applications || []).filter(
          (app) => app.status !== "Selected" && app.status !== "Rejected"
        );
        setApplicants(filtered);
        setFilteredApplicants(filtered);
      } catch (err) {
        setError(
          err.response?.data?.error || "Could not load applicants. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [companyEmail]);

  // Real-time search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApplicants(applicants);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    const results = applicants.filter((app) => {
      const name = (app.student?.name || "").toLowerCase();
      const email = (app.student?.email || "").toLowerCase();
      const dept = (app.student?.department || "").toLowerCase();
      const jobTitle = (app.job?.title || "").toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        dept.includes(term) ||
        jobTitle.includes(term)
      );
    });

    setFilteredApplicants(results);
  }, [searchTerm, applicants]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axios.post(
        `${API_BASE}/companies/update-application-status/${applicationId}/`,
        { status: newStatus }
      );

      alert(response.data.message);

      // Remove from list if final decision made
      setApplicants((prev) =>
        prev.filter((app) => {
          if (app.application_id === applicationId) {
            return newStatus !== "Selected" && newStatus !== "Rejected";
          }
          return true;
        })
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  useEffect(() => {
    if (!selectedStudentEmail || !companyEmail) {
      setProfile(null);
      setProfileError(null);
      return;
    }

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE}/companies/student-profile/${encodeURIComponent(selectedStudentEmail)}/`,
          { params: { company_email: companyEmail } }
        );
        setProfile(response.data);
      } catch (err) {
        setProfileError("Failed to load student profile");
        console.error("Profile fetch error:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [selectedStudentEmail, companyEmail]);

  const closeModal = () => {
    setSelectedStudentEmail(null);
  };

  // Helper to safely get array
  const getArray = (fieldName) => {
    const possible = [fieldName, fieldName + "s", "student_" + fieldName];
    for (const f of possible) {
      if (Array.isArray(profile?.[f])) return profile[f];
    }
    return [];
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

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

        .applicants-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, rgba(15,23,42,0.3), rgba(30,58,138,0.2));
          backdrop-filter: blur(8px);
        }

        .main-content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2.1rem;
          font-weight: 900;
          margin-bottom: 1.8rem;
          background: linear-gradient(90deg, var(--primary-start), var(--primary-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Search Bar Styles */
        .search-wrapper {
          position: relative;
          max-width: 500px;
          margin: 1.5rem auto 2.5rem;
        }

        .search-input {
          width: 100%;
          padding: 0.95rem 1.4rem;
          padding-right: 3.5rem;
          border: 1px solid rgba(209,213,219,0.6);
          border-radius: 9999px;
          font-size: 1rem;
          background: rgba(255,255,255,0.85);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-start);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .clear-btn {
          position: absolute;
          right: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.6rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .clear-btn:hover {
          color: #ef4444;
        }

        .applicants-grid {
          display: grid;
          gap: 1.6rem 1.8rem;
        }

        @media (min-width: 992px) { .applicants-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px) and (max-width: 991px) { .applicants-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 767px) { .applicants-grid { grid-template-columns: 1fr; } }

        .applicant-card {
          background: var(--glass-bg);
          border-radius: 1.4rem;
          padding: 1.8rem;
          box-shadow: 0 10px 32px rgba(0,0,0,0.15), inset 0 0 18px rgba(255,255,255,0.25);
          backdrop-filter: blur(14px);
          border: 1px solid var(--glass-border);
          transition: all 0.35s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 340px;
        }

        .applicant-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.28);
        }

        .applicant-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .applicant-info {
          font-size: 0.96rem;
          color: var(--text-secondary);
          margin-bottom: 0.7rem;
        }

        .status-section {
          margin: 1.2rem 0;
        }

        .status-label {
          font-weight: 600;
          color: var(--text-main);
          margin-right: 0.5rem;
        }

        .status-badge {
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
        }

        .status-applied { background: #cbd5e1; color: #334155; }
        .status-shortlisted { background: linear-gradient(135deg, #facc15, #fde047); color: #713f12; }
        .status-selected { background: linear-gradient(135deg, #10b981, #34d399); color: white; }
        .status-rejected { background: linear-gradient(135deg, #ef4444, #f87171); color: white; }

        .action-row {
          display: flex;
          gap: 0.9rem;
          margin-top: auto;
          padding-top: 1.2rem;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1 1 110px;
          padding: 0.8rem 1.4rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.96rem;
          cursor: pointer;
          transition: all 0.28s ease;
          border: none;
          color: white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .btn-view { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        .btn-shortlist { background: linear-gradient(135deg, #facc15, #fde047); color: #713f12; }
        .btn-select { background: linear-gradient(135deg, #10b981, #34d399); }
        .btn-reject { background: linear-gradient(135deg, #ef4444, #f87171); }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          background: var(--glass-bg);
          border-radius: 1.4rem;
          padding: 2rem;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-x: hidden;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.28), inset 0 0 30px rgba(255,255,255,0.35);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: #6366f1 transparent;
        }

        .modal-content * {
          max-width: 100% !important;
          box-sizing: border-box;
        }

        .modal-close {
          position: absolute;
          top: 1.2rem;
          right: 1.4rem;
          background: none;
          border: none;
          font-size: 1.9rem;
          color: #64748b;
          cursor: pointer;
        }

        .modal-close:hover { color: var(--text-main); }

        .modal-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #000000;
          margin-bottom: 1.8rem;
          padding-right: 2.5rem;
        }

        .modal-section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #000000;
          margin: 2.4rem 0 1.2rem;
          border-bottom: 1px solid rgba(99,102,241,0.18);
          padding-bottom: 0.5rem;
        }

        .modal-info {
          font-size: 1.05rem;
          color: #000000;
          margin-bottom: 0.9rem;
          line-height: 1.5;
        }

        .modal-info strong {
          color: #000000;
          font-weight: 600;
        }

        .skill-tag {
          background: rgba(99,102,241,0.12);
          color: #4f46e5;
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          font-size: 0.95rem;
          margin-right: 0.7rem;
          margin-bottom: 0.7rem;
          display: inline-block;
        }

        .education-item,
        .internship-item,
        .certificate-item,
        .project-item {
          margin-bottom: 1.6rem;
          padding-left: 1.2rem;
          border-left: 4px solid #6366f1;
          color: #000000;
        }

        .project-item {
          border-left-color: #8b5cf6;
        }

        .certificate-item {
          border-left-color: #10b981;
        }

        .loading-spinner {
          border: 5px solid rgba(99,102,241,0.12);
          border-top: 5px solid var(--primary-start);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
          margin: 4rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .social-link {
          color: #6366f1;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-right: 1.2rem;
          margin-bottom: 0.8rem;
        }

        .social-link:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        .resume-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.8rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          border-radius: 0.9rem;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
          transition: all 0.3s ease;
          width: fit-content;
          white-space: nowrap;
        }

        .resume-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(99,102,241,0.4);
        }

        /* Limit internship description to 2 lines with ellipsis */
        .internship-description {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5;
          max-height: 3em;
          margin-top: 0.6rem;
          color: #000000;
        }

        /* Fallback for non-webkit browsers */
        .internship-description {
          max-height: 3em;
          overflow: hidden;
        }

        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 0;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }
/* Force Education section text fully black */
.education-item,
.education-item div,
.education-item span,
.education-item p {
  color: #000000 !important;
}
      `}</style>

      <div className="applicants-container">
        <div className="main-content-wrapper">
          <h1 className="section-title">Job Applicants</h1>

          {/* Search Bar */}
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, department, job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "1.2rem", color: "#94a3b8" }}>Loading applicants...</p>
            </div>
          ) : error ? (
            <div style={{ color: "#991b1b", fontWeight: 500, textAlign: "center", padding: "2rem" }}>
              {error}
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="text-center py-10" style={{ color: "#64748b", fontSize: "1.1rem" }}>
              {searchTerm
                ? "No matching applicants found."
                : "No pending applications at the moment.\nSelected / Rejected applications are hidden from this view."}
            </div>
          ) : (
            <div className="applicants-grid">
              {filteredApplicants.map((app) => {
                const status = app.status || "Applied";
                let statusClass =
                  status === "Shortlisted" ? "status-shortlisted"
                  : status === "Selected" ? "status-selected"
                  : status === "Rejected" ? "status-rejected"
                  : "status-applied";

                return (
                  <div key={app.application_id} className="applicant-card">
                    <h3 className="applicant-name">
                      {app.student?.name || "Unknown Applicant"}
                    </h3>
                    <div className="applicant-info"><strong>Email:</strong> {app.student?.email}</div>
                    <div className="applicant-info"><strong>Department:</strong> {app.student?.department || "—"}</div>
                    <div className="applicant-info"><strong>Applied for:</strong> {app.job?.title}</div>
                    <div className="status-section">
                      <span className="status-label">Status:</span>
                      <span className={`status-badge ${statusClass}`}>{status}</span>
                    </div>
                    <div className="action-row">
                      <button
                        className="action-btn btn-view"
                        onClick={() => setSelectedStudentEmail(app.student?.email)}
                      >
                        View Profile
                      </button>
                      <button
                        className="action-btn btn-shortlist"
                        onClick={() => updateStatus(app.application_id, "Shortlisted")}
                        disabled={status === "Shortlisted"}
                      >
                        Shortlist
                      </button>
                      <button
                        className="action-btn btn-select"
                        onClick={() => updateStatus(app.application_id, "Selected")}
                        disabled={status === "Selected"}
                      >
                        Select
                      </button>
                      <button
                        className="action-btn btn-reject"
                        onClick={() => updateStatus(app.application_id, "Rejected")}
                        disabled={status === "Rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STUDENT PROFILE MODAL ── */}
          {selectedStudentEmail && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>✕</button>

                {profileLoading ? (
                  <div className="loading-spinner" style={{ margin: "5rem auto" }}></div>
                ) : profileError ? (
                  <div style={{ color: "#991b1b", textAlign: "center", padding: "4rem 1rem" }}>
                    {profileError}
                  </div>
                ) : profile ? (
                  <>
                    <h2 className="modal-title">{profile.student?.name || "Student Profile"}</h2>

                    <div className="modal-info"><strong>Email:</strong> {profile.student?.email}</div>
                    <div className="modal-info"><strong>Phone:</strong> {profile.student?.phone || "—"}</div>
                    <div className="modal-info"><strong>Department:</strong> {profile.student?.department || "—"}</div>
                    <div className="modal-info"><strong>Programme:</strong> {profile.student?.programme || "—"}</div>
                    <div className="modal-info"><strong>Register No:</strong> {profile.student?.university_reg_no || "—"}</div>

                    {/* Education - all text black */}
                    {getArray("educations").length > 0 && (
                      <>
                        <h3 className="modal-section-title">Education</h3>
                        {getArray("educations").map((edu, idx) => (
                          <div key={idx} className="education-item">
                            <div style={{ fontWeight: 600, fontSize: "1.08rem", color: "#000000" }}>
                              {edu.degree || "Degree"}
                            </div>
                            <div style={{ color: "#000000" }}>
                              {edu.institution || "—"}
                            </div>
                            <div style={{ color: "#000000", marginTop: "0.3rem" }}>
                              {edu.year_from ? `${edu.year_from} – ` : ""}
                              {edu.year_to || "Present"}
                              {edu.cgpa && ` • CGPA: ${edu.cgpa}`}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Skills */}
                    {profile.skills?.length > 0 && (
                      <>
                        <h3 className="modal-section-title">Skills</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                          {profile.skills.map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Internships */}
                    {getArray("internships").length > 0 && (
                      <>
                        <h3 className="modal-section-title">Internships</h3>
                        {getArray("internships").map((intern, idx) => (
                          <div key={idx} className="internship-item">
                            <div style={{ fontWeight: 700, fontSize: "1.08rem", color: "#000000" }}>
                              {intern.company_name || "Company Name"}
                              {intern.domain && ` — ${intern.domain}`}
                            </div>
                            {intern.duration && (
                              <div style={{ color: "#475569", margin: "0.3rem 0" }}>
                                {intern.duration}
                              </div>
                            )}
                            {intern.description && (
                              <p className="internship-description">
                                {intern.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Projects */}
                    {getArray("projects").length > 0 && (
                      <>
                        <h3 className="modal-section-title">Projects</h3>
                        {getArray("projects").map((proj, idx) => (
                          <div key={idx} className="project-item">
                            <div style={{ fontWeight: 700, fontSize: "1.08rem", color: "#000000" }}>
                              {proj.title || "Project Title"}
                            </div>
                            {proj.technologies && (
                              <div style={{ color: "#4f46e5", margin: "0.4rem 0" }}>
                                Technologies: {proj.technologies}
                              </div>
                            )}
                            {proj.description && (
                              <p style={{ color: "#000000", margin: "0.6rem 0" }}>{proj.description}</p>
                            )}
                            <div style={{ marginTop: "0.6rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                              {proj.github_link && (
                                <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="social-link">
                                  GitHub →
                                </a>
                              )}
                              {proj.live_link && (
                                <a href={proj.live_link} target="_blank" rel="noopener noreferrer" className="social-link">
                                  Live Demo →
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Certificates */}
                    {getArray("certificates").length > 0 && (
                      <>
                        <h3 className="modal-section-title">Certificates</h3>
                        {getArray("certificates").map((cert, idx) => (
                          <div key={idx} className="certificate-item">
                            <div style={{ fontWeight: 700, fontSize: "1.08rem", color: "#000000" }}>
                              {cert.title || "Certificate Title"}
                            </div>
                            <div style={{ color: "#000000", margin: "0.3rem 0" }}>
                              Issued by: <strong>{cert.issued_by || "—"}</strong>
                            </div>
                            <div style={{ color: "#475569", marginBottom: "0.6rem" }}>
                              Year: <strong>{cert.year_obtained || "—"}</strong>
                            </div>
                            {cert.file && (
                              <a
                                href={cert.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#6366f1",
                                  fontWeight: 600,
                                  textDecoration: "none",
                                }}
                              >
                                View Certificate →
                              </a>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Social Links */}
                    {profile.social_links && Object.values(profile.social_links).some(Boolean) && (
                      <>
                        <h3 className="modal-section-title">Social Links</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                          {profile.social_links.github && (
                            <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="social-link">
                              <i className="bi bi-github"></i> GitHub
                            </a>
                          )}
                          {profile.social_links.linkedin && (
                            <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                              <i className="bi bi-linkedin"></i> LinkedIn
                            </a>
                          )}
                          {profile.social_links.portfolio && (
                            <a href={profile.social_links.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                              <i className="bi bi-globe"></i> Portfolio
                            </a>
                          )}
                          {profile.social_links.twitter && (
                            <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                              <i className="bi bi-twitter-x"></i> Twitter
                            </a>
                          )}
                        </div>
                      </>
                    )}

                    {/* Resume */}
                    {profile.resume ? (
                      <>
                        <h3 className="modal-section-title" style={{ marginTop: "2.5rem" }}>
                          Resume
                        </h3>
                        <a
                          href={profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resume-btn"
                        >
                          <i className="bi bi-file-earmark-pdf-fill"></i>
                          View Resume
                        </a>
                      </>
                    ) : (
                      <>
                        <h3 className="modal-section-title" style={{ marginTop: "2.5rem" }}>
                          Resume
                        </h3>
                        <div
                          style={{
                            padding: "1.2rem",
                            background: "rgba(226,232,240,0.7)",
                            borderRadius: "0.8rem",
                            color: "#64748b",
                            fontStyle: "italic",
                            textAlign: "center",
                            border: "1px dashed #cbd5e1",
                            width: "fit-content",
                          }}
                        >
                          No resume uploaded
                        </div>
                      </>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}