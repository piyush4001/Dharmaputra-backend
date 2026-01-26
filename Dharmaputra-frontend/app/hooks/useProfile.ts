import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api";

export type Profile = {
  /* ---------- COMMON ---------- */
  role?: "SENIOR" | "FAMILY" | "HELPER";

  firstName?: string;
  lastName?: string;
  phone?: string;

  /* ---------- ADDRESS ---------- */
  address?:
    | {
        houseNo?: string;
        area?: string;
        city?: string;
        state?: string;
        pincode?: string;
      }
    | string; // backward compatible

  /* ---------- SENIOR ---------- */
  age?: number;
  emergencyContact?: string;
  medicalInfo?: string;

  /* ---------- FAMILY ---------- */
  relation?: string;
  isPrimaryContact?: boolean;

  /* ---------- HELPER ---------- */
  isActive?: boolean;
  message?: string;
};

export default function useProfile() {
  const [profile, setProfile] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Profile>("/profile/me");

      // ✅ Profile exists
      if (!res.data?.message) {
        setProfile(res.data);
        setHasProfile(true);
        setRole(null);
      }
      // 🆕 Profile not set yet
      else {
        setProfile(null);
        setHasProfile(false);
        setRole(res.data.role || null);
      }
    } catch (error) {
      console.log("Failed to load profile", error);
      setProfile(null);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    role,
    hasProfile,
    loading,
    refetch: fetchProfile,
  };
}
