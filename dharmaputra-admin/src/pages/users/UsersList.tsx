import { useEffect, useState } from "react";
import { getAllUsersAPI, getUserProfileAPI } from "../../api/users.api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import UserProfileModal from "../../components/users/UserProfileModal";

type User = {
  _id: string;
  name?: string;
  phone: string;
  role: "SENIOR" | "FAMILY";
  isActive: boolean;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    getAllUsersAPI()
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("FETCH USERS ERROR:", err);
        setError("Failed to load users");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-600">Loading users…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (users.length === 0) {
    return (
      <p className="p-6 text-slate-500">No senior or family users found.</p>
    );
  }

  return (
    <>
      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="pb-3">Name</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                {/* Name */}
                <td className="py-3 font-medium text-slate-800">
                  {u.name?.trim() || "—"}
                </td>

                {/* Phone */}
                <td>{u.phone}</td>

                {/* Role */}
                <td className="capitalize">{u.role}</td>

                {/* Status */}
                <td>
                  <Badge
                    label={u.isActive ? "Active" : "Blocked"}
                    color={u.isActive ? "green" : "red"}
                  />
                </td>

                {/* Actions */}
                <td className="flex gap-2 py-2">
                  <Button
                    onClick={async () => {
                      console.log("VIEW CLICKED FOR USER:", u._id);

                      const data = await getUserProfileAPI(u._id);

                      console.log("PROFILE API RESPONSE:", data);

                      setSelectedProfile(data);
                    }}
                  >
                    View
                  </Button>

                  {u.role === "FAMILY" && (
                    <Button variant="primary">Approve & Link</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PROFILE MODAL */}
      {selectedProfile && (
        <UserProfileModal
          data={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}
