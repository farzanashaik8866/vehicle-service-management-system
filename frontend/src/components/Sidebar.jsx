import { NavLink, useNavigate } from "react-router-dom";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function Sidebar({ role = "customer", mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const customerLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      path: "/book-service",
      label: "Book Service",
      icon: "🔧",
    },
    {
      path: "/my-services",
      label: "My Services",
      icon: "▤",
    },
    {
      path: "/vehicles",
      label: "My Vehicles",
      icon: "🚘",
    },
    {
      path: "/profile",
      label: "Profile",
      icon: "●",
    },
  ];

  const adminLinks = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "▦",
    },
    {
      path: "/admin/services",
      label: "All Services",
      icon: "▤",
    },
  ];

  const links = role === "admin" ? adminLinks : customerLinks;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? "app-sidebar-open" : ""}`}>
        {/* =====================================
            SIDEBAR BRAND
           ===================================== */}

        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <Logo size={48} showText={false} />

            <div className="sidebar-brand-text">
              <div className="sidebar-brand-title">Vehicle Service</div>

              <div className="sidebar-brand-subtitle">Management</div>
            </div>
          </div>
        </div>

        {/* =====================================
            USER ROLE
           ===================================== */}

        <div className="sidebar-role">
          <span className="sidebar-role-dot" />

          <span>{role === "admin" ? "Administrator" : "Customer"}</span>
        </div>

        {/* =====================================
            NAVIGATION
           ===================================== */}

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/dashboard" || link.path === "/admin"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
              onClick={() => {
                if (setMobileOpen) {
                  setMobileOpen(false);
                }
              }}
            >
              <span className="sidebar-link-icon">{link.icon}</span>

              <span className="sidebar-link-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* =====================================
            SIDEBAR BOTTOM
           ===================================== */}

        <div className="sidebar-bottom">
          {/* Appearance */}
          <div className="sidebar-theme">
            <span className="sidebar-theme-label">Appearance</span>

            <ThemeToggle />
          </div>

          {/* Logout */}
          <button type="button" className="sidebar-logout" onClick={logout}>
            <span className="sidebar-logout-icon">↪</span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
