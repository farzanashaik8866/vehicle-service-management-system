import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    totalCompletedServices: 0,
  });
  const [activities, setActivities] = useState([]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      setUser(parsedUser);
      loadDashboard();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      const [servicesResponse, revenueResponse, activityResponse] =
        await Promise.all([
          api.get("/services/admin/all"),
          api.get("/revenue"),
          api.get("/activity"),
        ]);

      setServices(servicesResponse.data.services || []);

      setRevenue({
        totalRevenue: revenueResponse.data.totalRevenue || 0,
        totalCompletedServices:
          revenueResponse.data.totalCompletedServices || 0,
      });

      setActivities(activityResponse.data.activities || []);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalServices = services.length;

  const pendingServices = services.filter(
    (service) => service.status === "Pending" || service.status === "Confirmed",
  ).length;

  const inProgressServices = services.filter(
    (service) => service.status === "In Progress",
  ).length;

  const cancelledServices = services.filter(
    (service) => service.status === "Cancelled",
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-badge status-completed";

      case "Confirmed":
        return "status-badge status-confirmed";

      case "In Progress":
        return "status-badge status-progress";

      case "Cancelled":
        return "status-badge status-cancelled";

      default:
        return "status-badge status-pending";
    }
  };

  const recentServices = [...services]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appointmentDate) -
        new Date(a.createdAt || a.appointmentDate),
    )
    .slice(0, 6);

  return (
    <div className="app-layout">
      <Sidebar
        role="admin"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="app-main">
        <MobileNavbar setMobileOpen={setMobileOpen} />

        <header className="desktop-topbar">
          <div className="desktop-user-area">
            <div className="desktop-user-info">
              <div className="desktop-user-name">
                {user?.name || "Administrator"}
              </div>

              <div className="desktop-user-role">Administrator</div>
            </div>

            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="app-content">
          <div className="dashboard-header">
            <div className="text-muted small fw-semibold mb-1">
              ADMINISTRATION
            </div>

            <h1 className="dashboard-title">Admin Dashboard</h1>

            <p className="dashboard-subtitle">
              Monitor service operations, bookings and revenue.
            </p>
          </div>

          {loading ? (
            <div className="professional-panel">
              <div className="professional-empty">
                <div className="spinner-border text-primary" role="status" />

                <p className="mt-3 mb-0">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">
                        Total Services
                      </span>

                      <span className="professional-stat-icon">▤</span>
                    </div>

                    <div className="professional-stat-value">
                      {totalServices}
                    </div>

                    <div className="professional-stat-footer">
                      All service requests
                    </div>
                  </div>
                </div>

                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">Pending</span>

                      <span className="professional-stat-icon warning">◷</span>
                    </div>

                    <div className="professional-stat-value">
                      {pendingServices}
                    </div>

                    <div className="professional-stat-footer">
                      Awaiting processing
                    </div>
                  </div>
                </div>

                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">
                        In Progress
                      </span>

                      <span className="professional-stat-icon blue">⚙</span>
                    </div>

                    <div className="professional-stat-value">
                      {inProgressServices}
                    </div>

                    <div className="professional-stat-footer">
                      Currently being serviced
                    </div>
                  </div>
                </div>

                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">Revenue</span>

                      <span className="professional-stat-icon success">₹</span>
                    </div>

                    <div className="professional-stat-value">
                      ₹{Number(revenue.totalRevenue).toLocaleString("en-IN")}
                    </div>

                    <div className="professional-stat-footer">
                      From completed services
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* Recent Services */}
                <div className="col-xl-8">
                  <div className="professional-panel">
                    <div className="professional-panel-header">
                      <div>
                        <h2 className="professional-panel-title">
                          Recent Service Requests
                        </h2>

                        <p className="professional-panel-subtitle">
                          Latest customer service bookings
                        </p>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate("/admin/services")}
                      >
                        View All
                      </button>
                    </div>

                    {recentServices.length === 0 ? (
                      <div className="professional-empty">
                        <div className="professional-empty-icon">▤</div>

                        <h5>No service requests</h5>

                        <p>There are currently no service bookings.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table professional-table align-middle">
                          <thead>
                            <tr>
                              <th>Customer</th>
                              <th>Vehicle</th>
                              <th>Service</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {recentServices.map((service) => (
                              <tr key={service._id}>
                                <td>
                                  <div className="fw-semibold">
                                    {service.customer?.name || "N/A"}
                                  </div>

                                  <small className="text-muted">
                                    {service.customer?.email || ""}
                                  </small>
                                </td>

                                <td>
                                  <div className="fw-semibold">
                                    {service.vehicle?.vehicleNumber || "N/A"}
                                  </div>

                                  <small className="text-muted">
                                    {service.vehicle?.brand || ""}{" "}
                                    {service.vehicle?.model || ""}
                                  </small>
                                </td>

                                <td>{service.serviceType}</td>

                                <td>
                                  {new Date(
                                    service.appointmentDate,
                                  ).toLocaleDateString("en-IN")}
                                </td>

                                <td>
                                  <span
                                    className={getStatusClass(service.status)}
                                  >
                                    {service.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overview */}
                <div className="col-xl-4">
                  <div className="professional-panel mb-4">
                    <div className="professional-panel-header">
                      <div>
                        <h2 className="professional-panel-title">
                          Service Overview
                        </h2>

                        <p className="professional-panel-subtitle">
                          Current service distribution
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="admin-overview-item">
                        <span>Pending / Confirmed</span>

                        <strong>{pendingServices}</strong>
                      </div>

                      <div className="admin-overview-item">
                        <span>In Progress</span>

                        <strong>{inProgressServices}</strong>
                      </div>

                      <div className="admin-overview-item">
                        <span>Completed</span>

                        <strong>{revenue.totalCompletedServices}</strong>
                      </div>

                      <div className="admin-overview-item">
                        <span>Cancelled</span>

                        <strong>{cancelledServices}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="professional-panel">
                    <div className="professional-panel-header">
                      <div>
                        <h2 className="professional-panel-title">
                          Recent Activity
                        </h2>

                        <p className="professional-panel-subtitle">
                          Latest system activity
                        </p>
                      </div>
                    </div>

                    {activities.length === 0 ? (
                      <div className="professional-empty small">
                        No recent activity.
                      </div>
                    ) : (
                      <div>
                        {activities.slice(0, 5).map((activity) => (
                          <div
                            className="admin-activity-item"
                            key={activity._id}
                          >
                            <div className="admin-activity-dot" />

                            <div>
                              <div className="fw-semibold">{activity.type}</div>

                              <div className="text-muted small">
                                {activity.message}
                              </div>

                              <div className="admin-activity-time">
                                {new Date(activity.createdAt).toLocaleString(
                                  "en-IN",
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
