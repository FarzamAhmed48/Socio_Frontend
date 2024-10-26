import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Only render children if the user is authenticated
  if (!user) {
    return null; // You can also return a loading spinner or a redirect component here
  }

  return <>{children}</>;
};

export default ProtectedRoutes;