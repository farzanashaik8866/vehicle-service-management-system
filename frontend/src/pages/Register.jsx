import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* ================= LEFT SIDE ================= */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <Logo size={105} showText={false} />

            <h1 className="auth-visual-title">
              Start Managing
              <br />
              Your Vehicle
            </h1>

            <p className="auth-visual-description">
              Create your account and manage your vehicles, service appointments
              and service history from one convenient platform.
            </p>

            <div className="auth-benefit-list">
              <div className="auth-benefit">
                <span>✓</span>

                <span>Manage multiple vehicles</span>
              </div>

              <div className="auth-benefit">
                <span>✓</span>

                <span>Book service appointments</span>
              </div>

              <div className="auth-benefit">
                <span>✓</span>

                <span>Track service progress</span>
              </div>

              <div className="auth-benefit">
                <span>✓</span>

                <span>Access your service history</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate("/")}
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                ← Back to Home
              </button>

              <ThemeToggle />
            </div>

            <div className="auth-logo d-lg-none">
              <Logo size={58} />
            </div>

            <h2 className="auth-title">Create Account</h2>

            <p className="auth-subtitle">
              Create your customer account to get started.
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Registration failed:</strong> {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control form-control-lg"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength="6"
                  required
                />

                <small className="text-muted">Minimum 6 characters.</small>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label fw-semibold"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-lg"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>

            <div className="text-center mt-4">
              <small className="text-muted">
                © 2026 Vehicle Service Management System
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
