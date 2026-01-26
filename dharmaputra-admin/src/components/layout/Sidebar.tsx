// import { NavLink, useNavigate } from "react-router-dom";
// import { LayoutDashboard, Users, UserCheck, LogOut } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// const menu = [
//   {
//     name: "Dashboard",
//     path: "/admin/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Seniors",
//     path: "/admin/seniors",
//     icon: UserCheck,
//   },
//   {
//     name: "Family Members",
//     path: "/admin/families",
//     icon: Users,
//   },
// ];

// export default function Sidebar() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/admin/login", { replace: true });
//   };

//   return (
//     <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
//       {/* Logo */}
//       <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-800">
//         Admin Portal
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 p-4 space-y-1">
//         {menu.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-2 rounded-md transition
//               ${
//                 isActive
//                   ? "bg-slate-800 text-white"
//                   : "text-slate-300 hover:bg-slate-800 hover:text-white"
//               }`
//             }
//           >
//             <item.icon size={18} />
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-slate-800">
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 w-full px-4 py-2 rounded-md
//                      text-slate-300 hover:bg-slate-800 hover:text-white transition"
//         >
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Seniors",
    path: "/admin/seniors",
    icon: UserCheck,
  },
  {
    name: "Family Members",
    path: "/admin/families",
    icon: Users,
  },
   {
    name: "Feedbacks",              // 👈 NEW
    path: "/admin/feedbacks",       // 👈 route
    icon: MessageSquare,
  },

];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
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
              `flex items-center gap-3 px-4 py-2 rounded-md transition
              ${
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
