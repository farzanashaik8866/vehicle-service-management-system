import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/CustomerDashboard";
import BookService from "./pages/BookService";
import MyServices from "./pages/MyServices";
import MyVehicles from "./pages/MyVehicles";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC PAGES
           ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =========================
            CUSTOMER PAGES
           ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-service"
          element={
            <ProtectedRoute allowedRole="customer">
              <BookService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-services"
          element={
            <ProtectedRoute allowedRole="customer">
              <MyServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRole="customer">
              <MyVehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="customer">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN PAGES
           ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminServices />
            </ProtectedRoute>
          }
        />

        {/* =========================
            FALLBACK
           ========================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
