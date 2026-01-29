import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

import {
  fetchSeniorByIdAPI,
  fetchFamiliesBySeniorAPI,
} from "../../api/admin.api";

export default function SeniorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [senior, setSenior] = useState<any>(null);
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [idOpen, setIdOpen] = useState(false);

  // const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const seniorData = await fetchSeniorByIdAPI(id);
        setSenior(seniorData);

        const familyData = await fetchFamiliesBySeniorAPI(id);
        setFamilies(familyData);
      } catch (error) {
        console.error("Senior detail fetch error:", error);
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
      // const data = await approveSeniorAPI(id);
      // UI sync
      setSenior((prev: any) => ({
        ...prev,
        isApproved: true,
        approvedAt: new Date().toISOString(),
      }));
    } catch {
      alert("Failed to approve senior");
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <p>Loading senior...</p>;
  if (!senior) return <p>Senior not found</p>;
  return (
    <>
      <div className="space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          // className="text-sm text-blue-600 hover:underline
          className="h-fit px-4 py-1 text-sm rounded-full bg-green-100 blue-600 hover:bg-green-200"
        >
          ← Back
        </button>

        {/* =====================
            PROFILE HEADER
            ===================== */}
        <div className="bg-white rounded-xl shadow p-6 flex items-start justify-between">
          <div>
            {senior?.profileImage && (
              <Avatar
                src={senior.profileImage}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            )}

            <h1 className="text-2xl font-bold">
              {senior.firstName} {senior.lastName}
            </h1>

            {senior?.idCardImage && (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setIdOpen(true)}
              >
                View ID
              </Button>
            )}

            <p className="text-sm text-slate-500 mt-1">
              Registered on {new Date(senior.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Approval Status */}
          {senior.isApproved ? (
            <span className="h-fit px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
              Approved
            </span>
          ) : (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {approving ? "Approving..." : "Approve Senior"}
            </button>
          )}
        </div>

        {/* =====================
            SENIOR DETAILS
            ===================== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Senior Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Age</p>
              <p className="font-medium">{senior.age ?? "—"}</p>
            </div>

            <div>
              <p className="text-slate-500">Emergency Contact</p>
              <p className="font-medium">{senior.emergencyContact ?? "—"}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-500">Address</p>
              <p className="font-medium">{`${senior?.address?.city},${senior?.address?.state} `}</p>
            </div>

            {senior.isApproved && senior.approvedAt && (
              <div className="sm:col-span-2 text-xs text-slate-500">
                Approved on {new Date(senior.approvedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* =====================
            LINKED FAMILIES
            ===================== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Linked Family Members</h2>

          {families.length === 0 ? (
            <p className="text-slate-500 text-sm">No family members linked</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Relation</th>
                  </tr>
                </thead>
                <tbody>
                  {families.map((family) => (
                    <tr
                      key={family._id}
                      onClick={() => navigate(`/admin/families/${family._id}`)}
                      className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
                    >
                      <td className="p-2 font-medium">
                        {family.firstName} {family.lastName}
                      </td>
                      <td className="p-2">{family.phone ?? "—"}</td>
                      <td className="p-2">{family.relation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ID CARD DIALOG */}
      <Dialog
        open={idOpen}
        onClose={() => setIdOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ID Card</DialogTitle>
        <DialogContent>
          <img
            src={senior.idCardImage}
            alt="ID Card"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
