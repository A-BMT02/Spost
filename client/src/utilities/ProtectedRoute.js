import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return Object.keys(user).length !== 0 ? children : <Navigate to="/signin" />;
}
