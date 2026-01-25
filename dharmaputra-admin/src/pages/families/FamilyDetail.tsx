import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchFamilyByIdAPI,
  fetchSeniorsByFamilyAPI,
  approveFamilyAPI,
} from "../../api/admin.api";

export default function FamilyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [family, setFamily] = useState<any>(null);
  const [seniors, setSeniors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const familyData = await fetchFamilyByIdAPI(id);
        setFamily(familyData);

        const seniorData = await fetchSeniorsByFamilyAPI(id);
        setSeniors(seniorData);
      } catch (error) {
        console.error("Family detail fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;

    try {
      setApproving(true);
      await approveFamilyAPI(id);

      setFamily((prev: any) => ({
        ...prev,
        isApproved: true,
        approvedAt: new Date().toISOString(),
      }));
    } catch {
      alert("Failed to approve family member");
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <p>Loading family member...</p>;
  if (!family) return <p>Family member not found</p>;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* =====================
          PROFILE HEADER
          ===================== */}
      <div className="bg-white rounded-xl shadow p-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {family.firstName} {family.lastName}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Registered on {new Date(family.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Approval Status */}
        {family.isApproved ? (
          <span className="h-fit px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
            Approved
          </span>
        ) : (
          <button
            onClick={handleApprove}
            disabled={approving}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {approving ? "Approving..." : "Approve Family"}
          </button>
        )}
      </div>

      {/* =====================
          FAMILY DETAILS
          ===================== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Family Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Phone</p>
            <p className="font-medium">{family.phoneNumber ?? "—"}</p>
          </div>

          <div>
            <p className="text-slate-500">Relation</p>
            <p className="font-medium">
              {family.relation === "OTHER"
                ? family.customRelation ?? "OTHER"
                : family.relation ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Primary Contact</p>
            <p className="font-medium">
              {family.isPrimaryContact ? "Yes" : "No"}
            </p>
          </div>

          {family.isApproved && family.approvedAt && (
            <div className="sm:col-span-2 text-xs text-slate-500">
              Approved on {new Date(family.approvedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* =====================
          LINKED SENIORS
          ===================== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Linked Seniors</h2>

        {seniors.length === 0 ? (
          <p className="text-slate-500 text-sm">No seniors linked</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Age</th>
                  <th className="p-2 text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                {seniors.map((senior) => (
                  <tr
                    key={senior._id}
                    onClick={() => navigate(`/admin/seniors/${senior._id}`)}
                    className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
                  >
                    <td className="p-2 font-medium">
                      {senior.firstName} {senior.lastName}
                    </td>
                    <td className="p-2">{senior.age ?? "—"}</td>
                    <td className="p-2">{senior.address ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
