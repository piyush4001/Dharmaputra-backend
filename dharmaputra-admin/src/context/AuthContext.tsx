import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("adminRole")
  );

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminRole", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
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
// import { createContext, useContext, useEffect, useState } from "react";

// interface AuthContextType {
//   token: string | null;
//   role: string | null;
//   login: (token: string, role: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType>(null as any);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [token, setToken] = useState<string | null>(null);
//   const [role, setRole] = useState<string | null>(null);

//   // ✅ HYDRATE FROM LOCALSTORAGE ON APP LOAD
//   useEffect(() => {
//     const storedToken = localStorage.getItem("adminToken");
//     const storedRole = localStorage.getItem("adminRole");

//     if (storedToken) setToken(storedToken);
//     if (storedRole) setRole(storedRole);
//   }, []);

//   const login = (token: string, role: string) => {
//     localStorage.setItem("adminToken", token);
//     localStorage.setItem("adminRole", role);
//     setToken(token);
//     setRole(role);
//   };

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminRole");
//     setToken(null);
//     setRole(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
