import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  role?: "FAMILY" | "SENIOR" | "HELPER";
  exp?: number; // 👈 expiry (seconds)
};

export const getRoleFromToken = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role ?? null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return true;

    const currentTime = Date.now() / 1000; // seconds
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
