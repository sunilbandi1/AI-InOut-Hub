import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function RoleProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleProtectedRoute;