import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

function BookService() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    vehicle: "",
    serviceType: "",
    appointmentDate: "",
    description: "",
  });

  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =====================================================
     SERVICE PRICES
     These are displayed to the customer.
     The backend also validates the actual price.
     ===================================================== */

  const servicePrices = {
    "Oil Change": 1500,
    "General Service": 2500,
    "Brake Service": 3000,
    "Engine Repair": 5000,
    "AC Service": 2500,
    "Battery Service": 3500,
    "Tyre Service": 2000,
    "Car Wash": 500,
    Other: 1500,
  };

  /* =====================================================
     LOAD CUSTOMER VEHICLES
     ===================================================== */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const loadVehicles = async () => {
      try {
        setLoadingVehicles(true);

        const response = await api.get("/vehicles");

        setVehicles(response.data.vehicles || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load your vehicles.",
        );
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, [navigate]);

  /* =====================================================
     HANDLE INPUT
     ===================================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  /* =====================================================
     BOOK SERVICE
     ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.vehicle ||
      !formData.serviceType ||
      !formData.appointmentDate
    ) {
      setError("Please select a vehicle, service type and appointment date.");

      return;
    }

    try {
      setBooking(true);

      await api.post("/services", {
        vehicle: formData.vehicle,
        serviceType: formData.serviceType,
        appointmentDate: formData.appointmentDate,
        description: formData.description,
      });

      setSuccess("Service appointment booked successfully.");

      setFormData({
        vehicle: "",
        serviceType: "",
        appointmentDate: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book the service. Please try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  /* =====================================================
     CANCEL
     ===================================================== */

  const handleCancel = () => {
    navigate("/dashboard");
  };

  /* =====================================================
     CURRENT SELECTED SERVICE PRICE
     ===================================================== */

  const selectedPrice = servicePrices[formData.serviceType];

  return (
    <div className="app-layout">
      {/* ===============================================
          SIDEBAR
         =============================================== */}

      <Sidebar
        role="customer"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ===============================================
          MAIN AREA
         =============================================== */}

      <main className="app-main">
        <MobileNavbar setMobileOpen={setMobileOpen} />

        <div className="app-content">
          {/* =========================================
              PAGE HEADER
             ========================================= */}

          <div className="page-header">
            <div>
              <h1 className="page-title">Book Service</h1>

              <p className="page-subtitle">
                Schedule a service appointment for your vehicle.
              </p>
            </div>
          </div>

          {/* =========================================
              SERVICE FORM
             ========================================= */}

          <div className="service-form-card">
            <div className="d-flex align-items-start justify-content-between mb-4">
              <div>
                <h2 className="service-form-title">Service Appointment</h2>

                <p className="service-form-description mb-0">
                  Enter the details for your service request.
                </p>
              </div>

              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                🔧
              </div>
            </div>

            {/* =======================================
                SUCCESS MESSAGE
               ======================================= */}

            {success && (
              <div className="alert alert-success" role="alert">
                <strong>Success:</strong> {success}
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={() => navigate("/my-services")}
                  >
                    View My Services
                  </button>
                </div>
              </div>
            )}

            {/* =======================================
                ERROR MESSAGE
               ======================================= */}

            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* =======================================
                FORM
               ======================================= */}

            <form onSubmit={handleSubmit}>
              {/* Vehicle */}

              <div className="mb-4">
                <label htmlFor="vehicle" className="form-label fw-semibold">
                  Select Vehicle
                </label>

                <select
                  id="vehicle"
                  name="vehicle"
                  className="form-select form-select-lg"
                  value={formData.vehicle}
                  onChange={handleChange}
                  disabled={loadingVehicles}
                  required
                >
                  <option value="">
                    {loadingVehicles
                      ? "Loading your vehicles..."
                      : "Choose your vehicle"}
                  </option>

                  {!loadingVehicles &&
                    vehicles.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleNumber} — {vehicle.brand}{" "}
                        {vehicle.model}
                      </option>
                    ))}
                </select>

                {!loadingVehicles && vehicles.length === 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      You don't have any vehicles yet.{" "}
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0"
                        onClick={() => navigate("/vehicles")}
                      >
                        Add a vehicle
                      </button>
                    </small>
                  </div>
                )}
              </div>

              {/* Service Type */}

              <div className="mb-4">
                <label htmlFor="serviceType" className="form-label fw-semibold">
                  Service Type
                </label>

                <select
                  id="serviceType"
                  name="serviceType"
                  className="form-select form-select-lg"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select service type</option>

                  <option value="Oil Change">Oil Change</option>

                  <option value="General Service">General Service</option>

                  <option value="Brake Service">Brake Service</option>

                  <option value="Engine Repair">Engine Repair</option>

                  <option value="AC Service">AC Service</option>

                  <option value="Battery Service">Battery Service</option>

                  <option value="Tyre Service">Tyre Service</option>

                  <option value="Car Wash">Car Wash</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* =====================================
                  SERVICE CHARGE
                 ===================================== */}

              {selectedPrice !== undefined && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Service Charge
                  </label>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: "58px",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      background: "var(--surface-soft)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "58px",
                        alignSelf: "stretch",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      ₹
                    </div>

                    <div
                      style={{
                        padding: "0 18px",
                        color: "var(--text)",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                    >
                      {selectedPrice.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <small
                    style={{
                      display: "block",
                      marginTop: "7px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Standard charge for the selected service. The amount cannot
                    be edited.
                  </small>
                </div>
              )}

              {/* Appointment Date */}

              <div className="mb-4">
                <label
                  htmlFor="appointmentDate"
                  className="form-label fw-semibold"
                >
                  Appointment Date
                </label>

                <input
                  id="appointmentDate"
                  type="date"
                  name="appointmentDate"
                  className="form-control form-control-lg"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Service Description */}

              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold">
                  Service Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="6"
                  placeholder="Describe the service or issue..."
                  value={formData.description}
                  onChange={handleChange}
                />

                <small className="text-muted">
                  Provide any additional details that may help the service team.
                </small>
              </div>

              {/* =====================================
                  ACTION BUTTONS
                 ===================================== */}

              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg px-4"
                  onClick={handleCancel}
                  disabled={booking}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-4"
                  disabled={booking || loadingVehicles || vehicles.length === 0}
                >
                  {booking ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Booking...
                    </>
                  ) : (
                    "Book Service"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookService;
