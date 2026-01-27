// //import { createContext, useContext, useState , ReactNode} from "react";
// import { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react";

// export interface AuthUser {
//   id: string;
//   phone?: string;
//   role: string;
//   name?: string;
//   email?: string;
// }

// type AuthContextType = {
//    user: AuthUser | null;
//   token: string | null;
//   role: string | null;
//   login: (token: string, role: string) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem("adminToken")
//   );
//   const [role, setRole] = useState<string | null>(
//     localStorage.getItem("adminRole")
//   );

//   const login = (newToken: string, newRole: string) => {
//     localStorage.setItem("adminToken", newToken);
//     localStorage.setItem("adminRole", newRole);
//     setToken(newToken);
//     setRole(newRole);
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

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }
//   return ctx;
// };
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  phone?: string;
  role: string;
  name?: string;
  email?: string;
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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("adminRole")
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminRole", newRole);

    setToken(newToken);
    setRole(newRole);

    // minimal user for admin panel
    setUser({
      id: "admin",
      role: newRole,
    });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
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
