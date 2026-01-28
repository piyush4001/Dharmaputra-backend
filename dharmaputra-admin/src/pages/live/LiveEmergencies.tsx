import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
/* ================= TYPES ================= */

type User = {
  _id: string;
  phone?: string;
  role?: string;
  name?: string;
  profileImage?: string;
};

type SeniorProfile = {
  firstName: string;
  lastName: string;
};

type Emergency = {
  _id: string;
  user: User; // senior user (phone lives here)
  seniorProfile: SeniorProfile;
  responders?: User[]; // ⚠️ OPTIONAL
  triggeredAt: string;
  status: string;
};

/* ================= COMPONENT ================= */

export default function LiveEmergencies() {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null
  );
  const [selectedResponder, setSelectedResponder] = useState<User | null>(null);

  /* ---------- FETCH ---------- */

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async () => {
    try {
      const res = await api.get("/emergency/admin/active");

      const normalized: Emergency[] = (res.data || []).map((em: any) => ({
        ...em,
        responders: em.responders ?? [], // ✅ ALWAYS ARRAY
      }));

      setEmergencies(normalized);
    } catch (err) {
      console.error("Failed to fetch live emergencies", err);
    }
  };

  /* ---------- ACTIONS ---------- */

  const resolveEmergency = async (emergencyId: string) => {
    try {
      await api.post("/emergency/resolve", { emergencyId });

      setEmergencies((prev) => prev.filter((em) => em._id !== emergencyId));

      setSelectedEmergency(null);
    } catch (err) {
      alert("Failed to resolve emergency");
      console.error(err);
    }
  };

  const callNumber = (phone?: string) => {
    if (!phone) {
      alert("Phone number not available");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">Live Emergencies</h1> */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Live Emergencies</h1>

        <button
          onClick={() => navigate("/admin/resolved-emergencies")}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Resolved Emergencies
        </button>
      </div>

      {emergencies.length === 0 ? (
        <p className="text-slate-500">No active emergencies</p>
      ) : (
        <div className="grid gap-4">
          {emergencies.map((em) => (
            <div
              key={em._id}
              onClick={() => setSelectedEmergency(em)}
              className="cursor-pointer rounded-lg border p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={em.user?.profileImage || "/logo.png"}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {em.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Active since {new Date(em.triggeredAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EMERGENCY MODAL ================= */}

      {selectedEmergency && (
        <Modal onClose={() => setSelectedEmergency(null)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Emergency Details</h2>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
              ACTIVE
            </span>
          </div>

          {/* Senior */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={selectedEmergency.user?.profileImage || "/logo.png"}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg">
                {selectedEmergency.seniorProfile.firstName}{" "}
                {selectedEmergency.seniorProfile.lastName}
              </p>
              <p className="text-sm text-slate-500">Senior</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => callNumber(selectedEmergency.user?.phone)}
              className="flex-1 rounded-md bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700 transition"
            >
              Call Senior
            </button>

            <button
              onClick={() => resolveEmergency(selectedEmergency._id)}
              className="flex-1 rounded-md bg-green-600 text-white py-2 text-sm font-semibold hover:bg-green-700 transition"
            >
              Resolve Emergency
            </button>
          </div>

          {/* Responders */}
          <h3 className="font-semibold mb-2">Responders</h3>

          {selectedEmergency.responders!.length === 0 ? (
            <p className="text-slate-500 text-sm">No responders yet</p>
          ) : (
            <div className="space-y-2">
              {selectedEmergency.responders!.map((responder) => (
                <div
                  key={responder._id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100"
                >
                  <div
                    onClick={() => setSelectedResponder(responder)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src={responder.profileImage || "/logo.png"}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {responder.name || "Responder"}
                      </p>
                      <p className="text-xs text-slate-500">{responder.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => callNumber(responder.phone)}
                    className="text-blue-600 text-xs font-semibold"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* ================= RESPONDER MODAL ================= */}

      {selectedResponder && (
        <Modal onClose={() => setSelectedResponder(null)}>
          <div className="flex items-center gap-4">
            <img
              src={selectedResponder.profileImage || "/logo.png"}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <p className="text-lg font-semibold">
                {selectedResponder.name || "Responder"}
              </p>
              <p className="text-slate-500 text-sm">{selectedResponder.role}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
