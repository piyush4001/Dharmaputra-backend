import { useEffect, useState } from "react";
import {
  getAllHelpersAPI,
  approveHelperAPI,
  rejectHelperAPI,
} from "../../api/helpers.api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { getHelperByIdAPI } from "../../api/helpers.api";
type Helper = {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  status: "Approved" | "Pending" | "Rejected";
};

export default function HelpersList() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHelperId, setSelectedHelperId] = useState<string | null>(null);
  const [helperDetail, setHelperDetail] = useState<any | null>(null);
  const openHelperProfile = async (id: string) => {
    try {
      setHelperDetail(null); // reset old state
      const data = await getHelperByIdAPI(id);
      setHelperDetail(data);
    } catch (err) {
      console.error("Failed to load helper profile", err);
      alert("Failed to load helper details");
    }
  };

  const loadHelpers = async () => {
    try {
      setLoading(true);
      const data = await getAllHelpersAPI();
      setHelpers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load helpers", err);
      setHelpers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpers();
  }, []);

  const approve = async (id: string) => {
    await approveHelperAPI(id);
    loadHelpers();
  };

  const reject = async (id: string) => {
    await rejectHelperAPI(id);
    loadHelpers();
  };

  function Modal({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-slate-500 hover:text-black"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }

  if (loading) return <p className="text-slate-500">Loading helpers...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Helpers</h2>

      {helpers.length === 0 ? (
        <p className="text-slate-500">No helpers found</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="py-2">Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {helpers.map((h) => {
              const helperId = h._id || h.id!;
              return (
                <tr key={helperId} className="border-b last:border-0">
                  <td
                    className="py-3 font-medium cursor-pointer text-blue-600 hover:underline"
                    onClick={() => openHelperProfile(helperId)}
                  >
                    {h.name}
                  </td>

                  <td>{h.phone}</td>

                  <td>
                    <Badge
                      label={h.status}
                      color={
                        h.status === "Approved"
                          ? "green"
                          : h.status === "Pending"
                          ? "yellow"
                          : "red"
                      }
                    />
                  </td>

                  <td className="flex justify-end gap-2 py-2">
                    {h.status === "Pending" && (
                      <>
                        <Button onClick={() => approve(helperId)}>
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => reject(helperId)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ✅ HELPER PROFILE MODAL (OUTSIDE TABLE) */}
      {helperDetail && (
        <Modal onClose={() => setHelperDetail(null)}>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={helperDetail.profileImage || "/logo.png"}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <p className="text-xl font-semibold">
                {helperDetail.firstName} {helperDetail.lastName}
              </p>
              <p className="text-sm text-slate-500">Helper</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <b>Phone:</b> {helperDetail.phone}
            </p>
            <p>
              <b>Age:</b> {helperDetail.age}
            </p>
            <p>
              <b>Education:</b> {helperDetail.education}
            </p>
            <p>
              <b>Availability:</b> {helperDetail.availability}
            </p>
            <p>
              <b>Status:</b> {helperDetail.isVerified ? "Approved" : "Pending"}
            </p>
            <p>
              <b>Rating:</b> {helperDetail.rating?.average || 0} ⭐ (
              {helperDetail.rating?.count || 0})
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
