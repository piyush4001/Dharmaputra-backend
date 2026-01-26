import { createContext, useContext, useEffect, useState } from "react";
import api from "@/utils/api";
import { getToken, removeToken } from "@/utils/storage";

export type UserRole = "SENIOR" | "FAMILY" | "HELPER" | null;

type AuthContextType = {
  isAuthenticated: boolean;
  role: UserRole;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  loading: true,
  refreshAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        setIsAuthenticated(false);
        setRole(null);
        return;
      }

      setIsAuthenticated(true);

      const res = await api.get("/auth/me");
      console.log("res:", res.data);
      setRole(res.data.role || null);
    } catch (error) {
      console.error("Failed to refresh auth:", error);
      await removeToken();
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshAuth();
      setLoading(false);
    };

    init();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // optional
    } catch (_) {
      // ignore
    } finally {
      await removeToken();
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        loading,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
