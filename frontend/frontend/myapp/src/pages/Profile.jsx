


// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper to get CSRF token from cookies (Django standard)
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [studentName, setStudentName] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [imageError, setImageError] = useState(false);


  // Remove Photo Confirmation Modal States (Same style as Company Logo)
  const [showRemovePhotoModal, setShowRemovePhotoModal] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);

  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name?.trim()) return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    let initials = parts.map((p) => p[0]).join("");
    if (initials.length < 2 && name.length > 1) {
      initials = name.slice(0, 2);
    }
    return initials.toUpperCase() || "?";
  };

  const loadProfile = async () => {
    const email = localStorage.getItem("studentEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const profileRes = await fetch(
        `http://localhost:8000/api/students/profile/?email=${email}`
      );
      if (!profileRes.ok) throw new Error("Failed to fetch profile");
      let profileData = await profileRes.json();

      let socialData = {
        github: "",
        linkedin: "",
        portfolio: "",
        twitter: "",
      };

      try {
        const socialRes = await fetch(
          `http://localhost:8000/api/students/get-social-links/?email=${email}`
        );
        if (socialRes.ok) {
          socialData = await socialRes.json();
        }
      } catch (socialErr) {
        console.warn("Could not load social links (using empty defaults):", socialErr);
      }

      const fullProfile = {
        ...profileData,
        social_links: socialData,
      };

      setProfile(fullProfile);

      if (fullProfile.student?.name && fullProfile.student.name.trim()) {
        setStudentName(fullProfile.student.name.trim());
      } else if (fullProfile.student?.username && fullProfile.student.username.trim()) {
        setStudentName(fullProfile.student.username.trim());
      } else {
        setStudentName("Student");
      }

      setImageError(false);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (!profile || !profile.student) return <p className="error-text">Profile not found</p>;

  const student = profile.student;
  const displayName = studentName;
  const initials = getInitials(displayName);

  let photoUrl = profile.profile_image;
  if (photoUrl && photoUrl.startsWith("/")) {
    photoUrl = `http://localhost:8000${photoUrl}`;
  }

  const hasPhoto = !!(photoUrl && typeof photoUrl === 'string' && photoUrl.trim() !== '' && !imageError);

  // Open Remove Confirmation Modal
  const removeProfilePhoto = () => {
    if (!hasPhoto) return;
    setShowRemovePhotoModal(true);
  };

  // Confirm and Delete Photo
  const confirmRemoveProfilePhoto = async () => {
    setRemovingPhoto(true);
    const email = localStorage.getItem("studentEmail");
    if (!email) {
      alert("No student email found.");
      setRemovingPhoto(false);
      setShowRemovePhotoModal(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/students/profile/delete-photo/?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: {
            "X-CSRFToken": getCookie("csrftoken")
          },
          credentials: "include"
        }
      );

      if (!res.ok) {
        throw new Error("Remove failed");
      }

      await loadProfile();
      setShowRemovePhotoModal(false);
    } catch (err) {
      alert("Error removing photo: " + (err.message || "Unknown error"));
    } finally {
      setRemovingPhoto(false);
    }
  };

  // ──────────────────────────────────────────
  // Modal Handlers
  // ──────────────────────────────────────────
  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData({});
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setModalData((prev) => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  // ──────────────────────────────────────────
  // Submit Handlers
  // ──────────────────────────────────────────
  const submitModal = async () => {
    setLoading(true);

    let url = "";
    let method = "POST";
    let body;
    let successMessage = "";

    switch (modalType) {
      case "addEdu":
      case "editEdu":
        if (!modalData.degree || !modalData.institution) {
          alert("Degree and Institution are required");
          setLoading(false);
          return;
        }
        body = new FormData();
        body.append("degree", modalData.degree);
        body.append("institution", modalData.institution);
        body.append("year_of_passing", modalData.year_of_passing);
        body.append("cgpa", modalData.cgpa);
        body.append("student", student.id);
        url =
          modalType === "editEdu"
            ? `http://localhost:8000/api/students/education/edit/${modalData.id}/`
            : "http://localhost:8000/api/students/education/add/";
        successMessage = modalType === "editEdu" ? "Education updated!" : "Education added!";
        break;

      case "addCert":
      case "editCert":
        if (!modalData.title || (!modalData.file && modalType === "addCert")) {
          alert("Title and file are required for new certificate");
          setLoading(false);
          return;
        }
        body = new FormData();
        body.append("title", modalData.title);
        body.append("issued_by", modalData.issued_by || "");
        body.append("year_obtained", modalData.year_obtained || "");
        if (modalData.file) body.append("certificate_file", modalData.file);
        body.append("student", student.id);
        url =
          modalType === "editCert"
            ? `http://localhost:8000/api/students/certificate/edit/${modalData.id}/`
            : "http://localhost:8000/api/students/certificate/add/";
        successMessage = modalType === "editCert" ? "Certificate updated!" : "Certificate added!";
        break;

      case "editAbout":
        body = new FormData();
        body.append("about", modalData.about?.trim() || "");
        url = `http://localhost:8000/api/students/profile/edit/${student.id}/`;
        successMessage = "About section updated!";
        break;

      case "replaceResume":
        if (!modalData.file) {
          alert("Please select a resume file");
          setLoading(false);
          return;
        }
        body = new FormData();
        body.append("resume_file", modalData.file);
        url = `http://localhost:8000/api/students/resume/edit/${student.id}/`;
        successMessage = "Resume replaced!";
        break;

      case "editSocial":
        url = "http://localhost:8000/api/students/save-social-links/";
        method = "POST";
        body = JSON.stringify({
          email: student.email,
          github: modalData.github?.trim() || "",
          linkedin: modalData.linkedin?.trim() || "",
          portfolio: modalData.portfolio?.trim() || "",
          twitter: modalData.twitter?.trim() || "",
        });
        successMessage = "Social links saved successfully!";
        break;

      default:
        setLoading(false);
        return;
    }

    try {
      const headers = {
        "X-CSRFToken": getCookie("csrftoken"),
      };

      if (modalType === "editSocial") {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(url, {
        method,
        headers,
        body: modalType === "editSocial" ? body : body,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Save failed");
      }

      await loadProfile();
      closeModal();
    } catch (err) {
      alert("Error: " + (err.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────
  // Delete Handlers
  // ──────────────────────────────────────────
  const deleteEducation = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/students/education/delete/${id}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      if (!res.ok) throw new Error("Delete failed");
      loadProfile();
    } catch (err) {
      alert("Error deleting education");
    }
  };

  const deleteCertificate = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/students/certificate/delete/${id}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      if (!res.ok) throw new Error("Delete failed");
      loadProfile();
    } catch (err) {
      alert("Error deleting certificate");
    }
  };

  return (
    <>
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
        :root {
          --primary: #4B0082;
          --primary-light: #6A0DAD;
          --light-violet-bg: rgba(139, 92, 246, 0.15);
          --light-violet-text: #7c3aed;
          --light-violet-border: rgba(139, 92, 246, 0.3);
          --text: #1e293b;
          --text-light: #475569;
          --bg-card: #ffffff;
          --border-light: #e2e8f0;
          --violet-text: #5b21b6;
        }

        .profile-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 5rem 1.5rem 3rem;
          background: #ffffff;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .profile-header-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          padding: 2.5rem;
          margin-bottom: 3rem;
        }

        .profile-header {
          display: flex;
          align-items: flex-start;
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          font-size: 3.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(75,0,130,0.25);
          flex-shrink: 0;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info {
          flex: 1;
          min-width: 280px;
        }

        .section-title {
          font-size: clamp(1.6rem, 4.5vw, 2.1rem);
          font-weight: 800;
          margin: 0 0 1.2rem;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .info-row {
          display: grid;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.2rem;
          font-size: 1.05rem;
          flex-wrap: wrap;
          grid-template-columns: 150px 1fr; /* label column | value column */
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .label-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-value {
          color: #1e293b;
          font-weight: 500;
        }

        .info-row strong {
          min-width: 110px;
          color: var(--violet-text);
          font-weight: 600;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .about-text {
          white-space: pre-wrap;
          line-height: 1.7;
          color: var(--text-light);
          margin-bottom: 1.8rem;
        }

        .profile-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          padding: 2.5rem;
          margin-bottom: 3rem;
        }

        .item-row {
          padding: 1.6rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1.6rem;
        }

        .item-content {
          margin-bottom: 1.2rem;
        }

        .item-actions {
          display: flex;
          flex-direction: row !important;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-start;
          width: 100%;
        }

        /* Responsive: Edit/Delete in same row for mobile */
        @media (max-width: 576px) {
          .item-actions {
            flex-direction: row !important;
            gap: 0.6rem;
            justify-content: flex-start;
            width: 100%;
          }
          .action-btn {
            width: auto;
            min-width: 70px;
            margin-bottom: 0;
          }
        }

        .action-btn {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          text-align: center;
          border: none;
        }

        .action-btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          box-shadow: 0 4px 12px rgba(75,0,130,0.25);
        }

        .action-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(75,0,130,0.4);
        }

        .action-btn-primary::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.45),
            transparent
          );
          transform: skewX(-25deg);
          animation: shine 3.2s linear infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 150%; }
        }

        .action-btn-outline {
          background: white;
          color: var(--primary);
          border: 1px solid var(--primary);
        }

        .action-btn-outline:hover {
          background: var(--light-violet-bg);
        }

        .action-btn-danger {
          background: var(--light-violet-bg);
          color: var(--light-violet-text);
          border: 1px solid var(--light-violet-border);
        }

        .action-btn-danger:hover {
          background: rgba(139, 92, 246, 0.25);
          transform: translateY(-1px);
        }

        .preview-container {
          width: 140px;
          height: 180px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
          cursor: pointer;
          background: #f8fafc;
        }

        .preview-container:hover {
          transform: scale(1.04);
        }

        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-pdf {
          width: 100%;
          height: 100%;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: var(--violet-text);
          border: 2px dashed var(--primary-light);
          gap: 10px;
        }

        .loading-text, .error-text {
          text-align: center;
          font-size: 1.4rem;
          color: var(--primary);
          margin: 5rem 1rem;
        }

        .resume-actions {
          display: flex;
          gap: 1.2rem;
          margin-top: 1.6rem;
          flex-wrap: wrap;
        }

        .resume-actions .action-btn {
          min-width: 160px;
          flex: 1;
          max-width: 220px;
        }

        .social-icon {
          font-size: 1.4rem;
          margin-right: 0.6rem;
        }

        .social-link {
          color: var(--violet-text);
          text-decoration: none;
          transition: color 0.2s;
        }

        .social-link:hover {
          color: var(--primary-light);
        }

        .social-empty {
          color: #64748b;
          font-style: italic;
        }

        .modal-content {
          border-radius: 16px;
          border: none;
          box-shadow: 0 12px 40px rgba(75, 0, 130, 0.22);
        }

        .modal-header {
          background: linear-gradient(135deg, rgba(75,0,130,0.06), rgba(106,13,173,0.06));
          border-bottom: 1px solid #e2e8f0;
          padding: 1.2rem 1.5rem;
        }

        .modal-title {
          font-size: 1.32rem;
          font-weight: 700;
          color: var(--violet-text);
        }

        .modal-body {
          padding: 1.3rem 1.5rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #fafbfc;
          gap: 1rem;
        }

        .modal-form-label {
          font-weight: 600;
          color: var(--violet-text);
          margin-bottom: 0.45rem;
          font-size: 0.96rem;
        }
          

        input.form-control,
        textarea.form-control {
          border-radius: 10px;
          padding: 0.7rem 1.2rem;
          font-size: 0.98rem;
        }

        textarea {
          min-height: 110px;
        }

        .spinner-border {
          width: 1.2rem;
          height: 1.2rem;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .profile-container {
            padding: 2.5rem 0.5rem 1.5rem;
          }
          .profile-header-card, .profile-card {
            padding: 1.2rem 0.7rem;
          }
        }
        @media (max-width: 768px) {
          .profile-container {
            padding: 1.2rem 0.2rem 1rem;
            min-height: unset;
          }
          .profile-header {
            flex-direction: column;
            gap: 2rem;
          }
          .avatar {
            width: 70px;
            height: 70px;
            font-size: 2.1rem;
          }
          .profile-header-card, .profile-card {
            padding: 1rem 0.5rem;
          }
          .action-btn {
            padding: 0.6rem 1.1rem;
            font-size: 0.95rem;
            min-width: 100px;
          }
          @media (max-width: 768px) {
  .info-row {
    display: flex;          /* mobile stacked view */
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}
        }
        @media (max-width: 480px) {
          .profile-container {
            padding: 0.5rem 0.1rem 0.5rem;
          }
          .avatar {
            width: 38px;
            height: 38px;
            font-size: 0.9rem;
          }
          .section-title {
            font-size: 1.1rem;
          }
          .profile-header-card, .profile-card {
            padding: 0.5rem 0.1rem;
          }
          .action-btn {
            padding: 0.45rem 0.7rem;
            font-size: 0.85rem;
            min-width: 70px;
          }
          .resume-actions .action-btn {
            min-width: 90px;
            max-width: 120px;
            font-size: 0.82rem;
            padding: 0.45rem 0.5rem;
          }
        }

        @media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar {
    width: 140px;
    height: 140px;
    font-size: 3.5rem;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 130px;
    height: 130px;
    font-size: 3rem;
  }
}
  /* Better mobile experience */
        @media (max-width: 576px) {
  .profile-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .profile-header-card,
  .profile-card {
    padding-left: 16px;
    padding-right: 16px;
  }

  .item-row,
  .resume-actions,
  .modal-body {
    padding-left: 0;
    padding-right: 0;
  }

  .action-btn {
    width: auto;
    min-width: 70px;
    margin-bottom: 0;
  }

  .item-actions {
    flex-direction: row !important;
    gap: 0.6rem;
    justify-content: flex-start;
    width: 100%;
  }
}

@media (max-width: 400px) {
  .profile-container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
  @media (max-width: 768px) {

  .profile-header {
    flex-direction: column;
    align-items: center;   /* Avatar centered */
  }

  .profile-info {
    width: 100%;
    text-align: left;      /* Not centered */
    padding-left: 20px;    /* 👈 Push slightly right */
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

}

@media (max-width: 768px) {

  .profile-header {
    flex-direction: column;
    align-items: flex-start;   /* 👈 Move to left */
  }

  .profile-header > div:first-child {
    align-items: flex-start;   /* 👈 Move avatar + buttons left */
    margin-left: 20px;         /* 👈 Little right spacing */
  }

}

@media (max-width: 768px) {

  .resume-actions .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3px;              /* space between icon & text */
    white-space: nowrap;   /* 🚀 prevents text going to next line */
  }

}
  .certificate-row {
  display: flex;
  gap: 16px;
}

.certificate-row input {
  flex: 1;                 /* Equal width */
  height: 42px;            /* Same height */
  box-sizing: border-box;
}
.certificate-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.certificate-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.7rem;
  flex-wrap: wrap;       /* 🔥 important */
}

/* Mobile fix */
@media (max-width: 768px) {
  .certificate-meta {
    flex-direction: column;   /* Stack vertically */
    align-items: flex-start;
    gap: 0.6rem;
  }
}
.certificate-row input {
  flex: 1;
  min-width: 0;              /* 🚀 Important: prevents overflow */
  height: 42px;
  box-sizing: border-box;    /* Includes padding inside width */
}

@media (max-width: 768px) {
  .certificate-row {
    flex-direction: column;
  }

  .certificate-row input {
    width: 100%;
  }
}
  *,
*::before,
*::after {
  box-sizing: border-box;
}
@media (max-width: 768px) {
  .certificate-row {
    flex-direction: column;
  }

  .certificate-row input {
    width: 100%;
    height: 42px;
  }
}


      `}</style>
      <style>{`
        .profile-container {
          max-width: 1320px;
          width: 100%;
          padding-top: 0.9rem;
          background: #ffffff;
          display: grid;
          grid-template-columns: minmax(420px, 1fr) minmax(420px, 1fr);
          gap: 0 1rem;
          align-items: stretch;
        }

        .left-stack,
        .right-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-header-card,
        .profile-card {
          background: #ffffff;
          border: 1px solid #cbdcfb;
          border-radius: 12px;
          box-shadow: none;
          padding: 1.05rem 1.05rem;
          margin-bottom: 0;
        }

        .profile-header-card,
        .resume-top-card {
          min-height: 380px;
        }

        .profile-header {
          gap: 1.5rem;
          align-items: flex-start;
        }

        .avatar {
          box-shadow: none;
          background: #0f172a;
          width: 104px;
          height: 104px;
        }

        .section-title {
          background: none;
          -webkit-background-clip: initial;
          -webkit-text-fill-color: initial;
          color: #1d4ed8;
          font-weight: 700;
          letter-spacing: 0;
        }

        .info-row strong,
        .social-link,
        .modal-title,
        .modal-form-label {
          color: #0f172a;
        }

        .section-heading {
          color: #1d4ed8;
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 1rem;
          padding-left: 0.5rem;
          letter-spacing: 0.2px;
        }

        .sub-heading {
          color: #1d4ed8;
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 0.8rem;
          padding-left: 0.35rem;
        }

        .section-divider {
          border-top: 1px solid #dbeafe;
          margin: 1rem 0;
        }

        .item-row {
          background: transparent;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.75rem;
        }

        .preview-container {
          border-radius: 8px;
          box-shadow: none;
          border: 1px solid #e5e7eb;
        }

        .preview-container:hover,
        .action-btn:hover,
        .action-btn-primary:hover,
        .action-btn-danger:hover,
        .action-btn-outline:hover {
          transform: none;
          box-shadow: none;
        }

        .action-btn {
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          border-radius: 8px;
        }

        .action-btn-primary {
          background: #2563eb;
          border: 1px solid #2563eb;
          box-shadow: none;
        }

        .action-btn-primary::before {
          content: none;
          animation: none;
        }

        .action-btn-primary:hover {
          background: #1d4ed8;
          border-color: #1d4ed8;
        }

        .action-btn-outline {
          color: #1e3a8a;
          border: 1px solid #93c5fd;
          background: #ffffff;
        }

        .action-btn-outline:hover {
          background: #eff6ff;
        }

        .action-btn-danger {
          color: #b91c1c;
          background: #fff5f5;
          border: 1px solid #fecaca;
        }

        .social-link {
          font-weight: 500;
          text-decoration: none;
        }

        .modal-content,
        .modal-header {
          box-shadow: none;
          background: #ffffff;
          border-color: #e5e7eb;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding-top: 1.1rem;
            grid-template-columns: 1fr;
            gap: 0.7rem;
          }

          .left-stack,
          .right-stack {
            gap: 0.8rem;
          }

          .profile-header-card,
          .profile-card {
            padding: 1rem 0.8rem;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }

          .section-heading {
            font-size: 1.35rem;
            padding-left: 0.3rem;
          }

          .sub-heading {
            font-size: 1.05rem;
            padding-left: 0.2rem;
          }

          .profile-header-card,
          .resume-top-card {
            min-height: auto;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .profile-header-card,
          .resume-top-card {
            min-height: 340px;
          }
        }
      `}</style>
      <div className="profile-container">
        <div className="left-stack">
          {/* Header + Basic Info */}
          <div className="profile-header-card">
            <div className="profile-header">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                marginTop: "0.6rem"
              }}>
                <div className="avatar" style={{ position: 'relative' }}>
                  {(photoUrl && typeof photoUrl === 'string' && photoUrl.trim() !== '' && !imageError) ? (
                    <img
                      src={photoUrl}
                      alt={`${displayName}'s photo`}
                      onError={() => setImageError(true)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div
                      className="fallback"
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 900,
                        background: '#0f172a',
                        color: 'white',
                        borderRadius: '50%',
                        textTransform: 'uppercase',
                        letterSpacing: 2
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  {loading && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: '50%'
                    }}>
                      <div className="spinner-border text-primary" role="status" style={{ width: 40, height: 40 }}>
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                    </div>
                  )}
                  <input
                    id="student-photo-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const email = localStorage.getItem("studentEmail");
                        if (!email) {
                          alert("No student email found.");
                          return;
                        }
                        const formData = new FormData();
                        formData.append("profile_image", file);
                        formData.append("email", email);
                        try {
                          const res = await fetch(`http://localhost:8000/api/students/profile/edit/${student.id}/`, {
                            method: "POST",
                            headers: {
                              "X-CSRFToken": getCookie("csrftoken")
                            },
                            body: formData,
                            credentials: "include"
                          });
                          if (!res.ok) throw new Error("Upload failed");
                          await loadProfile();
                          setImageError(false);
                        } catch (err) {
                          alert("Error uploading photo: " + (err.message || "Unknown error"));
                        }
                      }
                    }}
                  />
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "180px"
                }}>
                  <button
                    className="action-btn action-btn-primary"
                    style={{ width: "100%", padding: "0.6rem 1.2rem", fontSize: "0.95rem" }}
                    onClick={() => document.getElementById('student-photo-input').click()}
                  >
                    <i className="bi bi-camera-fill me-2"></i>
                    Profile Photo
                  </button>

                  <button
                    className="action-btn action-btn-danger"
                    style={{ width: "100%", padding: "0.6rem 1.2rem", fontSize: "0.95rem" }}
                    onClick={removeProfilePhoto}
                    disabled={!hasPhoto}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Remove
                  </button>
                </div>
              </div>

              <div className="profile-info">
                <h1 className="section-title" style={{ margin: 0 }}>{displayName}</h1>
                <div style={{ marginTop: "1.5rem" }}>
                  <div className="info-row">
                    <div className="label-wrapper">
                      <i className="bi bi-envelope-fill"></i>
                      <strong>Email:</strong>
                    </div>
                    <span className="info-value">{student.email || "—"}</span>
                  </div>
                  <div className="info-row">
                    <div className="label-wrapper">
                      <i className="bi bi-person-badge-fill"></i>
                      <strong>Register No:</strong>
                    </div>
                    <span className="info-value">{student.university_reg_no || "—"}</span>
                  </div>
                  <div className="info-row">
                    <div className="label-wrapper">
                      <i className="bi bi-telephone-fill"></i>
                      <strong>Phone:</strong>
                    </div>
                    <span className="info-value">{student.phone || "Not provided"}</span>
                  </div>
                  <div className="info-row">
                    <div className="label-wrapper">
                      <i className="bi bi-building-fill"></i>
                      <strong>Department:</strong>
                    </div>
                    <span className="info-value">{student.department || "—"}</span>
                  </div>
                  <div className="info-row">
                    <div className="label-wrapper">
                      <i className="bi bi-building-fill"></i>
                      <strong>Passed out year:</strong>
                    </div>
                    <span className="info-value">{student.passed_out_year || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h3 className="section-heading">About & Social Links</h3>

            <h4 className="sub-heading">About Me</h4>
            <p className="about-text">
              {profile.about || "No about information added yet."}
            </p>
            <button
              className="action-btn action-btn-primary"
              onClick={() => openModal("editAbout", { about: profile.about || "" })}
            >
              <i className="bi bi-pencil-square me-2"></i> Edit About
            </button>

            <div className="section-divider"></div>

            <h4 className="sub-heading">Social Links</h4>
            {profile.social_links &&
              Object.values(profile.social_links).some(link => link && link.trim()) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {profile.social_links.github && (
                  <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="bi bi-github social-icon"></i>
                    GitHub
                  </a>
                )}
                {profile.social_links.linkedin && (
                  <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="bi bi-linkedin social-icon"></i>
                    LinkedIn
                  </a>
                )}
                {profile.social_links.portfolio && (
                  <a href={profile.social_links.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="bi bi-globe social-icon"></i>
                    Portfolio
                  </a>
                )}
                {profile.social_links.twitter && (
                  <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                    <i className="bi bi-twitter-x social-icon"></i>
                    Twitter / X
                  </a>
                )}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontStyle: "italic", marginBottom: "1rem" }}>
                No social links added yet.
              </p>
            )}

            <button
              className="action-btn action-btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => openModal("editSocial", profile.social_links || {})}
            >
              <i className="bi bi-pencil-square me-2"></i> Edit Social Links
            </button>
          </div>

          <div className="profile-card">
            <h3 className="section-heading">Education</h3>
            {profile.education?.length > 0 ? (
              profile.education.map((edu) => (
                <div key={edu.id} className="item-row">
                  <div className="item-content">
                    <strong>{edu.degree}</strong> – {edu.institution}
                    <div style={{ color: "#64748b", marginTop: "0.5rem" }}>
                      {edu.year_of_passing} • CGPA: {edu.cgpa || "—"}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="action-btn action-btn-outline"
                      onClick={() => openModal("editEdu", edu)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button
                      className="action-btn action-btn-danger"
                      onClick={() => deleteEducation(edu.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", fontStyle: "italic", marginBottom: "1rem" }}>
                No education entries added yet.
              </p>
            )}
            <button
              className="action-btn action-btn-primary"
              onClick={() => openModal("addEdu")}
            >
              <i className="bi bi-plus-circle-fill me-2"></i> Add Education
            </button>
          </div>
        </div>

        <div className="right-stack">
          <div className="profile-card resume-top-card">
            <h3 className="section-heading">Resume</h3>
            {profile.resume ? (
              <>
                <a href={profile.resume} target="_blank" rel="noreferrer">
                  <div className="preview-container">
                    <div className="preview-pdf">
                      <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "3.2rem" }}></i>
                      <div>View Resume</div>
                      <div style={{ fontSize: "0.9rem" }}>(PDF)</div>
                    </div>
                  </div>
                </a>
                <div className="resume-actions">
                  <button
                    className="action-btn action-btn-primary"
                    style={{ background: "#08203a", borderColor: "#08203a" }}
                    onClick={() => window.open(profile.resume, '_blank')}
                  >
                    <i className="bi bi-download me-2"></i> Download
                  </button>
                  <button
                    className="action-btn action-btn-primary"
                    onClick={() => openModal("replaceResume")}
                  >
                    <i className="bi bi-arrow-repeat me-2"></i> Replace
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ color: "#64748b", fontStyle: "italic", marginBottom: "1rem" }}>
                  No resume uploaded yet.
                </p>
                <button
                  className="action-btn action-btn-primary"
                  onClick={() => openModal("replaceResume")}
                  style={{ width: "100%", marginTop: "0.7rem" }}
                >
                  <i className="bi bi-upload me-2"></i> Upload Resume
                </button>
              </>
            )}
          </div>

          <div className="profile-card">
            <h3 className="section-heading">Certificates</h3>
            {profile.certificates?.length > 0 ? (
              profile.certificates.map((cert) => (
                <div key={cert.id} className="item-row">
                  <div className="item-content">
                    <strong style={{ fontSize: "1.15rem", color: "#0f172a" }}>{cert.title}</strong>
                    <div className="certificate-meta">
                      {cert.issued_by && (
                        <span style={{ background: "#f8fafc", color: "#334155", padding: "0.35rem 0.9rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.98rem", border: "1px solid #e5e7eb" }}>
                          <i className="bi bi-award me-2" style={{ color: "#0f172a" }}></i>
                          Issued By: {cert.issued_by}
                        </span>
                      )}
                      {cert.year_obtained && (
                        <span style={{ background: "#f8fafc", color: "#334155", padding: "0.35rem 0.9rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.98rem", border: "1px solid #e5e7eb" }}>
                          <i className="bi bi-calendar-event me-2" style={{ color: "#0f172a" }}></i>
                          Year Obtained: {cert.year_obtained}
                        </span>
                      )}
                    </div>
                    {cert.certificate_file && (
                      <div style={{ marginTop: "1rem" }}>
                        <a href={cert.certificate_file} target="_blank" rel="noreferrer">
                          <div className="preview-container">
                            <img
                              src={cert.certificate_file}
                              alt={cert.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="item-actions">
                    <button
                      className="action-btn action-btn-outline"
                      onClick={() => openModal("editCert", cert)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button
                      className="action-btn action-btn-danger"
                      onClick={() => deleteCertificate(cert.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", fontStyle: "italic", marginBottom: "1rem" }}>
                No certificates added yet.
              </p>
            )}
            <button
              className="action-btn action-btn-primary"
              onClick={() => openModal("addCert")}
            >
              <i className="bi bi-plus-circle-fill me-2"></i> Add Certificate
            </button>
          </div>
        </div>
      </div>
      {/* ... inside your return ... after the main content ... */}

      {/* Remove Profile Photo Confirmation Modal */}
      {showRemovePhotoModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #4B0082, #6A0DAD)',
              color: 'white',
              padding: '1.4rem 1.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>
                <i className="bi bi-trash me-2"></i> Remove Profile Photo
              </h5>
              <button
                onClick={() => setShowRemovePhotoModal(false)}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '2rem 1.8rem', textAlign: 'center' }}>
              <i className="bi bi-exclamation-circle-fill" style={{ color: '#e53e3e', fontSize: '2.8rem', marginBottom: '1rem' }}></i>
              <div style={{ fontWeight: 600, fontSize: '1.15rem', color: '#1e293b', marginBottom: '0.6rem' }}>
                Are you sure you want to remove your profile photo?
              </div>
              <div style={{ color: '#64748b', fontSize: '0.98rem' }}>
                This action cannot be undone.
              </div>
            </div>

            <div style={{
              padding: '1.2rem 1.8rem',
              background: '#fafbfc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowRemovePhotoModal(false)}
                disabled={removingPhoto}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveProfilePhoto}
                disabled={removingPhoto}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {removingPhoto ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-trash"></i>
                )}
                {removingPhoto ? 'Removing...' : 'Remove Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Modal */}
      {modalType && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.55)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  {modalType.includes("add") ? "Add " : "Edit "}
                  {modalType.includes("Edu") ? "Education" :
                    modalType.includes("Cert") ? "Certificate" :
                      modalType.includes("About") ? "About" :
                        modalType.includes("Social") ? "Social Links" : "Resume"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
                {["addEdu", "editEdu"].includes(modalType) && (
                  <>
                    <div className="mb-3">
                      <label className="modal-form-label">Degree *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="degree"
                        value={modalData.degree || ""}
                        onChange={handleModalChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">Institution *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="institution"
                        value={modalData.institution || ""}
                        onChange={handleModalChange}
                      />
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="modal-form-label">Year of Passing</label>
                        <input
                          type="text"
                          className="form-control"
                          name="year_of_passing"
                          value={modalData.year_of_passing || ""}
                          onChange={handleModalChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="modal-form-label">CGPA</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cgpa"
                          value={modalData.cgpa || ""}
                          onChange={handleModalChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {["addCert", "editCert"].includes(modalType) && (
                  <>
                    <div className="mb-3">
                      <label className="modal-form-label">Certificate Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={modalData.title || ""}
                        onChange={handleModalChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">Issued By *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="issued_by"
                        value={modalData.issued_by || ""}
                        onChange={handleModalChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">Year Obtained *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="year_obtained"
                        value={modalData.year_obtained || ""}
                        onChange={handleModalChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">
                        {modalType === "addCert" ? "Upload Certificate *" : "Replace Certificate (optional)"}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </div>
                  </>
                )}

                {modalType === "editAbout" && (
                  <div className="mb-3">
                    <label className="modal-form-label">About Yourself</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      name="about"
                      value={modalData.about || ""}
                      onChange={handleModalChange}
                      placeholder="Tell something about yourself..."
                    />
                  </div>
                )}

                {modalType === "replaceResume" && (
                  <div className="mb-3">
                    <label className="modal-form-label">Upload New Resume *</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                {modalType === "editSocial" && (
                  <>
                    <div className="mb-3">
                      <label className="modal-form-label">GitHub URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="github"
                        value={modalData.github || ""}
                        onChange={handleModalChange}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">LinkedIn URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="linkedin"
                        value={modalData.linkedin || ""}
                        onChange={handleModalChange}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">Portfolio URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="portfolio"
                        value={modalData.portfolio || ""}
                        onChange={handleModalChange}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="modal-form-label">Twitter / X URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="twitter"
                        value={modalData.twitter || ""}
                        onChange={handleModalChange}
                        placeholder="https://x.com/yourhandle"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="action-btn action-btn-empty px-4"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="action-btn action-btn-primary px-5"
                  onClick={submitModal}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;









