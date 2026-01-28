import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  role: string;
}

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // ✅ HYDRATE FROM LOCALSTORAGE ON LOAD
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedRole = localStorage.getItem("admin_role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      setUser({
        id: "admin",
        role: storedRole,
      });
    }
  }, []);

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("admin_token", newToken);
    localStorage.setItem("admin_role", newRole);

    setToken(newToken);
    setRole(newRole);
    setUser({
      id: "admin",
      role: newRole,
    });
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
