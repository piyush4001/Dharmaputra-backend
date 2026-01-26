import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UsersList from "./pages/users/UsersList";
import HelpersList from "./pages/helpers/HelpersList";
import SuperAdminLayout from "./components/layout/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superAdmin/SuperAdminDashboard";
import CreateAdmin from "./pages/superAdmin/CreateAdmin";
import AdminList from "./pages/superAdmin/AdminList";
import SeniorsList from "./pages/seniors/SeniorsList";
import FamiliesList from "./pages/families/FamiliesList";
import SeniorDetail from "./pages/seniors/SeniorDetail";
import FamilyDetail from "./pages/families/FamilyDetail";
import FeedbackList from "./pages/feedback/FeedbackList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ROOT */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* LOGIN */}
          <Route path="/admin/login" element={<Login />} />

          {/* ADMIN AREA */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="seniors" element={<SeniorsList />} />

            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="helpers" element={<HelpersList />} />
            <Route path="families" element={<FamiliesList />} />
            <Route path="seniors/:id" element={<SeniorDetail />} />
            <Route path="families/:id" element={<FamilyDetail />} />
            <Route path="feedbacks" element={<FeedbackList />} />
          </Route>

          {/* SUPER ADMIN AREA */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="create-admin" element={<CreateAdmin />} />
            <Route path="admins" element={<AdminList />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
