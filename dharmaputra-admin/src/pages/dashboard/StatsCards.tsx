import { Users, UserCheck, ShieldAlert, Activity } from "lucide-react";

type StatsProps = {
  totalUsers: number;
  totalSeniors: number;
  activeHelpers: number;
  sosLast24h: number;
  totalSOS: number;
};

export default function StatsCards({
  totalUsers,
  totalSeniors,
  activeHelpers,
  sosLast24h,
  totalSOS,
}: StatsProps) {
  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Seniors",
      value: totalSeniors,
      icon: Activity,
      color: "bg-green-500",
    },
    {
      label: "Active Helpers",
      value: activeHelpers,
      icon: UserCheck,
      color: "bg-purple-500",
    },
    {
      label: "SOS (Last 24h)",
      value: sosLast24h,
      icon: ShieldAlert,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800">
              {item.value.toLocaleString()}
            </p>
          </div>

          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${item.color}`}
          >
            <item.icon size={22} />
          </div>
        </div>
      ))}
    </div>
  );
}
