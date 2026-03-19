// AdminRegister.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // added for better UX
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/admin-panel/register/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Success feedback
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1200);

      // Redirect to login after short delay
      setTimeout(() => navigate("/admin"), 1600);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
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
          font-family: 'Poppins', 'Inter', system-ui, sans-serif;
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #22d3ee 100%);
          min-height: 100vh;
          margin: 0;
          overflow-x: hidden;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .login-wrapper {
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 1.5rem;
          padding: 2rem 2.4rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.4);
        }

        .logo-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
          font-size: 2.4rem;
          box-shadow: 0 10px 30px rgba(139,92,246,0.35);
        }

        .login-title {
          font-size: 1.95rem;
          font-weight: 700;
          text-align: center;
          color: #ec4899;
          margin-bottom: 0.4rem;
        }

        .login-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 1rem;
          margin-bottom: 1.8rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 1.3rem;
        }

        .form-control {
          height: 50px;
          padding: 0 3rem 0 3.1rem;
          border: 1px solid #d1d5db;
          border-radius: 1rem;
          font-size: 0.98rem;
          background: #f9fafb;
          transition: all 0.25s;
        }

        .form-control:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 4px rgba(167,139,250,0.25);
          background: white;
        }

        .input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(15%);
          color: #9ca3af;
          font-size: 1.3rem;
          pointer-events: none;
          transition: color 0.25s;
        }

        .input-wrapper:focus-within .input-icon {
          color: #a78bfa;
        }

        .eye-btn {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(15%);
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.3rem;
          cursor: pointer;
        }

        .eye-btn:hover { color: #4b5563; }

        .btn-login {
          width: 100%;
          padding: 0.9rem;
          font-size: 1.02rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(90deg, #ec4899, #f97316);
          border: none;
          border-radius: 3rem;
          transition: all 0.35s;
          box-shadow: 0 6px 20px rgba(236,72,153,0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(236,72,153,0.45);
        }

        .btn-login::before {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 120%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s;
        }

        .btn-login:hover::before {
          left: 120%;
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert-custom {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
          border-radius: 1rem;
          padding: 0.9rem 1.3rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.95rem;
        }

        .register-text {
          text-align: center;
          margin-top: 1.6rem;
          font-size: 0.95rem;
          color: #4b5563;
        }

        .register-link {
          color: #a78bfa;
          font-weight: 600;
          cursor: pointer;
        }

        .register-link:hover {
          color: #c084fc;
          text-decoration: underline;
        }

        .toast-container {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 1055;
          min-width: 300px;
        }

        .security-badge {
          text-align: center;
          margin-top: 1.8rem;
          font-size: 0.88rem;
          color: #6b7280;
        }

        .security-badge i {
          color: #10b981;
          margin-right: 0.4rem;
        }

        @media (max-width: 576px) {
          .login-wrapper {
            padding: 1.8rem 1.8rem;
            max-width: 420px;
          }
          .login-title {
            font-size: 1.8rem;
          }
          .logo-icon {
            width: 70px;
            height: 70px;
            font-size: 2.2rem;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-wrapper">
          <div className="logo-icon">
            <i className="fas fa-user-plus"></i>
          </div>

          <h1 className="login-title">Create Admin Account</h1>
          <p className="login-subtitle">Restricted access — use carefully</p>

          {error && (
            <div className="alert-custom">
              <i className="fas fa-triangle-exclamation"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-wrapper">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>

            <div className="input-wrapper">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="input-wrapper">
              <label className="form-label">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <i className="fas fa-lock input-icon"></i>
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating account...
                </>
              ) : (
                "Register →"
              )}
            </button>
          </form>

          <div className="register-text">
            Already have access?{" "}
            <span
              className="register-link link-underline"
              onClick={() => navigate("/admin")}
            >
              Sign In
            </span>
          </div>

          <div className="security-badge">
            <i className="fas fa-shield-check"></i>
            Secured with end-to-end encryption
          </div>
        </div>

        {/* Success Toast */}
        <div className="toast-container">
          {showToast && (
            <div className="toast align-items-center text-bg-success border-0 show" role="alert">
              <div className="d-flex">
                <div className="toast-body">
                  <i className="fas fa-check-circle me-2"></i>
                  Account created! Redirecting to login...
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setShowToast(false)}
                ></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRegister;