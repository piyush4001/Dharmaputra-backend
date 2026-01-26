import { useEffect, useState } from "react";
// import { fetchAdminsAPI } from "../../api/admin.api";
import { fetchAdminsAPI, toggleAdminStatusAPI } from "../../api/admin.api";

type Admin = {
  _id: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await fetchAdminsAPI();
        setAdmins(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  if (loading) return <p>Loading admins...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Admins</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id} className="border-t">
              <td className="p-3">{admin.email}</td>
              <td className="p-3 font-medium">{admin.role}</td>
              <td className="p-3">
                {admin.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>
              <td className="p-3">
                <button
                  onClick={async () => {
                    const updated = await toggleAdminStatusAPI(admin._id);
                    setAdmins((prev) =>
                      prev.map((a) =>
                        a._id === admin._id
                          ? { ...a, isActive: updated.isActive }
                          : a
                      )
                    );
                  }}
                  className={`px-3 py-1 rounded text-white ${
                    admin.isActive ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {admin.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
