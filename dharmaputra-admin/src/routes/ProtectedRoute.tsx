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
  const auth = useAuth(); // ✅ CHANGE: keep full auth object
  const { token, role } = auth;

  const normalizedRole = role?.toUpperCase();

  // 🛡️ ADD THIS DEBUG LOG
  //("🛡️ PROTECTED ROUTE CHECK", {
    adminToken: localStorage.getItem("admin_token"),
    user: auth?.user,
    role: auth?.user?.role,
    allowedRoles,
  });

  // ✅ KEEP EXISTING DEBUG (useful)
  //("ADMIN AUTH CHECK:", {
    token,
    role,
    normalizedRole,
    allowedRoles,
  });

  // 🔐 Not logged in
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // 🔐 Logged in but role not allowed
  if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Authorized
  return children;
}
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }

// export default function ProtectedRoute({
//   children,
//   allowedRoles,
// }: ProtectedRouteProps) {
//   const token = localStorage.getItem("admin_token");
//   const role = localStorage.getItem("admin_role")?.toUpperCase();

//   if (!token) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (!role || !allowedRoles.includes(role)) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return <>{children}</>;
// }
