import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFamiliesAPI } from "../../api/admin.api";

type Family = {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  relation?: string;
  customRelation?: string;
  isPrimaryContact?: boolean;
};

export default function FamiliesList() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFamilies = async () => {
      try {
        const data = await fetchFamiliesAPI();
        setFamilies(data);
      } catch (error) {
        console.error("Fetch families error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFamilies();
  }, []);

  if (loading) {
    return <p>Loading family members...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Family Members</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Relation</th>
              <th className="p-3 text-left">Primary</th>
            </tr>
          </thead>
          <tbody>
            {families.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No family members found
                </td>
              </tr>
            ) : (
              families.map((family) => (
                <tr
                  key={family._id}
                  onClick={() => navigate(`/admin/families/${family._id}`)}
                  className="border-t cursor-pointer hover:bg-slate-50"
                >
                  <td className="p-3 font-medium">
                    {family.firstName} {family.lastName}
                  </td>
                  <td className="p-3">{family.phone ?? "—"}</td>
                  <td className="p-3">
                    {family.relation === "OTHER"
                      ? family.customRelation ?? "OTHER"
                      : family.relation ?? "—"}
                  </td>
                  <td className="p-3">
                    {family.isPrimaryContact ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
