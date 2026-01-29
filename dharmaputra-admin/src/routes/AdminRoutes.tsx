import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/dashboard/AdminDashboard";
import UsersList from "../pages/users/UsersList";
import FeedbackList from "../pages/feedback/FeedbackList";
import LiveEmergencies from "../pages/live/LiveEmergencies";
import HelpersList from "../pages/helpers/HelpersList";
import HelperDetail from "../pages/helpers/HelperDetail";
import ProtectedRoute from "./ProtectedRoute";
import ResolvedEmergencies from "../pages/live/ResolvedEmergencies";

export default function AdminRoutes() {
  return (
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
      <Route path="live-emergencies" element={<LiveEmergencies />} />

      {/* 👥 HELPERS */}
      <Route path="helpers" element={<HelpersList />} />
      <Route path="helpers/:helperId" element={<HelperDetail />} />
      <Route path="resolved-emergencies" element={<ResolvedEmergencies />} />
    </Route>
  );
}
