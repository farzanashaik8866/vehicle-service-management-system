import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);

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

      if (parsedUser.role !== "customer") {
        navigate("/admin");
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
      const [servicesResponse, vehiclesResponse] = await Promise.all([
        api.get("/services"),
        api.get("/vehicles"),
      ]);

      setServices(servicesResponse.data.services || []);

      setVehicles(vehiclesResponse.data.vehicles || []);
    } catch (error) {
      console.error("Customer dashboard error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DASHBOARD CALCULATIONS
     ===================================================== */

  const totalBookings = services.length;

  const activeBookings = services.filter(
    (service) =>
      service.status === "Pending" ||
      service.status === "Confirmed" ||
      service.status === "In Progress",
  ).length;

  const completedBookings = services.filter(
    (service) => service.status === "Completed",
  ).length;

  const totalSpent = services
    .filter((service) => service.status === "Completed")
    .reduce((total, service) => total + Number(service.amount || 0), 0);

  const recentServices = [...services]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appointmentDate) -
        new Date(a.createdAt || a.appointmentDate),
    )
    .slice(0, 5);

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

  return (
    <div className="app-layout">
      {/* =================================================
          SIDEBAR
          ================================================= */}
      <Sidebar
        role="customer"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="app-main">
        {/* =================================================
            MOBILE NAVBAR
            ================================================= */}
        <MobileNavbar setMobileOpen={setMobileOpen} />

        {/* =================================================
            DESKTOP TOPBAR
            ================================================= */}
        <header className="desktop-topbar">
          <div className="desktop-user-area">
            <div className="desktop-user-info">
              <div className="desktop-user-name">
                {user?.name || "Customer"}
              </div>

              <div className="desktop-user-role">Customer</div>
            </div>

            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
          </div>
        </header>

        {/* =================================================
            MAIN CONTENT
            ================================================= */}
        <main className="app-content">
          {/* =================================================
              PAGE HEADER
              ================================================= */}
          <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="text-muted small fw-semibold mb-1">
                CUSTOMER DASHBOARD
              </div>

              <h1 className="dashboard-title">
                Welcome back, {user?.name || "Customer"}
              </h1>

              <p className="dashboard-subtitle">
                Manage your vehicles and keep track of your service
                appointments.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/book-service")}
            >
              + Book Service
            </button>
          </div>

          {/* =================================================
              LOADING
              ================================================= */}
          {loading ? (
            <div className="professional-panel">
              <div className="professional-empty">
                <div className="spinner-border text-primary" role="status" />

                <p className="mt-3 mb-0">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* =================================================
                  STATISTICS
                  ================================================= */}
              <div className="row g-3 mb-4">
                {/* Total Bookings */}
                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">
                        Total Bookings
                      </span>

                      <span className="professional-stat-icon">▤</span>
                    </div>

                    <div className="professional-stat-value">
                      {totalBookings}
                    </div>

                    <div className="professional-stat-footer">
                      All service requests
                    </div>
                  </div>
                </div>

                {/* Active */}
                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">Active</span>

                      <span className="professional-stat-icon warning">◷</span>
                    </div>

                    <div className="professional-stat-value">
                      {activeBookings}
                    </div>

                    <div className="professional-stat-footer">
                      Pending or ongoing
                    </div>
                  </div>
                </div>

                {/* Completed */}
                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">Completed</span>

                      <span className="professional-stat-icon success">✓</span>
                    </div>

                    <div className="professional-stat-value">
                      {completedBookings}
                    </div>

                    <div className="professional-stat-footer">
                      Successfully completed
                    </div>
                  </div>
                </div>

                {/* Total Spent */}
                <div className="col-6 col-xl-3">
                  <div className="professional-stat-card">
                    <div className="professional-stat-top">
                      <span className="professional-stat-label">
                        Total Spent
                      </span>

                      <span className="professional-stat-icon blue">₹</span>
                    </div>

                    <div className="professional-stat-value">
                      ₹{totalSpent.toLocaleString("en-IN")}
                    </div>

                    <div className="professional-stat-footer">
                      Completed services
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  MAIN DASHBOARD GRID
                  ================================================= */}
              <div className="row g-4">
                {/* =================================================
                    RECENT SERVICES
                    ================================================= */}
                <div className="col-xl-8">
                  <div className="professional-panel">
                    <div className="professional-panel-header">
                      <div>
                        <h2 className="professional-panel-title">
                          Recent Services
                        </h2>

                        <p className="professional-panel-subtitle">
                          Your latest vehicle service activity
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate("/my-services")}
                      >
                        View All
                      </button>
                    </div>

                    {recentServices.length === 0 ? (
                      <div className="professional-empty">
                        <div className="professional-empty-icon">▤</div>

                        <h5>No services yet</h5>

                        <p>Book your first vehicle service to see it here.</p>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm mt-3"
                          onClick={() => navigate("/book-service")}
                        >
                          Book Service
                        </button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table professional-table align-middle">
                          <thead>
                            <tr>
                              <th>Vehicle</th>

                              <th>Service</th>

                              <th>Date</th>

                              <th>Amount</th>

                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {recentServices.map((service) => (
                              <tr key={service._id}>
                                <td>
                                  <div className="vehicle-cell">
                                    <div className="vehicle-icon">🚘</div>

                                    <div>
                                      <div className="fw-semibold">
                                        {service.vehicle?.vehicleNumber ||
                                          "N/A"}
                                      </div>

                                      <small className="text-muted">
                                        {service.vehicle?.brand || ""}{" "}
                                        {service.vehicle?.model || ""}
                                      </small>
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <div className="fw-semibold">
                                    {service.serviceType}
                                  </div>

                                  {service.description && (
                                    <small className="text-muted">
                                      {service.description}
                                    </small>
                                  )}
                                </td>

                                <td>
                                  {new Date(
                                    service.appointmentDate,
                                  ).toLocaleDateString("en-IN")}
                                </td>

                                <td className="fw-semibold">
                                  ₹
                                  {Number(service.amount || 0).toLocaleString(
                                    "en-IN",
                                  )}
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

                {/* =================================================
                    RIGHT COLUMN
                    ================================================= */}
                <div className="col-xl-4">
                  {/* =================================================
                      QUICK ACTIONS
                      ================================================= */}
                  <div className="professional-panel mb-4">
                    <div className="professional-panel-header">
                      <div>
                        <h2 className="professional-panel-title">
                          Quick Actions
                        </h2>

                        <p className="professional-panel-subtitle">
                          Common tasks
                        </p>
                      </div>
                    </div>

                    <div className="quick-actions-list">
                      {/* Book Service */}
                      <button
                        type="button"
                        className="quick-action-item"
                        onClick={() => navigate("/book-service")}
                      >
                        <span className="quick-action-item-icon">🔧</span>

                        <span className="quick-action-item-content">
                          <span className="quick-action-item-title">
                            Book a Service
                          </span>

                          <span className="quick-action-item-description">
                            Schedule vehicle maintenance
                          </span>
                        </span>

                        <span className="quick-action-item-arrow">→</span>
                      </button>

                      {/* Manage Vehicles */}
                      <button
                        type="button"
                        className="quick-action-item"
                        onClick={() => navigate("/vehicles")}
                      >
                        <span className="quick-action-item-icon">🚘</span>

                        <span className="quick-action-item-content">
                          <span className="quick-action-item-title">
                            Manage Vehicles
                          </span>

                          <span className="quick-action-item-description">
                            View your registered vehicles
                          </span>
                        </span>

                        <span className="quick-action-item-arrow">→</span>
                      </button>

                      {/* Service History */}
                      <button
                        type="button"
                        className="quick-action-item"
                        onClick={() => navigate("/my-services")}
                      >
                        <span className="quick-action-item-icon">▤</span>

                        <span className="quick-action-item-content">
                          <span className="quick-action-item-title">
                            Service History
                          </span>

                          <span className="quick-action-item-description">
                            View previous services
                          </span>
                        </span>

                        <span className="quick-action-item-arrow">→</span>
                      </button>
                    </div>
                  </div>

                  {/* =================================================
                      MY VEHICLES
                      ================================================= */}
                  <div className="professional-panel">
                    <div className="professional-panel-header">
                      <div>
                        <h2 className="professional-panel-title">
                          My Vehicles
                        </h2>

                        <p className="professional-panel-subtitle">
                          Registered vehicles
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate("/vehicles")}
                      >
                        View
                      </button>
                    </div>

                    {vehicles.length === 0 ? (
                      <div className="professional-empty">
                        <div className="professional-empty-icon">🚘</div>

                        <h5>No vehicles added</h5>

                        <p>Add your vehicle to book a service.</p>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm mt-3"
                          onClick={() => navigate("/vehicles")}
                        >
                          Add Vehicle
                        </button>
                      </div>
                    ) : (
                      <div className="dashboard-vehicle-list">
                        {vehicles.slice(0, 3).map((vehicle) => (
                          <div
                            className="dashboard-vehicle-item"
                            key={vehicle._id}
                          >
                            <div className="dashboard-vehicle-icon">🚘</div>

                            <div className="dashboard-vehicle-info">
                              <div className="dashboard-vehicle-number">
                                {vehicle.vehicleNumber}
                              </div>

                              <div className="dashboard-vehicle-name">
                                {vehicle.brand} {vehicle.model}
                              </div>

                              <div className="dashboard-vehicle-year">
                                {vehicle.year}
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

export default CustomerDashboard;
