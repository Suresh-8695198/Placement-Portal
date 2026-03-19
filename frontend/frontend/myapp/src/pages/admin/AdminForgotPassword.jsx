


// AdminForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [message, setMessage]   = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email");
      return;
    }

    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/admin-panel/forgot-password/send-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to send OTP");
        return;
      }

      // Success → navigate to verify page
      navigate("/admin/verify-otp", { state: { email } });

    } catch (err) {
      setMessage("Server error. Please try again later.");
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

        .forgot-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .forgot-wrapper {
          width: 100%;
          max-width: 480px;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 1.5rem;
          padding: 2.2rem 2.4rem;
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
          margin: 0 auto 1.2rem;
          color: white;
          font-size: 2.4rem;
          box-shadow: 0 10px 30px rgba(139,92,246,0.35);
        }

        .title {
          font-size: 1.85rem;
          font-weight: 700;
          text-align: center;
          color: #ec4899;
          margin-bottom: 0.5rem;
        }

        .subtitle {
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
          margin-bottom: 1.4rem;
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

        .btn-reset {
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

        .btn-reset:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(236,72,153,0.45);
        }

        .btn-reset::before {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 120%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s;
        }

        .btn-reset:hover::before {
          left: 120%;
        }

        .btn-reset:disabled {
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

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .back-link {
          color: #a78bfa;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.6rem;
          font-size: 0.97rem;
        }

        .back-link:hover {
          color: #c084fc;
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .forgot-wrapper {
            padding: 1.8rem 1.8rem;
            max-width: 420px;
          }
          .title {
            font-size: 1.7rem;
          }
          .logo-icon {
            width: 70px;
            height: 70px;
            font-size: 2.2rem;
          }
        }
      `}</style>

      <div className="forgot-page">
        <div className="forgot-wrapper">
          <div className="logo-icon">
            <i className="fas fa-key"></i>
          </div>

          <h1 className="title">Reset Password</h1>
          <p className="subtitle">Enter your email to receive an OTP</p>

          {message && (
            <div className={`alert-custom ${message.includes("OTP") ? "alert-success" : ""}`}>
              <i className={`fas ${message.includes("OTP") ? "fa-check-circle" : "fa-triangle-exclamation"}`}></i>
              {message}
            </div>
          )}

          <div className="input-wrapper">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          <button
            className="btn-reset"
            onClick={sendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Sending OTP...
              </>
            ) : (
              "Send OTP →"
            )}
          </button>

          <div style={{ textAlign: "center" }}>
            <span className="back-link" onClick={() => navigate("/admin/login")}>
              <i className="fas fa-arrow-left"></i> Back to Login
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminForgotPassword;