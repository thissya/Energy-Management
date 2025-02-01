import React, { useState } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  const login = (username) => {
    setUser({ username });
    setIsAuthenticated(true);
    setToken(username)
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken('');
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, login, logout, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
