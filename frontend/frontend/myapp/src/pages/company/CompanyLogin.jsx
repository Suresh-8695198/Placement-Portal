





import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/companies/login/", form);

      // Store user data in localStorage
      localStorage.setItem("companyId", res.data.company_id);
      localStorage.setItem("companyName", res.data.name || "");
      localStorage.setItem("companyEmail", res.data.email || form.email); // fallback to input if not in response

      // Show success toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1400);

      // Redirect to the correct dashboard path (matches your App.jsx nested routes)
      setTimeout(() => {
        navigate("/company/dashboard");  // ← FIXED: this is the correct path
      }, 1800);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/company-forgot-password", { state: { email: form.email } });
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
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <style>{`
        :root {
          --primary-start: #6366f1;
          --primary-end: #8b5cf6;
          --primary-glow: rgba(99, 102, 241, 0.5);
          --focus-ring: rgba(99, 102, 241, 0.18);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #0f172a, #1e3a8a, var(--primary-start));
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
          overflow-x: hidden;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
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
          border-left: 28px solid transparent;
          border-right: 28px solid transparent;
          border-bottom: 56px solid rgba(255, 255, 255, 0.13);
          transform-origin: center;
          animation: floatStar 22s ease-in-out infinite;
          filter: blur(1px);
        }

        .star::before,
        .star::after {
          content: "";
          position: absolute;
          top: 0;
          left: -28px;
          width: 0;
          height: 0;
          border-left: 28px solid transparent;
          border-right: 28px solid transparent;
          border-bottom: 56px solid rgba(255, 255, 255, 0.13);
        }

        .star::before { transform: rotate(72deg); }
        .star::after { transform: rotate(-72deg); }

        .star.small {
          border-left: 18px solid transparent;
          border-right: 18px solid transparent;
          border-bottom: 36px solid rgba(255, 255, 255, 0.11);
        }

        .star.small::before,
        .star.small::after {
          border-left: 18px solid transparent;
          border-right: 18px solid transparent;
          border-bottom: 36px solid rgba(255, 255, 255, 0.11);
        }

        .star:nth-child(1)  { top: 10%; left: 8%;  animation-delay: 0s;   transform: rotate(18deg) scale(0.9); }
        .star:nth-child(2)  { top: 18%; right: 12%; animation-delay: -3s;  transform: rotate(-22deg) scale(1.05); }
        .star:nth-child(3)  { top: 32%; left: 15%;  animation-delay: -6s;  transform: rotate(35deg) scale(0.75); }
        .star:nth-child(4)  { bottom: 22%; left: 10%; animation-delay: -9s; transform: rotate(-15deg) scale(0.95); }
        .star:nth-child(5)  { bottom: 15%; right: 14%; animation-delay: -12s; transform: rotate(28deg) scale(0.85); }
        .star:nth-child(6)  { top: 45%; right: 18%; animation-delay: -15s; transform: rotate(-30deg) scale(1.1); }
        .star:nth-child(7)  { bottom: 35%; left: 20%; animation-delay: -18s; transform: rotate(40deg) scale(0.7); }
        .star:nth-child(8)  { top: 55%; left: 25%; animation-delay: -21s; transform: rotate(10deg) scale(0.9); }

        @keyframes floatStar {
          0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
          50%      { transform: translateY(-110px) rotate(calc(var(--rot, 0deg) + 14deg)); }
        }

        .login-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.93);
          border-radius: 1.6rem;
          padding: 2.2rem 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.24);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.3);
          animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .logo-section { text-align: center; margin-bottom: 1.8rem; }

        .logo-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 12px 30px var(--primary-glow);
          animation: pulseLogo 2.6s ease-in-out infinite;
        }

        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }

        .logo-icon i { font-size: 2.1rem; color: white; }

        .login-title { font-size: 2rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem; }
        .login-subtitle { color: #475569; font-size: 1rem; }

        .form-label { font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; font-size: 0.95rem; display: block; }

        .input-wrapper { position: relative; margin-bottom: 1.4rem; }

        .form-control {
          height: 52px;
          padding: 0 3rem 0 3.1rem;
          border: 1px solid #d1d5db;
          border-radius: 1rem;
          font-size: 0.98rem;
          background: #f8fafc;
          transition: all 0.25s ease;
        }

        .form-control:focus {
          border-color: var(--primary-start);
          background: white;
          box-shadow: 0 0 0 4px var(--focus-ring);
        }

        .input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(15%);
          color: #64748b;
          font-size: 1.3rem;
          pointer-events: none;
          transition: color 0.25s;
        }

        .input-wrapper:focus-within .input-icon { color: var(--primary-start); }

        .eye-btn {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(13%);
          background: none;
          border: none;
          color: #64748b;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0;
        }

        .eye-btn:hover { color: #1e293b; }

        .forgot-link {
          color: var(--primary-start);
          font-size: 0.93rem;
          text-align: right;
          display: block;
          margin: -0.5rem 0 1.5rem;
          cursor: pointer;
        }

        .forgot-link:hover { text-decoration: underline; color: #4f46e5; }

        .btn-login {
          width: 100%;
          padding: 0.9rem;
          font-size: 1.05rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
          border: none;
          border-radius: 1.1rem;
          transition: all 0.35s ease;
          box-shadow: 0 6px 20px var(--primary-glow);
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 14px 35px var(--primary-glow);
        }

        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

        .alert-custom {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
          border-radius: 1rem;
          padding: 1.1rem 1.3rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.96rem;
          animation: shake 0.45s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-7px); }
          40%, 80% { transform: translateX(7px); }
        }

        .toast-container {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 1055;
          min-width: 280px;
        }

        .register-text {
          text-align: center;
          margin-top: 1.8rem;
          font-size: 0.97rem;
          color: #475569;
        }

        .register-link {
          color: var(--primary-start);
          font-weight: 600;
          cursor: pointer;
        }

        .register-link:hover { text-decoration: underline; color: #4f46e5; }

        @media (max-width: 576px) {
          .login-wrapper {
            padding: 1.6rem 1.4rem;
            border-radius: 1.3rem;
            max-width: 90%;
          }

          .login-title { font-size: 1.7rem; }
          .login-subtitle { font-size: 0.92rem; }

          .form-label { font-size: 0.9rem; }
          .form-control {
            height: 48px;
            font-size: 0.94rem;
            padding: 0 2.8rem 0 2.9rem;
          }

          .input-icon,
          .eye-btn { font-size: 1.2rem; }

          .forgot-link { font-size: 0.88rem; }
          .btn-login { font-size: 1rem; padding: 0.8rem; }

          .star {
            border-left: 20px solid transparent !important;
            border-right: 20px solid transparent !important;
            border-bottom: 40px solid rgba(255,255,255,0.12) !important;
          }

          .star::before,
          .star::after {
            border-left: 20px solid transparent !important;
            border-right: 20px solid transparent !important;
            border-bottom: 40px solid rgba(255,255,255,0.12) !important;
          }

          .star.small {
            border-left: 14px solid transparent !important;
            border-right: 14px solid transparent !important;
            border-bottom: 28px solid rgba(255,255,255,0.10) !important;
          }

          .star.small::before,
          .star.small::after {
            border-left: 14px solid transparent !important;
            border-right: 14px solid transparent !important;
            border-bottom: 28px solid rgba(255,255,255,0.10) !important;
          }
        }

        @media (max-width: 360px) {
          .login-wrapper { padding: 1.4rem 1.2rem; }
          .logo-icon { width: 64px; height: 64px; }
          .logo-icon i { font-size: 1.7rem; }
        }
      `}</style>

      <div className="login-page">
        <div className="floating-shapes">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star small"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star small"></div>
          <div className="star"></div>
        </div>

        <div className="login-wrapper">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-building"></i>
            </div>
            <h1 className="login-title">Company Portal</h1>
            <p className="login-subtitle">Sign in to manage postings & applications</p>
          </div>

          {error && (
            <div className="alert-custom">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label className="form-label">Email Address</label>
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="company@business.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="input-wrapper">
              <label className="form-label">Password</label>
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <span className="forgot-link" onClick={handleForgotPassword}>
              Forgot your password?
            </span>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i> Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="toast-container">
          {showToast && (
            <div className="toast align-items-center text-bg-success border-0 show" role="alert">
              <div className="d-flex">
                <div className="toast-body">
                  <i className="fas fa-check-circle me-2"></i>
                  Login successful! Redirecting...
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

export default CompanyLogin;