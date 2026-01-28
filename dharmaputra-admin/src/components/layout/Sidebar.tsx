import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserCog, //for helpers
  LogOut,
  MessageSquare,
  Activity,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Seniors", path: "/admin/seniors", icon: UserCheck },
  { name: "Family Members", path: "/admin/families", icon: Users },
  { name: "Helpers", path: "/admin/helpers", icon: UserCog },
  { name: "Feedbacks", path: "/admin/feedbacks", icon: MessageSquare },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeCount, setActiveCount] = useState(0);
  const [shake, setShake] = useState(false);
  const prevCountRef = useRef(0);
  //const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    // 🚫 DO NOT poll until token exists
    if (!token) return;

    const fetchActiveEmergencies = async () => {
      try {
        const res = await api.get("/emergency/admin/active");
        const count = Array.isArray(res.data) ? res.data.length : 0;

        if (count > prevCountRef.current) {
          setShake(true);
          setTimeout(() => setShake(false), 600);
        }

        prevCountRef.current = count;
        setActiveCount(count);
      } catch (err) {
        console.error("Failed to fetch live emergencies");
      }
    };

    // initial fetch AFTER auth
    fetchActiveEmergencies();

    intervalRef.current = setInterval(fetchActiveEmergencies, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-800">
        Admin Portal
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* LIVE */}
        <NavLink
          to="/admin/live-emergencies"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition
    ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }
    ${shake ? "animate-shake" : ""}`
          }
        >
          <div className="relative">
            <Activity
              size={18}
              className={activeCount > 0 ? "text-red-500" : ""}
            />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </div>

          <span className={activeCount > 0 ? "text-red-500 font-semibold" : ""}>
            Live
          </span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md
                     text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
