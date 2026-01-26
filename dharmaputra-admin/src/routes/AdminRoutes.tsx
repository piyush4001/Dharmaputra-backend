import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/dashboard/AdminDashboard";
import UsersList from "../pages/users/UsersList";
//import Settings from "../pages/superAdmin/Settings";
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersList />} />
        {/* <Route path="/admin/settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}
