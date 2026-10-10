import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function MyServices() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
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
      loadServices();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const loadServices = async () => {
    try {
      const response = await api.get("/services");

      setServices(response.data.services || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
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
          <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="text-muted small fw-semibold mb-1">
                SERVICE HISTORY
              </div>

              <h1 className="dashboard-title">My Services</h1>

              <p className="dashboard-subtitle">
                View and track all your vehicle service requests.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/book-service")}
            >
              + Book Service
            </button>
          </div>

          <div className="professional-panel">
            <div className="professional-panel-header">
              <div>
                <h2 className="professional-panel-title">Service History</h2>

                <p className="professional-panel-subtitle">
                  {services.length} service request
                  {services.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="professional-empty">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : services.length === 0 ? (
              <div className="professional-empty">
                <div className="professional-empty-icon">▤</div>

                <h5>No services found</h5>

                <p>You haven't booked any vehicle services yet.</p>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/book-service")}
                >
                  Book Your First Service
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table professional-table align-middle">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Service</th>
                      <th>Appointment</th>
                      <th>Booked On</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {services.map((service) => (
                      <tr key={service._id}>
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
                          <span className="fw-semibold">
                            {service.serviceType}
                          </span>

                          {service.description && (
                            <small className="d-block text-muted mt-1">
                              {service.description}
                            </small>
                          )}
                        </td>

                        <td>
                          {new Date(service.appointmentDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </td>

                        <td>
                          {service.createdAt
                            ? new Date(service.createdAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </td>

                        <td className="fw-semibold">
                          ₹{Number(service.amount || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span className={getStatusClass(service.status)}>
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
        </main>
      </div>
    </div>
  );
}

export default MyServices;
