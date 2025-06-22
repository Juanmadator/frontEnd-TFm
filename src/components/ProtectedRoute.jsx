import { Navigate } from "react-router-dom";
import useAlerts from "../hooks/useAlert";
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("user");
  const { showToast } = useAlerts();
  if (!isAuthenticated) {
    showToast(
      "error",
      "Debes iniciar sesion"
    );
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
