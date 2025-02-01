import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  token: '',
  setToken: ()=>{}
});

export default AuthContext;