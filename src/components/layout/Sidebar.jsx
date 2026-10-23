import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  Users,
  BrainCircuit,
  BarChart3,
  TrendingUp,
  User,
  Settings,
  LogOut,
  History,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "My Farms",
    icon: Sprout,
    path: "/farms",
  },
  {
    title: "Weather",
    icon: CloudSun,
    path: "/weather",
  },
  {
    title: "Market",
    icon: TrendingUp,
    path: "/marketplace",
  },
  {
    title: "Community",
    icon: Users,
    path: "/community",
  },
  {
    title: "AI Recommendation",
    icon: BrainCircuit,
    path: "/recommendation",
  },

  {
  title: "Recommendation History",
  icon: History,
  path: "/recommendation-history",
},

  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Clear authentication
    logout();

    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-green-800 text-white p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          🌾 FarmIQ
        </h1>

        <p className="text-green-200 text-sm mt-1">
          Smart Farming Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-green-500 text-white shadow-md"
                    : "text-green-100 hover:bg-green-700 hover:text-white"
                }`
              }
            >
              <Icon size={21} />

              <span className="font-medium">
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-xl text-red-300 hover:bg-red-500 hover:text-white transition-all duration-200"
      >
        <LogOut size={21} />

        <span className="font-medium">
          Logout
        </span>
      </button>

    </aside>
  );
}

export default Sidebar;