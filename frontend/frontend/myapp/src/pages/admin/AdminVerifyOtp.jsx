// AdminVerifyOtp.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter the OTP");
      return;
    }

    if (!email) {
      setMessage("Email information is missing. Please try again from forgot password.");
      return;
    }

    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/admin-panel/forgot-password/verify-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Invalid or expired OTP");
        return;
      }

      // Success → go to reset password page
      navigate("/admin/reset-password", { state: { email } });

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

        .verify-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .verify-wrapper {
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

        .email-hint {
          text-align: center;
          color: #4b5563;
          font-size: 0.95rem;
          margin-bottom: 1.6rem;
          padding: 0.6rem;
          background: rgba(167,139,250,0.08);
          border-radius: 0.8rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 1.6rem;
        }

        .form-control {
          height: 50px;
          padding: 0 3rem 0 3.1rem;
          border: 1px solid #d1d5db;
          border-radius: 1rem;
          font-size: 1.1rem;
          letter-spacing: 0.8px;
          text-align: center;
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

        .btn-verify {
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

        .btn-verify:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(236,72,153,0.45);
        }

        .btn-verify::before {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 120%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.6s;
        }

        .btn-verify:hover::before {
          left: 120%;
        }

        .btn-verify:disabled {
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

        .back-link {
          color: #a78bfa;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.8rem;
          font-size: 0.97rem;
        }

        .back-link:hover {
          color: #c084fc;
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .verify-wrapper {
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

      <div className="verify-page">
        <div className="verify-wrapper">
          <div className="logo-icon">
            <i className="fas fa-shield-check"></i>
          </div>

          <h1 className="title">Verify OTP</h1>
          <p className="subtitle">Enter the code sent to your email</p>

          <div className="email-hint">
            Sent to: <strong>{email || "your admin email"}</strong>
          </div>

          {message && (
            <div className="alert-custom">
              <i className="fas fa-triangle-exclamation"></i>
              {message}
            </div>
          )}

          <div className="input-wrapper">
            <label className="form-label">One-Time Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="••••••"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              disabled={isLoading}
            />
            <i className="fas fa-key input-icon"></i>
          </div>

          <button
            className="btn-verify"
            onClick={verifyOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP →"
            )}
          </button>

          <div style={{ textAlign: "center" }}>
            <span className="back-link" onClick={() => navigate("/admin/forgot-password")}>
              <i className="fas fa-arrow-left"></i> Back to Forgot Password
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminVerifyOtp;