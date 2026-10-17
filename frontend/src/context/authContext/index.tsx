import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../apiContext";
import { User } from "../../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  instantLogin: () => Promise<void>;
  loading: boolean;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const personalAccountsDisabled = async () => {
  throw new Error("Personal accounts are unavailable in this demo.");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEntryPage = pathname.startsWith("/auth/");
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIdentity = useCallback(async (token: string, signal?: AbortSignal) => {
    const response = await fetch(`${apiUrl}/auth/checkAuth`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      signal,
    });
    if (!response.ok) throw new Error("Could not load the demo session. Please try again.");
    const identity = await response.json();
    setAccessToken(token);
    setUser({ ...identity, projects: identity.projects ?? [] });
  }, [apiUrl]);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST", credentials: "include", signal,
    });
    if (!response.ok) throw new Error("The demo session has ended.");
    const { accessToken: token } = await response.json();
    await loadIdentity(token, signal);
  }, [apiUrl, loadIdentity]);

  useEffect(() => {
    const controller = new AbortController();
    if (isEntryPage) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh(controller.signal).catch(() => {
      if (!controller.signal.aborted) { setUser(null); setAccessToken(null); }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => { controller.abort(); };
  }, [isEntryPage, refresh]);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    const timer = window.setInterval(() => {
      refresh(controller.signal).catch(() => {
        if (!controller.signal.aborted) { setUser(null); setAccessToken(null); }
      });
    }, 12 * 60 * 1000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [accessToken, refresh]);

  const instantLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/instant-login`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" }, body: "{}",
      });
      if (!response.ok) {
        throw new Error(response.status === 503
          ? "The demo is being prepared. Please try again shortly."
          : "Could not open the demo. Please try again.");
      }
      const { accessToken: token } = await response.json();
      await loadIdentity(token);
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: "POST", credentials: "include",
    });
    if (!response.ok) throw new Error("Could not end the demo session. Please try again.");
    setUser(null);
    setAccessToken(null);
    navigate("/auth/instantLogin");
  };

  return <AuthContext.Provider value={{
    user, accessToken, loading, instantLogin, logout,
    login: personalAccountsDisabled, register: personalAccountsDisabled,
  }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
