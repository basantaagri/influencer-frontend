import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../utils/auth";

function RequireRole({ role, children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  const currentRole = getRole();

  if (currentRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireRole;
