import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function AdminServices() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [filter, setFilter] = useState("All");

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
      loadServices();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const loadServices = async () => {
    try {
      const response = await api.get("/services/admin/all");

      setServices(response.data.services || []);
    } catch (error) {
      console.error("Services loading error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (serviceId, status) => {
    setUpdatingId(serviceId);

    try {
      await api.put(`/services/${serviceId}/status`, { status });

      setServices((currentServices) =>
        currentServices.map((service) =>
          service._id === serviceId ? { ...service, status } : service,
        ),
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to update service status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

  const filteredServices =
    filter === "All"
      ? services
      : services.filter((service) => service.status === filter);

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
          <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="text-muted small fw-semibold mb-1">
                SERVICE MANAGEMENT
              </div>

              <h1 className="dashboard-title">All Services</h1>

              <p className="dashboard-subtitle">
                Manage customer service requests and update their status.
              </p>
            </div>

            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/admin")}
            >
              ← Dashboard
            </button>
          </div>

          <div className="professional-panel">
            <div className="professional-panel-header admin-filter-header">
              <div>
                <h2 className="professional-panel-title">Service Requests</h2>

                <p className="professional-panel-subtitle">
                  {filteredServices.length} request
                  {filteredServices.length !== 1 ? "s" : ""} shown
                </p>
              </div>

              <div className="admin-filter-group">
                {[
                  "All",
                  "Pending",
                  "Confirmed",
                  "In Progress",
                  "Completed",
                  "Cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`admin-filter-button ${
                      filter === status ? "active" : ""
                    }`}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="professional-empty">
                <div className="spinner-border text-primary" role="status" />

                <p className="mt-3 mb-0">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="professional-empty">
                <div className="professional-empty-icon">▤</div>

                <h5>No services found</h5>

                <p>No service requests match the selected filter.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table professional-table align-middle admin-services-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Service</th>
                      <th>Appointment</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredServices.map((service) => (
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
                          <div className="vehicle-cell">
                            <div className="vehicle-icon">🚘</div>

                            <div>
                              <div className="fw-semibold">
                                {service.vehicle?.vehicleNumber || "N/A"}
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
                          {new Date(service.appointmentDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </td>

                        <td className="fw-semibold">
                          ₹{Number(service.amount || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span className={getStatusClass(service.status)}>
                            {service.status}
                          </span>
                        </td>

                        <td>
                          <select
                            className="form-select form-select-sm admin-status-select"
                            value={service.status}
                            disabled={updatingId === service._id}
                            onChange={(e) =>
                              updateStatus(service._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>

                            <option value="Confirmed">Confirmed</option>

                            <option value="In Progress">In Progress</option>

                            <option value="Completed">Completed</option>

                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {updatingId === service._id && (
                            <small className="text-muted">Updating...</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminServices;
