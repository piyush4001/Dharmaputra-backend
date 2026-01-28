import { useEffect, useState } from "react";
import { fetchFeedbacksAPI } from "../../api/admin.api";

type Feedback = {
  _id: string;
  role: "SENIOR" | "FAMILY" | "HELPER";
  type: "TEXT" | "AUDIO" | "VIDEO";
  text?: string;
  mediaUrl?: string;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
};

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<
    "SENIOR" | "FAMILY" | "HELPER" | undefined
  >(undefined);

  const [type, setType] = useState<
    "TEXT" | "AUDIO" | "VIDEO" | undefined
  >(undefined);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchFeedbacksAPI({
        role,
        type,
      });

      // ✅ fetch() returns data directly (not res.data)
      setFeedbacks(res.feedbacks || []);
      //("Loaded feedbacks:", res);
    } catch (err: any) {
      console.error("Failed to load feedbacks:", err);
      setError("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, [role, type]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          📩 User Feedbacks
        </h1>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <select
          value={role ?? ""}
          onChange={(e) =>
            setRole(e.target.value ? (e.target.value as any) : undefined)
          }
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">All Roles</option>
          <option value="SENIOR">Senior</option>
          <option value="FAMILY">Family</option>
          <option value="HELPER">Helper</option>
        </select>

        <select
          value={type ?? ""}
          onChange={(e) =>
            setType(e.target.value ? (e.target.value as any) : undefined)
          }
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">All Types</option>
          <option value="TEXT">Text</option>
          <option value="AUDIO">Audio</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-center text-slate-500 py-10">
          Loading feedbacks...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-10">{error}</div>
      )}

      {!loading && feedbacks.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          No feedbacks found.
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {feedbacks.map((f) => (
          <div
            key={f._id}
            className="bg-white rounded-xl border shadow-sm p-5 space-y-3"
          >
            {/* META */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{f.role}</span>
              <span>•</span>
              <span>{f.type}</span>
              <span>•</span>
              <span>{new Date(f.createdAt).toLocaleString()}</span>
            </div>

            {/* USER */}
            <div className="text-sm">
              <span className="font-medium text-slate-700">User:</span>{" "}
              {f.user?.firstName} {f.user?.lastName}
              {f.user?.phone && (
                <span className="text-slate-500"> ({f.user.phone})</span>
              )}
            </div>

            {/* TEXT MESSAGE */}
            {f.text && (
              <div className="bg-slate-50 border rounded-lg p-3 text-sm text-slate-700">
                {f.text}
              </div>
            )}

            {/* MEDIA */}
            {f.type === "AUDIO" && f.mediaUrl && (
              <audio
                controls
                src={f.mediaUrl}
                className="w-full mt-2"
              />
            )}

           {f.type === "VIDEO" && f.mediaUrl && (
  <div className="mt-3 max-w-md w-full">
    <video
      controls
      src={f.mediaUrl}
      className="
        w-full
        rounded-xl
        border
        shadow-sm
        aspect-video
        object-cover
        bg-black
      "
    />
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}
