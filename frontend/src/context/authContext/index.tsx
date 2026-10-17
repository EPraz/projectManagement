import { createContext, useContext, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDemoSession } from "./useDemoSession";

type AuthContextType = ReturnType<typeof useDemoSession>;
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const session = useDemoSession(!pathname.startsWith("/auth/"));
  const instantLogin = async () => {
    await session.instantLogin();
    navigate("/projects");
  };
  const logout = async () => {
    await session.logout();
    navigate("/auth/instantLogin");
  };
  return <AuthContext.Provider value={{ ...session, instantLogin, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
