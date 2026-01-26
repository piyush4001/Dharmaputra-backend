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
  const { token, role } = useAuth();
   console.log("ADMIN AUTH CHECK:", { token, role, allowedRoles });
    const normalizedRole = role?.toUpperCase();



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
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// interface ProtectedRouteProps {
//   allowedRoles: string[];
// }

// export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
//   const { token, role } = useAuth();

//   if (!token) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   if (!role || !allowedRoles.includes(role)) {
//     return <Navigate to="/admin" replace />;
//   }

//   return <Outlet />; // ✅ KEY CHANGE
// }
