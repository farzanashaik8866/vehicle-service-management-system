import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function MyVehicles() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    vehicleType: "",
    year: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      loadVehicles();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const loadVehicles = async () => {
    try {
      const response = await api.get("/vehicles");

      setVehicles(response.data.vehicles || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError("Unable to load vehicles.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await api.post("/vehicles", {
        ...formData,
        year: Number(formData.year),
      });

      setMessage("Vehicle added successfully.");

      setFormData({
        vehicleNumber: "",
        brand: "",
        model: "",
        vehicleType: "",
        year: "",
      });

      await loadVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add vehicle.");
    } finally {
      setSaving(false);
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
          <div className="dashboard-header">
            <div className="text-muted small fw-semibold mb-1">
              VEHICLE MANAGEMENT
            </div>

            <h1 className="dashboard-title">My Vehicles</h1>

            <p className="dashboard-subtitle">
              Manage the vehicles registered to your account.
            </p>
          </div>

          <div className="row g-4">
            {/* Add vehicle */}
            <div className="col-xl-5">
              <div className="professional-panel">
                <div className="professional-panel-header">
                  <div>
                    <h2 className="professional-panel-title">Add Vehicle</h2>

                    <p className="professional-panel-subtitle">
                      Register a vehicle to book services.
                    </p>
                  </div>

                  <div className="professional-stat-icon">+</div>
                </div>

                <div className="p-4">
                  {message && (
                    <div className="alert alert-success">{message}</div>
                  )}

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Vehicle Number
                      </label>

                      <input
                        type="text"
                        name="vehicleNumber"
                        className="form-control"
                        placeholder="AP39AB1234"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Brand</label>

                        <input
                          type="text"
                          name="brand"
                          className="form-control"
                          placeholder="Hyundai"
                          value={formData.brand}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Model</label>

                        <input
                          type="text"
                          name="model"
                          className="form-control"
                          placeholder="i20"
                          value={formData.model}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Vehicle Type
                        </label>

                        <select
                          name="vehicleType"
                          className="form-select"
                          value={formData.vehicleType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select type</option>

                          <option value="Car">Car</option>

                          <option value="Bike">Bike</option>

                          <option value="SUV">SUV</option>

                          <option value="Truck">Truck</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Manufacturing Year
                        </label>

                        <input
                          type="number"
                          name="year"
                          className="form-control"
                          placeholder="2022"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={formData.year}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 mt-4"
                      disabled={saving}
                    >
                      {saving ? "Adding Vehicle..." : "Add Vehicle"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Vehicle list */}
            <div className="col-xl-7">
              <div className="professional-panel h-100">
                <div className="professional-panel-header">
                  <div>
                    <h2 className="professional-panel-title">
                      Registered Vehicles
                    </h2>

                    <p className="professional-panel-subtitle">
                      {vehicles.length} vehicle
                      {vehicles.length !== 1 ? "s" : ""} registered
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="professional-empty">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="professional-empty">
                    <div className="professional-empty-icon">🚘</div>

                    <h5>No vehicles registered</h5>

                    <p>Add your first vehicle using the form.</p>
                  </div>
                ) : (
                  <div>
                    {vehicles.map((vehicle) => (
                      <div className="vehicle-detail-card" key={vehicle._id}>
                        <div className="vehicle-detail-icon">🚘</div>

                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap justify-content-between gap-2">
                            <h5 className="fw-bold mb-1">
                              {vehicle.vehicleNumber}
                            </h5>

                            <span className="vehicle-year">{vehicle.year}</span>
                          </div>

                          <p className="text-muted mb-1">
                            {vehicle.brand} {vehicle.model}
                          </p>

                          <span className="badge rounded-pill text-bg-light">
                            {vehicle.vehicleType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyVehicles;
