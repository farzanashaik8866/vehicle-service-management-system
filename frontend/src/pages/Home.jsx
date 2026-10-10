import { useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* =====================================================
          NAVBAR
          ===================================================== */}
      <nav className="home-navbar">
        <div className="home-navbar-inner">
          <div className="home-navbar-brand">
            <Logo size={42} showText={true} />
          </div>

          <div className="home-navbar-links">
            <a href="#home">Home</a>
            <a href="#features">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="home-navbar-actions">
            <ThemeToggle />

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================
          HERO
          ===================================================== */}
      <section id="home" className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <div className="home-hero-eyebrow">Professional Vehicle Care</div>

            <h1 className="home-hero-title">
              Complete Vehicle
              <br />
              <span>Service Management</span>
            </h1>

            <p className="home-hero-description">
              Book vehicle services, manage your vehicles, track service
              requests and keep your complete service history in one convenient
              platform.
            </p>

            <div className="home-hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Get Started →
              </button>

              <a href="#features" className="btn btn-outline-primary">
                Explore Services
              </a>
            </div>

            <div className="home-hero-benefits">
              <div className="home-hero-benefit">
                <span className="home-hero-benefit-icon">✓</span>
                <span>Easy Booking</span>
              </div>

              <div className="home-hero-benefit">
                <span className="home-hero-benefit-icon">✓</span>
                <span>Service Tracking</span>
              </div>

              <div className="home-hero-benefit">
                <span className="home-hero-benefit-icon">✓</span>
                <span>Service History</span>
              </div>
            </div>
          </div>

          {/* =================================================
              HERO VISUAL
              ================================================= */}
          <div className="home-hero-visual">
            <div className="home-hero-car">
              <div className="home-hero-car-emoji">🚗</div>

              <h3 className="home-hero-car-title">Professional Vehicle Care</h3>

              <p className="home-hero-car-text">
                Reliable service management for your vehicle.
              </p>
            </div>

            <div className="home-floating-card home-floating-card-top">
              <div className="home-floating-icon">✓</div>

              <div>
                <p className="home-floating-title">Service Completed</p>

                <p className="home-floating-text">
                  Vehicle service successfully completed
                </p>
              </div>
            </div>

            <div className="home-floating-card home-floating-card-bottom">
              <div className="home-floating-icon">▦</div>

              <div>
                <p className="home-floating-title">Easy Scheduling</p>

                <p className="home-floating-text">
                  Book your next appointment online
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
          ===================================================== */}
      <section id="features" className="home-features-section">
        <div className="home-section-heading">
          <div className="home-section-label">Our Features</div>

          <h2 className="home-section-title">Everything Your Vehicle Needs</h2>

          <p className="home-section-description">
            Simple tools to manage your vehicle service experience from start to
            finish.
          </p>
        </div>

        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">🔧</div>

            <h3 className="home-feature-title">Professional Service</h3>

            <p className="home-feature-description">
              Keep your vehicle maintenance organized with convenient service
              management.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">▦</div>

            <h3 className="home-feature-title">Easy Booking</h3>

            <p className="home-feature-description">
              Schedule vehicle maintenance and repairs quickly through the
              online booking system.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">◷</div>

            <h3 className="home-feature-title">Track Progress</h3>

            <p className="home-feature-description">
              Follow your service request from booking through completion.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">▤</div>

            <h3 className="home-feature-title">Service History</h3>

            <p className="home-feature-description">
              Keep your vehicle's service records organized and easy to access.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT
          ===================================================== */}
      <section id="about" className="home-about-section">
        <div className="home-about-inner">
          <div className="home-about-visual">
            <div className="home-about-icon">🚘</div>
          </div>

          <div className="home-about-content">
            <div className="home-section-label">About The System</div>

            <h2>Smarter Vehicle Service Management</h2>

            <p>
              Vehicle Service Management System makes it easier for customers
              and service administrators to manage vehicle maintenance
              operations from one centralized platform.
            </p>

            <p>
              Customers can register their vehicles, book services, track
              service status and view their service history. Administrators can
              manage service requests, update statuses and monitor service
              revenue.
            </p>

            <div className="home-about-list">
              <div className="home-about-list-item">
                <span>✓</span>
                <span>Online vehicle service booking</span>
              </div>

              <div className="home-about-list-item">
                <span>✓</span>
                <span>Real-time service status tracking</span>
              </div>

              <div className="home-about-list-item">
                <span>✓</span>
                <span>Complete vehicle service history</span>
              </div>

              <div className="home-about-list-item">
                <span>✓</span>
                <span>Centralized administrator dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}
      <section id="contact" className="home-cta-section">
        <div className="home-cta">
          <div>
            <h2>Ready to manage your vehicle services?</h2>

            <p>
              Create your account and start managing your vehicle services
              today.
            </p>
          </div>

          <button
            type="button"
            className="btn"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <Logo size={42} showText={true} />

            <p>
              A complete platform for managing vehicles, service bookings,
              service history and service operations.
            </p>
          </div>

          <div className="home-footer-column">
            <h5>Quick Links</h5>

            <a href="#home">Home</a>

            <a href="#features">Services</a>

            <a href="#about">About</a>

            <a href="#contact">Contact</a>
          </div>

          <div className="home-footer-column">
            <h5>Account</h5>

            <a
              href="/login"
              onClick={(event) => {
                event.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </a>

            <a
              href="/register"
              onClick={(event) => {
                event.preventDefault();
                navigate("/register");
              }}
            >
              Create Account
            </a>
          </div>
        </div>

        <div className="home-footer-bottom">
          © 2026 Vehicle Service Management System
        </div>
      </footer>
    </div>
  );
}

export default Home;
