export default function SuperAdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Dharmaputra" className="h-10 w-10" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Super Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              System overview & control panel
            </p>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border">
          <div className="h-10 w-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
            SA
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-800">Super Admin</p>
            <p className="text-xs text-slate-500">Full Access</p>
          </div>
        </div>
      </div>

      {/* Empty / Placeholder Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Welcome</h2>
        <p className="text-sm text-slate-600 mb-4">
          This dashboard will display system metrics once backend APIs are
          connected.
        </p>

        <div className="border border-dashed rounded-lg p-6 text-center text-slate-500 text-sm">
          No statistics available yet
        </div>
      </div>
    </div>
  );
}
