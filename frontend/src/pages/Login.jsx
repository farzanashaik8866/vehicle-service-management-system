import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left visual section */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <Logo size={105} showText={false} />

            <h1 className="auth-visual-title">
              Vehicle Service
              <br />
              Management
            </h1>

            <p className="auth-visual-description">
              Manage your vehicles, book services and track your service history
              from one convenient platform.
            </p>

            <div className="mt-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <span>✓</span>
                <span>Easy Service Booking</span>
              </div>

              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <span>✓</span>
                <span>Service Status Tracking</span>
              </div>

              <div className="d-flex align-items-center justify-content-center gap-2">
                <span>✓</span>
                <span>Complete Service History</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login section */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            {/* Top controls */}
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

            {/* Logo on mobile */}
            <div className="auth-logo d-lg-none">
              <Logo size={58} />
            </div>

            <h2 className="auth-title">Welcome Back</h2>

            <p className="auth-subtitle">
              Login to manage your vehicle services.
            </p>

            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                <strong>Login failed:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>

                <div className="position-relative">
                  <span
                    className="position-absolute top-50 translate-middle-y ms-3"
                    style={{
                      fontSize: "18px",
                      zIndex: 2,
                    }}
                  >
                    ✉️
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control form-control-lg ps-5"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>

                <div className="position-relative">
                  <span
                    className="position-absolute top-50 translate-middle-y ms-3"
                    style={{
                      fontSize: "18px",
                      zIndex: 2,
                    }}
                  >
                    🔒
                  </span>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control form-control-lg ps-5"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Login button */}
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
                      aria-hidden="true"
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Register */}
            <div className="auth-footer">
              Don't have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate("/register")}
              >
                Create an account
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

export default Login;
