import api from "./axios";

/* ===========================
   LIVE / ACTIVE EMERGENCIES
   =========================== */

/**
 * Get all active (live) emergencies
 */
export const getLiveEmergenciesAPI = async () => {
  const res = await api.get("/emergency/admin/emergencies/resolved");
  return res.data;
};

/**
 * Resolve an emergency
 */
export const resolveEmergencyAPI = async (emergencyId: string) => {
  const res = await api.patch(
    `/emergency/admin/emergencies/${emergencyId}/resolve`
  );
  return res.data;
};

/* ===========================
   RESOLVED EMERGENCIES
   =========================== */

/**
 * Get all resolved emergencies
 */
export const getResolvedEmergenciesAPI = async () => {
  const res = await api.get("/emergency/admin/emergencies/resolved");
  return res.data;
};
