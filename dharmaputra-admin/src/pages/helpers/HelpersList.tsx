import { useEffect, useState } from "react";
import {
  getAllHelpersAPI,
  approveHelperAPI,
  rejectHelperAPI,
} from "../../api/helpers.api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function HelpersList() {
  const [helpers, setHelpers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHelpers = async () => {
    const data = await getAllHelpersAPI();
    setHelpers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHelpers();
  }, []);

  const approve = async (id: number) => {
    await approveHelperAPI(id);
    loadHelpers();
  };

  const reject = async (id: number) => {
    await rejectHelperAPI(id);
    loadHelpers();
  };

  if (loading) return <p>Loading helpers...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Helpers</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {helpers.map((h) => (
            <tr key={h.id} className="border-b last:border-0">
              <td className="py-3">{h.name}</td>
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
              <td className="flex gap-2 py-2">
                {h.status === "Pending" && (
                  <>
                    <Button onClick={() => approve(h.id)}>Approve</Button>
                    <Button variant="danger" onClick={() => reject(h.id)}>
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
