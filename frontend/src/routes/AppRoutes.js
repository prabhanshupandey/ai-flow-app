import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Login";
import MainApp from "../MainApp";
import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard";
import { useState } from "react";

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("admin");
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

export default function AppRoutes() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <MainApp user={user} setUser={setUser} />
          ) : (
            <Login setUser={setUser} />
          )
        }
      />

      <Route path="/admin/login" element={<AdminLogin setAdmin={() => {
        localStorage.setItem("admin", "true");
        window.location.href = "/admin";
      }} />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}