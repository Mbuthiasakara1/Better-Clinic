// src/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const user_id = sessionStorage.getItem("user_id");
    const session_id = sessionStorage.getItem("session_id");

    if (!user_id || !session_id) {
      setIsAuthenticated(false);
      navigate("/home");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
