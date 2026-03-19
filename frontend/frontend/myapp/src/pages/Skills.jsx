// src/pages/Skills.jsx
import React, { useEffect, useState } from "react";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [editName, setEditName] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load student ID
  const loadProfile = async () => {
    const email = localStorage.getItem("studentEmail");
    if (!email) {
      setError("No email found. Please login again.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/students/profile/?email=${email}`);
      const data = await res.json();
      if (data.student?.id) {
        setStudentId(data.student.id);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile");
    }
  };

  // Load skills
  const loadSkills = async (sid) => {
    if (!sid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/students/skill/list/?student=${sid}`);
      if (!res.ok) throw new Error("Failed to load skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError("Could not load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (studentId) loadSkills(studentId);
  }, [studentId]);

  const addSkill = async () => {
    if (!skillName.trim()) {
      setError("Please enter a skill name");
      return;
    }

    if (!studentId) {
      setError("No student profile found. Please login again.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("student", studentId);
    formData.append("skill_name", skillName.trim());

    try {
      const res = await fetch("http://localhost:8000/api/students/skill/add/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add skill");

      setSkillName("");
      loadSkills(studentId);
    } catch (err) {
      console.error("Add skill error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (skill) => {
    setEditingSkill(skill);
    setEditName(skill.skill_name);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditName("");
    setError(null);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      setError("Skill name cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("skill_name", editName.trim());

    try {
      const res = await fetch(`http://localhost:8000/api/students/skill/edit/${editingSkill.id}/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update skill");

      setEditingSkill(null);
      setEditName("");
      loadSkills(studentId);
    } catch (err) {
      console.error("Update skill error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/students/skill/delete/${skillId}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete skill");

      loadSkills(studentId);
    } catch (err) {
      console.error("Delete skill error:", err);
      setError("Could not delete skill");
    } finally {
      setLoading(false);
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

        .skills-page-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
          background: #ffffff;
          color: var(--text);
          min-height: 100vh;
          box-sizing: border-box;
        }

        .skills-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .skills-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
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

        .section-title {
          font-size: clamp(1.6rem, 4.5vw, 2.1rem);
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .skills-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          padding: 1.8rem 2rem;
          position: relative;
          box-sizing: border-box;
        }

        .input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.6rem;
          flex-wrap: wrap;
        }

        input[type="text"] {
          flex: 1;
          min-width: 220px;
          padding: 0.75rem 1.3rem;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 0.97rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        input[type="text"]:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(75,0,130,0.15);
          outline: none;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.8rem;
        }

        .action-btn {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          padding: 0.6rem 1.3rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 130px;
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
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
          transform: skewX(-25deg);
          animation: shine 3.2s linear infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 150%; }
        }

        .action-btn-cancel {
          background: #e2e8f0;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .action-btn-cancel:hover {
          background: #cbd5e1;
        }

        .action-btn-delete {
          background: var(--light-violet-bg);
          color: var(--light-violet-text);
          border: 1px solid var(--light-violet-border);
        }

        .action-btn-delete:hover {
          background: rgba(139, 92, 246, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .skill-item {
          padding: 1.2rem 1.4rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          margin-bottom: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        .skill-content {
          flex: 1;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--violet-text);
          word-break: break-word;
          line-height: 1.4;
        }

        .skill-actions {
          display: flex;
          flex-direction: row;
          gap: 0.8rem;
          flex-wrap: nowrap;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          z-index: 10;
          color: var(--primary);
          font-weight: 600;
        }

        .error-message {
          color: #dc2626;
          background: rgba(220,38,38,0.08);
          padding: 0.8rem 1.2rem;
          border-radius: 10px;
          margin-bottom: 1.4rem;
          font-size: 0.95rem;
        }

        .no-skills {
          color: #64748b;
          font-style: italic;
          text-align: center;
          padding: 2.5rem 1rem;
          font-size: 1.05rem;
        }

        /* Inline edit input matches display size */
        .skill-content input {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--violet-text);
          width: 100%;
          border: 1px solid var(--primary);
          border-radius: 8px;
          padding: 0.45rem 0.8rem;
          background: white;
        }

        /* --- Responsive Styles --- */
        @media (max-width: 1024px) {
          .skills-page-content {
            padding: 2.5rem 0.5rem 1.5rem;
          }
          .skills-card {
            padding: 1.2rem 0.7rem;
          }
        }

        @media (max-width: 768px) {
          .skills-page-content {
            padding: 2rem 0.2rem 1rem;
            min-height: unset;
          }
          .skills-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .skills-avatar {
            width: 70px;
            height: 70px;
            font-size: 2.1rem;
          }
          .input-group {
            flex-direction: column;
            gap: 0.7rem;
          }
          input[type="text"] {
            min-width: 100%;
            font-size: 0.95rem;
            padding: 0.6rem 1rem;
          }
          .skill-item {
            padding: 0.8rem 0.7rem;
            gap: 0.7rem;
            flex-direction: column;
            align-items: stretch;
          }
          .skill-content {
            font-size: 1.01rem;
          }
          .action-btn {
            padding: 0.5rem 0.8rem;
            font-size: 0.91rem;
            min-width: 100px;
          }
          .form-actions {
            flex-direction: column;
            gap: 0.7rem;
            align-items: stretch;
          }
        }

        @media (max-width: 480px) {
          .skills-page-content {
            padding: 1rem 0.1rem 0.5rem;
          }
          .skills-header {
            gap: 0.5rem;
          }
          .skills-avatar {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }
          .section-title {
            font-size: 1.1rem;
          }
          .skills-card {
            padding: 0.7rem 0.2rem;
          }
          .skill-content {
            font-size: 0.97rem;
          }
          .action-btn {
            min-width: 80px;
            font-size: 0.85rem;
            padding: 0.4rem 0.5rem;
          }
          .form-actions {
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="skills-page-content">
        {/* Header */}
        <div className="skills-header">
          <div className="skills-avatar">
            <i className="fas fa-tools"></i>
          </div>
          <div>
            <h1 className="section-title">My Skills</h1>
            <p style={{ color: "var(--text-light)", marginTop: "0.5rem", fontSize: "1.02rem" }}>
              Manage your professional skills and competencies
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="skills-card" style={{ position: "relative" }}>
          {loading && (
            <div className="loading-overlay">
              {editingSkill ? "Updating..." : "Saving..."}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {/* Add / Edit form */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Add new skill (e.g. React, Python, Leadership...)"
              value={editingSkill ? editName : skillName}
              onChange={(e) =>
                editingSkill ? setEditName(e.target.value) : setSkillName(e.target.value)
              }
              autoFocus={!!editingSkill}
            />
          </div>

          <div className="form-actions">
            <button
              className="action-btn action-btn-primary"
              onClick={editingSkill ? saveEdit : addSkill}
              disabled={loading}
            >
              {editingSkill ? (
                <>
                  <i className="bi bi-save me-2"></i> Update Skill
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i> Add Skill
                </>
              )}
            </button>

            {editingSkill && (
              <button className="action-btn action-btn-cancel" onClick={cancelEdit} disabled={loading}>
                <i className="bi bi-x-circle me-2"></i> Cancel
              </button>
            )}
          </div>

          <hr style={{ margin: "2rem 0", borderColor: "#e2e8f0" }} />

          {/* Skills list */}
          {skills.length === 0 ? (
            <div className="no-skills">
              No skills added yet. Start building your profile!
            </div>
          ) : (
            skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <div className="skill-content">
                  {editingSkill?.id === skill.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    skill.skill_name
                  )}
                </div>

                <div className="skill-actions">
                  {editingSkill?.id === skill.id ? (
                    <>
                      <button
                        className="action-btn action-btn-primary"
                        onClick={saveEdit}
                        disabled={loading}
                      >
                        <i className="bi bi-save me-1"></i> Save
                      </button>
                      <button
                        className="action-btn action-btn-cancel"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        <i className="bi bi-x-circle me-1"></i> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-btn action-btn-primary"
                        onClick={() => startEdit(skill)}
                      >
                        <i className="bi bi-pencil-square me-1"></i> Edit
                      </button>
                      <button
                        className="action-btn action-btn-delete"
                        onClick={() => deleteSkill(skill.id)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Skills;