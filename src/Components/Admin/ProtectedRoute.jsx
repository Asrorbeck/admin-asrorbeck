import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Login from "./Login";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div>Yuklanmoqda...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;

