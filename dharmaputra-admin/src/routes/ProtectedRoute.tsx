// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }

// export default function ProtectedRoute({
//   children,
//   allowedRoles,
// }: ProtectedRouteProps) {
//   const auth = useAuth();
//   const { token, role } = auth;

//   const normalizedRole = role?.toUpperCase();

//   // 🛡️ DEBUG LOGS (SAFE)
//   console.log("🛡️ PROTECTED ROUTE CHECK", {
//     adminToken: localStorage.getItem("adminToken"),
//     user: auth.user,
//     role,
//     normalizedRole,
//     allowedRoles,
//   });

//   // 🔐 Not logged in
//   if (!token) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   // 🔐 Logged in but role not allowed
//   if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
//     return <Navigate to="/admin" replace />;
//   }

//   // ✅ Authorized
//   return children;
// }
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { token, role, user, loading } = useAuth();

  const normalizedRole = role?.toUpperCase();

  // ⏳ WAIT until auth is hydrated
  if (loading) {
    return null; // or spinner
  }

  // 🔐 Not logged in → ALWAYS go to login
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 🚫 Logged in but role not allowed
  if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Authorized
  return children;
}
