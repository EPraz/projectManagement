import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../apiContext";
import { User } from "../../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  instantLogin: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { apiUrl } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = useMemo(
    () => /^\/auth\/login/.test(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      try {
        const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include", // Envia la cookie con el refresh token
          headers: { "Content-Type": "application/json" },
        });
        if (refreshResponse.ok) {
          const data: { accessToken: string; refreshToken: string } =
            await refreshResponse.json();
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.error("Error en refresh:", error);
      } finally {
        setInitialized(true);
      }
    };
    if (!isLoginPage) {
      refreshTokenIfNeeded();
    } else {
      setInitialized(true);
    }
  }, [apiUrl]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        setLoading(false);
        setUser(null);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/auth/checkAuth`, {
          method: "GET",
          credentials: "include", // Para enviar cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error en checkAuth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (initialized) {
      checkAuth();
    }
  }, [apiUrl, accessToken, initialized]);

  const login = async (email: string, password: string) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (!response.ok) throw new Error("Invalid credentials");

    const { accessToken: token } = await response.json();
    setAccessToken(token);
    navigate("/dashboard");
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    setLoading(false);
    if (!response.ok) throw new Error("Invalid credentials");

    const { accessToken: token } = await response.json();
    setAccessToken(token);
    navigate("/dashboard");
  };

  const instantLogin = async (email: string) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/auth/instant-login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (!response.ok) throw new Error("Failed to login instantly");

    const { accessToken: token } = await response.json();
    setAccessToken(token);
    navigate("/dashboard");
  };

  const logout = async () => {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    setUser(null);
    setAccessToken(null);
    setLoading(false);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, instantLogin, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
