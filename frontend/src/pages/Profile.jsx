import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "customer") {
        navigate("/admin");
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <Sidebar
        role="customer"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="app-main">
        <MobileNavbar setMobileOpen={setMobileOpen} />

        <header className="desktop-topbar">
          <div className="desktop-user-area">
            <div className="desktop-user-info">
              <div className="desktop-user-name">{user?.name}</div>

              <div className="desktop-user-role">Customer Account</div>
            </div>

            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="app-content">
          <div className="dashboard-header">
            <div className="text-muted small fw-semibold mb-1">ACCOUNT</div>

            <h1 className="dashboard-title">My Profile</h1>

            <p className="dashboard-subtitle">View your account information.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="professional-panel text-center p-4">
                <div
                  className="profile-avatar mx-auto mb-3"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "34px",
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <h4 className="fw-bold mb-1">{user?.name}</h4>

                <p className="text-muted mb-3">Customer</p>

                <span className="status-badge status-confirmed">
                  Active Account
                </span>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="professional-panel">
                <div className="professional-panel-header">
                  <div>
                    <h2 className="professional-panel-title">
                      Account Information
                    </h2>

                    <p className="professional-panel-subtitle">
                      Your registered account details.
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="profile-info-row">
                    <span>Name</span>
                    <strong>{user?.name || "—"}</strong>
                  </div>

                  <div className="profile-info-row">
                    <span>Email Address</span>
                    <strong>{user?.email || "—"}</strong>
                  </div>

                  <div className="profile-info-row">
                    <span>Account Type</span>
                    <strong>Customer</strong>
                  </div>

                  <div className="profile-info-row">
                    <span>Account Status</span>
                    <span className="status-badge status-completed">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-top">
                    <button className="btn btn-outline-danger" onClick={logout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
