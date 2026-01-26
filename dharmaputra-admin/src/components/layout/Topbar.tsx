import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { logout, user } = useAuth(); // assume user exists
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-md border-b">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png" // place logo in public folder
          alt="Dharmaputra Logo"
          className="h-9 w-9 object-contain"
        />
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Dharmaputra</h1>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-700">
            {user?.name || "Admin"}
          </p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
          {user?.name?.charAt(0) || "A"}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
