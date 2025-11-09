

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // استخدام Redux store للحصول على بيانات المستخدم
  const user = useSelector((state) => state.auth.user);
  
  // fallback للبيانات من sessionStorage في حالة عدم وجود بيانات في Redux store
  const isAuthenticated = () => {
    if (user) return true;
    
    const storedUser = sessionStorage.getItem("useralbaraqawy");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return !!parsed && parsed !== "null";
      } catch {
        return false;
      }
    }
    return false;
  };

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
