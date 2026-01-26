import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { token, role } = useAuth();

  // 🔐 Not logged in
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // 🔐 Logged in but role not allowed
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Authorized
  return children;
}
