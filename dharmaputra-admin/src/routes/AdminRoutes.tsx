import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/dashboard/AdminDashboard";
import UsersList from "../pages/users/UsersList";
import FeedbackList from "../pages/feedback/FeedbackList";
import LiveEmergencies from "../pages/live/LiveEmergencies";
import ProtectedRoute from "./ProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* 🔐 PROTECT ADMIN AREA ONCE (CORRECT PATTERN) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="feedbacks" element={<FeedbackList />} />

        {/* ✅ FINAL LIVE ROUTE (MATCHES SIDEBAR + APP.TSX) */}
        <Route path="live-emergencies" element={<LiveEmergencies />} />
      </Route>
    </Routes>
  );
}
