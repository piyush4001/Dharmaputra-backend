type SOS = {
  _id: string;
  triggerType: "BUTTON" | "POWER" | "FALL";
  status: "ACTIVE" | "RESOLVED" | "CANCELLED";
  triggeredAt: string;
  seniorName: string | null;
};

export default function RecentSOS({ sos }: { sos: SOS[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent SOS</h2>

      {sos.length === 0 ? (
        <p className="text-slate-500">No SOS raised yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="pb-2">Senior</th>
              <th className="pb-2">Trigger</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {sos.map((item) => (
              <tr key={item._id} className="border-b last:border-0">
                <td className="py-2">{item.seniorName ?? "—"}</td>
                <td className="py-2">{item.triggerType}</td>
                <td className="py-2 font-medium">{item.status}</td>
                <td className="py-2 text-slate-500">
                  {new Date(item.triggeredAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
