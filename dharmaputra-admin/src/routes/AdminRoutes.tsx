import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/dashboard/AdminDashboard";
import UsersList from "../pages/users/UsersList";
import FeedbackList from "../pages/feedback/FeedbackList"; // 👈 ADD
import ProtectedRoute from "./ProtectedRoute"; // 👈 ADD

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />

        {/* DASHBOARD */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* USERS */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <UsersList />
            </ProtectedRoute>
          }
        />

        {/* FEEDBACKS */}
        <Route
          path="feedbacks"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <FeedbackList />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
