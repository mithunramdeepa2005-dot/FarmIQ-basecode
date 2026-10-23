import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-2xl shadow-sm shadow-green-900/15 sm:h-12 sm:w-12">
            🌱
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-extrabold tracking-tight text-green-700 sm:text-2xl">
              FarmIQ
            </h1>
            <p className="mt-1 hidden text-xs text-slate-500 sm:block sm:text-sm">
              Smart Farming Platform
            </p>
          </div>
        </Link>

        {/* Main navigation */}
        <div className="hidden items-center gap-7 md:flex lg:gap-10">
          <Link
            to="/"
            className="font-medium text-slate-700 transition hover:text-green-700"
          >
            Home
          </Link>
          <Link
            to="/agrilearn"
            className="font-medium text-slate-700 transition hover:text-green-700"
          >
            AgriLearn
          </Link>
          <Link
            to="/marketplace"
            className="font-medium text-slate-700 transition hover:text-green-700"
          >
            Marketplace
          </Link>
        </div>

        {/* Account actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <NotificationBell />

              <div className="hidden items-center gap-2 lg:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-lg">
                  👤
                </div>
                <div>
                  <p className="max-w-28 truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user.accountType}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 sm:px-5 sm:py-2.5"
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="hidden font-medium text-red-600 transition hover:text-red-700 sm:inline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-slate-700 transition hover:text-green-700"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 sm:px-6 sm:py-3"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="mx-auto mt-3 flex max-w-7xl items-center justify-center gap-6 border-t border-slate-100 pt-3 md:hidden">
        <Link to="/" className="text-sm font-medium text-slate-700 hover:text-green-700">
          Home
        </Link>
        <Link to="/agrilearn" className="text-sm font-medium text-slate-700 hover:text-green-700">
          AgriLearn
        </Link>
        <Link to="/marketplace" className="text-sm font-medium text-slate-700 hover:text-green-700">
          Marketplace
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
