import { apiClient } from "../utils/apiClient";
export async function createAdminAPI(email: string, password: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/create-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create admin");
  }

  return data;
}

// LIST ADMINS (✅ THIS WAS MISSING)
export async function fetchAdminsAPI() {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/admins", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch admins");
  }

  return data.admins;
}

export async function toggleAdminStatusAPI(adminId: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(
    `http://localhost:5000/api/admin/admins/${adminId}/toggle-status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update admin status");
  }

  return data.admin;
}

export async function fetchDashboardStatsAPI() {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/dashboard-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch dashboard stats");
  }

  return data;
}

export async function fetchRecentSOSAPI() {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/recent-sos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch recent SOS");
  }

  return data.sos;
}

export async function fetchDashboardChartsAPI() {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/dashboard-charts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch chart data");
  }

  return data;
}

export async function fetchSeniorsAPI(params?: {
  search?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}) {
  const token = localStorage.getItem("adminToken");
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.minAge) query.append("minAge", String(params.minAge));
  if (params?.maxAge) query.append("maxAge", String(params.maxAge));
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const res = await fetch(
    `http://localhost:5000/api/admin/seniors?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch seniors");
  }

  return data;
}

export async function fetchFamiliesAPI() {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/families", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch families");
  }

  return data.families;
}
export async function fetchSeniorByIdAPI(id: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`http://localhost:5000/api/admin/seniors/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch senior");
  }

  return data.senior;
}

export async function fetchFamiliesBySeniorAPI(seniorId: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(
    `http://localhost:5000/api/admin/seniors/${seniorId}/families`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch linked families");
  }

  return data.families;
}

export async function fetchFamilyByIdAPI(id: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`http://localhost:5000/api/admin/families/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch family member");
  }

  return data.family;
}

export async function fetchSeniorsByFamilyAPI(familyId: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(
    `http://localhost:5000/api/admin/families/${familyId}/seniors`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch linked seniors");
  }

  return data.seniors;
}

export async function approveFamilyAPI(familyId: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(
    `http://localhost:5000/api/admin/families/${familyId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to approve family");
  }

  return data;
}

export async function approveSeniorAPI(seniorId: string) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(
    `http://localhost:5000/api/admin/seniors/${seniorId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  console.log("approveSeniorAPI data:", data);

  if (!res.ok) {
    throw new Error(data.message || "Failed to approve senior");
  }

  return data;
}
